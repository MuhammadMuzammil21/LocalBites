import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutPage from "./pages/CheckoutPage";
import Explore from './pages/Explore';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu/:restaurantId" element={<Menu />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
