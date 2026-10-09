"""Line-art illustrations. `out` ending in .mp4 renders the kind's seamless
loop (sheets, mcp, slack, api) on white instead of a transparent still:

blender -b -P lineart.py -- <kind> <out.png|out.mp4> [resolution]
"""
import bpy, bmesh, math, sys
from mathutils import Vector, Matrix
argv = sys.argv[sys.argv.index("--")+1:]
which, out = argv[0], argv[1]
res = int(argv[2]) if len(argv) > 2 else 1600
ANIMATE = out.endswith('.mp4')
FRAMES = 120  # 5s at 24fps; every motion below is periodic over this
ANIM = []     # callables f(t in [0,1)) that pose objects for that moment

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x = res; sc.render.resolution_y = int(res*0.75)
sc.render.film_transparent = True
sc.view_settings.view_transform = 'Standard'
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.render.use_freestyle = True
sc.render.line_thickness_mode = 'ABSOLUTE'; sc.render.line_thickness = res/700
vl = sc.view_layers[0]; vl.use_freestyle = True
fs = vl.freestyle_settings; fs.crease_angle = math.radians(140)
ls = fs.linesets[0] if fs.linesets else fs.linesets.new('L')
ls.select_by_visibility = True; ls.visibility = 'VISIBLE'
ls.select_silhouette = True; ls.select_border = True; ls.select_crease = True
if ls.linestyle is None: ls.linestyle = bpy.data.linestyles.new('LS')
ls.linestyle.color = (0.0423, 0.0666, 0.7454)  # #3b49e0 in linear
ls.linestyle.thickness = res/480
ls.linestyle.caps = 'ROUND'

def hexc(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return [((x+0.055)/1.055)**2.4 if x>0.04045 else x/12.92 for x in c]
def emat(name, h):
    m = bpy.data.materials.new(name)
    nt = m.node_tree if m.node_tree else None
    m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value=(*hexc(h),1); e.inputs['Strength'].default_value=1
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0])
    return m
TOP, SIDE_A, SIDE_B, ACC = emat('top','#ffffff'), emat('a','#e6eafb'), emat('b','#d3daf7'), emat('acc','#3b49e0')

def finish(obj, accent=False):
    me = obj.data
    for m in (TOP, SIDE_A, SIDE_B, ACC): me.materials.append(m)
    for p in me.polygons:
        n = obj.matrix_world.to_3x3() @ p.normal
        if accent == 'all': p.material_index = 3
        elif accent and n.z > 0.5: p.material_index = 3
        elif n.z > 0.5: p.material_index = 0
        elif abs(n.x) >= abs(n.y): p.material_index = 1
        else: p.material_index = 2
    return obj

def box(loc, size, accent=False):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.object; o.scale = (size[0]/2, size[1]/2, size[2]/2)
    bpy.ops.object.transform_apply(scale=True)
    return finish(o, accent)

def cyl(loc, r, h, accent=False, verts=96):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc)
    return finish(bpy.context.object, accent)

def pillar(x, y, base_z, w, d, h, accent=False):
    """A box whose origin sits on its bottom face, so scale.z grows it up."""
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
    o = bpy.context.object; o.scale = (w/2, d/2, h/2)
    bpy.ops.object.transform_apply(scale=True)
    o.data.transform(Matrix.Translation((0, 0, h/2)))
    o.location = (x, y, base_z)
    return finish(o, accent)

def wave(t, phase=0.0):
    """0..1..0 once per loop, eased, shifted by phase (fraction of a loop)."""
    return 0.5 - 0.5*math.cos(2*math.pi*((t - phase) % 1.0))

def pulse(t, phase, width=0.25):
    """A single smooth bump of the given width (fraction of loop) at phase."""
    u = ((t - phase) % 1.0) / width
    return 0.5 - 0.5*math.cos(2*math.pi*u) if u < 1 else 0.0

def rounded_slab(loc, w, d, h, r, accent=False):
    bm = bmesh.new()
    pts=[]
    for cx, cy, a0 in [(w/2-r, d/2-r, 0), (-w/2+r, d/2-r, 90), (-w/2+r, -d/2+r, 180), (w/2-r, -d/2+r, 270)]:
        for k in range(17):
            a = math.radians(a0 + k*90/16); pts.append((cx + r*math.cos(a), cy + r*math.sin(a)))
    vb=[bm.verts.new((x,y,-h/2)) for x,y in pts]; vt=[bm.verts.new((x,y,h/2)) for x,y in pts]
    bm.faces.new(vt); bm.faces.new(list(reversed(vb)))
    n=len(pts)
    for i in range(n):
        j=(i+1)%n; bm.faces.new((vb[i],vb[j],vt[j],vt[i]))
    me=bpy.data.meshes.new('rs'); bm.to_mesh(me); o=bpy.data.objects.new('rs',me); bpy.context.collection.objects.link(o)
    o.location=loc
    return finish(o, accent)

