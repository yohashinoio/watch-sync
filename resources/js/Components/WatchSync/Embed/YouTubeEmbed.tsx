import React from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { Options } from "youtube-player/dist/types";

type YouTubeEmbedProps = {
    id: string;
    onReady: (event: YouTubeEvent<any>) => void;
    onPlay(time: number): void;
    onPause(time: number): void;
    onEnd(): void;
    onPlaybackRateChange(event: YouTubeEvent<any>): void;
};

const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
// const BUFFERING = 3;
// const CUED = 5;

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = (props) => {
    const opts: Options = {
        playerVars: {
            playsinline: 0,
            autoplay: 1,
            loop: 0,
        },
    };

    const onStateChange = async (event: YouTubeEvent<number>) => {
        const time = await event.target.getCurrentTime();

        switch (event.data) {
            case PLAYING:
                props.onPlay(time);
                break;
            case PAUSED:
                props.onPause(time);
                break;
            case ENDED:
                props.onEnd();
                break;
            default:
                throw new Error("Failed to get current time");
        }
    };

    return (
        <YouTube
            opts={opts}
            videoId={props.id}
            onReady={props.onReady}
            onStateChange={onStateChange}
            onPlaybackRateChange={props.onPlaybackRateChange}
        />
    );
};
