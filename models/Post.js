const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users' // so that users can only delete their own post, and also shows which user created the post
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    // name of the user
    // so if a user deletes her/his account, the post can be remained
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users' // then we know which likes came from which user
        // also, this restricts the users can only like a post once
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users' // then we know which likes came from which user
        // also, this restricts the users can only like a post once
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: { // the day for the actual post
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);