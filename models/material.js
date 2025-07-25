import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'construction', 'agricultural', 'industrial', 'textiles', 'chemicals', 'other'],
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'liter', 'piece', 'meter', 'ton'],
  },
  deliveryArea: {
    type: String,
    required: true,
  },
  deliveryRadius: {
    type: Number, // in kilometers
    default: 50,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [{
    type: String, // URLs to images
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  bulkDiscounts: [{
    minQuantity: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
  }],
  specifications: {
    type: Map,
    of: String, // For additional specifications like quality grade, origin, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MaterialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);
