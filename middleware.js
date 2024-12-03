import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('authToken'); // Retrieve the token from cookies

    // If no token exists, redirect to the login page
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If authenticated, allow access to the route
    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*'], 
};
