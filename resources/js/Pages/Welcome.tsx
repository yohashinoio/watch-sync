import { Button, Center, Stack } from "@mantine/core";
import { PageProps } from "@/types";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function Welcome({ auth }: PageProps) {
    const createRoom = () => {
        axios
            .post(route("rooms.store"))
            .then((room) =>
                router.get(route("rooms.show", { room: room.data }))
            )
            .catch((e) => console.error(e));
    };

    const joinRoom = () => {
        const room_id = prompt("Enter Room ID");

        if (!room_id) {
            return;
        }

        router.get(route("rooms.show", { room: { id: room_id } }));
    };

    return (
        <Center h={"100vh"}>
            <Stack>
                <Button onClick={createRoom}>Create Room</Button>
                <Button onClick={joinRoom}>Join Room</Button>
            </Stack>
        </Center>
    );
}
