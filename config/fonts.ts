import { Fira_Code as FontMono } from "next/font/google";

// SN Pro is loaded via CSS @import in globals.css
// We create a placeholder variable for consistency
export const fontSans = {
  variable: "--font-sans",
  className: "font-sans",
};

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
