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

  // const result = await db.json.get('users');

  // intialisation code - already initialsed so no need to run this again
  // args in set() - collection name, key value in the doc, value to be added in doc.
  // await db.json.set('users', '$', {
  //   users: ['intial user'],
  // });

  try {
    await db.json.arrAppend('users', '.users', req.body.phone);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false });
  }
}
