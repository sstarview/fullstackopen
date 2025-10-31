const Country = ({ selectedCountry, weather }) => {
  if (!selectedCountry || !weather) {
    return null;
  }

  return (
    <>
      <h1>{selectedCountry.name.common}</h1>
      <div>Capital {selectedCountry.capital?.[0]}</div>
      <div>Area {selectedCountry?.area}</div>
      <h1>Languages</h1>
      <ul>
        {Object.values(selectedCountry.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={selectedCountry.flags.png} alt={selectedCountry.flags.alt} />
      <h1>Weather in {selectedCountry?.capital?.[0]}</h1>
      <div>Temperature {(weather.main.temp - 273.15).toFixed(2)}&deg;C</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`}
      />
      <div>Wind {weather.wind.speed} m/s</div>
    </>
  );
};

export default Country;
