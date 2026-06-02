import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  key: {
    type: String,
    required: true
  },
  editedkey:[
  String
  ],
size:{
  type:Number,
  required:true
},
dimensions:{
  width:{
    type:Number,
    required:true
  },
  height:{
    type:Number,
    required:true,
  }
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model("Image", imageSchema);

export default Image;