import { Button, Center, Stack } from "@mantine/core";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";

export default function Welcome({ auth }: PageProps) {
    if (auth.user) router.get(route("dashboard"));
    else {
        return (
            <Center h={"100svh"}>
                <Stack>
                    <Button onClick={() => router.get(route("login"))}>
                        Log in
                    </Button>
                    <Button onClick={() => router.get(route("register"))}>
                        Register
                    </Button>
                </Stack>
            </Center>
        );
    }
}
