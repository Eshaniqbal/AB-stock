import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this item'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide a quantity for this item'],
    default: 0,
    min: [0, 'Quantity cannot be negative'],
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

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Item) {
  delete mongoose.models.Item;
}

const Item = mongoose.model('Item', ItemSchema);

export default Item; 