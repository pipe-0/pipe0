# The hero's Swiss Army knife: a red knife whose tools are agents.
#
#   blender -b -P knife_anim.py -- <out_dir> [--frames 1,60,120] [--samples 64]
#
# Writes RGBA PNG frames (transparent, with a shadow catcher) to out_dir;
# knife_encode.sh flattens them onto white and encodes the loop. The loop
# opens on the whole knife fanned out, folds it, flips each agent out on its
# own to say hello, and fans them all out again. Every transform is computed
# per frame from the functions below and keyed, so the timing reads like the
# code rather than like a graph editor.
import bpy, bmesh, math, os, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
OUT = argv[0]
FRAMES = None
SAMPLES = 64
if "--frames" in argv:
    FRAMES = [int(f) for f in argv[argv.index("--frames") + 1].split(",")]
if "--samples" in argv:
    SAMPLES = int(argv[argv.index("--samples") + 1])
RES = int(argv[argv.index("--res") + 1]) if "--res" in argv else 400

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    sc.cycles.device = "GPU"
except Exception as e:
    print(e)
sc.render.resolution_x = sc.render.resolution_y = RES
sc.render.film_transparent = True
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Punchy"
sc.view_settings.exposure = -0.9
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
sc.render.use_motion_blur = True
sc.render.motion_blur_shutter = 0.45
FPS = 30
sc.render.fps = FPS


# ---------------------------------------------------------------- materials

def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


def mat(name, hexc, rough, sss=0.0, coat=0.0, metal=0.0, coat_rough=0.08):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*lin(hexc), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Subsurface Weight"].default_value = sss
    b.inputs["Subsurface Radius"].default_value = (0.9, 0.35, 0.3)
    b.inputs["Subsurface Scale"].default_value = 0.08
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = coat_rough
    return m


def gradient_mat(name, bottom, top, rough, coat):
    """Base colour ramped bottom → top in the object's own space."""
    m = mat(name, bottom, rough, coat=coat, sss=0.15)
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -0.45
    mr.inputs["From Max"].default_value = 0.45
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*lin(bottom), 1)
    ramp.color_ramp.elements[1].color = (*lin(top), 1)
    nt.links.new(tc.outputs["Object"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], nt.nodes["Principled BSDF"].inputs["Base Color"])
    return m


RED = mat("red", "#c8102e", 0.22, sss=0.12, coat=0.8)
STEEL = mat("steel", "#d9dde6", 0.16, metal=1.0)
STEEL_DARK = mat("steel_dark", "#8d94a6", 0.3, metal=1.0)
WHITE = mat("white", "#f4f5f8", 0.35, coat=0.3)
EYE_DARK = mat("eye_dark", "#16130f", 0.3, coat=0.4)
EYE_LIGHT = mat("eye_light", "#ffffff", 0.6)
CLAY_ORANGE = mat("clay_orange", "#d97757", 0.55, sss=0.25)
DOT_BLACK = mat("dot_black", "#15161b", 0.22, coat=1.0)
BUDDY = mat("buddy", "#d3d8ff", 0.45, sss=0.3)
INDIGO = mat("indigo", "#3b49e0", 0.28, coat=0.7)
SPARK = gradient_mat("spark", "#3d7bff", "#a54ff0", 0.28, 0.8)


# ---------------------------------------------------------------- geometry helpers

