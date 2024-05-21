import { Box, Center, Flex, Stack } from "@mantine/core";
import React from "react";
import { VideoInfo } from "js-video-url-parser/lib/urlParser";
import { YouTubePlayer } from "react-youtube";
import { PageProps } from "@/types";
import { useRecoilCallback, useRecoilState } from "recoil";
import { Media, playListAtom } from "@/Recoil/atoms";
import { Embed } from "@/Components/WatchSync/Embed";
import { URLInput } from "@/Components/WatchSync/Input/URLInput";
import { ViewerList } from "@/Components/WatchSync/List/ViewerList";
import axios from "axios";
import { PlayList } from "@/Components/WatchSync/List/PlayList";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const TOLERABLE_DELAY_SECONDS = 2;

const onPlaybackRateChange = () => {
    console.log("onPlaybackRateChange");
};

type Props = {
    room_id: number;
    playlist_id: number;
    init_playlist: any[];
    init_viewers: any[];
};

export default function Room({
    auth,
    room_id,
    playlist_id,
    init_playlist,
    init_viewers,
}: PageProps<Props>) {
    const youtube_player = React.useRef<YouTubePlayer | null>(null);

    const [playlist, setPlaylist] = useRecoilState(playListAtom);
    const [embed, setEmbed] = React.useState<React.ReactNode | null>(null);
    const [current_media, setCurrentMedia] = React.useState<Media | null>(null);
    const [viewers, setViewers] = React.useState<any[]>(init_viewers);

    React.useEffect(() => {
        axios
            .post("/broadcast/join-room", {
                room_id,
                joined_user: auth.user,
            })
            .catch((e) => console.error(e));
    }, [room_id]);

    React.useEffect(() => {
        // Initialize playlist
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

    const displayEmbed = (c: Media, onReady: () => void = () => {}) => {
        setCurrentMedia(c);

        if (c.provider === "youtube") {
            setEmbed(
                <Embed.YouTube
                    id={c.id}
                    onReady={(e) => {
                        youtube_player.current = e.target;
                        onReady();
                    }}
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

    const getNextMedia = useRecoilCallback(
        ({ snapshot }) =>
            // Get the next media in the playlist
            async (): Promise<Media | undefined> => {
                const current = await snapshot.getPromise(playListAtom);
                return current.at(0);
            },
        []
    );

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
            if (!current_media)
                throw new Error("Failed to broadcast: no media");

            const api =
                kind === "Play" ? "/broadcast/play" : "/broadcast/pause";

            axios
                .post(api, {
                    room_id,
                    publisher: auth.user,
                    media: current_media,
                    time,
                })
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
        const next_media = await getNextMedia();

        if (next_media) {
            axios
                .post("/broadcast/end", {
                    room_id,
                    publisher: auth.user,
                    next_media,
                })
                .catch((e) => console.error(e));
        } else {
            setEmbed(null);
            return null;
        }
    };

    const onUpdatePlaylist = async (new_playlist: any) => {
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

    const pause = () => {
        // Use setter to get the latest value
        setCurrentMedia((current_media) => {
            if (!current_media) throw new Error("Failed to pause: no media");

            if (current_media.provider === "youtube") {
                if (youtube_player.current)
                    youtube_player.current?.pauseVideo();
                else throw new Error("Failed to pause: player is null");
            }

            return current_media;
        });
    };

    const play = () => {
        // Use setter to get the latest value
        setCurrentMedia((current_media) => {
            if (!current_media) throw new Error("Failed to play: no media");

            if (current_media.provider === "youtube") {
                if (youtube_player.current) youtube_player.current.playVideo();
                else throw new Error("Failed to play: player is null");
            }

            return current_media;
        });
    };

    const seekTo = (time: number) => {
        // Use setter to get the latest value
        setCurrentMedia((current_media) => {
            if (!current_media) throw new Error("Failed to seek: no media");

            if (current_media.provider === "youtube") {
                if (youtube_player.current)
                    youtube_player.current.seekTo(time, true);
                else throw new Error("Failed to play: player is null");
            }

            return current_media;
        });
    };

    const changeState = async (state: "play" | "pause") => {
        if (state === "play") play();
        else if (state === "pause") pause();
        else throw new Error("Failed to change state: unknown state");
    };

    const getCurrentTime = async (): Promise<number> => {
        if (!current_media)
            throw new Error("Failed to get current time: no media");

        if (current_media.provider === "youtube") {
            if (youtube_player.current)
                return await youtube_player.current.getCurrentTime();
            else throw new Error("Failed to get current time: player is null");
        } else {
            throw new Error("Failed to get current time: unsupported provider");
        }
    };

    const getEmbedState = async (): Promise<"play" | "pause"> => {
        if (!current_media)
            throw new Error("Failed to get current state: no media");

        if (current_media.provider === "youtube") {
            if (youtube_player.current) {
                const state = await youtube_player.current.getPlayerState();
                if (state === PlayerStates.PLAYING) return "play";
                else if (state === PlayerStates.PAUSED) return "pause";
                else
                    throw new Error(
                        "Failed to get current state: unknown state"
                    );
            } else
                throw new Error("Failed to get current state: player is null");
        } else {
            throw new Error(
                "Failed to get current state: unsupported provider"
            );
        }
    };

    const calculateDelay = async (time: number) => {
        return Math.abs(time - (await getCurrentTime()));
    };

    // Use useEffect to prevent multiple listen events!!
    React.useEffect(() => {
        window.Echo.leaveAllChannels();

        window.Echo.channel("end-channel").listen("End", (e: any) => {
            if (e.room_id !== room_id) return;

            const next_media = e.next_media;

            console.log(`End: ${next_media.id}`);

            displayEmbed(next_media);

            setPlaylist((playlist) => {
                const next = playlist.at(0);
                if (
                    next_media.provider === next?.provider &&
                    next_media.id === next?.id
                ) {
                    axios
                        .put(route("playlists.update", playlist_id), {
                            new_playlist: playlist.slice(1),
                        })
                        .catch((e) => console.error(e));
                }
                return playlist;
            });
        });

        window.Echo.channel("pause-channel").listen("Pause", async (e: any) => {
            if (e.room_id !== room_id) return;
            if (e.publisher.id === auth.user.id) return;

            // const media = e.media;
            const time = e.time;

            console.log(`Pause: ${e.time}`);

            const delay = await calculateDelay(time);
            if (TOLERABLE_DELAY_SECONDS < delay) {
                seekTo(time);
                console.log(`Delay exceeded tolerance: ${delay}`);
            }

            pause();
        });

        window.Echo.channel("play-channel").listen("Play", async (e: any) => {
            if (e.room_id !== room_id) return;
            if (e.publisher.id === auth.user.id) return;

            const media = e.media;
            const time = e.time;

            console.log(`Play: ${media} ${time}`);

            const delay = await calculateDelay(time);
            if (TOLERABLE_DELAY_SECONDS < delay) {
                seekTo(time);
                console.log(`Delay exceeded tolerance: ${delay}`);
            }

            play();
        });

        window.Echo.channel("update-playlist-channel").listen(
            "UpdatePlaylist",
            (e: any) => {
                if (e.playlist_id !== playlist_id) return;

                console.log(`Update playlist`);

                onUpdatePlaylist(e.new_playlist);
            }
        );

        window.Echo.channel("join-room-channel").listen(
            "JoinRoom",
            async (e: any) => {
                if (e.room_id !== room_id) return;

                console.log(`Join: ${e.joined_user.name}`);

                setViewers((viewers) => {
                    if (viewers.find((v) => v.id === e.joined_user.id))
                        return viewers;
                    else return [...viewers, e.joined_user];
                });

                if (!embed || !current_media) return;

                axios
                    .post("/broadcast/playback-status", {
                        room_id,
                        for: e.joined_user,
                        media: current_media,
                        state: await getEmbedState(),
                        time: await getCurrentTime(),
                    })
                    .catch((e) => console.error(e));
            }
        );

        // A channel to share the media currently being played for newcomers to the room
        window.Echo.channel("playback-status-channel").listen(
            "PlaybackStatus",
            async (e: any) => {
                if (e.room_id !== room_id) return;

                if (embed) return;

                if (e.for.id === auth.user.id) {
                    const media = e.media;
                    const state = e.state;
                    const time = e.time;

                    console.log(`Share state: ${media} ${state} ${time}`);

                    displayEmbed(media, () => {
                        seekTo(time);
                        changeState(state);
                    });
                }
            }
        );
    }, [embed, current_media]);

    if (!auth.user) router.get("/");
    else {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Center py={48} px={"2rem"}>
                    <Stack w={"100%"}>
                        <Box>
                            <URLInput onEnter={handleEnterUrl} />
                        </Box>

                        <Flex
                            w={"100%"}
                            justify={"space-between"}
                            align={"center"}
                        >
                            <PlayList h={"70svh"} />
                            <Box>{embed}</Box>
                            <ViewerList h={"70svh"} viewers={viewers} />
                        </Flex>

                        <Center>Room id: {room_id}</Center>
                    </Stack>
                </Center>
            </AuthenticatedLayout>
        );
    }
}
