import mongoose from 'mongoose';

const GroupOrderSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  targetQuantity: {
    type: Number,
    required: true,
  },
  currentQuantity: {
    type: Number,
    default: 0,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled', 'fulfilled', 'completed'],
    default: 'open',
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  paymentTerms: {
    type: String,
    enum: ['advance', 'on_delivery', 'partial'],
    default: 'on_delivery',
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  supplierConfirmed: {
    type: Boolean,
    default: false,
  },
  totalAmount: {
    type: Number,
    default: 0,
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

GroupOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalAmount = this.currentQuantity * this.pricePerUnit;
  next();
});

export default mongoose.models.GroupOrder || mongoose.model('GroupOrder', GroupOrderSchema);
