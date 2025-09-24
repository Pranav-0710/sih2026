import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Droplet, Thermometer } from 'lucide-react';
import Navigation from '../components/Navigation';
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

interface ForecastData {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <Sun className="w-8 h-8" />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud className="w-8 h-8" />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudRain className="w-8 h-8" />;
      case '13d':
      case '13n':
        return <Snowflake className="w-8 h-8" />;
      default:
        return <Cloud className="w-8 h-8" />;
    }
  };

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]);

    try {
      // Fetch current weather
      const currentWeatherResponse = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(currentWeatherResponse.data);

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      // Filter for one entry per day (around noon)
      const dailyForecast = forecastResponse.data.list.filter((item: any, index: number, arr: any[]) => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours();
        // Get one forecast per day, ideally around noon (12-15h)
        return hour >= 12 && hour <= 15 && arr.findIndex((findItem: any) => {
          const findDate = new Date(findItem.dt * 1000);
          return findDate.getDate() === date.getDate() && findDate.getMonth() === date.getMonth();
        }) === index;
      }).slice(0, 5); // Take next 5 days
      setForecast(dailyForecast);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Could not fetch weather data.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, fetch weather for a default city on mount or user's location
    // For now, let's keep it empty and let the user search.
  }, []);

  return (
    <>
    <Navigation />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Weather Dashboard</h1>

      <div className="flex justify-center mb-6 space-x-2">
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="max-w-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              fetchWeather();
            }
          }}
        />
        <Button onClick={fetchWeather}>Get Weather</Button>
      </div>

      {loading && <p className="text-center text-lg">Loading weather data...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {weather && (
        <Card className="mb-8 max-w-md mx-auto bg-blue-100 dark:bg-blue-900">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>{weather.name}</span>
              {getWeatherIcon(weather.weather[0].icon)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{Math.round(weather.main.temp)}°C</p>
            <p className="text-xl mb-1">Feels like: {Math.round(weather.main.feels_like)}°C</p>
            <p className="text-lg capitalize mb-4">{weather.weather[0].description}</p>
            <div className="grid grid-cols-2 gap-2 text-md">
              <p className="flex items-center"><Wind className="mr-2" size={20} /> Wind: {weather.wind.speed} m/s</p>
              <p className="flex items-center"><Droplet className="mr-2" size={20} /> Humidity: {weather.main.humidity}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {forecast.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {forecast.map((day) => (
              <Card key={day.dt} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {getWeatherIcon(day.weather[0].icon)}
                  <p className="text-xl font-bold mt-2">{Math.round(day.main.temp_max)}°C / {Math.round(day.main.temp_min)}°C</p>
                  <p className="text-sm capitalize">{day.weather[0].description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div></>
  );
};

export default Weather;
