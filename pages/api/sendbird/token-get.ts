import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.sendbird_token;

  if (!token) {
    return res.status(401).json({ error: "No token found" });
  }

  return res.status(200).json({ token });
}
