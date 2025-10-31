import axios from "axios";

const baseUrl = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
    import.meta.env.VITE_API_KEY
  }`;

const getWeather = (lat, lon) => {
  return axios.get(baseUrl(lat, lon)).then((response) => response.data);
};

export default {
  getWeather,
};
