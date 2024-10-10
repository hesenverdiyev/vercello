import mongoose from "mongoose";

const { Schema} = mongoose;

const pollSchema = new Schema({
  pollname: {
    type: String,
    required: true
  },
  pollquestion: {
    type: String,
    required: true
  },
  options: {
    type: [{
      title: String,
      picture: {
        type: String,
        required: false
      }, 
      voters: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
          }
        }
      ]
    }],
    required: true
  },
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;