"use client";

import { useGroupChannel } from "@sendbird/uikit-react/GroupChannel/context";
import { useEffect, useRef, useState } from "react";
import {
  FileMessageCreateParams,
  UserMessageCreateParams,
} from "@sendbird/chat/message";

import { MdAttachFile } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
const CustomMessageInput = () => {
  const channel = useGroupChannel().state.currentChannel;
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkTheme = () => {
      const hasDark = document.body.classList.contains("sendbird-theme--dark");
      setIsDarkMode(hasDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const sendTextMessage = async () => {
    if (!channel || !message.trim()) return;

    const params: UserMessageCreateParams = {
      message: message.trim(),
    };

    try {
      channel.sendUserMessage(params);
      setMessage("");

      if (channel.memberCount <= 2) {
        await fetch("/api/channel/increment-message-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelUrl: channel.url }),
        });
      }
    } catch (err) {
      console.error("Failed to send text message:", err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !channel) return;

    const params: FileMessageCreateParams = {
      file,
      name: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };

    try {
      channel.sendFileMessage(params);
      e.target.value = ""; // reset input

      if (channel.memberCount <= 2) {
        await fetch("/api/channel/increment-message-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelUrl: channel.url }),
        });
      }
    } catch (err) {
      console.error("Failed to send file message:", err);
    }
  };

  return (
    <div
      className={`flex items-center p-3 gap-2 border-t ${
        isDarkMode ? "border-gray-400" : "bg-white border-gray-200"
      }`}
    >
      <div className="relative flex-1">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={`w-full pr-10 px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            isDarkMode
              ? "bg-[#1E1E1E] text-white border-[#555] placeholder-gray-400"
              : "bg-white text-black border-gray-300"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendTextMessage();
            }
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <MdAttachFile
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-500 text-lg cursor-pointer"
          title="Attach file"
        />
      </div>

      <button
        onClick={sendTextMessage}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer ${
          isDarkMode
            ? "bg-violet-600 hover:bg-violet-700"
            : "bg-violet-600 hover:bg-violet-700"
        }`}
      >
        <IoMdSend className="text-xl" />
      </button>
    </div>
  );
};

export default CustomMessageInput;
