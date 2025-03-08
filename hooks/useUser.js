import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  
  return { user };
}
