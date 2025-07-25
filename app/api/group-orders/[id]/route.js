import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import GroupOrder from '../../../../models/groupOrder';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const groupOrder = await GroupOrder.findById(params.id)
      .populate('material', 'name category unit pricePerKg description')
      .populate('organizer', 'name businessName location businessType')
      .populate('supplier', 'name businessName location businessType')
      .populate('participants.user', 'name businessName location');
    
    if (!groupOrder) {
      return NextResponse.json(
        { error: 'Group order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(groupOrder);
  } catch (error) {
    console.error('Error fetching group order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group order' },
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
    
    const groupOrder = await GroupOrder.findById(params.id);
    
    if (!groupOrder) {
      return NextResponse.json(
        { error: 'Group order not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the organizer
    if (groupOrder.organizer.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. Only the organizer can update this group order.' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    Object.assign(groupOrder, data);
    await groupOrder.save();
    await groupOrder.populate([
      { path: 'material', select: 'name category unit pricePerKg' },
      { path: 'organizer', select: 'name businessName location' },
      { path: 'participants.user', select: 'name businessName' }
    ]);
    
    return NextResponse.json(groupOrder);
  } catch (error) {
    console.error('Error updating group order:', error);
    return NextResponse.json(
      { error: 'Failed to update group order' },
      { status: 500 }
    );
  }
}
