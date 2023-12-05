import React from "react";
import { EmbedProps } from "@/app/_types/embed";

export const YouTubeEmbed: React.FC<EmbedProps> = (props) => {
  return <p>{props.url.hostname}</p>;
};
