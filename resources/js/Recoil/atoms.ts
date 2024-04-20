import { atom } from "recoil";

// Videos, Music, Podcasts, etc.
export type Media = {
    key: number;
    id: string;
    provider: string | undefined;
};

export const playQueueAtom = atom<Media[]>({
    key: "playqueue",
    default: [],
});
