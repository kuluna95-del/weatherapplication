"use client";

import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import Weather from "./components/Weather";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedCities, setSavedCities] = useState<any[]>([]);

  const makeUrl = (q: string) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;

  // Frontend en prod utilise l'URL Render
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!; 
  // Sur Vercel, créer la variable NEXT_PUBLIC_BACKEND_URL = https://weatherbackend-u64d.onrender.com/api/cities

  const fetchSavedCities = async () => {
    try {
      const res = await fetch(backendUrl);
      if (!res.ok) throw new Error("Failed to fetch saved cities");
      const data = await res.json();
      setSavedCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching saved cities:", err);
      setSavedCities([]);
    }
  };

  useEffect(() => {
    fetchSavedCities();
  }, []);

  const fetchWeather = async (e: any) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    try {
      const response = await axios.get(makeUrl(city));
      setWeather(response.data);
    } catch {
      alert("City not found.");
    } finally {
      setCity("");
      setLoading(false);
    }
  };

  const handleSaveCity = async () => {
    if (!weather?.name) return;

    try {
      const body = { name: weather.name, country: weather.sys?.country || "" };
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save city");

      await fetchSavedCities();
      alert(`${weather.name} saved!`);
    } catch (err) {
      console.error("Error saving city:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete city");
      await fetchSavedCities();
    } catch (err) {
      console.error("Error deleting city:", err);
    }
  };

  const handleLoadSavedWeather = async (name: string) => {
    setLoading(true);
    try {
      const response = await axios.get(makeUrl(name));
      setWeather(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1170&auto=format&fit=crop"
          alt="background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative p-4 text-white z-[2]">
        <h1 className="text-3xl mb-6 text-center font-bold">Weather App</h1>

        <div className="max-w-[500px] w-full m-auto mb-4">
          <form
            onSubmit={fetchWeather}
            className="flex items-center w-full bg-black/20 border border-gray-300 p-3 rounded-2xl"
          >
            <input
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="bg-transparent border-none text-white focus:outline-none text-2xl flex-1"
              type="text"
              placeholder="Search city"
            />
            <button type="submit">
              <BsSearch size={40} />
            </button>
          </form>
        </div>

        {loading && <p className="text-white text-center text-2xl mt-4">Loading...</p>}

        {weather && (
          <>
            <Weather data={weather} />
            <div className="text-center mt-4">
              <button
                onClick={handleSaveCity}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-300"
              >
                Save City
              </button>
            </div>
          </>
        )}

        <div className="max-w-[600px] w-full m-auto mt-10">
          <h2 className="text-xl font-semibold mb-3">Saved Cities</h2>
          {savedCities.length === 0 && <p className="text-gray-300 text-sm">No saved cities yet.</p>}
          <ul className="space-y-2">
            {savedCities.map((c) => (
              <li key={c._id} className="bg-black/30 p-3 rounded flex justify-between items-center">
                <button onClick={() => handleLoadSavedWeather(c.name)} className="text-left">
                  <p className="font-bold">{c.name}</p>
                  {c.country && <p className="text-sm text-gray-300">{c.country}</p>}
                </button>
                <button onClick={() => handleDelete(c._id)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
