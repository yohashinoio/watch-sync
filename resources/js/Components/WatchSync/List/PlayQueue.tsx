import { playQueueAtom } from "@/Recoil/atoms";
import { Box, Center, Paper, ScrollArea, Stack } from "@mantine/core";
import { useRecoilValue } from "recoil";

type PlayQueueProps = { h: string };

export const PlayQueue: React.FC<PlayQueueProps> = (props) => {
    const play_queue = useRecoilValue(playQueueAtom);

    return (
        <Paper h={props.h} w={"20%"} shadow={"xs"}>
            <ScrollArea>
                <Center mt={16}>
                    <Stack>
                        {play_queue.map((entry) => (
                            <Box key={entry.key}>{entry.id}</Box>
                        ))}
                    </Stack>
                </Center>
            </ScrollArea>
        </Paper>
    );
};
