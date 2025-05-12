import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const SENDBIRD_API_TOKEN = process.env.MASTER_API_TOKEN!;
const SENDBIRD_API_URL = process.env.NEXT_PUBLIC_SENDBIRD_API_URL!;

type CreateUserBody = {
  userId: string;
  nickname: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, nickname }: CreateUserBody = req.body;

    if (!userId || !nickname) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sbResponse = await fetch(`${SENDBIRD_API_URL}/users`, {
      method: "POST",
      headers: {
        "Api-Token": SENDBIRD_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        nickname,
        profile_url: "",
      }),
    });

    if (!sbResponse.ok) {
      const errorData = await sbResponse.json();
      console.error("[SENDBIRD_ERROR]", errorData);
      return res
        .status(sbResponse.status)
        .json({ message: "Sendbird error", error: errorData });
    }

    const data = await sbResponse.json();
    const { user_id, nickname: sbName } = data;

    // 2. Insert into PostgreSQL via Prisma
    const chatUser = await prisma.user.create({
      data: {
        id: user_id,
        nickname: sbName,
        profileUrl: "",
      },
    });

    return res.status(201).json({ message: "User created", chatUser });
  } catch (error: any) {
    console.error("[CREATE_USER_ERROR]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
