import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/home', element: <HomePage /> }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
