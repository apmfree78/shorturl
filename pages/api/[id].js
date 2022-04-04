import dbConnect from '../../lib/dbConnect';
import UrlCode from '../../models/url';
import catchErrors from '../../lib/errorHandlers';

//reads query from url [id], if this shortcode exists
//in database then 301 redirects to correponding url
export default catchErrors(async (req, res) => {
  //extracting short url code from params
  const shortcode = parseInt(req.query.id);
  console.log(`req.query: ${JSON.stringify(req.query)}`);
  //checking input
  if (typeof shortcode != 'number')
    return res.send(
      'Sorry, you inputed invalid short url code, please try again!'
    );

  console.log(`shortcode: ${shortcode}`);
  //checking if see if this code exists in directory
  const urlCode = await UrlCode.findOne({ indexurl: shortcode });

  if (!urlCode) {
    //if code doesn't exist return error message
    return res.send(
      'Sorry, this short url code does not exist, please try again!'
    );
  } else {
    //if exists, redirect to corresponding original url, we're done!
    console.log(`destination: ${urlCode.url}`);
    return res.redirect(301, urlCode.url);
  }
});
