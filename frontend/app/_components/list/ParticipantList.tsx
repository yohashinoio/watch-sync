import { Paper, ScrollArea } from "@mantine/core";

type ParticipantListProps = { h: string };

export const ParticipantList: React.FC<ParticipantListProps> = (props) => {
  return (
    <Paper h={props.h} w={"20%"} shadow={"xs"}>
      <ScrollArea></ScrollArea>
    </Paper>
  );
};
