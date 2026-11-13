# Scene stills (fal.ai)

`public/media/website/illustrations/scene-*.webp`: the pictures on the
marketing pages below the hero. They are the four agents from the hero
knife (`knife_fal.md`) at work, so every section speaks the picture
language the headline starts. Used by `landing-story.tsx` (`Scene`), the
surfaces cards, the Products menu, `/mcp` and `/enrichment-api`.

They are glossy plastic, not clay. Clay figures are the visual identity of
Clay, a direct competitor, so nothing on the site should look modelled by
hand. The scenes are rendered first and given their material in a second
pass (below), which is also how to restyle them again without losing the
compositions.

Stills on purpose. A reader is reading next to them, and anything that
moves beside the words competes with them. They are also 17 to 34 KB each,
where a loop was 100 to 400 KB.

The picked renders are kept at full size in `scenes/` next to this file
(WebP, about 1 MB in all), so a still can be cropped or encoded again
without rendering it again. A new render never comes back the same.

`moment` is in `scenes/` but not on the site at the moment: the band it
illustrated was cut from the homepage.

Needs `FAL_KEY` in the environment; never commit the key.

## 1. Render: `fal-ai/nano-banana-pro/edit`

`image_urls`: the hero knife's poster (`knife.webp`, as a PNG), which pins
the characters, the clay and the light. `resolution: "2K"`, three renders
per scene, `aspect_ratio: "4:3"` (`"3:4"` for `moment`). The prompt is one
shared opening, the scene, and one shared close.

Opening:

> Create a new premium 3D illustration in exactly the style of the
> reference image, using its characters. The reference shows four cute clay
> characters: a blocky orange pixel-art crab with raised claws, two small
> dark eyes and a smile; a puffy four-pointed sparkle star with a blue to
> violet gradient and two tiny white eyes; a glossy black ball with two big
> white cartoon eyes; and a pale lavender pebble-shaped blob with a tiny
> indigo two-leaf sprout on top and small navy eyes. Keep each character's
> exact look and colors. Do not show the red knife.

Close:

