import styles from "./Item.module.css";

import { Media } from "@/Recoil/atoms";
import { Box, Image } from "@mantine/core";
import React from "react";

const getMediaImage = (media: Media) => {
    if (media.provider === "youtube")
        return `https://img.youtube.com/vi/${media.id}/mqdefault.jpg`;

    throw new Error("Unsupported provider: " + media.provider);
};

export const PlayListItem: React.FC<{ media: Media }> = ({ media }) => {
    const onClick = () => {
        if (media.provider === "youtube") {
            window.open(
                `https://www.youtube.com/watch?v=${media.id}`,
                "_blank"
            );
        }

        throw new Error("Unsupported provider: " + media.provider);
    };

    return (
        <Box className={styles.item} onClick={onClick}>
            <Image src={getMediaImage(media)} />
        </Box>
    );
};
