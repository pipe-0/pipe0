# Hero knife loop (fal.ai)

`public/media/website/illustrations/knife.mp4` and `knife.webp`, the Swiss
Army knife in the homepage headline. Made with fal.ai: an image model for
the still, then an image-to-video model with that still as both the first
and the last frame, so the clip loops. Needs `FAL_KEY` in the environment;
never commit the key.

The Blender version (`knife_anim.py`, `knife_encode.sh`) was replaced by
this one: it read as too simple next to the type.

## 1. Still: `fal-ai/nano-banana-pro`

`num_images: 4`, `aspect_ratio: "4:3"`, `resolution: "2K"`. The third of the
batch was picked: a plain white cross, the agents big, a bare corkscrew in
the middle. Reject any result that draws Victorinox's shield (two of four
did). A first, upright-knife batch was dropped: at headline size the agents
on a tall, thin knife were too small to read.

> Premium 3D product render, wide landscape composition. A classic glossy
> red Swiss Army knife lying horizontally, seen from the side at a slight
> three-quarter angle and slightly from above, a small white cross on the
> red handle, polished steel liners and rivets visible. Four polished steel
> tools are folded out and fan upward from the top of the handle like a
> peacock tail, evenly spread. On the tip of each tool sits a cute character
> made of soft matte clay, and the characters are big: each one about as
> tall as the knife handle is high. From left to right: (1) a blocky orange
> pixel-art crab with raised claws, two small dark eyes and a smile, (2) a
> puffy four-pointed sparkle star with a blue to violet gradient and two
> tiny white eyes, (3) a glossy black ball with two big white cartoon eyes,
> (4) a pale lavender pebble-shaped blob with a tiny indigo two-leaf sprout
> on top and small navy eyes. Friendly and charming, Pixar or Apple product
> marketing quality. Pure seamless white background (#ffffff), very soft
> contact shadow under the knife, bright soft studio lighting, crisp detail.
> The whole knife and all four characters fully in frame with white margin.
> No text, no logos.

## 2. Motion: `fal-ai/kling-video/v2.1/pro/image-to-video`

`image_url` and `tail_image_url` both set to the still, `duration: "5"`.
(Veo 3.1 first-last-frame only renders 16:9 or 9:16 and cropped the agents
off; Kling keeps the input's shape and holds the knife still.)

> The four cute clay characters on the tools of the red Swiss Army knife
> come alive with small, charming, gentle motions: the orange pixel crab
> waves its claws and blinks, the blue-violet star twinkles and wiggles, the
> black ball blinks its big eyes and looks around, the lavender blob bobs
> and wiggles its leaf sprout. Each character keeps its exact colors and
> shape. The knife and the tools stay perfectly still. Locked-off static
> camera, no zoom, no camera movement. Seamless pure white studio
> background, soft contact shadow. Premium Pixar-quality 3D animation,
> smooth and subtle.

Negative prompt: `camera movement, zoom, blur, distortion, text, extra
characters, morphing knife, color change, new objects`.

## 3. Encode

The clip's last frame repeats its first, so it is dropped. The background
comes back at about 250, not 255, and the page multiplies the video onto
white, so a soft curve lifts it to pure white (anything less draws a faint
box around the knife). The crop is the knife's bounds over every frame plus
a margin, measured, not guessed: ffmpeg's cropdetect cut an agent off. Check
afterwards that all four edges are 253 or brighter.

```sh
ffmpeg -i kling.mp4 -vf "trim=end_frame=121,setpts=PTS-STARTPTS,\
crop=1560:800:40:224,scale=702:360:flags=lanczos,\
curves=all='0/0 0.5/0.52 0.93/0.985 0.97/1 1/1',format=yuv420p" \
  -c:v libx264 -preset veryslow -crf 22 -movflags +faststart -an knife.mp4
ffmpeg -i knife.mp4 -frames:v 1 poster.png && cwebp -q 88 poster.png -o knife.webp
```
