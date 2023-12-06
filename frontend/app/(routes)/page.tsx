"use client";

import { Avatar, Box, Center, Flex } from "@mantine/core";
import React from "react";
import { VideoInfo } from "js-video-url-parser/lib/urlParser";
import { Embed } from "../_components/Embed";
import { PlayList } from "../_components/list/PlayList";
import { ParticipantList } from "../_components/list/ParticipantList";
import { URLInput } from "../_components/input/URLInput";

export default function Home() {
  const [embed, setEmbed] = React.useState<React.ReactNode | null>(null);

  const handleEnterUrl = (parsed: VideoInfo<Record<string, any>, string>) => {
    if (parsed.provider === "youtube")
      setEmbed(<Embed.YouTube id={parsed.id} />);
  };

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
          <ParticipantList h={"80svh"} />
        </Flex>
      </main>

      <footer>
        <Center h={"10svh"}></Center>
      </footer>
    </Box>
  );
}
