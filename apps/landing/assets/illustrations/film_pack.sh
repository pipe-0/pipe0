#!/bin/sh
# Packs the hero film's pictures (film_fal.md) into public/media/website/film:
# the helper's poses as one strip, the clock, and the portraits.
#
#   sh film_pack.sh <dir with the cut-outs: idle.png blink.png glance.png
#                    look.png look2.png mail.png sleep.png clock.png>
#
# The cut-outs are the renders in film/ with their background removed (step
# 5 of film_fal.md), 2048 square, RGBA. Every pose gets the same crop, so
# the poses register on the feet and the film can cut from one to the next.
# The portraits come straight from film/faces.webp.
set -e
IN="$1"
HERE="$(dirname "$0")"
OUT="$HERE/../../public/media/website/film"
TMP="$(mktemp -d)"
mkdir -p "$OUT"

# The helper: seven poses, 216x243 each (about 2.7x their size on screen).
CROP="crop=1368:1540:340:196,scale=216:243:flags=lanczos"
ffmpeg -y -loglevel error \
  -i "$IN/idle.png" -i "$IN/blink.png" -i "$IN/glance.png" -i "$IN/look.png" \
  -i "$IN/look2.png" -i "$IN/mail.png" -i "$IN/sleep.png" \
  -filter_complex "[0]$CROP[a];[1]$CROP[b];[2]$CROP[c];[3]$CROP[d];[4]$CROP[e];[5]$CROP[f];[6]$CROP[g];[a][b][c][d][e][f][g]hstack=7" \
  -frames:v 1 "$TMP/blob.png"
cwebp -quiet -q 90 -alpha_q 92 "$TMP/blob.png" -o "$OUT/blob.webp"

# The clock. Its white face is cut out with the background; the film puts a
# face and hands behind and over it.
ffmpeg -y -loglevel error -i "$IN/clock.png" \
  -vf "crop=1272:1440:388:290,scale=212:240:flags=lanczos" -frames:v 1 "$TMP/clock.png"
cwebp -quiet -q 90 -alpha_q 92 "$TMP/clock.png" -o "$OUT/clock.webp"

# Portraits: eight 600px squares from the 4x2 sheet (cells start at x 0, 691,
# 1380, 2070 and y 0, 773), in reading order.
SHEET="$HERE/film/faces.webp"
FACES=""
N=0
for Y in 22 795; do
  for X in 40 731 1420 2110; do
    FACES="$FACES[0]crop=600:600:$X:$Y[f$N];"
    N=$((N + 1))
  done
done
ALL="[f0][f1][f2][f3][f4][f5][f6][f7]hstack=8"
ffmpeg -y -loglevel error -i "$SHEET" -filter_complex "$FACES$ALL,scale=1024:128:flags=lanczos" -frames:v 1 "$TMP/faces.png"
cwebp -quiet -q 86 "$TMP/faces.png" -o "$OUT/faces.webp"
# The first three again at 8, 16 and 32 pixels: the terminal's inline
# pictures, and the steps a portrait sharpens through.
for SIZE in 8 16 32; do
  ffmpeg -y -loglevel error -i "$SHEET" \
    -filter_complex "[0]crop=600:600:40:22[a];[0]crop=600:600:731:22[b];[0]crop=600:600:1420:22[c];[a][b][c]hstack=3,scale=$((SIZE * 3)):$SIZE:flags=bicubic" \
    -frames:v 1 "$OUT/faces-$SIZE.png"
done
ls -l "$OUT"
