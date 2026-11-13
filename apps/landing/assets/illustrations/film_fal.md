# Hero film pictures (fal.ai)

`public/media/website/film/`: the few pictures the hero film
(`src/components/landing/hero-morph.tsx`) loads. Everything else in the
film is DOM.

- `blob.webp`: pipe0's helper in seven poses, side by side: idle, blink,
  glance, look, look2, mail, sleep.
- `clock.webp`: the alarm clock Run turns into.
- `faces.webp`: eight portraits, and `faces-8.png`, `faces-16.png`,
  `faces-32.png`: the first three again as pixels, for the terminal.

About 105 KB in all.

The helper is stills, not video. The film cuts from pose to pose and moves
the picture itself (hops, squash, the little jump when it finds something),
the way a toy is animated in stop motion. That keeps every beat on the
film's own clock, lets the helper stand on any background, and costs 59 KB
where one looping clip cost 100 to 400.

The picked renders are kept at full size in `film/` next to this file (WebP,
about 1.1 MB), so a pose can be cut or packed again without rendering it
again. A new render never comes back the same.

Needs `FAL_KEY` in the environment; never commit the key.

## 1. The helper, standing: `fal-ai/nano-banana-pro/edit`

`image_urls`: `film/first-look.webp` and `film/first-mail.webp` (as PNGs),
two first tries of the helper holding a prop. Those were rendered from
`scenes/sheets.webp` and `scenes/levels/infrastructure.webp`, which both
show the helper in glossy plastic, with this same opening and close around
a prop scene. `aspect_ratio: "1:1"`, `resolution: "2K"`, three renders; the
second was picked (`film/idle.webp`). It is the reference for every pose.

