import { Center, Paper, ScrollArea, Text } from "@mantine/core";

type ViewerListProps = { h: string; viewers: any[] };

export const ViewerList: React.FC<ViewerListProps> = ({ h, viewers }) => {
    return (
        <Paper h={h} w={"20%"} shadow={"xs"}>
            <ScrollArea py={16}>
                {viewers.map((viewer) => (
                    <Center key={viewer.id}>
                        <Text>{viewer.name}</Text>
                    </Center>
                ))}
            </ScrollArea>
        </Paper>
    );
};
