import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import GroupOrder from '../../../models/groupOrder';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (location) {
      query.deliveryLocation = { $regex: location, $options: 'i' };
    }
    
    const groupOrders = await GroupOrder.find(query)
      .populate('material', 'name category unit pricePerKg')
      .populate('organizer', 'name businessName location')
      .populate('supplier', 'name businessName location')
      .populate('participants.user', 'name businessName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await GroupOrder.countDocuments(query);
    
    return NextResponse.json({
      groupOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Error fetching group orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'vendor') {
      return NextResponse.json(
        { error: 'Unauthorized. Only vendors can create group orders.' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const data = await request.json();
    
    const groupOrder = new GroupOrder({
      ...data,
      organizer: session.user.id,
      participants: [{
        user: session.user.id,
        quantity: data.initialQuantity || 0,
        status: 'confirmed'
      }],
      currentQuantity: data.initialQuantity || 0,
    });
    
    await groupOrder.save();
    await groupOrder.populate([
      { path: 'material', select: 'name category unit pricePerKg' },
      { path: 'organizer', select: 'name businessName location' },
      { path: 'participants.user', select: 'name businessName' }
    ]);
    
    return NextResponse.json(groupOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating group order:', error);
    return NextResponse.json(
      { error: 'Failed to create group order' },
      { status: 500 }
    );
  }
}
