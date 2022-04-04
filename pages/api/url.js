import dbConnect from '../../lib/dbConnect';
import UrlCode from '../../models/url';
import catchErrors from '../../lib/errorHandlers';

// returns full list of urls in database
export default catchErrors(async (req, res) => {
  await dbConnect();

  const urls = await UrlCode.find({});

  res.json(urls);
});
