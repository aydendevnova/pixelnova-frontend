"use client";
import { WasmProvider } from "@/components/wasm-provider";
import DownscalePageComponent from "./page-component";

export default function DownscalePage() {
  return (
    <WasmProvider>
      <DownscalePageComponent />
    </WasmProvider>
  );
}
