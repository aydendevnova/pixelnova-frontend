import { Metadata } from "next";
import PageClient from "./components/page-client";

export const metadata: Metadata = {
  title: "Account Settings | Pixel Labs",
  description: "Manage your Pixel Labs account settings and preferences",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function AccountPage() {
  return <PageClient />;
}
