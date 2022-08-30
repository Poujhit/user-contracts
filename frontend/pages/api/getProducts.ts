import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';

type Data = {
  success: boolean;
  data: Array<Record<string, any>>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const db = createClient({
    url: process.env.REDIS_URL,
  });

  await db.connect();

  const result = (await db.json.get('products')) as Record<string, any>;

  if (!result) {
    res.status(200).json({ success: false, data: [] });
  } else {
    res.status(200).json({ success: true, data: result['allProducts'] });
  }

  await db.disconnect();
}
