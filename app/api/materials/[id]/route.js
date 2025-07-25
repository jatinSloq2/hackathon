import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Material from '../../../../models/material';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const material = await Material.findById(params.id)
      .populate('supplier', 'name businessName location businessType');
    
    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const material = await Material.findById(params.id);
    
    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns this material
    if (material.supplier.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only update your own materials.' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    Object.assign(material, data);
    await material.save();
    await material.populate('supplier', 'name businessName location');
    
    return NextResponse.json(material);
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const material = await Material.findById(params.id);
    
    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns this material
    if (material.supplier.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only delete your own materials.' },
        { status: 403 }
      );
    }
    
    await Material.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
