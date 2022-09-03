// withdraw collection will have all the data that a buyer has brought your product and it's data is stored in the contract
// and the seller can see that transaction. using this data he can withdraw the amount that the buyer has put in that
// contract

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

  const result = (await db.json.get('withdraw')) as Record<string, any>;
  const isOldUser = Object.keys(result).includes(req.body.phone);
  if (!isOldUser) {
    await db.json.set('withdraw', req.body.phone, [
      {
        contractAddress: req.body.contractAddress,
      },
    ]);
  } else {
    await db.json.arrAppend('withdraw', `${req.body.phone}`, {
      contractAddress: req.body.contractAddress,
    });
  }
  await db.disconnect();

  res.status(200).json({ success: true });
}