def outline_solid(name, pts, y0, y1, material, bevel=0.03, segs=4):
    """Extrude a 2D outline drawn in the x–z plane between y0 and y1."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    vs = [bm.verts.new((x, y0, z)) for x, z in pts]
    face = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in [g for g in ext["geom"] if isinstance(g, bmesh.types.BMVert)]:
        v.co.y = y1
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    if bevel:
        b = ob.modifiers.new("bevel", "BEVEL")
        b.width = bevel
        b.segments = segs
        b.limit_method = "ANGLE"
        b.harden_normals = True
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(material)
    return ob


def stadium(x0, x1, z0, z1, n=24):
    r = (z1 - z0) / 2
    cz = (z0 + z1) / 2
    pts = []
    for i in range(n + 1):  # right cap, bottom to top
        a = -math.pi / 2 + math.pi * i / n
        pts.append((x1 - r + r * math.cos(a), cz + r * math.sin(a)))
    for i in range(n + 1):  # left cap, top to bottom
        a = math.pi / 2 + math.pi * i / n
        pts.append((x0 + r + r * math.cos(a), cz + r * math.sin(a)))
    return pts


def ball(name, r, scale, loc, material, parent=None, segs=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, radius=r, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    if parent:
        o.parent = parent
    return o


def box(name, size, loc, material, parent=None, bevel=0.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    b = o.modifiers.new("bevel", "BEVEL")
    b.width = bevel
    b.segments = 5
    o.modifiers.new("sub", "SUBSURF").levels = 1
    bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    if parent:
        o.parent = parent
    return o


def empty(name, loc=(0, 0, 0), parent=None):
    o = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(o)
    o.location = loc
    if parent:
        o.parent = parent
    return o


# ---------------------------------------------------------------- the knife

HX, HZ = 1.6, 0.42  # handle half-length, half-height
PIVOT_X = 1.15

knife = empty("knife")

# Steel core: liners and tool spines, a hair inside the scales' outline so a
# silver line runs along the top and bottom edges.
core = outline_solid("core", stadium(-HX + 0.05, HX - 0.05, -HZ + 0.035, HZ - 0.035), -0.13, 0.13, STEEL, bevel=0.015)
core.parent = knife
for y in (-0.072, 0.072):  # the dark seams between layers
    seam = outline_solid("seam", stadium(-HX + 0.07, HX - 0.07, -HZ + 0.025, HZ - 0.025), y - 0.008, y + 0.008, STEEL_DARK, bevel=0)
    seam.parent = knife

# Red scales, front and back, with a fat rounded edge.
for y0, y1 in ((-0.27, -0.12), (0.12, 0.27)):
    s = outline_solid("scale", stadium(-HX, HX, -HZ, HZ, 32), y0, y1, RED, bevel=0.07, segs=6)
    s.modifiers.new("sub", "SUBSURF").levels = 1
    s.parent = knife

# Domed rivets on the front scale.
for x in (-PIVOT_X, PIVOT_X):
    ball("rivet", 0.085, (1, 0.45, 1), (x, -0.272, 0), STEEL, knife, segs=32)

# The white plus. (The pipe0 mark is line art and vanishes at glyph size.)
for size in ((0.36, 0.04, 0.12), (0.12, 0.04, 0.36)):
    box("plus", size, (0, -0.272, 0), WHITE, knife, bevel=0.035)


# ---------------------------------------------------------------- agents
#
# Each agent is built around its own origin (the middle of its body) and
# faces the camera (-y). `parts` holds what the per-frame animation moves.

def eyes(parent, xs, z, size, material, y=-0.42):
    out = []
    for x in xs:
        e = ball("eye", 1, size, (x, y, z), material, parent, segs=24)
        out.append(e)
    return out


def make_crab(root):
    body = box("crab_body", (0.86, 0.5, 0.52), (0, 0, 0.04), CLAY_ORANGE, root, bevel=0.07)
    arms = [
        box("crab_arm", (0.2, 0.3, 0.16), (x, 0, 0.05), CLAY_ORANGE, root, bevel=0.05)
        for x in (-0.44, 0.44)
    ]
    legs = [
        box("crab_leg", (0.09, 0.22, 0.24), (x, 0, -0.21), CLAY_ORANGE, root, bevel=0.035)
        for x in (-0.33, -0.17, 0.17, 0.33)
    ]
    ey = eyes(root, (-0.19, 0.19), 0.1, (0.045, 0.03, 0.09), EYE_DARK, y=-0.252)
    return {"body": body, "arms": arms, "legs": legs, "eyes": ey, "eye_y": 0.1}


def star_pts(r, belly=0.3, n=20):
    pts = []
    for i in range(4):
        a = math.pi / 2 - i * math.pi / 2
        b = a - math.pi / 2
        m = a - math.pi / 4
        p0 = (r * math.cos(a), r * math.sin(a))
        p1 = (r * math.cos(b), r * math.sin(b))
        c = (belly * r * math.cos(m), belly * r * math.sin(m))
        for s in range(n):
            t = s / n
            u = 1 - t
            pts.append((u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]))
    return pts


def make_spark(root):
    star = outline_solid("spark", star_pts(0.5), -0.11, 0.11, SPARK, bevel=0.08, segs=6)
    star.modifiers.new("sub", "SUBSURF").levels = 1
    star.parent = root
    ey = eyes(root, (-0.075, 0.075), 0.02, (0.03, 0.02, 0.055), EYE_LIGHT, y=-0.118)
    minis = []
    for loc, r in (((0.62, 0, 0.48), 0.16), ((-0.6, 0, 0.3), 0.11)):
        m = outline_solid("mini", star_pts(r), -0.04, 0.04, SPARK, bevel=0.025, segs=3)
        m.parent = root
        m.location = loc
        minis.append(m)
    return {"body": star, "eyes": ey, "minis": minis, "eye_y": 0.02}


def make_dot(root):
    body = ball("dot", 0.4, (1, 1, 1), (0, 0, 0), DOT_BLACK, root)
    ey = eyes(root, (-0.11, 0.11), 0.05, (0.04, 0.03, 0.075), EYE_LIGHT, y=-0.375)
    typing = [ball("typing", 0.12, (1, 1, 1), (x, 0, -0.08), DOT_BLACK, root, segs=32) for x in (-0.3, 0, 0.3)]
    return {"body": body, "eyes": ey, "typing": typing, "eye_y": 0.05}


def make_buddy(root):
    body = ball("buddy", 0.42, (1.08, 0.95, 0.92), (0, 0, 0), BUDDY, root, segs=64)
    sprout = empty("sprout", (0, 0, 0.36), root)
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.026, depth=0.15, location=(0, 0, 0.06))
    st = bpy.context.object
    bpy.ops.object.shade_smooth()
    st.data.materials.append(INDIGO)
    st.parent = sprout
    leaves = []
    for side in (-1, 1):
        lf = ball("leaf", 0.13, (1.0, 0.55, 0.34), (0.1 * side, 0, 0.15), INDIGO, sprout, segs=32)
        lf.rotation_euler = (0, math.radians(-30 * side), 0)
        leaves.append(lf)
    ey = eyes(root, (-0.13, 0.13), 0.03, (0.042, 0.03, 0.075), mat("buddy_eye", "#1d2356", 0.3, coat=0.4), y=-0.385)
    return {"body": body, "eyes": ey, "sprout": sprout, "leaves": leaves, "eye_y": 0.03}


# ---------------------------------------------------------------- tools

def stem_mesh(name, length, y):
    """A flat steel tool seen side-on: a boss at the rivet, a bar to the tip."""
    pts = stadium(-0.15, length, -0.11, 0.11, 16)
    o = outline_solid(name, pts, y - 0.035, y + 0.035, STEEL, bevel=0.025, segs=3)
    return o


# (agent, side, fan angle, solo angle, rivet-to-agent distance, depth)
# Angles in degrees on screen: 0 points right, 90 up.
TOOLS = [
    ("crab", -1, 76, 64, 2.0, -0.045),
    ("spark", 1, 104, 116, 2.0, 0.045),
    ("dot", -1, 107, 64, 1.72, 0.045),
    ("buddy", 1, 73, 116, 1.72, -0.045),
]
MAKERS = {"crab": make_crab, "spark": make_spark, "dot": make_dot, "buddy": make_buddy}
FAN_SCALE = 0.98
SOLO_SCALE = 1.4
HEAD_OFFSET = 0.3  # from the steel tip to the agent's middle

tools = []
for who, side, fan, solo, reach, y in TOOLS:
    pivot = empty(f"pivot_{who}", (side * PIVOT_X, 0, 0), knife)
    stem = stem_mesh(f"stem_{who}", reach - HEAD_OFFSET + 0.05, y)
    stem.parent = pivot
    root = empty(f"agent_{who}", (0, 0, 0), knife)
    parts = MAKERS[who](root)
    tools.append({
        "who": who, "side": side, "fan": fan, "solo": solo, "reach": reach,
        "closed": 0.0 if side < 0 else 180.0, "pivot": pivot, "root": root, "parts": parts,
    })


# ---------------------------------------------------------------- timing

FAN_OPEN, FAN_HOLD, FAN_CLOSE, SOLO, SWING = 0.9, 2.2, 0.45, 3.0, 0.42
LOOP = FAN_OPEN + FAN_HOLD + FAN_CLOSE + SOLO * len(tools)
N = round(LOOP * FPS)
sc.frame_start, sc.frame_end = 1, N


def clamp01(x):
    return min(1.0, max(0.0, x))


def smooth(x):
    t = clamp01(x)
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def back(x, c=1.7):
    t = clamp01(x) - 1
    return 1 + (c + 1) * t ** 3 + c * t ** 2


def env(t, a, b, c, d):
    return smooth((t - a) / (b - a)) * (1 - smooth((t - c) / (d - c)))


def bump(t, a, d):
    return math.sin(math.pi * (t - a) / d) if a < t < a + d else 0.0


def hop(t, t0, dur, h):
    """Height and squash (+ stretches) for a hop starting at t0."""
    pre, post = 0.1, 0.14
    if t0 - pre < t < t0:
        return 0.0, -0.12 * math.sin(math.pi * (t - t0 + pre) / pre)
    if t0 <= t <= t0 + dur:
        p = (t - t0) / dur
        return h * math.sin(math.pi * p), 0.12 * math.sin(math.pi * p) * abs(math.cos(math.pi * p))
    if t0 + dur < t < t0 + dur + post:
        return 0.0, -0.1 * math.sin(math.pi * (t - t0 - dur) / post)
    return 0.0, 0.0


def state(t):
    """Per tool: (open 0..1+, solo 0..1, character time), and the knife's kick."""
    t %= LOOP
    kick = 0.0
    out = []
    for i in range(len(tools)):
        stagger = i * (FAN_OPEN - SWING) / (len(tools) - 1)
        if t < FAN_OPEN + FAN_HOLD + FAN_CLOSE:
            opening = (t - stagger) / SWING
            closing = (t - FAN_OPEN - FAN_HOLD) / FAN_CLOSE
            if 0 < opening < 1:
                kick = max(kick, bump(t - stagger, SWING * 0.5, 0.3))
            o = 1 - smooth(closing) if closing > 0 else back(opening)
            out.append((o, 0.0, 0.45 + (t - stagger) * 0.62))
            continue
        local = t - FAN_OPEN - FAN_HOLD - FAN_CLOSE - i * SOLO
        if local < 0 or local > SOLO:
            out.append((0.0, 1.0, 0.0))
            continue
        if local < SWING:
            kick = max(kick, bump(local, SWING * 0.5, 0.3))
        o = back(local / SWING) if local < SWING else 1 - smooth((local - (SOLO - SWING)) / SWING)
        out.append((o, 1.0, 0.3 + local))
    return out, kick


