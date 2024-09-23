import { atom } from "jotai";

const appDataStore = atom({
  aidn: 0,
  name: "",
  callback: "",
  homepage: "",
  description: "",
  logoUrl: "",
  iconUrl: "",
  baseRole: "",
});

export { appDataStore };
