import mongoose from "mongoose";

const subcriptionSchema = new mongoose.Schema({
    planName: {
        type: String,
        enum: ['Free', 'Monthly', 'Yearly'],
        default: 'Free'
      },
      price: {
        type: Number,
        required: true
      },
      duration: {
        type: String,
        enum: ['Monthly', 'Yearly'],
        default: 'Monthly' // For non-free plans
      },
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: {
        type: Date
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
},{
    timestamps:true
})

const Subcription = mongoose.model("Subcription",subcriptionSchema);

export default Subcription;