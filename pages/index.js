import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home({ fullUrl }) {
  const [url, setUrl] = useState(''); //URL submitted by user
  const [response, setResponse] = useState(''); //response from api, includes short url number if successful
  const [isSubmitted, setSubmit] = useState(false); //boolean to check if user has submitted url
  const router = useRouter(); //use this hook to determine pathname
  const localhost = 'http://localhost:3001/api/'; //localhost url for dev

  //useEffect for fetch POST submission of URL user enters
  //data will be submitted to backend /api/ , generate
  //short_url number to use for shortened url, and
  //record to mongodb database
  useEffect(() => {
    if (isSubmitted) {
      //setup submit options for POST request
      const submitOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      };
      //POST request to server
      console.log(`......................useEffect url:${url}`);
      fetch('/api/setUrl', submitOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          //if no error, then set response to short_url value
          if (!data.error) setResponse(`${data.full_short_url}`);
          else setResponse('Please Enter Valid URL');
        });
      // console.log(response);
      //reset values
      setSubmit(false);
    }
  });

  const setSubmitTrue = (event) => {
    event.preventDefault();
    setSubmit(true);
  };

  return (
    <div className='container'>
      <Head>
        <title>ShortIt Url Shortner</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* main input form where user submits url to shorten */}
      <main>
        <h1>Shortit URL Shortener</h1>
        <form onSubmit={(e) => setSubmitTrue(e)}>
          <label htmlFor='url'>
            <span id='form_label'>Enter URL:</span>
            <input
              type='url'
              name='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://google.com'
            />
            <button type='submit'>Submit</button>
          </label>
        </form>
        <div id='result'>
          <h3>Your Shortened URL</h3>
          {response ? (
            <a href={`${response}`} target='_blank'>{`${response}`}</a>
          ) : (
            <p>...</p>
          )}
        </div>
      </main>
    </div>
  );
}
