import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

const SENDBIRD_API_URL = process.env.NEXT_PUBLIC_SENDBIRD_API_URL!;
const SENDBIRD_API_TOKEN = process.env.MASTER_API_TOKEN!;

type CreateTokenBody = {
  userId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { userId }: CreateTokenBody = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  const THIRTY_MINUTES = 30 * 60 * 1000;
  const expiresAt = Date.now() + THIRTY_MINUTES;
  const response = await fetch(`${SENDBIRD_API_URL}/users/${userId}/token`, {
    method: "POST",
    headers: {
      "Api-Token": SENDBIRD_API_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expires_at: expiresAt,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sendbird_token", data.token, {
      httpOnly: true,
      secure: process.env.NEXT_ENV === "production",
      sameSite: "strict",
      maxAge: 1800,
      path: "/",
    })
  );

  return res.status(200).json({ success: true });
}