> Create a new 3D illustration in exactly the style of the reference
> images: the same material, colours, lighting and camera angle. Everything
> is smooth, hard, glossy solid plastic, like a premium vinyl designer toy:
> perfectly even surfaces, crisp rounded edges, clear soft studio
> reflections. Simple and chunky, with very few parts. The picture shows
> one small character and one prop, and nothing else. The character is the
> helper from the references: a pale lavender glossy pebble-shaped blob, a
> little wider than tall, with a tiny indigo blue two-leaf sprout on top of
> its head, two small dark navy oval eyes set fairly wide apart and a tiny
> smile. It has two small stubby lavender arms and no legs. Keep its look
> exactly. No hard hat, no spreadsheet, no pipe, no clock.
>
> Scene: the blob simply stands upright in the middle of the frame, facing
> the camera, calm and friendly, with its two stubby arms relaxed at its
> sides and two tiny rounded feet. It holds nothing. No prop at all. Its
> body shape and proportions are those of the character in the first
> reference image: round and plump, slightly taller than wide.
>
> Colours: pale lavender for the character, indigo blue (#3B49E0), sunny
> yellow and coral red for the prop, and white. Bright, clean and positive.
> Seen from the front and very slightly above. Pure seamless white
> background (#ffffff), only a very soft, very small contact shadow
> directly under the character, bright soft studio lighting, crisp detail.
> Wide composition: the character and its prop sit together in the middle
> of the frame, large, with clear white margins on all sides, and nothing
> touches the edges. No text, no letters, no numbers, no logos.

## 2. Poses: `fal-ai/nano-banana-pro/edit`

`image_urls`: `film/idle.webp` and nothing else. Same size. Two renders a
pose. The opening pins the character in place, which is what lets the film
cut between poses; a pose that came back larger, smaller or shifted is no
use, so check the feet line up before picking.

> Edit this image. Keep exactly the same character, the same smooth glossy
> plastic material, the same colours, lighting, camera and pure white
> background, and keep the character the same size and in the same place in
> the frame, standing on the same spot. Change only its pose and expression
> as described, and add nothing else. No text, no letters, no logos.

- `glance`: The blob looks toward the left side of the picture: both of its
  dark eyes are clearly shifted to the left edge of its face and its body
  leans a little to the left, curious about something beside it. Its arms
  stay relaxed at its sides.
- `look`, `look2` (the two renders of one prompt; one has the glass on its
  left eye, the other on its right, and the film alternates them): The blob
  holds a magnifying glass in one stubby arm, up in front of one of its
  eyes, and peers through it toward the camera, leaning slightly forward
  with curiosity. The magnifying glass has a chunky sunny yellow round rim
  and a short coral red handle, and its lens is about as big as the blob's
  face. The eye behind the lens looks bigger. The other eye stays visible.
- `mail`: The blob holds a chunky white envelope, closed with a round coral
  red seal, high above its head with both stubby arms, triumphant and
  delighted. Its eyes are closed into two happy upward-curved arcs and it
  has a wide open smile.
- `sleep`: The blob is fast asleep, standing: its eyes are closed into two
  small downward-curved lines, its mouth is a tiny relaxed line, its body
  has settled a little lower and wider, and the two-leaf sprout on its head
  droops to one side.
- `blink`: The blob has its eyes closed into two short curved lines, as in
  the middle of a blink. Everything else is identical to the original
  image.

## 3. The clock: `fal-ai/nano-banana-pro/edit`

`image_urls`: `scenes/sheets.webp`, which has the clock in it. `"1:1"`,
`"2K"`, two renders; pick the one seen dead straight from the front, since
the film draws the hands on it.

> Create a new 3D illustration in exactly the style of the reference image:
> smooth, hard, glossy solid plastic, like a premium vinyl designer toy,
> with perfectly even surfaces, crisp rounded edges and clear soft studio
> reflections. The picture shows one object and nothing else: the small
> round twin-bell alarm clock from the reference, seen exactly from the
> front, perfectly straight on, not tilted and not rotated. It has a sunny
> yellow round body, two sunny yellow bells on top with a small yellow
> hammer between them, and two short yellow feet. Its face is a plain,
> completely empty, flat white disc: no hands, no numbers, no marks, no
> dots, nothing on the face at all. No character, no spreadsheet. Pure
> seamless white background (#ffffff), only a very soft, very small contact
> shadow, bright soft studio lighting, crisp detail. The clock sits in the
> middle of the frame, large, with clear white margins on all sides. No
> text, no letters, no numbers, no logos.

## 4. Portraits: `fal-ai/nano-banana-pro`

Text only, `aspect_ratio: "16:9"`, `"2K"`, two renders. One came back as a
clean grid (`film/faces.webp`); the other drew film-strip borders around
every cell. Nobody in it is a real person.

> A contact sheet of eight separate professional headshot photographs
> arranged in a clean grid, four columns by two rows, each photo in its own
> square cell of exactly equal size, with thin white gutters between the
> cells. Each photo shows a different real-looking person, head and
> shoulders, centred, facing the camera with a warm, natural, relaxed
> smile, the head filling about sixty percent of the cell height, identical
> framing and scale in every cell. The eight people are varied in gender,
> ethnicity and age, between about 28 and 50, with different hair and
> modern smart-casual clothing in plain colours. Each cell has its own
> plain, flat, softly lit pastel studio backdrop: in order, pale lavender,
> butter yellow, blush coral, mint green, sky blue, pale lavender, butter
> yellow, blush coral. Natural editorial portrait photography shot on an
> 85mm lens, soft even daylight, true skin texture, candid and likeable,
> not retouched, not glamorous, no stock-photo poses. No text, no captions,
> no logos, no borders other than the white gutters.

The pastel backdrops are the page's own lavender, yellow and coral, which
is what lets photographs sit next to the plastic.

## 5. Cut out: `fal-ai/birefnet/v2`

Each pose and the clock, as PNG: `model: "General Use (Heavy)"`,
`operating_resolution: "2048x2048"`, `refine_foreground: true`,
`output_format: "png"`. It returns the picture with a clean alpha edge and
without the floor shadow, which the film draws itself so it can shrink
when the helper jumps. It also removes the clock's white face along with
the background; the film puts a face behind it.

## 6. Pack

```sh
sh film_pack.sh <dir with the eight cut-outs>
```

One crop for every pose, so they register on the feet. If a new pose is
taller or wider than the crop (340, 196, 1368 by 1540 of 2048), widen the
crop for all of them and change `BLOB` in `hero-morph.tsx` to the same
proportions.

## Rules the film keeps

- No provider logos. A provider is one of the plastic tiles in the three
  colours; a miss goes grey and falls away, a hit stays in front of what
  it found.
- Not a copy of the product's table. Three big rows, three columns, one
  helper.
- One helper on screen. More of them, or looping clips in several cells,
  is more motion than a reader beside it can take.
