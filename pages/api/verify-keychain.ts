import { NextApiRequest, NextApiResponse } from "next";
import wretch from "wretch";

// the secret appchain for kreative id, production
const APPCHAIN = process.env.NEXT_PUBLIC_APPCHAIN;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // handle error
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log("appchain: " + APPCHAIN);

  wretch("https://id-api.kreativeusa.com/v1/keychains/verify")
    .post({
      key: req.body.key,
      aidn: req.body.aidn,
      appchain: APPCHAIN,
    })
    .unauthorized((error) => {
      // unauthorized exception, meaning that the keychain is expired
      // relocates to signin page with the callback for 'Kreative ID Test'
      return res.status(401).json({ message: error.message });
    })
    .forbidden((error) => {
      // aidn given is not the same as the one on the keychain
      // this is a weird error that would even happen, so we will just reauthenticate the user
      // relocates to signin page with the callback for 'Kreative ID Test'
      return res.status(403).json({ message: error.message });
    })
    .internalError((error) => {
      // since there is something on the server side that isn't working reauthenticating wont work
      // instead we will redirect the user to an auth error page
      return res.status(500).json({ message: error.message });
    })
    .notFound((error) => {
      // the keychain does not exist, meaning that the user has never signed in
      // relocates to signin page with the callback for 'Kreative ID Test'
      return res.status(404).json({ message: error.message });
    })
    .json((response) => {
      const account = response.data.account;
      const keychain = response.data.keychain;
      return res.status(200).json({ account, keychain });
    })
    .catch((error) => {
      // some sort of unknown error, possibly on the client side itself
      return res.status(500).json({ message: error.message });
    });

}