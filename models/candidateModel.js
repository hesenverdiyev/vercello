import mongoose from "mongoose";

const { Schema} = mongoose;

const candidateSchema = new Schema({
    username: {
      type: String,
      required: [true, "Username is required"],
      lowercase: true,
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
    },
    followers: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false
        },
        city: {
          type: String,
          required: true
        }
      }
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  }, {
    timestamps: true
  });


const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;