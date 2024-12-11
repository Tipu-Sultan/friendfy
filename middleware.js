import { NextResponse } from 'next/server';

export function middleware(req) {
    const path = req.nextUrl.pathname;
    const isPublicUrl = path==="/login" || path==="/register" || path==="/forgot-password" || path==="/verify-email"
    const token = req.cookies.get('authToken'); 

    // If  token exists, redirect to the path
    if (isPublicUrl && token) {
        return NextResponse.redirect(new URL(path, req.nextUrl));
    }

    // If no token exists, redirect to the login page
    if (!isPublicUrl && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

}

export const config = {
    matcher: [
        '/login',
        '/register',
        "/forgot-password",
        "/verify-email",
        '/',
        '/chat',
        '/friends',
        '/settings',
        '/profile/:path*'], 
};
