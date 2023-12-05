import { URL } from "url";

export interface EmbedProps {
  url: URL;

  on_start(): void;
  on_pause(): void;
  on_resume(): void;
}
