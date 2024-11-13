import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import logo from './assets/color-picker.png';
import plus from './assets/plus.png';
import remove from './assets/remove.png';
import lock from './assets/lock.png';

function App() {
  // Rastgele renk üretme fonksiyonu
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random()).toFixed(2);  // opacity (alpha)

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

    return { hex, rgba };
  };

  // `createInitialColors` fonksiyonunu `useCallback` ile tanımlıyoruz
  const createInitialColors = useCallback((numColors) => {
    return Array.from({ length: numColors }, () => ({
      ...generateRandomColor(),
      locked: false,
    }));
  }, []);

  const [colors, setColors] = useState(createInitialColors(3));

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const initialColorCount = isMobile ? 5 : 3;
      setColors(createInitialColors(initialColorCount));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [createInitialColors]);

  // Yeni renk ekleme fonksiyonu
  const addColor = (index) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && colors.length >= 5) {
      alert("Mobilde maksimum 5 renk eklenebilir!");
      return;
    }
    if (colors.length >= 10) {
      alert("Maksimum 10 renk eklenebilir!");
      return;
    }

    const newColor = generateRandomColor();
    const updatedColors = [
      ...colors.slice(0, index + 1),
      { ...newColor, locked: false },
      ...colors.slice(index + 1),
    ];
    setColors(updatedColors);
  };

  // Renk silme fonksiyonu
  const removeColor = (index) => {
    if (index === 0 || index === colors.length - 1) {
      return;
    }

    if (colors[index].locked) {
      alert("Bu renk kilitli ve silinemez!");
      return;
    }

    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  // Renk kilitleme fonksiyonu
  const toggleLock = (index) => {
    const updatedColors = colors.map((color, i) => {
      if (i === index) {
        return { ...color, locked: !color.locked };
      }
      return color;
    });
    setColors(updatedColors);
  };

  // Boşluk tuşuyla rastgele renk oluşturma
  const handleKeyPress = useCallback((e) => {
    if (e.key === " ") {
      const updatedColors = colors.map((color) =>
        color.locked ? color : { ...generateRandomColor(), locked: false }
      );
      setColors(updatedColors);
    }
  }, [colors]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Renk paletini güncelleme fonksiyonu
  const updatePalette = () => {
    const updatedColors = colors.map((color) =>
      color.locked ? color : { ...generateRandomColor(), locked: false }
    );
    setColors(updatedColors);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Random Color Generator</h1>
        <img src={logo} className="img" alt="" />
      </div>
      <div className="palette">
        {colors.map((color, index) => (
          <div key={index} className="color-box-container">
            <div
              className="color-box"
              style={{ backgroundColor: color.hex }}
              onClick={() => toggleLock(index)}
            >
              <span className="color-code">{color.hex}</span>
              <span className="color-code-rgba">{color.rgba} </span>
            </div>

            {index !== 0 && index !== colors.length - 1 && (
              <div className="remove-color" onClick={() => removeColor(index)}>
                <img src={remove} alt="Remove Color" className="img" />
              </div>
            )}

            {index < colors.length - 1 && (
              <div className="add-color" onClick={() => addColor(index)}>
                <img src={plus} alt="Add Color" className="img" />
              </div>
            )}

            {color.locked && (
              <div className="lock-icon">
                <img src={lock} alt="Locked Color" className="img" />
              </div>
            )}

            {/* RGBA değeri gösterimi */}
            <span className="color-rgba">{color.rgba}</span>
          </div>
        ))}
        <button className="bottom-btn" onClick={updatePalette}>
          Renk Paletini Güncelle
        </button>
      </div>
    </div>
  );
}

export default App;

