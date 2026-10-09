"""Animated sheet board for the mobile hero.

A 5x4 sheet slab in the line-art style (lineart.py). Indigo cells rise out of
the board one after another, column by column — enrichment filling a sheet —
hold, then sink back so the loop restarts cleanly. Rendered on white so the
page can lay it on the dotted stage with mix-blend-mode: multiply.

blender -b -P board_anim.py -- out.mp4 [resolution]
"""
import bpy, bmesh, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
out = argv[0]
res = int(argv[1]) if len(argv) > 1 else 900

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE"
sc.render.resolution_x = res
sc.render.resolution_y = int(res * 0.75)
sc.render.film_transparent = False
sc.view_settings.view_transform = "Standard"
sc.render.use_freestyle = True
sc.render.line_thickness_mode = "ABSOLUTE"
vl = sc.view_layers[0]
vl.use_freestyle = True
fs = vl.freestyle_settings
fs.crease_angle = math.radians(140)
ls = fs.linesets[0] if fs.linesets else fs.linesets.new("L")
if ls.linestyle is None:
    ls.linestyle = bpy.data.linestyles.new("LS")
ls.select_by_visibility = True
ls.visibility = "VISIBLE"
ls.select_silhouette = ls.select_border = ls.select_crease = True
ls.linestyle.color = (0.0423, 0.0666, 0.7454)
ls.linestyle.thickness = res / 480
ls.linestyle.caps = "ROUND"

world = bpy.data.worlds.new("w")
sc.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (1, 1, 1, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0


def hexc(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c]


def emat(name, h):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*hexc(h), 1)
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs[0], o.inputs[0])
    return m


TOP, SA, SB, ACC = emat("t", "#ffffff"), emat("a", "#e6eafb"), emat("b", "#d3daf7"), emat("acc", "#3b49e0")


def box(loc, size, accent=False):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.object
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    me = o.data
    for m in (TOP, SA, SB, ACC):
        me.materials.append(m)
    for p in me.polygons:
        n = p.normal
        if accent and n.z > 0.5:
            p.material_index = 3
        elif n.z > 0.5:
            p.material_index = 0
        elif abs(n.x) >= abs(n.y):
            p.material_index = 1
        else:
            p.material_index = 2
    return o


FRAMES = 120  # 5s at 24fps
sc.frame_start, sc.frame_end = 1, FRAMES
sc.render.fps = 24

W, D = 4.2, 3.0
cols, rows = 5, 4
cw, ch = W / cols, D / rows
box((0, 0, 0.15), (W, D, 0.3))
for i in range(cols):
    for j in range(rows):
        x = -W / 2 + cw * (i + 0.5)
        y = -D / 2 + ch * (j + 0.5)
        box((x, y, 0.33), (cw - 0.1, ch - 0.1, 0.06))

# Indigo cells: enrichment columns filling row by row, with gaps where a
# provider found nothing. Each cell grows up out of its slot (scaled in z
# from the cell surface) and is hidden from render while it is down.
fill = [(2, 3), (2, 1), (3, 3), (3, 2), (3, 0), (4, 3), (4, 2), (4, 0)]
SURFACE, H = 0.36, 0.42
for k, (c, r) in enumerate(fill):
    x = -W / 2 + cw * (c + 0.5)
    y = -D / 2 + ch * (r + 0.5)
    o = box((0, 0, H / 2), (cw - 0.1, ch - 0.1, H), accent=True)
    # origin at the bottom face so scaling grows upward
    bpy.context.scene.cursor.location = (0, 0, 0)
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    o.location = (x, y, SURFACE)
    up = 10 + k * 9
    down = FRAMES - 16 + (k % 3)
    keys = ((1, 0.02, True), (up - 1, 0.02, True), (up, 0.02, False), (up + 9, 1.0, False),
            (down, 1.0, False), (down + 9, 0.02, False), (down + 10, 0.02, True), (FRAMES, 0.02, True))
    for f, sz, hidden in keys:
        o.scale = (1, 1, sz)
        o.keyframe_insert("scale", index=2, frame=f)
        o.hide_render = hidden
        o.keyframe_insert("hide_render", frame=f)

target = Vector((0, 0, 0.3))
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
sc.collection.objects.link(cam)
cam.data.type = "ORTHO"
cam.data.ortho_scale = 6.2
el, az = math.radians(35.264), math.radians(45)
cam.location = target + Vector((30 * math.cos(el) * math.sin(az), -30 * math.cos(el) * math.cos(az), 30 * math.sin(el)))
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
sc.camera = cam

if hasattr(sc.render.image_settings, "media_type"):
    sc.render.image_settings.media_type = "VIDEO"
sc.render.image_settings.file_format = "FFMPEG"
sc.render.ffmpeg.format = "MPEG4"
sc.render.ffmpeg.codec = "H264"
sc.render.ffmpeg.constant_rate_factor = "HIGH"
sc.render.ffmpeg.ffmpeg_preset = "GOOD"
sc.render.filepath = out
bpy.ops.render.render(animation=True)
