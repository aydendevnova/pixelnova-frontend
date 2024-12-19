import { Metadata } from "next";
import EditorPage from "./editor/page";

export const metadata: Metadata = {
  title: "Pixel Labs | AI Pixel Art",
  description: "Pixel Labs | AI Pixel Editor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Home() {
  return <EditorPage />;
}
