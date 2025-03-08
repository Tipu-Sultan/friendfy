"use client"; // This ensures it's a Client Component

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
