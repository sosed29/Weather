import React from 'react';

interface WeatherModeSelectorProps {
  mode: 'current' | 'forecast';
  onModeChange: (mode: 'current' | 'forecast') => void;
}

const WeatherModeSelector: React.FC<WeatherModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div>
      <label>
        <input
          type="radio"
          value="current"
          checked={mode === 'current'}
          onChange={() => onModeChange('current')}
        />
        Текущая погода
      </label>
      <label>
        <input
          type="radio"
          value="forecast"
          checked={mode === 'forecast'}
          onChange={() => onModeChange('forecast')}
        />
        Прогноз на 5 дней
      </label>
    </div>
  );
};

export default WeatherModeSelector;
export {};
