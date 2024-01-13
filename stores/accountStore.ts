import { atom } from "jotai";

interface IAccountRole {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  aidn: number;
  description?: string;
}

interface IAccount {
  ksn: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  emailVerified: boolean;
  profilePicture: string;
  walletBalance: number;
  roles: IAccountRole[];
}

const accountStore = atom({} as IAccount);

export { accountStore };
export type { IAccount };
