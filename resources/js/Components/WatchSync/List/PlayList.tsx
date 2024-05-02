import { playListAtom } from "@/Recoil/atoms";
import { Box, Center, Paper, ScrollArea, Stack } from "@mantine/core";
import { useRecoilValue } from "recoil";

type PlayQueueProps = { h: string };

export const PlayList: React.FC<PlayQueueProps> = (props) => {
    const playlist = useRecoilValue(playListAtom);

    return (
        <Paper h={props.h} w={"20%"} shadow={"xs"}>
            <ScrollArea>
                <Center mt={16}>
                    <Stack>
                        {playlist.map((entry) => (
                            <Box key={entry.key}>{entry.id}</Box>
                        ))}
                    </Stack>
                </Center>
            </ScrollArea>
        </Paper>
    );
};
