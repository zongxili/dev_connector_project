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
      return res.status(404).json({ msg: ' Post not found' });
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

// @route  PUT api/posts/like/:id
// @desc   Unlike a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    // fetch the post
    const post = await Post.findById(req.params.id);

    // Check if the post has already been like by this user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    // fetch the post
    const post = await Post.findById(req.params.id);

    // Check if the post has already been like by this user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    // Get remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json({ msg: 'Like Removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private
router.post('/comment/:id', [auth, [
  check('text', 'Comment Text is required').not().isEmpty()]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password'); // not send the password back
    const post = await Post.findById(req.params.id);
    const newComment = { // not a model from the Database
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete a comment
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment 
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    // Make sure comment exists/
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user who wants to delete this comment made this comment
    if (comment.user.toString() !== req.user.id) {
      // HTTP 401 Unauthorized client error
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

module.exports = router;