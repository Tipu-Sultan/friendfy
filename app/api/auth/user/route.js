import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from "@/models/UserModel"; 
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      const token = request.cookies.get('authToken')?.value; 
  
      if (!token) {
        return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
      }
  
      const secret = process.env.JWT_SECRET; // Make sure JWT_SECRET is set in your .env file
      const decoded = jwt.verify(token, secret);

      console.log(decoded);
  
      await connectDB();
  
      const user = await User.findById(decoded.userId).select('-password -recentChats'); // Assuming the token contains the user ID
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({user}, { status: 200 });
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
  }