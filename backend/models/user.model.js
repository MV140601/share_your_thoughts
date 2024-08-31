import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  passWord: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',  // Use 'Users' as a string here
      default: []
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',  // Use 'Users' as a string here
      default: []
    }
  ],
  profileImg: {
    type: String,
    default: ""
  },
  coverImg: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  link: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);

export default Users;
