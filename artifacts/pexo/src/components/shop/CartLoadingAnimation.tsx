import { useEffect, useState } from "react";
import {
  CART_LOADING_FRAMES,
  CART_LOADING_FRAME_DURATION_MS,
} from "@/lib/cart-loading-frames";

/**
 * Plays the cart loading animation by cycling through pre-rendered WebP
 * frames on an interval. No animation library required — the source
 * Lottie file only ever contained flat image frames (no vector
 * morphing), so a plain <img> swap reproduces it exactly.
 */
export function CartLoadingAnimation({ size = 120 }: { size?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % CART_LOADING_FRAMES.length);
    }, CART_LOADING_FRAME_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <img
      src={CART_LOADING_FRAMES[frame]}
      alt="Loading"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
