import React from "react";
import { EmbedProps } from "@/app/_types/embed";

export const TwitchEmbed: React.FC<EmbedProps> = (props) => {
  return <p>{props.url.hostname}</p>;
};
