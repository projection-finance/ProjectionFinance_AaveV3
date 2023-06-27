import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import SessionReact from "supertokens-auth-react/recipe/session";
import axios from "axios";
import ThirdPartyPasswordless from "supertokens-auth-react/recipe/thirdpartypasswordless";
import { appInfo } from "./appInfo";


export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
       ThirdPartyPasswordless.init({
        contactMethod: "EMAIL",
       
        style: `
                [data-supertokens~=container] {
                    --palette-background: 26,28,44;
                    --palette-inputBackground: 0,0,0;
                    --palette-inputBorder: 41, 41, 41;
                    --palette-textTitle: 255, 255, 255;
                    --palette-textLabel: 255, 255, 255;
                    --palette-textPrimary: 255, 255, 255;
                    --palette-error: 173, 46, 46;
                    --palette-textInput: 169, 169, 169;
                    --palette-textLink: 169, 169, 169;
                    --palette-primary: 79, 127, 250;
                    --palette-primaryBorder:58, 114, 234;
                },
                [data-supertokens~=button] {
                  background-color: #252571;
                  border: 0px;
                  width: 30%;
                  margin: 0 auto;
              }
            `,
        onHandleEvent: async (context) => {
          if (context.action === "SESSION_ALREADY_EXISTS") {
            // TODO:
          } else if (context.action === "PASSWORDLESS_RESTART_FLOW") {
            // TODO:
          } else if (context.action === "PASSWORDLESS_CODE_SENT") {
            // TODO:
          } else {
            let { id, login } = context.user;
            if (context.action === "SUCCESS") {
              if (context.isNewUser) {
                // Sign up
                
                console.log('sign up front end');
              } else {
                // Sign in
               
                console.log('sign in front end');
              }
            }
          }
        },
        getRedirectionURL: async (context) => {
          if (context.action === "SUCCESS") {
            if (context.redirectToPath !== undefined) {
              // we are navigating back to where the user was before they authenticated
              return context.redirectToPath;
            }
            
            //redirect to the home page /wallets
            return "/wallets";
            
          }
          return undefined;
        },
        signInUpFeature: {
          
          providers: [
            ThirdPartyPasswordless.Github.init(),
            ThirdPartyPasswordless.Google.init(),
        ],
          
        },
        
        
      }),
      SessionReact.init(),
    ],
    // The user will be taken to the custom path when then need to login.
    getRedirectionURL: async (context) => {
      if (context.action === "TO_AUTH") {
        return "/authentification";
      }
    }
  };
};
