import { NextResponse } from "next/server";

export function middleware(req) {
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const privateRoutes = ["/", "/chat", "/profile"]; // Add more private routes as needed

  const url = req.nextUrl;
  const token = req.cookies.get(
    process.env.NODE_ENV === "development" ? "next-auth.session-token" : "__Secure-next-auth.session-token"
  )?.value; // Extracting the value from the cookie object
  
  // Allow access to public routes
  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  // Restrict access to private routes if not authenticated
  if (privateRoutes.includes(url.pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
