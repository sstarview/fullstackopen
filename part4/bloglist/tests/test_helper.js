const Blog = require("../model/blog");

const initialTestBlog = [
  {
    title: "A Beautiful Wind",
    author: "Zoharan Malik",
    url: "https://zohranmalik.com",
    likes: 88,
  },
  {
    title: "A Wind Forever",
    author: "Kavish Hussain",
    url: "https://kavishhussain.com",
    likes: 12,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

module.exports = {
  initialTestBlog,
  blogsInDB,
};
