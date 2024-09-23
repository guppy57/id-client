import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createLink(page, appData) {
  let base = "/" + page + "?aidn=" + appData.aidn;

  base += appData.testing ? `&testing=${appData.testingInfo}` : "";
  base += appData.restrict ? `&restrict=${appData.restrict}` : "";
  base += appData.platform ? `&platform=${appData.platform}` : "";
  base += appData.inviteCode ? `&inviteCode=${appData.inviteCode}` : "";

  return base;
}
