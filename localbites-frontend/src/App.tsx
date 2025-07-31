import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { AuthDialogProvider } from './context/AuthDialogContext';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import Map from './pages/Map';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './components/auth/ResetPassword';
import AuthDialog from './components/auth/AuthDialog';

function App() {
  return (
    <AuthProvider>
      <AuthDialogProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/menu/:restaurantId" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Home />} />
            <Route path="/orders" element={<Cart />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
          <AuthDialog />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthDialogProvider>
    </AuthProvider>
  );
}

export default App;