# ---------------------------------------------------------------- per-frame pose

def blink(u):
    return 1 - 0.92 * max(bump(u, 1.25, 0.16), bump(u, 2.2, 0.14))


def pose_agent(tool, u):
    p = tool["parts"]
    who = tool["who"]
    dz, squash = hop(u, 0.5, 0.3, 0.22)
    if who == "buddy":
        dz2, s2 = hop(u, 0.9, 0.24, 0.12)
        dz, squash = dz + dz2, squash + s2
    look = 0.045 * env(u, 1.5, 1.8, 2.3, 2.6)
    shut = blink(u)
    for e in p["eyes"]:
        e.scale.z = e["rest_z"] * shut
        e.location.x = e["rest_x"] + look
    body_scale = (1 - 0.7 * squash, 1, 1 + squash)

    if who == "crab":
        wave = env(u, 0.6, 0.8, 1.4, 1.6)
        p["arms"][1].location.z = 0.05 + wave * (0.07 + 0.05 * math.sin((u - 0.6) * 22))
        p["arms"][1].rotation_euler.y = -wave * 0.5
        tap = env(u, 1.6, 1.7, 2.4, 2.5)
        for k, leg in enumerate(p["legs"]):
            leg.location.z = -0.21 + tap * 0.06 * max(0.0, math.sin(u * 19 + k * math.pi / 2))
    elif who == "spark":
        spin = smooth((u - 1.4) / 0.5) * (math.pi / 2)
        twinkle = 1 + 0.06 * env(u, 0.55, 0.7, 1.0, 1.2) * math.sin((u - 0.55) * 30)
        p["body"].rotation_euler.y = spin
        p["body"].scale = (twinkle,) * 3
        for k, m in enumerate(p["minis"]):
            g = env(u, 1.7 + 0.15 * k, 1.9 + 0.15 * k, 2.35 + 0.1 * k, 2.55 + 0.1 * k)
            m.scale = (g,) * 3
            m.rotation_euler.y = u * 2.5 * (1 if k else -1)
    elif who == "dot":
        split = env(u, 1.45, 1.7, 2.25, 2.5)
        main = 1 - smooth(split * 1.2)
        p["body"].scale = (max(main, 0.001),) * 3
        for e in p["eyes"]:
            e.scale.x = e["rest_x_s"] * max(main, 0.001)
            e.scale.z *= max(main, 0.001)
        for k, d in enumerate(p["typing"]):
            g = smooth((split - 0.15 * k) / 0.6)
            d.scale = (max(g, 0.001),) * 3
            d.location.z = -0.08 + 0.1 * max(0.0, math.sin(u * 11 - k * 1.2)) * g
    elif who == "buddy":
        wig = env(u, 0.55, 0.7, 1.5, 1.7)
        p["sprout"].rotation_euler.y = wig * 0.35 * math.sin((u - 0.55) * 16)

    root = tool["root"]
    root["dz"] = dz
    root["squash"] = body_scale


