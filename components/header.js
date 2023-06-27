import { Fragment, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/router";
import Script from "next/script";
import { useDispatch} from "react-redux";

import { Disclosure } from "@headlessui/react";

import logoDark from "../public/logo_blue_white.png";



export default function Header(props) {

  return (
    <>
      <Head>
        <title>Projection Finance</title>
        <meta name="robots" content="index,follow" />
        <meta name="title" content="Projection Finance" />
        <meta name="description" content="Predictions &amp; Analytics Platform for Defi" />
        <meta name="keywords" content="blockchain,web3,defi,prediction,finance,crypto" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Projection Finance" />
        <meta name="twitter:site" content="https://twitter.com/projection_defi" />
        <meta name="twitter:creator" content="@projection_defi" />
        <meta name="twitter:image" content="https://www.projection.finance/app_preview.jpeg" />
        <meta property="og:title" content="Projection Finance" />
        <meta property="og:description" content="Predictions &amp; Analytics Platform for Defi" />
        <meta property="og:url" content="https://www.projection.finance/" />
        <meta property="og:image" content="https://www.projection.finance/app_preview.jpeg" />
        <meta property="og:image:alt" content="Projection Finance" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="2228" />
        <meta property="og:image:height" content="1368" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content="Projection Finance" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"></link>
      </Head>
      <Script defer data-domain="projection.finance" src="https://plausible.io/js/script.js" id="plausible"></Script>
      <Script strategy="afterInteractive" id="hotjar">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3311646,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
      <header>
        <Disclosure as="nav">
        <div className="">
                <div className="relative flex h-20 items-center justify-between border-b border-gray-dark/20 dark:border-gray-700/50 mb-4">
                  
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                    
                    <Link href="/" passHref legacyBehavior>
    <a rel="noopener noreferrer" className="p-0 m-0 leading-none">
        <Image src={logoDark} width="236" height="42" alt='logo' />
    </a>
</Link>
                    </div>
                  </div>
                  
                </div>
              </div>
        </Disclosure>
      </header>
    </>
  );
}
