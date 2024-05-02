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

const onPlaybackRateChange = () => {
    console.log("onPlaybackRateChange");
};

type Props = {
    room_id: number;
    playlist_id: number;
};

export default function Room({ auth, room_id, playlist_id }: PageProps<Props>) {
    // TODO: プレイと一時停止の状態を同期する

    const youtube_player = React.useRef<YouTubePlayer | null>(null);

    const [playlist, setPlaylist] = useRecoilState(playListAtom);
    const [embed, setEmbed] = React.useState<React.ReactNode | null>(null);

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

    const advanceEmbed = useRecoilCallback(
        ({ snapshot }) =>
            // On end of current media, play the top of playlist
            async () => {
                const current = await snapshot.getPromise(playListAtom);

                const next = current.at(0);

                if (!next) {
                    setEmbed(null);
                    return;
                }

                axios
                    .put(route("playlists.update", playlist_id), {
                        new_playlist: current.slice(1),
                    })
                    .catch((e) => console.error(e));

                displayEmbed(next);
            },
        []
    );

    const displayEmbed = (c: Media) => {
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

    const onPause = (time: number) => {
        axios.post("/broadcast/pause", { time }).catch((e) => console.error(e));
    };

    const onPlay = (time: number) => {
        axios.post("/broadcast/play", { time }).catch((e) => console.error(e));
    };

    const onEnd = () => {
        axios.post("/broadcast/end").catch((e) => console.error(e));
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

    // Use useEffect to prevent multiple listen events!!
    React.useEffect(() => {
        window.Echo.channel("end-channel").listen("End", (e: any) => {
            advanceEmbed();
        });

        window.Echo.channel("pause-channel").listen("Pause", (e: any) => {
            console.log(`Pause: ${e.time}`);
        });

        window.Echo.channel("play-channel").listen("Play", (e: any) => {
            console.log(`Play: ${e.time}`);
        });

        window.Echo.channel("update-playlist-channel").listen(
            "UpdatePlaylist",
            (e: any) => {
                console.log(`Update playlist`);
                onUpdatePlaylist(e.new_playlist);
            }
        );
    }, []);

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
