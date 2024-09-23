import SigninFunction from "./Signin";
import SignupFunction from "./Signup";
import ForgotPasswordFunction from "./ForgotPassword";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAtom } from "jotai";
import { appDataStore } from "../stores/appDataStore";

export default function Controller({ action }) {
  const router = useRouter();
  const { aidn, testing, platform, restrict, inviteCode } = router.query;
  const [storedAppData, setStoredAppData] = useAtom(appDataStore);
  const [appData, setAppData] = useState();

  React.useEffect(() => {
    const fetchAndSet = async () => {
      let app;

      if (storedAppData.aidn != 0) {
        console.log("stored app data is sufficient");
        app = storedAppData;
      } else {
        console.log("fetching app data");
        const response = await fetch(
          `https://id-api.kreativeusa.com/v1/applications/${aidn}/basic`,
        );

        if (!response.ok) console.log(response);

        const appData = await response.json();

        setStoredAppData({
          aidn: appData.data.aidn,
          name: appData.data.name,
          callbackUrl: appData.data.callbackUrl,
          mobileCallbackUrl: appData.data.mobileCallbackUrl,
        });

        app = appData.data;
      }

      let callbackUrl = app.callbackUrl;

      if (platform === "mobile") {
        callbackUrl = app.mobileCallbackUrl;
      }

      // check if the referrer is localhost
      if (testing !== undefined) {
        if (testing.includes("true") && testing.includes("local")) {
          const url = new URL(app.callbackUrl);
          callbackUrl = `http://localhost:3000${url.pathname}`;
        } else if (testing.includes("true") && testing.includes("dev")) {
          const url = new URL(app.callbackUrl);
          callbackUrl = `https://docuvet-dev.kreativeusa.com${url.pathname}`;
        }
      }

      setAppData({
        testing: testing !== undefined,
        aidn: app.aidn,
        name: app.name,
        testingInfo: testing,
        callbackUrl,
        platform,
        restrict,
        inviteCode,
      });
    };

    if (!aidn) return;
    if (!storedAppData) return;

    fetchAndSet();
  }, [aidn, testing, platform, restrict, inviteCode, storedAppData]);

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