for tl in tools:
    for e in tl["parts"]["eyes"]:
        e["rest_z"] = e.scale.z
        e["rest_x"] = e.location.x
        e["rest_x_s"] = e.scale.x
    for d in tl["parts"].get("typing", []):
        d.scale = (0.001,) * 3
    for m in tl["parts"].get("minis", []):
        m.scale = (0.001,) * 3

ANIMATED = []
for tl in tools:
    ANIMATED += [tl["pivot"], tl["root"]]
    ANIMATED += [o for o in tl["root"].children_recursive]
ANIMATED.append(knife)


def apply(t):
    st, kick = state(t)
    knife.rotation_euler = (0, math.radians(1.4 * kick), 0)
    knife.location = (0, 0, -0.03 * kick)
    for tl, (o, solo, u) in zip(tools, st):
        target = lerp(tl["fan"], tl["solo"], solo)
        a = math.radians(lerp(tl["closed"], target, o))
        tl["pivot"].rotation_euler = (0, -a, 0)
        pose_agent(tl, u)
        k = lerp(FAN_SCALE, SOLO_SCALE, solo) * clamp01((o - 0.3) / 0.7) ** 0.8
        k = max(k, 0.001)
        r = tl["reach"]
        sx, sy, sz = tl["root"]["squash"]
        tl["root"].location = (
            tl["side"] * PIVOT_X + math.cos(a) * r,
            -0.02,
            math.sin(a) * r + tl["root"]["dz"] * k,
        )
        # Upright, leaning a little with its tool, turned to the camera.
        tl["root"].rotation_euler = (0, -(a - math.pi / 2) * 0.16, math.radians(CAM_AZ))
        tl["root"].scale = (k * sx, k * sy, k * sz)


