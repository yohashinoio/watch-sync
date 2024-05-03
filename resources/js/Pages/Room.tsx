import { Avatar, Box, Center, Flex } from "@mantine/core";
import React from "react";
import { VideoInfo } from "js-video-url-parser/lib/urlParser";
import { YouTubePlayer } from "react-youtube";
import { PageProps } from "@/types";
import { useRecoilCallback, useRecoilState } from "recoil";
import { Media, playListAtom } from "@/Recoil/atoms";
import { Embed } from "@/Components/WatchSync/Embed";
import { URLInput } from "@/Components/WatchSync/Input/URLInput";
import { MemberList } from "@/Components/WatchSync/List/MemberList";
import axios from "axios";
import { PlayList } from "@/Components/WatchSync/List/PlayList";

const TOLERABLE_DELAY_SECONDS = 5;

const onPlaybackRateChange = () => {
    console.log("onPlaybackRateChange");
};

type Props = {
    room_id: number;
    playlist_id: number;
    init_playlist: any;
};

export default function Room({
    auth,
    room_id,
    playlist_id,
    init_playlist,
}: PageProps<Props>) {
    // TODO: ルームに入った時に再生中の状態を同期する
    // TODO: 一時停止の状態を同期する

    const youtube_player = React.useRef<YouTubePlayer | null>(null);

    const [playlist, setPlaylist] = useRecoilState(playListAtom);
    const [embed, setEmbed] = React.useState<React.ReactNode | null>(null);
    const [current_media, setCurrentMedia] = React.useState<Media | null>(null);

    React.useEffect(() => {
        // Initialize playlist
        console.log(init_playlist);
        if (init_playlist) {
            setPlaylist(
                init_playlist.map((c: any, idx: number): Media => {
                    return {
                        key: idx,
                        id: c.media_id,
                        provider: c.provider,
                    };
                })
            );
        }
    }, [setPlaylist, init_playlist]);

    const handleEnterUrl = (info: VideoInfo<Record<string, any>, string>) => {
        const entry: Media = {
            key: Date.now(),
            id: info.id,
            provider: info.provider,
        };

        axios
            .put(route("playlists.update", playlist_id), {
                new_playlist: [...playlist, entry],
            })
            .catch((e) => console.error(e));
    };

    const displayEmbed = (c: Media) => {
        setCurrentMedia(c);

        if (c.provider === "youtube") {
            setEmbed(
                <Embed.YouTube
                    id={c.id}
                    onReady={(e) => (youtube_player.current = e.target)}
                    onPause={onPause}
                    onPlay={onPlay}
                    onEnd={onEnd}
                    onPlaybackRateChange={onPlaybackRateChange}
                />
            );

            // If it is the same video, the embed will not be updated
            // If a user has already played the video halfway through, it will start from there
            //
            // The following line is needed to work around these
            youtube_player.current?.seekTo(0, true);
        }
    };

    // Return the displayed media
    const advanceEmbed = useRecoilCallback(
        ({ snapshot }) =>
            // On end of current media, play the top of playlist
            async (): Promise<Media | null> => {
                const current = await snapshot.getPromise(playListAtom);

                const next = current.at(0);

                if (!next) {
                    setEmbed(null);
                    return null;
                }

                axios
                    .put(route("playlists.update", playlist_id), {
                        new_playlist: current.slice(1),
                    })
                    .catch((e) => console.error(e));

                displayEmbed(next);

                return next;
            },
        [setEmbed, playlist_id, displayEmbed]
    );

    const broadcastPlayOrPause = (kind: "Play" | "Pause", time: number) => {
        // Use setter to get the latest value
        setCurrentMedia((current_media) => {
            if (!current_media) {
                // Abort broadcast as impossible
                return current_media;
            }

            const api =
                kind === "Play" ? "/broadcast/play" : "/broadcast/pause";

            axios
                .post(api, { media: current_media, time })
                .catch((e) => console.error(e));

            return current_media;
        });
    };

    const onPause = (time: number) => {
        broadcastPlayOrPause("Pause", time);
    };

    const onPlay = (time: number) => {
        broadcastPlayOrPause("Play", time);
    };

    const onEnd = async () => {
        const media = await advanceEmbed();

        if (media) {
            axios
                .post("/broadcast/play", { media, time: 0 })
                .catch((e) => console.error(e));
        }
    };

    const onUpdatePlaylist = (new_playlist: any) => {
        setPlaylist(
            new_playlist.map((c: any, idx: number): Media => {
                return {
                    key: idx,
                    id: c.media_id,
                    provider: c.provider,
                };
            })
        );

        // Use setter to get the latest value
        setEmbed((current_embed) => {
            if (current_embed === null) advanceEmbed();
            return current_embed;
        });
    };

    const seekTo = (time: number) => {
        if (current_media?.provider === "youtube")
            youtube_player.current?.seekTo(time, true);
    };

    const getCurrentTime = async (): Promise<number> => {
        if (!current_media)
            throw new Error("Failed to get current time: no media");

        if (current_media.provider === "youtube") {
            if (youtube_player.current)
                return await youtube_player.current.getCurrentTime();
            else throw new Error("Failed to get current time: player is null");
        } else {
            throw new Error("Failed to get current time: unknown provider");
        }
    };

    // Use useEffect to prevent multiple listen events!!
    React.useEffect(() => {
        window.Echo.channel("pause-channel").listen("Pause", (e: any) => {
            console.log(`Pause: ${e.time}`);
        });

        window.Echo.channel("play-channel").listen("Play", async (e: any) => {
            const media = e.media;
            const time = e.time;

            console.log(`Play: ${media} ${time}`);

            // Use setter to get the latest value
            setCurrentMedia((current_media) => {
                if (current_media) {
                    if (
                        current_media.provider !== media.provider ||
                        current_media.id !== media.id
                    ) {
                        displayEmbed(media);
                    }
                }
                return current_media;
            });

            // Calculate delay and compensate if it exceeds tolerance!
            const delay = Math.abs(time - (await getCurrentTime()));
            if (TOLERABLE_DELAY_SECONDS < delay) {
                seekTo(time);
                console.log(`Delay exceeded tolerance: ${delay}`);
            }
        });

        window.Echo.channel("update-playlist-channel").listen(
            "UpdatePlaylist",
            (e: any) => {
                console.log(`Update playlist`);
                onUpdatePlaylist(e.new_playlist);
            }
        );
    }, [onUpdatePlaylist, advanceEmbed]);

    return (
        <Box mx={24}>
            <header>
                <Center>
                    <Flex
                        w={"100%"}
                        h={"10svh"}
                        justify={"space-between"}
                        align={"center"}
                    >
                        <URLInput onEnter={handleEnterUrl} />
                        <Avatar radius={"sm"} />
                    </Flex>
                </Center>
            </header>

            <main>
                <Flex h={"80svh"} justify={"space-between"} align={"center"}>
                    <PlayList h={"80svh"} />
                    <Box>{embed}</Box>
                    <MemberList h={"80svh"} />
                </Flex>
            </main>

            <footer>
                <Center h={"10svh"}>Room id: {room_id}</Center>
            </footer>
        </Box>
    );
}
