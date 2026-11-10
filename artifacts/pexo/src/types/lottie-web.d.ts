declare module "lottie-web" {
  export type AnimationItem = {
    destroy: () => void;
    setDirection: (direction: number) => void;
  };

  export type AnimationConfig = {
    container: Element;
    renderer?: "svg" | "canvas" | "html";
    path: string;
    loop?: boolean | number;
    autoplay?: boolean;
    rendererSettings?: { preserveAspectRatio?: string };
  };

  export function loadAnimation(config: AnimationConfig): AnimationItem;

  const lottie: { loadAnimation: typeof loadAnimation };
  export default lottie;
}
