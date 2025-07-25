import bcrypt from 'bcryptjs';
import connectDB from '../../../lib/db';
import User from '../../../models/user';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password, role, businessName, businessType, location, image, provider } = await request.json();

    if (!name || !email || !role || !businessName || !businessType || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!password && provider !== 'google') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      businessName,
      businessType,
      location,
      image: image || null,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
