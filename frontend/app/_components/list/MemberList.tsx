import { Paper, ScrollArea } from "@mantine/core";

type MemberListProps = { h: string };

export const MemberList: React.FC<MemberListProps> = (props) => {
  return (
    <Paper h={props.h} w={"20%"} shadow={"xs"}>
      <ScrollArea></ScrollArea>
    </Paper>
  );
};
