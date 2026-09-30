import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Homepage from './pages/Homepage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage/>
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)
