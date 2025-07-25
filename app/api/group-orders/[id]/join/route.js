import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import GroupOrder from '../../../../../models/groupOrder';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'vendor') {
      return NextResponse.json(
        { error: 'Unauthorized. Only vendors can join group orders.' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { quantity } = await request.json();
    
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }
    
    const groupOrder = await GroupOrder.findById(params.id);
    
    if (!groupOrder) {
      return NextResponse.json(
        { error: 'Group order not found' },
        { status: 404 }
      );
    }
    
    if (groupOrder.status !== 'open') {
      return NextResponse.json(
        { error: 'This group order is no longer accepting participants' },
        { status: 400 }
      );
    }
    
    // Check if user is already a participant
    const existingParticipant = groupOrder.participants.find(
      p => p.user.toString() === session.user.id
    );
    
    if (existingParticipant) {
      return NextResponse.json(
        { error: 'You are already a participant in this group order' },
        { status: 400 }
      );
    }
    
    // Add participant
    groupOrder.participants.push({
      user: session.user.id,
      quantity: quantity,
      status: 'pending'
    });
    
    // Update current quantity
    groupOrder.currentQuantity += quantity;
    
    await groupOrder.save();
    await groupOrder.populate([
      { path: 'material', select: 'name category unit pricePerKg' },
      { path: 'organizer', select: 'name businessName location' },
      { path: 'participants.user', select: 'name businessName' }
    ]);
    
    return NextResponse.json({
      message: 'Successfully joined the group order',
      groupOrder
    });
  } catch (error) {
    console.error('Error joining group order:', error);
    return NextResponse.json(
      { error: 'Failed to join group order' },
      { status: 500 }
    );
  }
}
