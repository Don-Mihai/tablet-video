import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Buttons from './pages/Buttons/Main';
import VideoPage from './pages/VideoPage/VideoPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Buttons />,
  },
  {
    path: '/video/:videoId',
    element: <VideoPage />,
  },
]);
root.render(<RouterProvider router={router} />);
