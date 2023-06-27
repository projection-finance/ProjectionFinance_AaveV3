console.log(process.env.NEXT_PUBLIC_URL,'process.env.NEXT_PUBLIC_URL')
export const appInfo = {
  // learn more about this on https://supertokens.com/docs/passwordless/appinfo
  appName: "Projection Finance",
  apiDomain: process.env.NEXT_PUBLIC_URL,
  websiteDomain: process.env.NEXT_PUBLIC_URL,
  apiBasePath: "/api/auth",
  websiteBasePath: "/auth",
};
