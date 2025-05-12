import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type UpdateUserBody = {
  userId: string;
  nickname: string;
  profileUrl?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Method:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, nickname, profileUrl }: UpdateUserBody = req.body;
    if (!userId || !nickname) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        nickname,
        profileUrl,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("[UPDATE_USER_ERROR]", error);
    return res.status(500).json({ error: "Update failed" });
  }
}
