import React from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { Options } from "youtube-player/dist/types";

type YouTubeEmbedProps = {
    id: string;
    onReady: (event: YouTubeEvent<any>) => void;
    onPlay(time: number): void;
    onPause(time: number): void;
    onEnd(): void;
    onPlaybackRateChange(event: YouTubeEvent<any>): void;
};

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
            case PlayerStates.PLAYING:
                props.onPlay(time);
                break;
            case PlayerStates.PAUSED:
                props.onPause(time);
                break;
            case PlayerStates.ENDED:
                props.onEnd();
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
