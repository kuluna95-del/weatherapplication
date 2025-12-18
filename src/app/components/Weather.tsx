import React from "react";

const Weather = ({ data }: any) => {
  return (
    <div className="text-white text-center mt-8">
      <h2 className="text-4xl font-bold">{data.name}</h2>

      <p className="text-xl mt-2">
        {data.weather[0].main} — {data.weather[0].description}
      </p>

      <p className="text-6xl font-bold mt-4">
        {Math.round(data.main.temp)}°F
      </p>

      <div className="mt-6 text-lg">
        <p>Feels like: {Math.round(data.main.feels_like)}°F</p>
        <p>Humidity: {data.main.humidity}%</p>
        <p>Wind: {data.wind.speed} MPH</p>
      </div>
    </div>
  );
};

export default Weather;
