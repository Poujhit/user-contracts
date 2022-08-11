import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';

type Data = {
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

  const result = db.json.get('products');

  if (!result) {
    await db.json.set('products', '$', {
      allProducts: req.body,
    });
  } else {
    await db.json.arrAppend('products', '.allProducts', req.body);
  }

  await db.disconnect();

  res.status(200).json({ success: true });
}
