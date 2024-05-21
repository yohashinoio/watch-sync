import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Button, Center, Stack } from "@mantine/core";

export default function Dashboard({ auth }: PageProps) {
    const createRoom = () => {
        router.get(route("rooms.create"));
    };

    const joinRoom = () => {
        const room_id = prompt("Enter Room ID");

        if (!room_id) {
            return;
        }

        router.get(route("rooms.show", { room: { id: room_id } }));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <Center h={"80svh"}>
                <Stack>
                    <Button onClick={createRoom}>Create Room</Button>
                    <Button onClick={joinRoom}>Join Room</Button>
                </Stack>
            </Center>
        </AuthenticatedLayout>
    );
}
