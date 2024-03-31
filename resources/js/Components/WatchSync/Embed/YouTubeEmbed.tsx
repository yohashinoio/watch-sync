import React from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { Options } from "youtube-player/dist/types";

type YouTubeEmbedProps = {
    id: string;
    onReady: (event: YouTubeEvent<any>) => void;
    onPlay(event: YouTubeEvent<any>): void;
    onPause(event: YouTubeEvent<any>): void;
    onEnd(event: YouTubeEvent<any>): void;
    onPlaybackRateChange(event: YouTubeEvent<any>): void;
};

const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = (props) => {
    const opts: Options = {
        playerVars: {
            playsinline: 0,
            autoplay: 1,
            loop: 0,
        },
    };

    const onStateChange = (event: YouTubeEvent<number>) => {
        switch (event.data) {
            case ENDED:
                props.onEnd(event);
                break;
            case PLAYING:
                props.onPlay(event);
                break;
            case PAUSED:
                props.onPause(event);
                break;
            case BUFFERING:
                break;
            case CUED:
                break;
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
