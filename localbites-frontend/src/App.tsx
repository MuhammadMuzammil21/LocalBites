import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
