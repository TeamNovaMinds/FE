// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import AdditionalInfo from './components/AdditionalInfo/AdditionalInfo'; // 추가 정보 페이지
import './App.css';

function App() {
  return (
    // BrowserRouter는 최상위에서 한 번만 선언합니다.
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* URL 경로에 따라 어떤 컴포넌트를 보여줄지 정의합니다. */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/additional-info" element={<AdditionalInfo />} />

          {/* 사용자가 기본 주소(예: http://localhost:3000/)로 접속했을 때도
              회원가입 페이지를 보여줍니다. */}
          <Route path="/" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;