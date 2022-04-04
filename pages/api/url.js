import dbConnect from '../../lib/dbConnect';
import UrlCode from '../../models/url';

export default async (req, res) => {
  await dbConnect();

  const urls = await UrlCode.find({});

  res.json(urls);
};
