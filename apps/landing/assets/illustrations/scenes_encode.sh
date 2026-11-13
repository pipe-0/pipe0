#!/bin/sh
# Turns one fal.ai render from the scene set (scenes_fal.md) into the still
# the site uses: crops it, lifts the studio backdrop to pure white, fades the
# frame edges, and writes public/media/website/illustrations/scene-<name>.webp.
#
#   sh scenes_encode.sh <name> <render.png> <crop w:h:x:y> <out w> <out h> [r g b]
#
# The stills are multiplied onto a white page, so anything short of pure
# white around a figure draws a box. Three steps deal with that:
#   1. colorlevels: the backdrop comes back just short of white. Each
#      channel's white point is the backdrop's own value along the top edge
#      (the optional r g b, as fractions of 255; 0.992 if left out).
#   2. curves: a knee sends what is left of the backdrop to white. The
#      lightest parts of the picture sit below the knee and keep their
#      shading. Frosted glass is almost as light as the backdrop, so the
#      glass stills set a later, shorter knee: KNEE="0.965/0.965 0.992/1".
#   3. geq: a floor shadow can run to the frame's edge. The outer pixels are
#      faded to white.
# Check afterwards that the still's edges read 253 or brighter.
set -e
NAME="$1"
IN="$2"
CROP="$3"
W="$4"
H="$5"
R="${6:-0.992}"
G="${7:-0.992}"
B="${8:-0.992}"
KNEE="${KNEE:-0.94/0.94 0.98/1}"
OUT="$(dirname "$0")/../../public/media/website/illustrations"
TMP="$(mktemp -d)"

E="clip(min(min(X,W-1-X),min(Y,H-1-Y))/30,0,1)"
M="(1-$E*$E*(3-2*$E))"
ffmpeg -y -loglevel error -i "$IN" -frames:v 1 -vf "\
crop=$CROP,scale=$W:$H:flags=lanczos,\
colorlevels=rimax=$R:gimax=$G:bimax=$B,\
curves=all='0/0 $KNEE 1/1',format=gbrp,\
geq=r='r(X,Y)+(255-r(X,Y))*$M':g='g(X,Y)+(255-g(X,Y))*$M':b='b(X,Y)+(255-b(X,Y))*$M'" \
  "$TMP/$NAME.png"
cwebp -quiet -q 84 "$TMP/$NAME.png" -o "$OUT/scene-$NAME.webp"
ls -l "$OUT/scene-$NAME.webp"
