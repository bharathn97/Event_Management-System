import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
require("dotenv").config();

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return <Component {...pageProps} logout={logout} />;
}
