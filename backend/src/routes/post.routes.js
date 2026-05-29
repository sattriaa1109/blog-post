const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);

// Protected routes
router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').optional().trim(),
  ],
  postController.create
);

router.put(
  '/:id',
  authMiddleware,
  [body('title').optional().trim().notEmpty()],
  postController.update
);

router.delete('/:id', authMiddleware, postController.remove);

module.exports = router;
