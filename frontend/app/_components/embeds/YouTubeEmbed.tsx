import React from "react";
import { EmbedProps } from "@/app/_types/embed";
import YouTube from "react-youtube";

type YouTubeEmbedProps = EmbedProps & {
  id: string;
};

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = (props) => {
  const opts = {
    playerVars: {
      playsinline: 0,
      autoplay: 1,
      mute: 0,
      loop: 0,
    },
  };

  return <YouTube opts={opts} videoId={props.id} />;
};
