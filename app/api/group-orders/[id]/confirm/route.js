import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import GroupOrder from '../../../../../models/groupOrder';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'buyer') {
      return NextResponse.json(
        { error: 'Unauthorized. Only buyers/suppliers can confirm group orders.' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const groupOrder = await GroupOrder.findById(params.id)
      .populate('material');
    
    if (!groupOrder) {
      return NextResponse.json(
        { error: 'Group order not found' },
        { status: 404 }
      );
    }
    
    // Check if the buyer is the material supplier
    if (groupOrder.material.supplier.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. Only the material supplier can confirm this order.' },
        { status: 403 }
      );
    }
    
    if (groupOrder.supplierConfirmed) {
      return NextResponse.json(
        { error: 'This group order has already been confirmed' },
        { status: 400 }
      );
    }
    
    const { deliveryDate } = await request.json();
    
    // Update group order
    groupOrder.supplier = session.user.id;
    groupOrder.supplierConfirmed = true;
    groupOrder.status = 'closed';
    groupOrder.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    
    // Confirm all pending participants
    groupOrder.participants.forEach(participant => {
      if (participant.status === 'pending') {
        participant.status = 'confirmed';
      }
    });
    
    await groupOrder.save();
    await groupOrder.populate([
      { path: 'material', select: 'name category unit pricePerKg' },
      { path: 'organizer', select: 'name businessName location' },
      { path: 'supplier', select: 'name businessName location' },
      { path: 'participants.user', select: 'name businessName' }
    ]);
    
    return NextResponse.json({
      message: 'Group order confirmed successfully',
      groupOrder
    });
  } catch (error) {
    console.error('Error confirming group order:', error);
    return NextResponse.json(
      { error: 'Failed to confirm group order' },
      { status: 500 }
    );
  }
}
