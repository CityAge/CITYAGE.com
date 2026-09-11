"""Render a deterministic 12-second cinemagraph from the approved still.

Requires Python, Pillow, NumPy, SciPy and ffmpeg. No generative service is used.
The original photograph is unchanged. All motion is confined to water and a
small exhaust region; the vessel, architecture, sky and camera are locked.
Run from the repository root: python scripts/render-harbour-loop.py
"""
from pathlib import Path
import json
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import map_coordinates

ROOT = Path(__file__).resolve().parents[1]
W, H, FPS, SECONDS = 1600, 800, 24, 12
SOURCE = ROOT / 'public/next-west-dawn-with-tug.jpg'
OUTPUT = ROOT / 'public/next-west-harbour-loop-v1.mp4'
base = np.asarray(Image.open(SOURCE).convert('RGB').resize((W,H), Image.Resampling.LANCZOS), dtype=np.float32)
yy, xx = np.mgrid[:H,:W].astype(np.float32)
x, y = xx * 1774/W, yy * 887/H

def polygon(points, blur=6):
    im = Image.new('L',(W,H))
    ImageDraw.Draw(im).polygon([(a*W/1774,b*H/887) for a,b in points],fill=255)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(blur)),dtype=np.float32)/255

water = polygon([(0,252),(142,260),(175,301),(370,313),(680,344),(818,368),(960,406),(1025,450),(1190,516),(1120,545),(1010,565),(884,579),(735,578),(585,558),(470,535),(414,514),(362,531),(0,745)])
water += polygon([(480,841),(700,754),(1050,650),(1265,599),(1394,643),(1450,679),(1555,687),(1705,750),(1774,775),(1774,887),(480,887)])
water = np.clip(water,0,1)
# Protect the tug and its mast, with a soft falloff outside the silhouette.
boat = polygon([(764,531),(796,531),(796,498),(815,498),(826,532),(837,542),(857,557),(853,578),(801,581),(769,564)],4)
water *= 1-boat
# Existing wake, running back/up-left from the stern; no invented white stripe.
along = (780-x)*.89 + (541-y)*.45
across = (x-780)*-.45 + (y-541)*.89
wake = np.exp(-(across/6)**2) * np.clip(along/18,0,1) * np.clip((185-along)/50,0,1) * water

def frame(t):
    t = t % SECONDS
    phase = 2*np.pi*t/SECONDS
    # Integer temporal frequencies make the motion periodic at exactly 12s.
    dx = water*(1.05*np.sin(y*.24+x*.013-phase*4) + .45*np.sin(y*.41-x*.019+phase*6))
    dy = water*(.43*np.sin(y*.16+x*.029-phase*3))
    coords = np.array([yy+dy,xx+dx])
    out = np.stack([map_coordinates(base[:,:,c],coords,order=1,mode='nearest',prefilter=False) for c in range(3)],axis=2)
    # Keep immobile regions pixel-exact before video encoding.
    out = base + (out-base)*water[:,:,None]
    out += (wake*3.3*np.sin(along*.29-phase*8))[:,:,None]
    # Several faint puffs overlap; each fades to zero before being recycled.
    for i in range(6):
        age = (t/SECONDS+i/6)%1
        life = age*3.0
        cx = 798-19*life
        cy = 536-13*life
        radius = 2.4+life*4.8
        envelope = np.sin(np.pi*age)**2
        puff = np.exp(-(((x-cx)/(radius*1.6))**2+((y-cy)/radius)**2)/2)*envelope*.026
        out += puff[:,:,None]*(np.array([133,135,137])-out)
    return np.clip(out,0,255).astype(np.uint8)

if __name__ == '__main__':
    first = frame(0)
    assert np.array_equal(first,frame(SECONDS)), 'Loop is not periodic'
    last = frame(SECONDS-1/FPS)
    nxt = frame(1/FPS)
    report = {'duration_seconds':SECONDS,'fps':FPS,'width':W,'height':H,
              'exact_periodic_endpoints':True,
              'seam_mean_pixel_delta':float(np.abs(first.astype(float)-last).mean()),
              'ordinary_frame_mean_pixel_delta':float(np.abs(nxt.astype(float)-first).mean()),
              'source':'next-west-dawn-with-tug.jpg',
              'motion':'Masked water displacement, existing wake shimmer and faint procedural exhaust. Tug remains stationary.'}
    print(json.dumps(report),flush=True)
    cmd = ['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(OUTPUT)]
    p = subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for n in range(FPS*SECONDS):
        p.stdin.write(frame(n/FPS).tobytes())
        if n%48 == 0: print(f'Rendered {n}/{FPS*SECONDS}',flush=True)
    p.stdin.close()
    if p.wait(): raise RuntimeError('ffmpeg failed')
    report['bytes'] = OUTPUT.stat().st_size
    (ROOT/'docs/harbour-loop-render.json').write_text(json.dumps(report,indent=2)+'\n')
    print(f'Finished: {OUTPUT.stat().st_size:,} bytes',flush=True)
