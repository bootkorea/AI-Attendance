import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import AdminPage from "./pages/Admin";

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/admin', element: <AdminPage /> }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
