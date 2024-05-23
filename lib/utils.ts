import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SHA256 as sha256 } from "crypto-js";

export const hashPassword = (string: string) => {
  return sha256(string).toString();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
