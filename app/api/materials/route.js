import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Material from '../../../models/material';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (location) {
      query.deliveryArea = { $regex: location, $options: 'i' };
    }
    
    const materials = await Material.find(query)
      .populate('supplier', 'name businessName location')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Material.countDocuments(query);
    
    return NextResponse.json({
      materials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'buyer') {
      return NextResponse.json(
        { error: 'Unauthorized. Only buyers can create material listings.' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const data = await request.json();
    
    const material = new Material({
      ...data,
      supplier: session.user.id,
    });
    
    await material.save();
    await material.populate('supplier', 'name businessName location');
    
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { error: 'Failed to create material listing' },
      { status: 500 }
    );
  }
}
