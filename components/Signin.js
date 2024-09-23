import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import AlertComponent from "./Alert";
import Wallpaper from "./Wallpaper";

export default function SigninFunction({ appData }) {
  const router = useRouter();

  // api data variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // page element variables
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyles, setAlertStyles] = useState("hidden");
  const [showPassword, setShowPassword] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // regex expression for checking if a string is a valid email address
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  React.useEffect(() => {
    // used to allow for checkbox changes
    if (router.query.a === "true") setRememberMe(true);
  }, [router.query.a]);

  const handleCheckedChange = (e) => setRememberMe(!rememberMe);

  const changeAlert = (message) => {
    setAlertMessage(message);
    setAlertStyles("");
  };

  const createSigninInstance = (e) => {
    // prevents page refresh upon button click
    e.preventDefault();

    // removes any displayed alerts
    setAlertStyles("hidden");

    // verify that all the fields we want are not empty strings
    // if anyone of them are empty, error is shown
    if (email === "" || password === "") {
      changeAlert("Please make sure all fields are filled out");
      return;
    }

    // make sure that the email entered is actually an email
    // shows error if the string test doesn't pass
    if (!regexExp.test(email)) {
      changeAlert("Please enter a valid email address");
      return;
    }

    setShowSpinner(true);

    // makes post request for the signin api
    axios
      .post("https://id-api.kreativeusa.com/v1/accounts/signin", {
        environment: appData.testing ? "development" : "production",
        aidn: parseInt(appData.aidn),
        email: email.toLowerCase(),
        password,
        rememberMe,
      })
      .then((response) => {
        goBack(response.data.data.keychain.key);
      })
      .catch((error) => {
        setShowSpinner(false);
        // retrieves the statusCode from error object
        const statusCode = error.response.data.statusCode;
        // finds and sets the message from error object
        const message = error.response.data.message;

        if (statusCode === 500 || statusCode === 400) {
          // 500: internal server error, 400: bad schema
          if (statusCode === 400 && message === "email must be an email") {
            changeAlert("Please enter a valid email address");
          } else {
            changeAlert("Internal server error. Try again soon.");
          }
        } else if (statusCode === 404) {
          // no account found with the given email
          changeAlert("No account found with the given email");
        } else if (statusCode === 403 || statusCode === 401) {
          // incorrect credentials
          changeAlert("Password or email incorrect");
        } else {
          // some sort of unknown error on the client side
          console.log(error);
          changeAlert("Internal application error. Try again soon.");
        }
      });
  };

  const goBack = (keychain) => {
    let url = `${appData.callbackUrl}?key=${keychain}`;

    if (appData.inviteCode) url += `&inviteCode=${appData.inviteCode}`;

    window.location.href = url;
  };

  return (
    <div>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center bg-white/95 py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-32">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-8 w-auto"
                src="https://res.cloudinary.com/dlazo25rt/image/upload/v1700092604/kreative-id/kreative-id_zpbczr.png"
                alt="Kreative ID logo in color"
                height={512}
                width={136}
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="text-md mt-2 text-gray-600">
                to continue to {appData.name}
              </p>
            </div>
            <div id="alert" className={alertStyles}>
              <AlertComponent message={alertMessage} />
            </div>
            <div id="signin-form" className="mt-8">
              <div className="mt-6">
                <form className="mt-8 space-y-6">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email-address"
                        value={email}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        value={password}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-bl-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-br-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <EyeIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        checked={rememberMe}
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => handleCheckedChange(e)}
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link
                        href={`/forgot_password?aidn=${appData.aidn}${
                          appData.testing
                            ? `&testing=${appData.testingInfo}`
                            : ""
                        }${
                          appData.restrict
                            ? `&restrict=${appData.restrict}`
                            : ""
                        }${
                          appData.platform
                            ? `&platform=${appData.platform}`
                            : ""
                        }${
                          appData.inviteCode
                            ? `&inviteCode=${appData.inviteCode}`
                            : ""
                        }`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={(e) => createSigninInstance(e)}
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {showSpinner ? (
                        <div className="flex items-center justify-center space-x-3">
                          <span>Signing in...</span>
                          <motion.span
                            className="flex h-4 w-4 items-center rounded-full border-2 border-white border-t-indigo-600"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            role="status"
                          />
                        </div>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              {appData.restrict === "registration" ? null : (
                <p className="mt-2 pt-2 text-center text-sm text-gray-600">
                  Need an account?{" "}
                  <Link
                    href={`/signup?aidn=${appData.aidn}${
                      appData.testing ? `&testing=${appData.testingInfo}` : ""
                    }${
                      appData.platform ? `&platform=${appData.platform}` : ""
                    }${
                      appData.restrict ? `&restrict=${appData.restrict}` : ""
                    }${
                      appData.inviteCode
                        ? `&inviteCode=${appData.inviteCode}`
                        : ""
                    }`}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up here{" "}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Wallpaper />
    </div>
  );
}