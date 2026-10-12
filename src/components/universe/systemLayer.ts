/**
 * Which of the five system layers is lit, shared by the 3D scene and the HTML list.
 * Kept free of three.js imports so page-level code can use it without pulling in the
 * 3D bundle.
 */
export function activeSystemLayer(chapter: number, layers = 5) {
  const local = chapter - 1;
  return Math.round(Math.min(Math.max((local + 0.45) / 0.9, 0), 1) * (layers - 1));
}
