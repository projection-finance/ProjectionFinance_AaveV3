import "../styles/globals.css";
import "../styles/index.css";
import "../styles/dateselect.css";

import React, { useEffect } from "react";
import { legacy_createStore as createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';



import ThemeProvider from "../context/ThemeProvider";

import rootReducer from '../redux/reducers/index.js';

import "nprogress/nprogress.css";
import NProgress from "nprogress";



const store = createStore(rootReducer);

function MyApp({ Component, pageProps, router }) {
  // const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
      <Component {...pageProps} />
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default MyApp;
