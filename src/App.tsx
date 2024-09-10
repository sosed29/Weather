
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import WeatherModeSelector from './WeatherModeSelector';
import './App.css';

const API_KEY = '4d334c05dd91969bd9ee9498bfefe4c1';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [mode, setMode] = useState<'current' | 'forecast'>('current');
  const [warning, setWarning] = useState<string | null>(null);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setWarning('Ваш браузер не поддерживает геолокацию.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCityFromCoords(latitude, longitude);
      },
      () => {
        setWarning('Не удалось получить доступ к геолокации. Пожалуйста, введите город вручную.');
      }
    );
  };

  const fetchCityFromCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
      );
      if (!response.ok) {
        throw new Error('Не удалось определить город по координатам.');
      }
      const data = await response.json();
      setCity(data.name);
      setWarning(null);
    } catch (error) {
      setWarning('Не удалось определить город по координатам.');
    }
  };

  return (
    <div className="App">
      <h1>Прогноз погоды</h1>
      <SearchBar onSearch={setCity} />
      <button onClick={handleLocation}>Текущее местоположение</button>
      {warning && <p className="warning">{warning}</p>}
      <WeatherModeSelector mode={mode} onModeChange={setMode} />
      {city && <WeatherDisplay city={city} mode={mode} API_Key={API_KEY} />}
    </div>
  );
};

export default App;
