
export type AppMode = 'home' | 'camera' | 'processing' | 'result';

export interface ToonifyResult {
  original: string;
  cartoon: string;
}

export enum CartoonStyle {
  PIXAR = "Pixar style 3D animation",
  GHIBLI = "Studio Ghibli style watercolor anime",
  COMIC = "Dynamic Western comic book art",
  SIMPSONS = "Yellow character animation style",
  CYBERPUNK = "Stylized neon cyberpunk illustration"
}
