const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/blogs');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

var upload = multer({ storage: storage });

const blogController = require('../controllers/blog.controller');

router.post('/upload-images', upload.single('image'), asyncHandler(blogController.uploadImages));
router.post('/create', authUser, asyncHandler(blogController.createBlog));
router.get('/all', asyncHandler(blogController.getBlogs));
router.delete('/delete/:id', authUser, asyncHandler(blogController.deleteBlog));
router.put('/update/:id', authUser, asyncHandler(blogController.updateBlog));
router.get('/detail/:id', asyncHandler(blogController.getBlogById));

module.exports = router;
