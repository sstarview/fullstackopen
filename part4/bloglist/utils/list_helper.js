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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
