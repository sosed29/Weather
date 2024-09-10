import React, { useEffect, useState } from 'react';


interface WeatherDisplayProps {
  city: string;
  mode: 'current' | 'forecast';
  API_Key?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ city, mode }) => {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          mode === 'current'
            ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4d334c05dd91969bd9ee9498bfefe4c1&units=metric&lang=ru`
            : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=4d334c05dd91969bd9ee9498bfefe4c1&units=metric&lang=ru`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Не удалось получить данные о погоде');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Не удалось получить данные о погоде.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, mode]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (mode === 'current' && weather) {
    const { main, weather: weatherDetails, wind, sys, name } = weather;
    if (!main || !weatherDetails || !wind || !sys || !name) {
      return <p>Данные о погоде временно недоступны.</p>;
    }
    const iconUrl = `https://openweathermap.org/img/wn/${weatherDetails[0].icon}@2x.png`;

    return (
      <div className="weather-display">
        <h2>{name}</h2>
        <img src={iconUrl} alt={weatherDetails[0].description} />
        <p>Температура: {main.temp} °C</p>
        <p>Погода: {weatherDetails[0].description}</p>
        <p>Давление: {main.pressure} hPa</p>
        <p>Влажность: {main.humidity}%</p>
        <p>Скорость ветра: {wind.speed} м/с</p>
        <p>Восход солнца: {formatTime(sys.sunrise)}</p>
        <p>Закат солнца: {formatTime(sys.sunset)}</p>
      </div>
    );
  }

  if (mode === 'forecast' && weather) {
    const { list, city: cityInfo } = weather;
    if (!list || !cityInfo) {
      return <p>Данные о прогнозе временно недоступны.</p>;
    }
    return (
      <div className="weather-display">
        <h2>Прогноз на 5 дней для {cityInfo.name}</h2>
        {list.slice(0, 5).map((item: any, index: number) => {
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

          return (
            <div key={index}>
              <p>Дата: {item.dt_txt}</p>
              <img src={iconUrl} alt={item.weather[0].description} />
              <p>Температура: {item.main.temp} °C</p>
              <p>Погода: {item.weather[0].description}</p>
              <p>Давление: {item.main.pressure} hPa</p>
              <p>Влажность: {item.main.humidity}%</p>
              <p>Скорость ветра: {item.wind.speed} м/с</p>
            </div>
          );
        })}
      </div>
    );
  }

  return <p>Данные не найдены.</p>;
};

export default WeatherDisplay;
