import { useState, useEffect } from "react";
import Country from "./components/Country";
import weatherService from "./services/weather";
import countryService from "./services/country";

function App() {
  const [value, setValue] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [message, setMessage] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countryService.getAll().then((data) => {
      setAllCountries(data);
    });
  }, []);

  useEffect(() => {
    if (value) {
      const countries = allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      );
      if (countries.length > 10) {
        setCountryList([]);
        setSelectedCountry(null);
        setMessage("Too many matches, specify another filter");
      } else if (countries.length >= 2 && countries.length <= 10) {
        setMessage("");
        setSelectedCountry(null);
        setCountryList(countries);
      } else if (countries.length === 1) {
        setCountryList([]);
        setMessage("");
        setSelectedCountry(countries[0]);
        const [lat, lon] = countries[0].capitalInfo.latlng;
        weatherService
          .getWeather(lat, lon)
          .then((data) => setWeather(data))
          .catch((error) => console.error("error", error));
      } else {
        setMessage("No country found");
        setSelectedCountry(null);
        setCountryList([]);
      }
    } else {
      setMessage("");
      setSelectedCountry(null);
      setCountryList([]);
    }
  }, [value, allCountries]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClick = (id) => {
    const currentCountry = allCountries.find((c) => c.name.common === id);
    setSelectedCountry(currentCountry);
    setCountryList([]);
    setValue(id);
    const [lat, lon] = currentCountry.capitalInfo.latlng;
    weatherService
      .getWeather(lat, lon)
      .then((data) => setWeather(data))
      .catch((error) => console.error("error", error));
  };

  return (
    <>
      <div>
        find countries <input onChange={handleChange} value={value} />
      </div>
      <div>{message}</div>
      {countryList.map((country) => (
        <div key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => handleClick(country.name.common)}>Show</button>
        </div>
      ))}
      <Country selectedCountry={selectedCountry} weather={weather} />
    </>
  );
}

export default App;