# ---------------------------------------------------------------- camera, light, ground

CAM_AZ = -16  # degrees; the camera sits a little to the left
target = Vector((-0.1, 0, 0.98))
dist = 15.5
el = math.radians(9)
az = math.radians(CAM_AZ)
cam_loc = target + Vector((math.sin(az) * math.cos(el) * dist, -math.cos(az) * math.cos(el) * dist, math.sin(el) * dist))
bpy.ops.object.camera_add(location=cam_loc)
cam = bpy.context.object
cam.rotation_euler = (target - cam_loc).to_track_quat("-Z", "Y").to_euler()
cam.data.lens = 116
sc.camera = cam


def area(loc, power, size, col=(1, 1, 1), aim=(0, 0, 0.6)):
    bpy.ops.object.light_add(type="AREA", location=loc)
    l = bpy.context.object
    l.data.energy = power
    l.data.size = size
    l.data.color = col
    l.rotation_euler = (Vector(aim) - l.location).to_track_quat("-Z", "Y").to_euler()
    return l


area((-3.5, -5, 7), 900, 4.5)                    # key, high left
fill = area((5, -3, 2.5), 220, 3.5, (0.86, 0.9, 1))  # cool fill, right
rim = area((1.5, 6, 4), 700, 3, aim=(0, 0, 1.2))     # rim, behind
# Only the key and the top card cast onto the ground: one soft contact
# shadow, not a grey band thrown forward by the rim.
fill.data.use_shadow = rim.data.use_shadow = False
front = area((0, -6, 0.3), 140, 7, (0.94, 0.95, 1), aim=(0, 0, 0.6))  # soft front
front.data.use_shadow = False
area((0, -2.5, 6.5), 200, 6, aim=(0, 0, 0))      # soft top card for the steel

w = bpy.data.worlds.new("w")
sc.world = w
w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.95, 0.96, 1, 1)
w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.35

bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -HZ - 0.005))
ground = bpy.context.object
ground.is_shadow_catcher = True


# ---------------------------------------------------------------- bake and render

def key_all(f):
    for o in ANIMATED:
        o.keyframe_insert("location", frame=f)
        o.keyframe_insert("rotation_euler", frame=f)
        o.keyframe_insert("scale", frame=f)


# One frame either side of the loop, so motion blur at the seam samples
# the neighbouring frames of the loop rather than a held pose.
# Frame 1 is the fan fully open: the poster, and the first thing anyone sees.
START = FAN_OPEN + 0.1
for f in range(0, N + 2):
    apply(START + (f - 1) / FPS)
    key_all(f)

os.makedirs(OUT, exist_ok=True)
for f in (FRAMES or range(1, N + 1)):
    sc.frame_set(f)
    sc.render.filepath = os.path.join(OUT, f"k{f:04d}.png")
    bpy.ops.render.render(write_still=True)
print("frames", N)
