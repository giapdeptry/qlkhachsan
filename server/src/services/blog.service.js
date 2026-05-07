const modelBlog = require('../models/blog.model');

class BlogService {
    async uploadImages(images) {
        return images.filename;
    }

    async createBlog(title, content, image) {
        const blog = await modelBlog.create({ title, content, image });
        return blog;
    }

    async getBlogs() {
        const blogs = await modelBlog.find();
        return blogs;
    }

    async getBlogById(id) {
        const blog = await modelBlog.findOne({ _id: id });
        return blog;
    }

    async deleteBlog(id) {
        const blog = await modelBlog.findOne({ _id: id });
        if (!blog) {
            throw new BadRequestError('Blog not found');
        }
        await blog.deleteOne();
        return blog;
    }

    async updateBlog(id, title, content, image) {
        const blog = await modelBlog.findOne({ _id: id });
        if (!blog) {
            throw new BadRequestError('Blog not found');
        }
        blog.title = title;
        blog.content = content;
        blog.image = image;
        await blog.save();
        return blog;
    }

    async getBlogById(id) {
        const blog = await modelBlog.findOne({ _id: id });
        return blog;
    }
}

module.exports = new BlogService();
