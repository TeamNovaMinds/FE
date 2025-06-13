// src/App.test.js

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter 임포트
import App from './App';

// 테스트 설명을 "회원가입 페이지가 렌더링되는지 확인" 등으로 바꿀 수 있습니다.
test('renders signup page', () => {
  // <App /> 컴포넌트를 <BrowserRouter>로 감싸줍니다.
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // 기존 테스트 내용은 더 이상 유효하지 않으므로,
  // '회원가입'이라는 텍스트가 화면에 있는지 확인하는 것으로 변경합니다.
  const titleElement = screen.getByText(/회원가입/i);
  expect(titleElement).toBeInTheDocument();
});