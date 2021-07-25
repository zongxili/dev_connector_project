const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { ValidationHalt } = require('express-validator/src/base');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
// const { route } = require('./users');
// const request = require('request');
// const config = require('config');

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post('/', [auth, [
  check('text', 'Text is required').not().isEmpty()]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password'); // not send the password back

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/posts
// @desc   Get all posts
// @access Private (because we can't see the Post page unless logging in)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // find the most recent first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/posts/:id
// @desc   Get post by User ID
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }


    res.json(post);
  } catch (err) {
    console.error(err.message);
    // if the ID is not valid
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found & given ID is invalid' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post by its ID
// @access Private (because we can't see the Post page unless logging in)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // if the post doesn't exist
    if (!post) {
      return res.status(404).json({ msg: 'Post doesn\' exist or Post not found' });
    }

    // making sure the User who wants to delete the post owns this post
    if (post.user.toString() !== req.user.id) { // the first one will be an object ID
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found & given ID is invalid' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;