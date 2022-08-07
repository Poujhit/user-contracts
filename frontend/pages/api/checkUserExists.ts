import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';

type Data = {
  userExists?: boolean;
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const db = createClient({
    url: process.env.REDIS_URL,
  });

  await db.connect();

  try {
    const result = (await db.json.get('users')) as Record<string, any>;
    const match = (result?.users as string[]).find(
      (value) => value === req.body.phone
    );
    res.status(200).json({ userExists: match ? true : false, success: true });
  } catch (error) {
    res.status(200).json({ success: false });
  }
}
