import dbConnect from '../../lib/dbConnect';
import UrlCode from '../../models/url';
import catchErrors from '../../lib/errorHandlers';

//takes POST request from submitted by
//frontend when user enter and submits URL
//1. validates url
//2. checks if url is already in database
//if so, then just return entry
//3. if url is new, then creates new database
//entry and assigns url short url code
export default catchErrors(async (req, res) => {
  const url = req.body.url;
  //get full url so we can send back full short url in response
  const hostname =
    process.env.NODE_ENV === 'production'
      ? `https://${process.env.VERCEL_URL}/`
      : process.env.LOCAL_HOST;

  //addtional validation check
  const httpCheck = /^https?:\/\//;
  const matchDomain = /^https?:\/\/(.*)/;
  if (!httpCheck.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  //extracting domain name
  const [fullUrl, domain] = url.match(matchDomain);
  // console.log(`domain: ${domain}`);

  //checking to see if url is ready in databse
  await dbConnect();
  const urlCode = await UrlCode.findOne({ url });
  if (!urlCode) {
    //new url , add to database
    //1 must find number for short url, will just do +1 of index size
    //checking if there are eny entries
    let indexurl = 0;
    const exists = await UrlCode.exists();
    if (exists) {
      indexurl = await UrlCode.countDocuments();
      indexurl++;
    } else indexurl = 1; //first index
    indexurl = parseInt(indexurl);
    console.log(`index: ${indexurl}, url: ${url}`);

    //creating new entry
    const newUrl = await new UrlCode({ indexurl: indexurl, url: url });
    console.log(`index: ${newUrl.indexurl}, url: ${newUrl.url}`);
    await newUrl.save();
    return res.json({
      original_url: newUrl.url,
      short_url: newUrl.indexurl,
      full_short_url: `${hostname}api/${urlCode.indexurl}`,
    });
  } else {
    //url already exists is database, return existing info
    return res.json({
      original_url: urlCode.url,
      short_url: urlCode.indexurl,
      full_short_url: `${hostname}api/${urlCode.indexurl}`,
    });
  }
});
