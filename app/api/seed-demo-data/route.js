import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import User from '../../../models/user';
import Material from '../../../models/material';
import GroupOrder from '../../../models/groupOrder';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Only allow in development environment for security
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Demo data seeding is not allowed in production' },
        { status: 403 }
      );
    }

    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Material.deleteMany({});
    await GroupOrder.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create demo buyers (suppliers)
    const buyers = await User.create([
      {
        name: 'Raj Agricultural Supplies',
        email: 'raj@agsupplies.com',
        password: hashedPassword,
        role: 'buyer',
        businessName: 'Raj Agricultural Supplies',
        businessType: 'Agricultural Supplier',
        location: 'Mumbai, Maharashtra'
      },
      {
        name: 'Fresh Produce Hub',
        email: 'contact@freshproduce.com',
        password: hashedPassword,
        role: 'buyer',
        businessName: 'Fresh Produce Hub',
        businessType: 'Wholesale Distributor',
        location: 'Delhi, NCR'
      },
      {
        name: 'Green Valley Foods',
        email: 'admin@greenvalley.com',
        password: hashedPassword,
        role: 'buyer',
        businessName: 'Green Valley Foods',
        businessType: 'Food Processor',
        location: 'Bangalore, Karnataka'
      }
    ]);

    // Create demo vendors
    const vendors = await User.create([
      {
        name: 'Mumbai Restaurant Group',
        email: 'orders@mumbairestaurants.com',
        password: hashedPassword,
        role: 'vendor',
        businessName: 'Mumbai Restaurant Group',
        businessType: 'Restaurant Chain',
        location: 'Mumbai, Maharashtra'
      },
      {
        name: 'Hotel Paradise',
        email: 'procurement@hotelparadise.com',
        password: hashedPassword,
        role: 'vendor',
        businessName: 'Hotel Paradise',
        businessType: 'Hotel',
        location: 'Delhi, NCR'
      },
      {
        name: 'Food Court Central',
        email: 'manager@foodcourtcentral.com',
        password: hashedPassword,
        role: 'vendor',
        businessName: 'Food Court Central',
        businessType: 'Food Court',
        location: 'Bangalore, Karnataka'
      }
    ]);

    // Create demo materials
    const materials = await Material.create([
      {
        name: 'Premium Tomatoes',
        description: 'Fresh red tomatoes, grade A quality',
        category: 'food',
        pricePerKg: 45,
        availableQuantity: 2000,
        minOrderQuantity: 50,
        unit: 'kg',
        deliveryArea: 'Mumbai Metropolitan Area',
        supplier: buyers[0]._id
      },
      {
        name: 'Refined Cooking Oil',
        description: 'Sunflower cooking oil, refined and filtered',
        category: 'food',
        pricePerKg: 120,
        availableQuantity: 1000,
        minOrderQuantity: 20,
        unit: 'liter',
        deliveryArea: 'Mumbai and Pune',
        supplier: buyers[0]._id
      },
      {
        name: 'Wheat Flour',
        description: 'Fine quality wheat flour for commercial use',
        category: 'food',
        pricePerKg: 35,
        availableQuantity: 5000,
        minOrderQuantity: 100,
        unit: 'kg',
        deliveryArea: 'Delhi NCR',
        supplier: buyers[1]._id
      },
      {
        name: 'Basmati Rice',
        description: 'Premium basmati rice, 1121 variety',
        category: 'food',
        pricePerKg: 85,
        availableQuantity: 3000,
        minOrderQuantity: 50,
        unit: 'kg',
        deliveryArea: 'Delhi NCR and surrounding areas',
        supplier: buyers[1]._id
      },
      {
        name: 'Red Lentils (Masoor Dal)',
        description: 'High quality red lentils for commercial kitchens',
        category: 'food',
        pricePerKg: 95,
        availableQuantity: 1500,
        minOrderQuantity: 25,
        unit: 'kg',
        deliveryArea: 'Bangalore and Karnataka',
        supplier: buyers[2]._id
      }
    ]);

    // Create demo group orders
    await GroupOrder.create([
      {
        material: materials[0]._id,
        organizer: vendors[0]._id,
        title: 'Bulk Tomatoes for Mumbai Restaurants',
        description: 'Group order for fresh tomatoes for restaurant chain',
        targetQuantity: 500,
        currentQuantity: 150,
        pricePerUnit: 45,
        participants: [
          {
            user: vendors[0]._id,
            quantity: 100,
            status: 'confirmed'
          }
        ],
        status: 'open',
        deadlineDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        deliveryLocation: 'Mumbai Central Market'
      },
      {
        material: materials[2]._id,
        organizer: vendors[2]._id,
        title: 'Wheat Flour Bulk Order',
        description: 'Large quantity wheat flour for food court vendors',
        targetQuantity: 1000,
        currentQuantity: 300,
        pricePerUnit: 35,
        participants: [
          {
            user: vendors[2]._id,
            quantity: 200,
            status: 'confirmed'
          },
          {
            user: vendors[1]._id,
            quantity: 100,
            status: 'confirmed'
          }
        ],
        status: 'open',
        deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        deliveryLocation: 'Delhi Wholesale Market'
      }
    ]);

    return NextResponse.json({
      message: 'Demo data seeded successfully!',
      data: {
        buyers: buyers.length,
        vendors: vendors.length,
        materials: materials.length,
        groupOrders: 2
      },
      loginInfo: {
        password: 'password123',
        buyerEmails: buyers.map(b => b.email),
        vendorEmails: vendors.map(v => v.email)
      }
    });

  } catch (error) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}
