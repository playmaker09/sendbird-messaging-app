"use client";

import dynamic from "next/dynamic";

// You can now use ssr: false here safely
const MainChat = dynamic(() => import("./MainChat"), {
  ssr: false,
});

export default function MainChatWrapper() {
  return <MainChat />;
}
