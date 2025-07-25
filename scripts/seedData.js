const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models (adjust paths as needed for your project structure)
const User = require('../models/user');
const Material = require('../models/material');
const GroupOrder = require('../models/groupOrder');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vendorcollect';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Material.deleteMany({});
    await GroupOrder.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Buyers (Suppliers)
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
      },
      {
        name: 'Construction Materials Co.',
        email: 'info@constructionmat.com',
        password: hashedPassword,
        role: 'buyer',
        businessName: 'Construction Materials Co.',
        businessType: 'Construction Supplier',
        location: 'Pune, Maharashtra'
      }
    ]);

    // Vendors
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
      },
      {
        name: 'Café Delight Chain',
        email: 'supply@cafedelight.com',
        password: hashedPassword,
        role: 'vendor',
        businessName: 'Café Delight Chain',
        businessType: 'Café Chain',
        location: 'Mumbai, Maharashtra'
      },
      {
        name: 'Building Contractors United',
        email: 'materials@buildersunited.com',
        password: hashedPassword,
        role: 'vendor',
        businessName: 'Building Contractors United',
        businessType: 'Construction Company',
        location: 'Pune, Maharashtra'
      },
      {
        name: 'Catering Services Pro',
        email: 'orders@cateringpro.com',
        password: hashedPassword,
        role: 'vendor',
        businessName: 'Catering Services Pro',
        businessType: 'Catering Service',
        location: 'Mumbai, Maharashtra'
      }
    ]);

    console.log(`Created ${buyers.length} buyers and ${vendors.length} vendors`);

    // Create demo materials
    const materials = await Material.create([
      // Agricultural/Food materials from buyers
      {
        name: 'Premium Tomatoes',
        description: 'Fresh red tomatoes, grade A quality',
        category: 'food',
        pricePerKg: 45,
        availableQuantity: 2000,
        minOrderQuantity: 50,
        unit: 'kg',
        deliveryArea: 'Mumbai Metropolitan Area',
        deliveryRadius: 50,
        supplier: buyers[0]._id,
        bulkDiscounts: [
          { minQuantity: 100, discountPercentage: 5 },
          { minQuantity: 500, discountPercentage: 10 }
        ]
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
        deliveryRadius: 100,
        supplier: buyers[0]._id,
        bulkDiscounts: [
          { minQuantity: 50, discountPercentage: 7 },
          { minQuantity: 200, discountPercentage: 12 }
        ]
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
        deliveryRadius: 75,
        supplier: buyers[1]._id,
        bulkDiscounts: [
          { minQuantity: 500, discountPercentage: 8 },
          { minQuantity: 1000, discountPercentage: 15 }
        ]
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
        deliveryRadius: 80,
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
        deliveryRadius: 60,
        supplier: buyers[2]._id
      },
      {
        name: 'Green Vegetables Mix',
        description: 'Fresh seasonal green vegetables bundle',
        category: 'food',
        pricePerKg: 40,
        availableQuantity: 800,
        minOrderQuantity: 30,
        unit: 'kg',
        deliveryArea: 'Bangalore Metropolitan',
        deliveryRadius: 40,
        supplier: buyers[2]._id
      },
      // Construction materials
      {
        name: 'Portland Cement',
        description: 'Grade 53 Portland cement for construction',
        category: 'construction',
        pricePerKg: 8,
        availableQuantity: 10000,
        minOrderQuantity: 1000,
        unit: 'kg',
        deliveryArea: 'Pune and Mumbai',
        deliveryRadius: 120,
        supplier: buyers[3]._id,
        bulkDiscounts: [
          { minQuantity: 5000, discountPercentage: 5 },
          { minQuantity: 10000, discountPercentage: 10 }
        ]
      },
      {
        name: 'Steel Rods (TMT)',
        description: '12mm TMT steel rods for construction',
        category: 'construction',
        pricePerKg: 65,
        availableQuantity: 5000,
        minOrderQuantity: 100,
        unit: 'kg',
        deliveryArea: 'Pune and surrounding areas',
        deliveryRadius: 80,
        supplier: buyers[3]._id
      },
      {
        name: 'River Sand',
        description: 'Clean river sand for construction purposes',
        category: 'construction',
        pricePerKg: 2.5,
        availableQuantity: 50000,
        minOrderQuantity: 5000,
        unit: 'kg',
        deliveryArea: 'Maharashtra state',
        deliveryRadius: 200,
        supplier: buyers[3]._id
      }
    ]);

    console.log(`Created ${materials.length} materials`);

    // Create demo group orders
    const groupOrders = await GroupOrder.create([
      {
        material: materials[0]._id, // Premium Tomatoes
        organizer: vendors[0]._id, // Mumbai Restaurant Group
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
          },
          {
            user: vendors[3]._id, // Café Delight Chain
            quantity: 50,
            status: 'confirmed'
          }
        ],
        status: 'open',
        deadlineDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        deliveryLocation: 'Mumbai Central Market',
        paymentTerms: 'on_delivery'
      },
      {
        material: materials[1]._id, // Cooking Oil
        organizer: vendors[1]._id, // Hotel Paradise
        title: 'Cooking Oil Group Purchase',
        description: 'Bulk purchase of cooking oil for hotels and restaurants',
        targetQuantity: 200,
        currentQuantity: 80,
        pricePerUnit: 120,
        participants: [
          {
            user: vendors[1]._id,
            quantity: 50,
            status: 'confirmed'
          },
          {
            user: vendors[5]._id, // Catering Services Pro
            quantity: 30,
            status: 'confirmed'
          }
        ],
        status: 'open',
        deadlineDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        deliveryLocation: 'Mumbai Food Hub',
        paymentTerms: 'advance'
      },
      {
        material: materials[2]._id, // Wheat Flour
        organizer: vendors[2]._id, // Food Court Central
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
            user: vendors[1]._id, // Hotel Paradise
            quantity: 100,
            status: 'confirmed'
          }
        ],
        status: 'open',
        deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        deliveryLocation: 'Delhi Wholesale Market',
        paymentTerms: 'partial'
      },
      // Confirmed order example
      {
        material: materials[4]._id, // Red Lentils
        organizer: vendors[2]._id, // Food Court Central
        title: 'Red Lentils for Bangalore Food Courts',
        description: 'Group purchase of red lentils',
        targetQuantity: 300,
        currentQuantity: 300,
        pricePerUnit: 95,
        participants: [
          {
            user: vendors[2]._id,
            quantity: 150,
            status: 'confirmed'
          },
          {
            user: vendors[1]._id,
            quantity: 150,
            status: 'confirmed'
          }
        ],
        status: 'closed',
        deadlineDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        deliveryLocation: 'Bangalore Food Distribution Center',
        supplier: buyers[2]._id,
        supplierConfirmed: true,
        paymentTerms: 'on_delivery'
      },
      // Construction material group order
      {
        material: materials[6]._id, // Portland Cement
        organizer: vendors[4]._id, // Building Contractors United
        title: 'Cement for Construction Projects',
        description: 'Bulk cement purchase for multiple construction sites',
        targetQuantity: 8000,
        currentQuantity: 3000,
        pricePerUnit: 8,
        participants: [
          {
            user: vendors[4]._id,
            quantity: 3000,
            status: 'confirmed'
          }
        ],
        status: 'open',
        deadlineDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        deliveryLocation: 'Pune Construction Material Hub',
        paymentTerms: 'advance'
      }
    ]);

    console.log(`Created ${groupOrders.length} group orders`);

    console.log('\n=== DEMO DATA SEEDED SUCCESSFULLY ===');
    console.log('\nDemo Users Created:');
    console.log('\nBUYERS (Material Suppliers):');
    buyers.forEach(buyer => {
      console.log(`- ${buyer.businessName} (${buyer.email}) - ${buyer.location}`);
    });
    
    console.log('\nVENDORS (Group Order Organizers):');
    vendors.forEach(vendor => {
      console.log(`- ${vendor.businessName} (${vendor.email}) - ${vendor.location}`);
    });

    console.log('\nLogin with any email above using password: password123');
    console.log('\nMaterials and Group Orders have been created and linked appropriately.');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

async function main() {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  console.log('\nDatabase connection closed.');
}

// Run the seeding script
if (require.main === module) {
  main();
}

module.exports = { seedData };
