const Blog = require("../model/blog");
const User = require("../model/user");

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

const initialTestUser = [
  {
    username: "AlanWalker",
    name: "Alan Walker",
    password: "123456",
  },
  {
    username: "JaunEliah",
    name: "Jaun Eliah",
    password: "987654321",
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialTestBlog,
  blogsInDB,
  initialTestUser,
  usersInDb,
};
