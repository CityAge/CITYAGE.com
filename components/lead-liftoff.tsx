/**
 * The lift-off on the homepage lead photo: the rocket climbs out of the top of
 * the frame, leaves a thin trail, then the picture resets. Pure CSS, no script.
 *
 * It only fits one photo (Starship SN8, Forest Katsch / Unsplash, 1600×1067,
 * shown cropped to 4:3). Two small cut-outs made from that photo do the work:
 *   /lead-liftoff-sky.png    a strip of clean sky laid over the rocket in the photo
 *   /lead-liftoff-rocket.png the rocket itself, on a transparent background
 * Positions below are the cut-outs' places in the photo, converted for the
 * 4:3 crop (the crop trims 6.25% off each side). Change the photo and this
 * must be removed or re-measured.
 *
 * Visitors who ask their device for reduced motion get the still photo.
 */
export const LIFTOFF_PHOTO = 'https://images.unsplash.com/photo-1608920585318-b4895fcd2e55?w=1600&q=80'

export function LeadLiftoff() {
  return (
    <div className="lead-liftoff" aria-hidden="true">
      <style>{`
        .lead-liftoff { position: absolute; inset: 0; pointer-events: none; }
        .lead-liftoff > i { position: absolute; display: block; background-size: 100% 100%; background-repeat: no-repeat; }
        .lead-liftoff .sky { left: 50.422%; top: 30.272%; width: 3.094%; height: 12.84%; background-image: url(/lead-liftoff-sky.png); }
        .lead-liftoff .trail { left: 51.9%; width: 0.14%; min-width: 1px; bottom: 57.6%; height: 46.4%; transform-origin: 50% 100%; transform: scaleY(0);
          background: linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.75) 100%); }
        .lead-liftoff .rocket { left: 50.703%; top: 30.647%; width: 2.531%; height: 11.903%; background-image: url(/lead-liftoff-rocket.png); will-change: transform; }
        @media (prefers-reduced-motion: no-preference) {
          .lead-liftoff .rocket { animation: lead-liftoff-rocket 14s linear infinite; }
          .lead-liftoff .trail { animation: lead-liftoff-trail 14s linear infinite; }
        }
        @keyframes lead-liftoff-rocket {
          0%, 14% { transform: translate3d(0,0,0); opacity: 1; animation-timing-function: cubic-bezier(0.6, 0, 0.95, 0.55); }
          68% { transform: translate3d(0,-390%,0); opacity: 1; }
          69%, 86% { transform: translate3d(0,0,0); opacity: 0; }
          100% { transform: translate3d(0,0,0); opacity: 1; }
        }
        @keyframes lead-liftoff-trail {
          0%, 14% { transform: scaleY(0); opacity: 1; animation-timing-function: cubic-bezier(0.6, 0, 0.95, 0.55); }
          68% { transform: scaleY(1); opacity: 1; }
          84% { transform: scaleY(1); opacity: 0; }
          85%, 100% { transform: scaleY(0); opacity: 0; }
        }
      `}</style>
      <i className="sky" />
      <i className="trail" />
      <i className="rocket" />
    </div>
  )
}
