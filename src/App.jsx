import './App.css';
import Layout from './components/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Recommended from './pages/Recommended';
import Section from './pages/Section';
import ItemDetails from './pages/ItemDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import { CartProvider } from "./context/CartContext.jsx";
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';



const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Recommended />,
      },
      {
        path: 'browse',
        element: <Section />,
      },
      {
        path: 'section/:sectionId',
        element: <Section />,
      },
      {
        path: 'item/:sectionId/:itemId',
        element: <ItemDetails />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'wishlist',
        element: <Wishlist />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
