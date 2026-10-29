#!/bin/sh
# Flattens knife_anim.py's RGBA frames onto white and writes the hero loop
# and its poster (the first frame) into public/.
#
#   blender -b -P knife_anim.py -- /tmp/knife --samples 40
#   sh knife_encode.sh /tmp/knife
set -e
IN="$1"
# The floor shadow is the only thing that reaches the frame's edges, and a
# shadow cut off by the edge draws a faint box in the headline. Fade it out
# over the outer 70px; solid pixels (alpha > 230) are left alone, so an agent
# near the edge keeps its full colour.
E="clip(min(min(X,W-1-X),min(Y,H-1-Y))/70,0,1)"
FADE="format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='alpha(X,Y)*if(gt(alpha(X,Y),230),1,$E*$E*(3-2*$E))'"
OUT="$(dirname "$0")/../../public/media/website/illustrations"
ffmpeg -y -loglevel error -framerate 30 -i "$IN/k%04d.png" \
  -filter_complex "[0:v]$FADE[fg];color=white:s=400x400:r=30[bg];[bg][fg]overlay=shortest=1,format=yuv420p" \
  -c:v libx264 -preset veryslow -crf 21 -tune animation -movflags +faststart -an \
  "$OUT/knife.mp4"
ffmpeg -y -loglevel error -i "$IN/k0001.png" \
  -filter_complex "[0:v]$FADE[fg];color=white:s=400x400[bg];[bg][fg]overlay" -frames:v 1 \
  "$IN/poster.png"
cwebp -quiet -q 88 "$IN/poster.png" -o "$OUT/knife.webp"
ls -l "$OUT/knife.mp4" "$OUT/knife.webp"
