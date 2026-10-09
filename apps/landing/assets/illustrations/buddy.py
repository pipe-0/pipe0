import bpy, math, sys
from mathutils import Vector
out = sys.argv[sys.argv.index("--")+1]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 160; sc.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type='METAL'; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = 'GPU'
except Exception as e: print(e)
sc.render.resolution_x = sc.render.resolution_y = 640
sc.render.film_transparent = True
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Base Contrast'
sc.render.image_settings.file_format='PNG'; sc.render.image_settings.color_mode='RGBA'

def lin(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(((x+0.055)/1.055)**2.4 if x>0.04045 else x/12.92 for x in c)
def mat(name, hexc, rough, sss=0.0, coat=0.0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*lin(hexc),1)
    b.inputs['Roughness'].default_value=rough
    b.inputs['Subsurface Weight'].default_value=sss
    b.inputs['Subsurface Radius'].default_value=(0.6,0.5,0.8)
    b.inputs['Subsurface Scale'].default_value=0.15
    b.inputs['Coat Weight'].default_value=coat
    return m

# Body: a soft pebble, slightly wider than tall, flat-ish base
bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1.0, location=(0,0,0))
body=bpy.context.object; body.scale=(1.08,0.95,0.92)
bpy.ops.object.shade_smooth()
m=body.modifiers.new('s','SUBSURF'); m.levels=2
body.data.materials.append(mat('clay','#cdd3ff',0.5,sss=0.25))

# Sprout: two soft leaves in glossy brand indigo
def leaf(rot, loc):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=0.3, location=loc)
    o=bpy.context.object; o.scale=(1.0,0.55,0.34); o.rotation_euler=rot
    bpy.ops.object.shade_smooth()
    o.data.materials.append(mat('leaf','#3b49e0',0.28,coat=0.7))
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.06, depth=0.34, location=(0,0,0.97))
st=bpy.context.object; bpy.ops.object.shade_smooth(); st.data.materials.append(mat('stem','#3b49e0',0.3,coat=0.6))
leaf((0,math.radians(-30),0), (0.24,0,1.17))
leaf((0,math.radians(30),0), (-0.24,0,1.17))

# No ground shadow: the avatar circle grounds the character.

cam_loc=Vector((0,-6.2,1.4)); bpy.ops.object.camera_add(location=cam_loc); cam=bpy.context.object
cam.rotation_euler=(Vector((0,0,0.12))-cam_loc).to_track_quat('-Z','Y').to_euler()
cam.data.lens=62; sc.camera=cam

def area(loc,p,size,col=(1,1,1)):
    bpy.ops.object.light_add(type='AREA',location=loc); l=bpy.context.object
    l.data.energy=p; l.data.size=size; l.data.color=col
    l.rotation_euler=(Vector((0,0,0.2))-l.location).to_track_quat('-Z','Y').to_euler()
area((-1.6,-2.4,6),700,3.5)
area((4,-1,1.5),90,3,(0.8,0.85,1))
area((1.5,4,3),420,2.5)
area((0,-4,-1.5),140,5,(0.92,0.94,1))  # soft bounce from below
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True
w.node_tree.nodes['Background'].inputs['Color'].default_value=(0.95,0.96,1,1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value=0.28
sc.render.filepath=out
bpy.ops.render.render(write_still=True)
