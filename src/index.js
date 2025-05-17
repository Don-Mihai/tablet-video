import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main/Main';

// 1. Глобально отключаем контекстное меню (правый клик и долгий тап)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
]);
root.render(<RouterProvider router={router} />);
