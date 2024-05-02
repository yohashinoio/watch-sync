import { atom } from "recoil";

// Videos, Music, Podcasts, etc.
export type Media = {
    key: number;
    id: string;
    provider: string | undefined;
};

export const playListAtom = atom<Media[]>({
    key: "playlist",
    default: [],
});
