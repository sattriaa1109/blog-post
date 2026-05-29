const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

exports.getAll = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, published = false } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
