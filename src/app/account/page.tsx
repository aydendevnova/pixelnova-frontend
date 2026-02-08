import { Metadata } from "next";
import PageClient from "./components/page-client";

export const metadata: Metadata = {
  title: "Account Settings | Pixel Nova",
  description: "Manage your Pixel Nova account settings and preferences",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function AccountPage() {
  return <PageClient />;
}
