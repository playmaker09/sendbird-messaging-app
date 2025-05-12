import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type ChannelRequestBody = {
  channelUrl: string;
  updatedAt: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { channelUrl }: ChannelRequestBody = req.body;

  if (!channelUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await prisma.channel.update({
      where: { channelUrl },
      data: {
        totalMessages: { increment: 1 },
      },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Prisma update error:", err);
    res.status(500).json({ error: "Message increment failed" });
  }
}
