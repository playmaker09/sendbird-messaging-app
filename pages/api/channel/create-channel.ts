import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type ChannelRequestBody = {
  channelUrl: string;
  chatmateId: string;
  totalMessages?: number;
  createdBy: string;
  isDeleted?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    channelUrl,
    chatmateId,
    totalMessages,
    createdBy,
    isDeleted,
  }: ChannelRequestBody = req.body;

  console.log(req.body);
  if (!channelUrl || !createdBy || !chatmateId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const channel = await prisma.channel.create({
      data: {
        channelUrl,
        chatmateId,
        totalMessages: totalMessages ?? 0,
        createdById: createdBy,
        isDeleted: isDeleted ?? false,
      },
    });

    res.status(200).json(channel);
  } catch (error) {
    console.error("[CREATE_CHANNEL_ERROR]", error);
    res.status(500).json({ error: "Channel creation failed" });
  }
}
