// add it in orders collection, document key is the phone number of the user.
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

  const result = (await db.json.get('orders')) as Record<string, any>;
  const isOldUser = Object.keys(result).includes(req.body.phone);
  if (!isOldUser) {
    await db.json.set('orders', req.body.phone, [
      {
        contractAddress: req.body.contractAddress,
      },
    ]);
  } else {
    await db.json.arrAppend('orders', `${req.body.phone}`, {
      contractAddress: req.body.contractAddress,
    });
  }
  await db.disconnect();
  res.status(200).json({ success: true });
}
