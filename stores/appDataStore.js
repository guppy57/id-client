import { atom } from "jotai";

const appDataStore = atom({
  aidn: 0,
  name: "",
  callbackUrl: "",
  mobileCallbackUrl: "",
});

export { appDataStore };
