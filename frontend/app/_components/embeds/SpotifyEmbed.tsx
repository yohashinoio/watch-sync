import React from "react";
import { EmbedProps } from "@/app/_types/embed";

export type SpotifyEmbedProps = EmbedProps & {
  premium_account: boolean;
};

export const SpotifyEmbed: React.FC<SpotifyEmbedProps> = (props) => {
  if (!props.premium_account) {
    return <p>Premium account is required for spotify features</p>;
  }

  return <p>{props.url.hostname}</p>;
};
