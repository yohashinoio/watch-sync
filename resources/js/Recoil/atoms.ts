import { atom } from "recoil";

// Videos, Music, Podcasts, etc.
export type Content = {
  key: number;
  id: string;
  provider: string | undefined;
};

export const playQueueAtom = atom<Content[]>({
  key: "playqueue",
  default: [],
});
