import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//a function to convert space to - in a string
export function slugMaker(str: string) {
  return str.replace(/\s/g, "-");
}
