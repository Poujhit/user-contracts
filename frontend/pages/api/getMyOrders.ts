import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';

type Data = {
  success: boolean;
  orders?: Record<string, any>[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const db = createClient({
    url: process.env.REDIS_URL,
  });

  await db.connect();

  const result = (await db.json.get('orders')) as Record<string, any>;
  const isOldUser = Object.keys(result).includes(req.body.phone);
  console.log(req.body.phone);
  if (!isOldUser) {
    res.status(200).json({ success: true, orders: [] });
  } else {
    res.status(200).json({ success: true, orders: result[req.body.phone] });
  }
  await db.disconnect();
}
