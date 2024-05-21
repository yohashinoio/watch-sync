import { playListAtom } from "@/Recoil/atoms";
import { Center, Paper, ScrollArea, Stack } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { PlayListItem } from "./PlayListItem";

type PlayQueueProps = { h: string };

export const PlayList: React.FC<PlayQueueProps> = (props) => {
    const playlist = useRecoilValue(playListAtom);

    return (
        <Paper h={props.h} w={"20%"} shadow={"xs"}>
            <ScrollArea py={16} h={props.h}>
                <Center>
                    <Stack w={"70%"}>
                        {playlist.map((entry, idx) => (
                            <PlayListItem key={idx} media={entry} />
                        ))}
                    </Stack>
                </Center>
            </ScrollArea>
        </Paper>
    );
};
