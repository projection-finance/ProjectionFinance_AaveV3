import React, { useState } from 'react';

function EmailForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const url = 'https://48e878b0.sibforms.com/serve/MUIEAIn3u5AOyh3N3NVTQL_ZWzyBPXRUcEgouSnYKEbAN20-ZbTrIE_nw7fqHYOqqfipFl-XBryAuSwdwxHHeu74FAtTotvlUt4N62kCD3tfAKHrm69cpi2VsahSfQJ4ZqMhHpq_ftp7w_a54dj8WagBMWndTUzUbzQ8OTB-wN33_PaQ6Wn0jXOPuPRhkjp40JFyptlWrE-vDSx2';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (submitted) {
    return <div className="mt-4 text-center text-green-500">Thank you for subscribing!</div>;
  }

  return (
    <form className="mt-4 sm:flex sm:max-w-md validate" onSubmit={handleSubmit}>
      <div className="flex items-center py-2">
        <label htmlFor="email" className="sr-only">Email address</label>
        <input type="hidden" name="sib_form_api_token" value="MUIEAIn3u5AOyh3N3NVTQL_ZWzyBPXRUcEgouSnYKEbAN20-ZbTrIE_nw7fqHYOqqfipFl-XBryAuSwdwxHHeu74FAtTotvlUt4N62kCD3tfAKHrm69cpi2VsahSfQJ4ZqMhHpq_ftp7w_a54dj8WagBMWndTUzUbzQ8OTB-wN33_PaQ6Wn0jXOPuPRhkjp40JFyptlWrE-vDSx2" />
        <input type="email" name="EMAIL" id="email" autoComplete="email" required className="flex-grow min-w-0 appearance-none rounded-md bg-transparent py-2 px-4 text-base text-blue-crayola placeholder-black/20 focus:border-white focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-crayola" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="ml-3 flex-shrink-0 rounded-md border border-transparent bg-blue-crayola py-2 px-4 text-base font-medium text-white hover:bg-blue-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
          Subscribe
        </button>
      </div>
    </form>);
}

export default EmailForm;


