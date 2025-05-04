import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import VideoPage from './pages/VideoPage/VideoPage';
import Main from './pages/Main/Main';
import Preview from './pages/Preview/Preview';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Preview />,
  },
  {
    path: '/main',
    element: <Main />,
  },
]);
root.render(<RouterProvider router={router} />);