> Everything is made of smooth, clean, soft matte clay with gently rounded
> shapes, in bright, saturated, cheerful candy colors: sunny yellow,
> orange, coral red, mint green, sky blue, indigo blue and white. Colorful,
> light and lively, never dark, dull or dirty. Friendly and charming, Pixar
> or Apple product marketing quality. Pure seamless white background
> (#ffffff), a very soft small contact shadow, bright soft studio lighting,
> crisp detail. The whole scene sits in the middle of the frame with wide
> white margins on all sides. No text, no letters, no numbers, no logos.

The colour sentence matters. An earlier set in the brand's indigo, white
and navy alone read as dark and grimy next to the hero. The words "soft
matte clay" are still in this prompt because the hero's characters are
described that way and the model keeps them on model with it; the next step
takes the clay out.

Scenes:

- `moment`: the four characters stand on each other's shoulders in a
  slightly wobbly tower. From bottom to top: the lavender blob, the orange
  pixel crab, the blue-violet star, and on top the black ball. Above them,
  a glowing warm yellow lightbulb hangs on a thin cord from the top of the
  frame. The black ball looks up at it and stretches as high as it can, but
  the lightbulb is still just out of reach: a clear small gap remains
  between them. All four look up, hopeful.
- `research`: the glossy black ball character peers through a large
  magnifying glass with a chunky orange rim and handle. Under the glass
  lies a small white clay profile card showing a simple round
  head-and-shoulders figure in sky blue and three short colored lines. The
  glass makes part of the card look bigger. Only this one character
  appears.
- `systems`: the orange pixel crab runs a cute little clay machine. The
  machine is a rounded sky blue box with a sunny yellow funnel on top, a
  coral red lever on its side and two round dials. A short mint green
  conveyor belt comes out of the machine carrying a neat row of five small
  white clay envelopes with colored seals, evenly spaced. The crab holds
  the lever with one claw and looks pleased. Only this one character
  appears.
- `infrastructure`: the pale lavender blob with the indigo sprout looks
  after a small free-standing machine made of chunky clay pipes in indigo
  blue, sunny yellow, coral red and mint green, with round joints, a red
  valve wheel and a small round pressure gauge. The pipes rise from a low
  base, and every pipe end is closed with a rounded cap, so no pipe leaves
  the picture. Three pipes bend down into three outlets, and small colored
  clay balls drop from each outlet into three little matching bins. The
  blob wears a tiny sunny yellow hard hat and stands beside the bins. Only
  this one character appears. Nothing touches the edges of the frame.
- `sheets`: a chunky clay spreadsheet lies tilted toward the viewer like a
  tray: a thick rounded white slab with a neat grid of square cells, five
  columns by four rows. About half of the cells hold bright colored tiles
  in indigo blue, sunny yellow, coral red and mint green; the rest are
  empty white. The pale lavender blob stands on the sheet and carries one
  more colored tile to an empty cell. A small round sunny yellow alarm
  clock stands beside the sheet. Only this one character appears.
- `mcp`: in the middle stands a rounded indigo blue hub block with three
  round sockets and a small glowing white light. The orange pixel crab, the
  blue-violet star and the black ball are arranged around it, and each is
  connected to the hub by its own chunky curly cable with a plug: one cable
  sunny yellow, one coral red, one mint green. All three plugs are plugged
  in. The characters look happy. Only these three characters appear.
- `slack`: a big puffy white clay speech bubble with a small tail, and on
  its front a chunky at sign, the symbol @, in indigo blue clay. The pale
  lavender blob with the indigo sprout sits on top of the bubble. Beside it
  floats a smaller mint green reply bubble with three white dots, and a
  tiny sunny yellow bubble and a tiny coral red bubble float nearby. Only
  this one character appears.
- `api`: the blue-violet sparkle star builds with chunky toy building
  blocks in sunny yellow, coral red, mint green and sky blue, stacked into
  a small sturdy tower. The star holds one more block, a white one with a
  pair of bold indigo curly braces pressed into its front, about to place
  it on the tower. Only this one character appears.

Two prompts were rewritten after a first batch. `infrastructure` first ran
its pipes out of the top of the frame, which a crop cannot fix. `slack`
first asked for a four-colour hash sign, which came back as Slack's retired
logo; an at sign says "mention" without borrowing a mark.

Picking: reject a render where a character is hidden (a ball behind the
magnifying glass), where the scene touches the frame, or where the
characters drift from the hero's.

## 2. Material: `fal-ai/nano-banana-pro/edit`

`image_urls`: the picked render from step 1, nothing else. Same aspect
ratio and resolution. The result comes back aligned with its source to
within a few pixels, so the crops below carry over.

> Edit this image and change only the material that every object and
> character is made of. Everything is now made of smooth, hard, glossy
> plastic, like a premium vinyl designer toy or polished injection-moulded
> plastic: perfectly even surfaces, crisp clean edges, clear soft studio
> reflections and highlights. Remove every trace of clay: no hand-made
> texture, no fingerprints, no lumps, no dents, no soft matte modelling-clay
> look. Keep everything else exactly as it is, pixel for pixel: the same
> shapes, the same characters and faces, the same positions and sizes, the
> same bright colours, the same composition, camera, framing, shadows and
> white background. No text, no logos.

A satin, soft-touch plastic was tried next to it. It is closer to the clay
originals and, at the size the pictures are shown, still reads as clay.
Gloss is what tells the eye "not clay" at a glance, and it matches the
knife's handle and the site's glossy buttons and bars.

## 3. Encode

`scenes_encode.sh` crops a render to the scene plus an even margin, lifts
the backdrop to pure white and writes the WebP. The crop and the backdrop's
white point belong to the render, so measure them for a new one: the
figure's bounds, and the backdrop's value along the top edge.

```sh
sh scenes_encode.sh moment         scenes/moment.webp         1100:2389:301:0    690 1498
sh scenes_encode.sh research       scenes/research.webp       2220:1665:73:44    1000 750 0.996 0.996 0.996
sh scenes_encode.sh systems        scenes/systems.webp        2325:1743:48:34    1000 750 0.992 0.996 0.992
sh scenes_encode.sh infrastructure scenes/infrastructure.webp 2082:1561:111:138  1000 750
sh scenes_encode.sh sheets         scenes/sheets.webp         2069:1552:174:141  1000 750 0.992 0.996 0.996
sh scenes_encode.sh mcp            scenes/mcp.webp            2348:1761:10:0     1000 750 0.992 0.996 0.996
sh scenes_encode.sh slack          scenes/slack.webp          2085:1564:188:104  1000 750 1 1 1
sh scenes_encode.sh api            scenes/api.webp            2088:1566:197:130  1000 750 0.996 0.996 0.996
```

Every still is 1000 by 750 except `moment`, which is tall: the tower is the
point, and the cord has to reach the top of the frame.

On the page a still is an `<img>` with `mix-blend-multiply`, straight on
the white cell: no dotted stage, no brackets, no frame.

## Level pictures (homepage)

`scene-research`, `scene-systems` and `scene-infrastructure`, the three
pictures in the "three levels" cards, are a simpler set of their own: one
object each, in solid glossy colour. The stills above (sheets, mcp, slack,
api) are the older, busier set and are no longer on the homepage.

Rules that hold across the three:

- One object, or two. No character unless the scene needs one
  (infrastructure keeps the helper in the hard hat).
- Indigo (#3B49E0) as the main colour, sunny yellow and coral red as
  accents, and white. No other colours.
- Every picture points the same way, from the upper left down to the lower
  right: the magnifying glass's handle, the conveyor belt, the pipe's
  outlet.

Tried and dropped, in this order: a needle-felted plush version (the look
of the films in `video-pipeline`), a version shown as a construction
drawing until hovered, and a frosted-glass version of these same three
scenes ("a visual regression").

### 1. Research: `fal-ai/nano-banana-pro`

Text only, `aspect_ratio: "4:3"`, `resolution: "2K"`, one render. It is
also the style reference for the other two.

> A simple, minimal 3D illustration, 4:3 composition. A small profile card
> lies on the floor, seen in three-quarter view: a white rounded rectangle
> with a simple round head-and-shoulders figure in indigo blue on its left
> side and three short rounded bars on its right side. A large magnifying
> glass lies across the upper right part of the card, its round lens over
> the bars, its straight handle pointing toward the lower right corner of
> the frame. Only these two objects and nothing else: no character, no
> face, no hands. Camera: three-quarter view from the front and slightly
> above; the scene's main direction runs from the upper left to the lower
> right. Material: smooth, hard, glossy plastic, like a premium designer
> toy or a product render for Apple marketing: perfectly even surfaces,
> crisp clean rounded edges, clear soft studio reflections. Chunky,
> simplified shapes with very few details. Colours: indigo blue (#3B49E0)
> as the main colour, with sunny yellow and coral red as accents, and
> white. Bright, clean and positive, never dark or dull. Pure seamless
> white background (#ffffff), a very soft small contact shadow, bright soft
> studio lighting, crisp detail. The objects sit in the middle of the frame
> with wide white margins on all sides. No text, no letters, no numbers, no
> logos.

### 2. Systems and infrastructure: `fal-ai/nano-banana-pro/edit`

`image_urls`: the research render. Two renders per scene. A shared
opening, the scene, a shared close.

> Create a new 3D illustration in exactly the style of the reference image:
> the same material, colours, lighting and camera angle. Everything is
> smooth, hard, glossy solid plastic, like a premium designer toy:
> perfectly even surfaces, crisp rounded edges, clear soft studio
> reflections. Nothing is glass, nothing is transparent. Simple and chunky,
> with very few parts. Colours: indigo blue (#3B49E0) as the main colour,
> sunny yellow and coral red as accents, and white. Seen in the same
> three-quarter view as the reference, from the front and slightly above,
> and the scene points the same way: its direction runs from the upper left
> to the lower right. Do not show the card or the magnifying glass from the
> reference.

> Bright, clean and positive. Pure seamless white background (#ffffff),
> only a very soft small contact shadow, bright soft studio lighting, crisp
> detail. The scene sits in the middle of the frame with wide white margins
> on all sides and nothing touches the edges. No text, no letters, no
> numbers, no logos.

- `systems`: one small machine and nothing else. Its housing is a rounded
  indigo blue box. On top sits a sunny yellow funnel. On its front are two
  round white dials, and on its side a coral red lever with a round knob. A
  short pale grey conveyor belt comes out of the front of the machine and
  runs toward the lower right corner of the frame, carrying a neat row of
  three small white envelopes, each closed with a coral red dot. No
  character, no face, no hands.
- `infrastructure`: one pipe and one small helper, nothing else. A single
  thick indigo blue pipe stands on a small round base at the left, rises,
  makes one smooth bend like an arched tap, and ends in an open outlet that
  points down toward the lower right. One coral red valve wheel sits on the
  pipe. Two small balls, one sunny yellow and one coral red, are dropping
  from the outlet into a small white bin that stands on the floor at the
  lower right. Beside the base of the pipe, at the lower left, stands a
  small round helper: a pale lavender glossy blob with two small dark eyes
  and a tiny smile, wearing a sunny yellow hard hat, looking toward the
  lower right.

### 3. Backdrop and encode

The backdrops come back off-white and uneven from corner to corner. Each
pick was flat-fielded before it was saved: a smooth surface fitted to the
backdrop and divided out, which leaves the objects, their shading and the
floor shadows alone. The corrected renders are in `scenes/levels/`.

White parts on a white backdrop (the card, the bin, the envelopes) are
almost as light as the backdrop itself, so two things differ from the older
set. The crop must be measured on everything that is not backdrop, the
palest parts included, or it cuts them off. And the encode uses a later,
shorter knee, or they lose their edges:

```sh
export KNEE="0.965/0.965 0.992/1"
sh scenes_encode.sh research       scenes/levels/research.webp       2104:1578:219:167 1000 750 1 1 1
sh scenes_encode.sh systems        scenes/levels/systems.webp        2080:1560:300:118 1000 750 1 1 1
sh scenes_encode.sh infrastructure scenes/levels/infrastructure.webp 2133:1600:206:120 1000 750 1 1 1
```

