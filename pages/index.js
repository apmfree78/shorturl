import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState('');
  const [isSubmitted, setSubmit] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      console.log(url);
      const submitOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      };
      //POST request to server
      console.log(`......................useEffect url:${url}`);
      fetch('/api/setUrl', submitOptions)
        .then((res) => res.text())
        .then((data) => setResponse(data));
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

      <main>
        <form onSubmit={(e) => setSubmitTrue(e)}>
          <label htmlFor='url'>
            Add URL to shorten:
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
        <p>{response}</p>
      </main>
    </div>
  );
}
