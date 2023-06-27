import ThirdPartyPasswordless from "supertokens-node/recipe/thirdpartypasswordless";
import Dashboard from "supertokens-node/recipe/dashboard";
let { Google, Github } = ThirdPartyPasswordless;
import SessionNode from "supertokens-node/recipe/session";
import {
    appInfo
} from "./appInfo";
import prisma from "../lib/prisma"
export const backendConfig = () => {

    async function SignInUp(response,provider,providerToken){
        let {
            id,
            email
        } = response.user;
        console.log(response,'response');
            // TODO: post sign up logic
            console.log('upsert prisma / backend');
            const arrayWallets = [];
            const walletObj = {};
            walletObj.walletAddress = '';
            walletObj.ensAddress = 'Demo Wallet';
            arrayWallets.push(walletObj);
            const _toISOString = new Date().toISOString();
            try {
                const result = await prisma.user.upsert({
                    where: { login:email },
                    update: {
                        login: email,
                        superTokenId: id,
                        connectedAt: _toISOString,
                    },
                    create: {
                        login: email,
                        superTokenId: id,
                        wallets: arrayWallets
                    },
                });
                console.log(result);
            } catch (err) {
                console.log(email,'email')
                console.log(id,'id (superTokenId')
                console.log(err)
            }
    }
    console.log('backend config load');
    return {
        framework: "express",
        supertokens: {
            // These are the connection details of the app you created on supertokens.com
            // to move to .env config
            // connectionURI: "https://05ca88c14b1111ed942925e72350e5e7-eu-west-1.aws.supertokens.io:3573",
            // apiKey: "XZBY=loYRQv6YuMgmA9f1FAtR7u4SU",
            connectionURI: "",
            apiKey: "",
        },
        appInfo,
        recipeList: [
            Dashboard.init({
                apiKey: ""
              }),
            ThirdPartyPasswordless.init({
                flowType: "MAGIC_LINK",
                contactMethod: "EMAIL",
                
                providers: [
                    // We have provided you with development keys which you can use for testing.
                    // IMPORTANT: Please replace them with your own OAuth keys for production use.
                    Google({
                        //base supertokens 
                        //clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                        //clientSecret: "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",
                        //projection finance google credentials: 
                        clientId: "",
                        clientSecret: "",
                    }),
                    Github({
                        //base supertokens
                        clientId: "",
                        clientSecret: "",
                        //projection finance .env or localhost
                        clientId: process.env.github_clientId || "",
                        clientSecret: process.env.github_clientSecret || "",

                    }),
                    // Facebook({
                    //     clientSecret: "FACEBOOK_CLIENT_SECRET",
                    //     clientId: "FACEBOOK_CLIENT_ID"
                    // })
                ],
                override: {
                    apis: (originalImplementation) => {
                        return {
                            ...originalImplementation,

                            thirdPartySignInUpPOST: async function (input) {
                                if (originalImplementation.thirdPartySignInUpPOST === undefined) {
                                    throw Error("Should never come here");
                                }
    
                                let response = await originalImplementation.thirdPartySignInUpPOST(input)
                             
                                if (response.status === "OK") {
                                    await SignInUp(response,'google','providerToken')
                                }
    
                                return response;
                            },
                            consumeCodePOST: async (input) => {
                                console.log('consumecode POST');
                                if (originalImplementation.consumeCodePOST === undefined) {
                                    throw Error("Should never come here");
                                }
                                // First we call the original implementation of consumeCodePOST.
                                let response = await originalImplementation.consumeCodePOST(input);
                                // Post sign up response, we check if it was successful
                                console.log(response,'response dans consumecodepost')
                                if (response.status === "OK") {
                                    await SignInUp(response,'passwordless','')
                                }
                                return response;
                            },
                        };
                    },
                },
            }),
            SessionNode.init(),
        ],
        isInServerlessEnv: true,
    };
};