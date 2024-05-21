import { TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import urlParser from "js-video-url-parser";
import { VideoInfo } from "js-video-url-parser/lib/urlParser";
import React, { ReactNode } from "react";

type URLInputProps = {
    onEnter: (parsed: VideoInfo<Record<string, any>, string>) => void;
};

export const URLInput: React.FC<URLInputProps> = (props) => {
    const [error, setError] = React.useState<ReactNode | null>(null);
    const [value, setValue] = React.useState<string>("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") return;

        const url = event.currentTarget.value;
        const parsed = urlParser.parse(url);

        if (parsed) {
            setValue("");
            setError(null);
            props.onEnter(parsed);
        } else {
            setError(true);
            notifications.show({
                title: "Invalid URL",
                message: "Please enter a valid URL",
                color: "red",
                autoClose: 5000,
            });
        }
    };

    return (
        <TextInput
            w={"26em"}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            aria-label={"URL"}
            placeholder={"Enter a URL"}
            onKeyDown={handleKeyDown}
            error={error}
        />
    );
};
