// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import AdditionalInfoPart1 from './components/AdditionalInfoPart1/AdditionalInfoPart1'; // 추가 정보 페이지
import AdditionalInfoPart2 from './components/AdditionalInfoPart2/AdditionalInfoPart2';
import './App.css';

function App() {
  return (
    // BrowserRouter는 최상위에서 한 번만 선언합니다.
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/additional-info-part1" element={<AdditionalInfoPart1 />} />
          <Route path="/additional-info-part2" element={<AdditionalInfoPart2 />} />
          <Route path="/" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;