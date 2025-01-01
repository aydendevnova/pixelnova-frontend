import { Metadata } from "next";
import EditorPage from "./editor/page";

export const metadata: Metadata = {
  title: "Pixel Nova | AI Pixel Art Editor",
  description: "Pixel Nova | AI Pixel Art Editor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Home() {
  return <EditorPage />;
}
