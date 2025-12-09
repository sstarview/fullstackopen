import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h1>log in to application</h1>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      showNotification("Wrong username or password", "error");
      console.log(error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title,
      author,
      url,
    };
    try {
      const result = await blogService.create(blogObject);
      setBlogs(blogs.concat(result.data));
      setTitle("");
      setAuthor("");
      setUrl("");
      showNotification(
        `a new blog "${blogObject.title}" by ${blogObject.author} added`,
        "success"
      );
    } catch (error) {
      showNotification(`${error?.response?.data?.error}`, "error");
    }
  };

  return (
    <div>
      {!user && loginForm()}

      {user && (
        <div>
          <h2>blogs</h2>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <form onSubmit={addBlog}>
            <div>
              <h2>create new</h2>
              <label>
                title:{" "}
                <input
                  type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                author:{" "}
                <input
                  type="text"
                  value={author}
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                url:{" "}
                <input
                  type="text"
                  value={url}
                  onChange={({ target }) => setUrl(target.value)}
                />
              </label>
            </div>
            <button type="submit">create</button>
          </form>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
