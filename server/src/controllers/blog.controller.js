const BlogService = require('../services/blog.service');
const { OK, Created } = require('../core/success.response');

class BlogController {
    async uploadImages(req, res) {
        const images = req.file;
        const data = await BlogService.uploadImages(images);
        return new OK({ message: 'Upload images successfully', metadata: data }).send(res);
    }

    async createBlog(req, res) {
        const { title, content, image } = req.body;
        const data = await BlogService.createBlog(title, content, image);
        return new Created({ message: 'Create blog successfully', metadata: data }).send(res);
    }

    async getBlogs(req, res) {
        const data = await BlogService.getBlogs();
        return new OK({ message: 'Get blogs successfully', metadata: data }).send(res);
    }

    async deleteBlog(req, res) {
        const { id } = req.params;
        const data = await BlogService.deleteBlog(id);
        return new OK({ message: 'Delete blog successfully', metadata: data }).send(res);
    }

    async updateBlog(req, res) {
        const { id } = req.params;
        const { title, content, image } = req.body;
        const data = await BlogService.updateBlog(id, title, content, image);
        return new OK({ message: 'Update blog successfully', metadata: data }).send(res);
    }

    async getBlogById(req, res) {
        const { id } = req.params;
        const data = await BlogService.getBlogById(id);
        return new OK({ message: 'Get blog by id successfully', metadata: data }).send(res);
    }
}

module.exports = new BlogController();
