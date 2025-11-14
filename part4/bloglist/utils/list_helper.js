const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogPosts) => {
  const reducer = (sum, current) => {
    return (sum += current.likes);
  };
  return blogPosts.reduce(reducer, 0);
};

const favoriteBlog = (blogPosts) => {
  if (blogPosts.length === 0) return null;
  return blogPosts.reduce((favorite, current) =>
    favorite.likes < current.likes ? current : favorite
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const result = _.chain(blogs)
    .countBy("author")
    .map((count, author) => ({
      author: author,
      blog: count,
    }))
    .maxBy("blog")
    .value();

  return result;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const result = _.chain(blogs)
    .groupBy("author")
    .map((authorBlogs, authorName) => ({
      author: authorName,
      likes: _.sumBy(authorBlogs, "likes"),
    }))
    .maxBy("likes")
    .value();

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