if which == 'sheets':
    box((0,0,0.15), (4.2,3.0,0.3))
    cols, rows = 5, 4
    cw, ch = 4.2/cols, 3.0/rows
    raised = {(4,0),(4,1),(4,3),(3,2)}
    order = [(3,2),(4,3),(4,1),(4,0)]
    for i in range(cols):
        for j in range(rows):
            x = -2.1 + cw*(i+0.5); y = -1.5 + ch*(j+0.5)
            if (i,j) in raised:
                o = pillar(x, y, 0.3, cw-0.1, ch-0.1, 0.34, accent=True)
                k = order.index((i,j))
                ANIM.append(lambda t, o=o, k=k: setattr(o, 'scale', (1, 1, 0.45 + 0.55*(1 - 0.85*pulse(t, k*0.22, 0.32)))))
            else:
                box((x, y, 0.3 + 0.03), (cw-0.1, ch-0.1, 0.06))
    target, scale = (0,0,0.3), 6.2
elif which == 'mcp':
    # A hub wired to four different tools. An indigo packet runs out along
    # each wire in turn; the tool it reaches pops up — an agent calling tools.
    box((0,0,0.12), (4.6,4.6,0.24))
    box((0,0,0.24+0.4), (1.1,1.1,0.8))                 # hub
    box((0,0,0.24+0.8+0.07), (0.6,0.6,0.14), accent=True)
    R = 1.6
    spots = [(R,0), (0,R), (-R,0), (0,-R)]
    tools = []
    for k,(x,y) in enumerate(spots):
        # wire from hub edge to the tool
        if x: box(((0.55+R-0.45)/2*(1 if x>0 else -1), 0, 0.27), (R-1.0, 0.12, 0.06))
        else: box((0, (0.55+R-0.45)/2*(1 if y>0 else -1), 0.27), (0.12, R-1.0, 0.06))
        if k % 2 == 0:
            o = pillar(x, y, 0.24, 0.8, 0.8, 0.55)
        else:
            bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.42, depth=0.55, location=(0,0,0))
            o = bpy.context.object
            o.data.transform(Matrix.Translation((0,0,0.275)))
            o.location = (x, y, 0.24)
            finish(o)
        tools.append(o)
    pk = box((0,0,0), (0.26,0.26,0.26), accent='all')   # the packet
    def route(t):
        seg = int((t % 1.0) * 4); u = (t % 1.0) * 4 - seg
        x, y = spots[seg]
        travel = min(1.0, u/0.45)
        e = 0.5 - 0.5*math.cos(math.pi*travel)
        r0, r1 = 0.55, R - 0.45
        d = r0 + (r1 - r0)*e
        nx, ny = (x/R, y/R)
        pk.location = (nx*d, ny*d, 0.43)
        s_ = 1.0 if u < 0.5 else 0.001             # absorbed by the tool
        pk.scale = (s_, s_, s_)
        for k, o in enumerate(tools):
            bump = 0.0
            if k == seg and u >= 0.42:
                bump = math.sin(math.pi*min(1.0, (u-0.42)/0.58))
            o.scale = (1, 1, 1 + 0.75*bump)
    ANIM.append(route)
    target, scale = (0,0,0.55), 7.0
elif which == 'slack':
    # A speech bubble standing upright, three dots on its face, on a base.
    o = rounded_slab((0,0,0), 3.2, 2.1, 0.5, 0.55)
    o.data.transform(Matrix.Rotation(math.radians(90),4,'X'))
    o.location = (0,0,1.75)
    for p in o.data.polygons: pass
    o.data.materials.clear(); finish(o)
    # No tail: any box meeting the bubble leaves a junction line Freestyle
    # draws across the bubble face; the dots alone read as chat.
    for x in (-0.75,0,0.75):
        bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=0.18, depth=0.03, location=(x,-0.265,1.75), rotation=(math.radians(90),0,0))
        dot = finish(bpy.context.object, accent='all')
        k = (-0.75, 0, 0.75).index(x)
        # three bounces per loop, dots staggered like a typing indicator
        ANIM.append(lambda t, o=dot, k=k: setattr(o.location, 'z', 1.75 + 0.2*pulse((t*3) % 1.0, k*0.14, 0.42)))
    target, scale = (0,0,1.35), 6.0
