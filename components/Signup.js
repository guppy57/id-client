import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import zxcvbn from "zxcvbn";
import { AnimatePresence, motion } from "framer-motion";
import AlertComponent from "./Alert";
import Wallpaper from "./Wallpaper";
import ProgressBarComponent from "./ProgressBar";
import { createLink } from "../lib/utils";

export default function SignupFunction({ appData }) {
  // api data variables
  const [username, setUsername] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");

  // password strength analyzer progress bar states
  const [passwordScore, setPasswordScore] = useState(0);
  const [barWrapperClass, setBarWrapperClass] = useState("pt-3 hidden");
  const [barMessage, setBarMessage] = useState("");
  const [progressClass, setProgressClass] = useState("");
  const [barWidthName, setBarWidthName] = useState("");
  const [textClass, setTextClass] = useState("gray-500");

  // page element variables
  const [title, setTitle] = useState("Create your account");
  const [subtitle, setSubtitle] = useState(
    `Then continue back to ${appData.name}`,
  );
  const [formStyles, setFormStyles] = useState("mt-8");
  const [goBackStyles, setGoBackStyles] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyles, setAlertStyles] = useState("hidden");
  const [showPassword, setShowPassword] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showUsernameHelpText, setShowUsernameHelpText] = useState(false);
  const [showUsernameField, setShowUsernameField] = useState(false);

  // regex expression for checking if a string is a valid email address
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  const changeAlert = (message) => {
    setAlertMessage(message);
    setAlertStyles("");
  };

  const changeProgressBar = (message, progressClass, widthName, textClass) => {
    // sets the state for the different variables for the progress bar
    setBarMessage(message);
    setProgressClass(progressClass);
    setBarWidthName(widthName);
    setTextClass(textClass);
  };

  const handlePasswordInput = (passwordInput) => {
    // hides the progress bar if there is no password entered
    if (passwordInput.length !== 0) setBarWrapperClass("pt-3");
    else setBarWrapperClass("pt-3 hidden");

    // updates the password in react state
    setPassword(passwordInput);

    // get the score of the password and sets it to state
    const score = zxcvbn(password).score;
    setPasswordScore(score);

    // changes progress bar strength based on score
    if (passwordScore === 0) {
      changeProgressBar(
        "Password is weak",
        "h-2.5 w-4/12 rounded-full bg-red-600",
        "20%",
        "text-sm text-red-600",
      );
    } else if (passwordScore === 1) {
      changeProgressBar(
        "Password is good",
        "h-2.5 w-8/12 rounded-full bg-yellow-500",
        "75%",
        "text-sm text-yellow-500",
      );
    } else if (passwordScore === 2 || passwordScore === 3) {
      changeProgressBar(
        "Password is getting stronger",
        "h-2.5 w-11/12 rounded-full bg-orange-500",
        "90%",
        "text-sm text-orange-500",
      );
    } else {
      changeProgressBar(
        "This password is hard to crack!",
        "h-2.5 w-12/12 rounded-full bg-green-700",
        "100%",
        "text-sm text-green-700",
      );
    }
  };

  const createSignupInstance = (e) => {
    // prevents page refresh upon button click
    e.preventDefault();

    // removes any displayed alerts
    setAlertStyles("hidden");

    // make sure username is only made up of letters, numbers, underscores, and periods
    if (!/^[a-zA-Z0-9_.]*$/.test(username)) {
      changeAlert(
        "Username can only be made up of letters, numbers, underscores, and periods",
      );
      return;
    }

    // verify that all the fields we want are not empty strings
    // if anyone of them are empty, error is shown
    if (
      email === "" ||
      password === "" ||
      fname === "" ||
      lname === "" ||
      username === ""
    ) {
      changeAlert("Please make sure all fields are filled out");
      return;
    }

    // make sure that the email entered is actually an email
    // shows error if the string test doesn't pass
    if (!regexExp.test(email)) {
      changeAlert("Please enter a valid email address");
      return;
    }

    // // makes sure that the password entered is strong enough
    // if (passwordScore < 3) {
    //   changeAlert("Please make your password stronger");
    //   return;
    // }

    setShowSpinner(true);

    // makes post request for the signup api
    axios
      .post("https://id-api.kreativeusa.com/v1/accounts/signup", {
        environment: appData.testing ? "development" : "production",
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password,
        firstName: fname,
        lastName: lname,
        aidn: appData.aidn,
      })
      .then((response) => {
        setShowSpinner(false);
        setFormStyles("hidden");
        setGoBackStyles("mt-8");
        setKey(response.data.data.keychain.key);
        setTitle("Welcome to Kreative");
        setSubtitle(
          `You're ready to go back to ${appData.name} and continue your experience`,
        );
      })
      .catch((error) => {
        setShowSpinner(false);
        // sets and finds the statuscode for the response
        const statusCode = error.response.data.statusCode;
        // finds and sets the message for the response
        const message = error.response.data.message;

        if (statusCode === 500 || statusCode === 400) {
          // 500: internal server error, 400: bad schema
          // the email part of this error is basically server-side form validation
          if (statusCode === 400 && message === "email must be an email") {
            changeAlert("Please enter a valid email address");
          } else {
            changeAlert("Internal server error. Try again soon.");
          }
        } else if (statusCode === 403) {
          // unique constraints are failing server-side
          if (message.includes("username")) {
            changeAlert("Username is taken, try a new one.");
          } else if (message.includes("email")) {
            changeAlert("There is already an account with this email.");
          }
        } else if (statusCode === 404) {
          // account was not found
          changeAlert("Account not found with given email");
        } else {
          // some sort of unknown error on the client side
          console.log(error);
          changeAlert("Internal application error. Try again soon.");
        }
      });
  };

  const goBack = (e) => {
    e.preventDefault();
    let url = `${appData.callbackUrl}?key=${key}`;

    if (appData.inviteCode) url += `&inviteCode=${appData.inviteCode}`;

    window.location.href = url;
  };

  return (
    <div>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center bg-white/95 py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
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
                {title}
              </h2>
              <p className="text-md mt-2 text-gray-600">{subtitle}</p>
            </div>
            <div id="alert" className={alertStyles}>
              <AlertComponent message={alertMessage} />
            </div>
            <div className={formStyles}>
              <div className="mt-6">
                <form className="mt-8 space-y-6">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div className="flex -space-x-px rounded-t-md rounded-b-none">
                      <div className="w-1/2 min-w-0 flex-1">
                        <label htmlFor="first-name" className="sr-only">
                          First name
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          value={fname}
                          className="relative block w-full rounded-none rounded-tl-md border-gray-300 focus:z-10 focus:border-black focus:ring-black sm:text-sm"
                          placeholder="First name"
                          onChange={(e) => setFname(e.target.value)}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label htmlFor="last-name" className="sr-only">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          value={lname}
                          className="relative block w-full rounded-none rounded-tr-md border-gray-300 focus:z-10 focus:border-black focus:ring-black sm:text-sm"
                          placeholder="Last name"
                          onChange={(e) => setLname(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="nope"
                        value={email}
                        required
                        className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                        placeholder="Email address"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        onBlur={() => {
                          setShowUsernameField(true);
                          if (username === "") setUsername(email.split("@")[0]);
                        }}
                      />
                    </div>
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        required
                        className="relative block w-full appearance-none rounded-none rounded-bl-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                        placeholder="Password"
                        onChange={(e) => handlePasswordInput(e.target.value)}
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
                    <div className={barWrapperClass}>
                      <ProgressBarComponent
                        widthName={barWidthName}
                        progressClass={progressClass}
                        textClass={textClass}
                        message={barMessage}
                      />
                    </div>
                  </div>
                  <AnimatePresence>
                    {showUsernameField && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { delay: 0.2, duration: 0.25 },
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                          transition: { duration: 0.25 },
                        }}
                        className="mt-1 sm:col-span-2 sm:mt-0"
                      >
                        <div className="flex max-w-full rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            @
                          </span>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username" // skipcq
                            value={username}
                            placeholder="Username"
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black sm:text-sm"
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setShowUsernameHelpText(true)}
                            onBlur={() => setShowUsernameHelpText(false)}
                            required
                          />
                        </div>
                        <AnimatePresence>
                          {showUsernameHelpText && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { delay: 0.1, duration: 0.3 },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.2 },
                              }}
                              className="mt-1.5 text-[0.875rem] leading-[1rem] text-gray-500"
                            >
                              Usernames are case-insensitive and only contain
                              letters, numbers, underscores, and periods.
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <motion.button
                      whileHover={{
                        scale: 0.95,
                        transition: { duration: 0.2, ease: "linear" },
                      }}
                      onClick={(e) => createSignupInstance(e)}
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      {showSpinner ? (
                        <div className="flex items-center justify-center space-x-3">
                          <span>Signing you up...</span>
                          <motion.span
                            className="flex h-4 w-4 items-center rounded-full border-2 border-white border-t-black"
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
                        "Sign up"
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
              <p className="mt-2 pt-2 text-center text-sm text-gray-600">
                Have an account?{" "}
                <Link
                  href={createLink("signin", appData)}
                  className="font-bold text-black hover:text-indigo-500"
                >
                  Sign in here{" "}
                </Link>
              </p>
            </div>
            <div id="go-back-button" className={goBackStyles}>
              <div>
                <button
                  onClick={(e) => goBack(e)}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
        <Wallpaper />
      </div>
    </div>
  );
}
