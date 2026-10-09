"""One interface, two users — animated, for the mobile comparison section.

A screen stands on a base. An agent's plug slides in from the left, a person's
cursor from the right; once both are docked the screen's rows light up one
by one, hold, and everything resets for the loop.

blender -b -P interface_anim.py -- out.mp4 [resolution]
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



FRAMES = 144  # 6s at 24fps
sc.frame_start, sc.frame_end = 1, FRAMES
sc.render.fps = 24


def key_loc(o, frames):
    for f, loc in frames:
        o.location = loc
        o.keyframe_insert("location", frame=f)


def key_vis(o, shown_from, shown_to):
    for f, hidden in ((1, True), (shown_from - 1, True), (shown_from, False),
                      (shown_to, False), (shown_to + 1, True), (FRAMES, True)):
        o.hide_render = hidden
        o.keyframe_insert("hide_render", frame=f)


# Base and the screen (front face towards the camera, -y)
box((0, 0, 0.12), (4.6, 2.2, 0.24))
box((0, 0.2, 1.24), (2.0, 0.14, 2.0))          # screen body
rows_y = (1.85, 1.45, 1.05, 0.65)
for z in rows_y:                               # empty rows
    box((0, 0.11, z), (1.5, 0.04, 0.22))
lit = []
for k, z in enumerate(rows_y):                 # rows that light up
    o = box((0, 0.08, z), (1.5, 0.06, 0.22))
    for poly in o.data.polygons:   # indigo on every face
        poly.material_index = 3
    key_vis(o, 62 + k * 10, 118)
    lit.append(o)

# Agent: a plug (body + cap + prongs) parented to an empty that slides in
plug = bpy.data.objects.new("plug", None)
sc.collection.objects.link(plug)
parts = [box((0, 0, 0), (0.7, 0.6, 0.6)), box((-0.45, 0, 0), (0.25, 0.36, 0.36), accent=True),
         box((0.45, 0.12, 0.12), (0.3, 0.08, 0.08)), box((0.45, -0.12, -0.12), (0.3, 0.08, 0.08))]
for p in parts:
    p.parent = plug
key_loc(plug, [(1, (-3.6, 0.0, 1.25)), (14, (-3.6, 0.0, 1.25)), (34, (-1.55, 0.0, 1.25)),
               (124, (-1.55, 0.0, 1.25)), (140, (-3.6, 0.0, 1.25)), (FRAMES, (-3.6, 0.0, 1.25))])

# Person: an extruded cursor that glides in and "clicks"
bm = bmesh.new()
pts = [(0, 0), (0, -1.0), (0.25, -0.76), (0.45, -1.14), (0.6, -1.06), (0.41, -0.69), (0.74, -0.69)]
vb = [bm.verts.new((x, 0, z)) for x, z in pts]
vt = [bm.verts.new((x, 0.16, z)) for x, z in pts]
bm.faces.new(vt); bm.faces.new(list(reversed(vb)))
for i in range(len(pts)):
    j = (i + 1) % len(pts)
    bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me = bpy.data.meshes.new("cur"); bm.to_mesh(me)
cur = bpy.data.objects.new("cur", me); sc.collection.objects.link(cur)
for m in (TOP, SA, SB, ACC):
    me.materials.append(m)
for p in me.polygons:
    p.material_index = 3
cur.scale = (0.8, 0.8, 0.8)
key_loc(cur, [(1, (3.4, -0.9, 1.7)), (30, (3.4, -0.9, 1.7)), (50, (0.55, -0.9, 1.35)),
              (54, (0.52, -0.9, 1.28)), (58, (0.55, -0.9, 1.35)),
              (124, (0.55, -0.9, 1.35)), (140, (3.4, -0.9, 1.7)), (FRAMES, (3.4, -0.9, 1.7))])

target = Vector((0, 0, 1.0))
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
sc.collection.objects.link(cam)
cam.data.type = "ORTHO"
cam.data.ortho_scale = 6.4
el, az = math.radians(24), math.radians(28)
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
