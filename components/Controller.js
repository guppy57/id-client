import SigninFunction from "./Signin";
import SignupFunction from "./Signup";
import ForgotPasswordFunction from "./ForgotPassword";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Controller({ action }) {
  const router = useRouter();
  const { aidn, testing, platform, restrict, inviteCode } = router.query;
  const [appData, setAppData] = useState();

  React.useEffect(() => {
    let mounted = true;

    if (!aidn) return;

    axios
      .get(`https://id-api.kreativeusa.com/v1/applications/${aidn}/basic`)
      .then((response) => {
        let callbackUrl = response.data.data.callbackUrl;

        if (platform === "mobile") {
          callbackUrl = response.data.data.mobileCallbackUrl;
        }

        // check if the referrer is localhost
        if (testing !== undefined) {
          if (testing.includes("true") && testing.includes("local")) {
            const url = new URL(response.data.data.callbackUrl);
            callbackUrl = `http://localhost:3000${url.pathname}`;
          } else if (testing.includes("true") && testing.includes("dev")) {
            const url = new URL(response.data.data.callbackUrl);
            callbackUrl = `https://docuvet-dev.kreativeusa.com${url.pathname}`;
          }
        }

        setAppData({
          testing: testing !== undefined,
          aidn: response.data.data.aidn,
          name: response.data.data.name,
          testingInfo: testing,
          callbackUrl,
          platform,
          restrict,
          inviteCode,
        });
        return () => (mounted = false);
      })
      .catch((error) => {
        // unknown error
        console.log(error);
      });
  }, [aidn, testing, platform, restrict, inviteCode]);

  return (
    <div>
      {appData && action === "signin" && <SigninFunction appData={appData} />}
      {appData && action === "signup" && <SignupFunction appData={appData} />}
      {appData && action === "forgotpass" && (
        <ForgotPasswordFunction appData={appData} />
      )}
    </div>
  );
}
