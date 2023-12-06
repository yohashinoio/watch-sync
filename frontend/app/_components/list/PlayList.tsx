import { Paper, ScrollArea } from "@mantine/core";

type PlayListProps = { h: string };

export const PlayList: React.FC<PlayListProps> = (props) => {
  return (
    <Paper h={props.h} w={"20%"} shadow={"xs"}>
      <ScrollArea></ScrollArea>
    </Paper>
  );
};
