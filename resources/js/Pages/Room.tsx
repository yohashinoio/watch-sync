import { Avatar, Box, Center, Flex } from "@mantine/core";
import React from "react";
import { VideoInfo } from "js-video-url-parser/lib/urlParser";
import { YouTubePlayer } from "react-youtube";
import { PageProps } from "@/types";
import { useRecoilCallback, useRecoilState } from "recoil";
import { Content, playQueueAtom } from "@/Recoil/atoms";
import { Embed } from "@/Components/WatchSync/Embed";
import { URLInput } from "@/Components/WatchSync/Input/URLInput";
import { PlayQueue } from "@/Components/WatchSync/List/PlayQueue";
import { MemberList } from "@/Components/WatchSync/List/MemberList";
import axios from "axios";

const onPlaybackRateChange = () => {
    console.log("onPlaybackRateChange");
};

export default function Room({ auth }: PageProps) {
    const youtube_player = React.useRef<YouTubePlayer | null>(null);

    const [play_queue, setPlayQueue] = useRecoilState(playQueueAtom);
    const [embed, setEmbed] = React.useState<React.ReactNode | null>(null);

    const advance_embed = useRecoilCallback(
        ({ snapshot }) =>
            // On end of current content, play the top of play queue
            async () => {
                const next = (await snapshot.getPromise(playQueueAtom)).at(0);

                if (!next) {
                    setEmbed(null);
                    return;
                }

                setPlayQueue((prev) => prev.slice(1));
                displayEmbed(next);
            },
        []
    );

    const onPause = (time: number) => {
        axios.post("/pause", { time }).catch((e) => console.error(e));
    };

    const onPlay = (time: number) => {
        axios.post("/play", { time }).catch((e) => console.error(e));
    };

    const onEnd = () => {
        axios.post("/end").catch((e) => console.error(e));
    };

    const displayEmbed = (c: Content) => {
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
        }
    };

    const handleEnterUrl = (info: VideoInfo<Record<string, any>, string>) => {
        const entry = { key: Date.now(), id: info.id, provider: info.provider };

        if (play_queue.length === 0 && embed === null) {
            displayEmbed(entry);
            return;
        }

        setPlayQueue((prev) => [...prev, entry]);
        console.log(play_queue);
    };

    window.Echo.channel("end-channel").listen("End", (e: any) => {
        advance_embed();
    });

    window.Echo.channel("pause-channel").listen("Pause", (e: any) => {
        console.log(`Pause: ${e.time}`);
    });

    window.Echo.channel("play-channel").listen("Play", (e: any) => {
        console.log(`Play: ${e.time}`);
    });

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
                    <PlayQueue h={"80svh"} />
                    <Box>{embed}</Box>
                    <MemberList h={"80svh"} />
                </Flex>
            </main>

            <footer>
                <Center h={"10svh"}></Center>
            </footer>
        </Box>
    );
}