elif which == 'both':
    # One sheet, two workers: an agent's plug seated in one cell, a person's
    # cursor resting on another. The positioning in a single object.
    box((0,0,0.15), (4.2,3.0,0.3))
    cols, rows = 5, 4
    cw, ch = 4.2/cols, 3.0/rows
    raised = {(1,1),(3,2)}
    for i in range(cols):
        for j in range(rows):
            x = -2.1 + cw*(i+0.5); y = -1.5 + ch*(j+0.5)
            hgt = 0.34 if (i,j) in raised else 0.06
            box((x, y, 0.3 + hgt/2), (cw-0.1, ch-0.1, hgt), accent=(i,j) in raised)
    # agent: plug hovering over cell (3,2), prongs down
    px, py = -2.1 + cw*3.5, -1.5 + ch*2.5
    box((px, py, 1.6), (0.7,0.7,0.55))
    box((px, py, 2.07), (0.4,0.4,0.4), accent=True)
    box((px-0.16, py+0.16, 1.15), (0.09,0.09,0.36))
    box((px+0.16, py-0.16, 1.15), (0.09,0.09,0.36))
    # person: a pointer standing upright above cell (1,1), facing the viewer
    cx, cy = -2.1 + cw*1.5, -1.5 + ch*1.5
    bm = bmesh.new()
    pts = [(0,0),(0,-1.0),(0.25,-0.76),(0.45,-1.14),(0.6,-1.06),(0.41,-0.69),(0.74,-0.69)]
    vb=[bm.verts.new((x,0,z)) for x,z in pts]; vt=[bm.verts.new((x,0.14,z)) for x,z in pts]
    bm.faces.new(vt); bm.faces.new(list(reversed(vb)))
    n=len(pts)
    for i in range(n):
        j=(i+1)%n; bm.faces.new((vb[i],vb[j],vt[j],vt[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me=bpy.data.meshes.new('cur'); bm.to_mesh(me); o=bpy.data.objects.new('cur',me); bpy.context.collection.objects.link(o)
    o.location=(cx-0.25, cy+0.25, 2.1); o.rotation_euler=(0,0,math.radians(45)); bpy.context.view_layer.update()
    finish(o, accent='all')
    target, scale = (0,0,0.8), 6.6
elif which == 'catalog':
    # A tray of building blocks: different shapes, one in indigo.
    box((0,0,0.12), (4.4,3.0,0.24))
    shapes = [
        ('box', (-1.45,-0.75)), ('cyl', (0,-0.75)), ('box', (1.45,-0.75)),
        ('cyl', (-1.45,0.75)), ('box', (0,0.75)), ('cyl', (1.45,0.75)),
    ]
    for k,(kind,(x,y)) in enumerate(shapes):
        acc = (k == 4)
        if kind == 'box':
            box((x,y,0.24+0.35), (0.95,0.95,0.7), accent=acc)
        else:
            cyl((x,y,0.24+0.3), 0.48, 0.6, accent=acc)
    target, scale = (0,0,0.4), 6.4
elif which == 'search':
    # A magnifying lens resting over a grid of records.
    box((0,0,0.12), (4.2,3.0,0.24))
    for i in range(5):
        for j in range(4):
            x = -2.1 + 0.84*(i+0.5); y = -1.5 + 0.75*(j+0.5)
            hit = (i,j) in {(2,1),(3,2)}
            box((x,y,0.24+0.04), (0.74,0.65,0.08), accent=hit)
    cx, cy, cz = 0.0, 0.15, 1.05
    bpy.ops.mesh.primitive_torus_add(major_radius=0.95, minor_radius=0.14, major_segments=96, minor_segments=24, location=(cx,cy,cz))
    finish(bpy.context.object)
    # Handle: leaves the ring toward the front-right, sloping down to rest.
    d = Vector((0.75, -0.66, -0.28)).normalized()
    start = Vector((cx,cy,cz)) + Vector((d.x, d.y, 0)).normalized()*1.05
    length = 1.5
    mid = start + d*(length/2)
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.17, depth=length, location=mid)
    h = bpy.context.object
    h.rotation_euler = d.to_track_quat('Z','Y').to_euler()
    bpy.context.view_layer.update()
    finish(h, accent='all')
    target, scale = (0.2,0,0.6), 6.4
elif which == 'reference':
    # A card file: an open box with three tabbed index cards standing in it.
    box((0,0,0.5), (3.0,1.9,1.0))
    for k in range(3):
        y = -0.5 + k*0.5
        box((0,y,1.25), (2.6,0.1,1.6))
        tx = -0.8 + k*0.8
        box((tx,y,2.2), (0.7,0.1,0.3), accent=(k==1))
    target, scale = (0,0,1.1), 6.2
elif which == 'agent':
    # pipe0's agent: a rounded head with an indigo visor, two eyes and an
    # antenna. Square render, used as the Ask AI avatar.
    sc.render.resolution_y = sc.render.resolution_x
    rounded_slab((0,0,0.75), 1.7, 1.7, 1.5, 0.42)
    # visor on the camera-facing -y side, within the flat part of the face
    box((0.0,-0.87,0.82), (0.84,0.04,0.5), accent='all')
    box((-0.17,-0.9,0.84), (0.13,0.04,0.2))
    box((0.17,-0.9,0.84), (0.13,0.04,0.2))
    cyl((0,0,1.72), 0.07, 0.44)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=0.17, location=(0,0,2.02))
    finish(bpy.context.object, accent='all')
    AZ = 20
    target, scale = (0,0,1.0), 2.9
elif which == 'api':
    for k,z in enumerate((0.15, 0.95, 1.75)):
        o = box((0,0,z), (3.0 - k*0.5, 3.0 - k*0.5, 0.3), accent=(k==2))
        if k:
            # box() bakes its position into the mesh, so location is an offset
            if k == 2:
                # top layer: rises, makes a quarter turn (square, so seamless), settles
                def top(t, o=o):
                    lift = pulse(t, 0.1, 0.7)
                    o.location.z = 0.5*lift
                    turn = min(1.0, max(0.0, ((t - 0.1) % 1.0 - 0.15) / 0.4)) if (t - 0.1) % 1.0 < 0.7 else 1.0
                    o.rotation_euler.z = math.radians(90) * (0.5 - 0.5*math.cos(math.pi*turn)) * (1 if (t - 0.1) % 1.0 < 0.7 else 0)
                ANIM.append(top)
            else:
                ANIM.append(lambda t, o=o: setattr(o.location, 'z', 0.22*pulse(t, 0.05, 0.75)))
    cyl((0,0,1.3), 0.28, 3.0)
    target, scale = (0,0,1.0), 5.6

bpy.ops.object.camera_add(); cam = bpy.context.object
cam.data.type = 'ORTHO'; cam.data.ortho_scale = scale
el, az = math.radians(28 if 'AZ' in globals() else 35.264), math.radians(globals().get('AZ', 45))
dist = 30
cam.location = Vector(target) + Vector((dist*math.cos(el)*math.sin(az), -dist*math.cos(el)*math.cos(az), dist*math.sin(el)))
cam.rotation_euler = (Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
sc.camera = cam
w = bpy.data.worlds.new('w'); sc.world = w
sc.render.filepath = out
if not ANIMATE:
    for fn in ANIM:  # the still is the loop's first frame (the video poster)
        fn(0.0)
    bpy.ops.render.render(write_still=True)
else:
    # White ground (the page multiplies it onto the dotted stage), keyed
    # every frame from the periodic functions so the loop is seamless.
    sc.render.film_transparent = False
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (1, 1, 1, 1)
    sc.frame_start, sc.frame_end, sc.render.fps = 1, FRAMES, 24
    objs = [o for o in sc.objects if o.type == 'MESH']
    for f in range(1, FRAMES + 1):
        for fn in ANIM:
            fn((f - 1) / FRAMES)
        for o in objs:
            o.keyframe_insert('location', frame=f); o.keyframe_insert('scale', frame=f)
            o.keyframe_insert('rotation_euler', frame=f)
    if hasattr(sc.render.image_settings, 'media_type'):
        sc.render.image_settings.media_type = 'VIDEO'
    sc.render.image_settings.file_format = 'FFMPEG'
    sc.render.ffmpeg.format = 'MPEG4'; sc.render.ffmpeg.codec = 'H264'
    sc.render.ffmpeg.constant_rate_factor = 'HIGH'; sc.render.ffmpeg.ffmpeg_preset = 'GOOD'
    bpy.ops.render.render(animation=True)
