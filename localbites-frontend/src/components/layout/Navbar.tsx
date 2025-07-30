"use client";
import { Menu, MapPin, User, ChevronDown, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import AuthDialog from "../auth/AuthDialog";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

const cartItems = [
  { id: 1, name: "Burger", price: 5.99 },
  { id: 2, name: "Fries", price: 2.99 },
];

const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          className="text-xl font-bold text-white cursor-pointer hover:text-gray-200 transition-colors"
        >
          Local<span className="text-gray-300">Bites</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavigationLinks />
          
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants..."
              className="w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Desktop User Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 p-0">
                  <Avatar className="h-8 w-8 bg-gray-700 border border-gray-600">
                    <AvatarFallback className="bg-gray-700 text-white text-sm font-medium">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-800 border-gray-700">
                <DropdownMenuLabel className="text-white">
                  {user?.name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/profile" className="w-full">Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/orders" className="w-full">Orders</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/cart" className="w-full">Cart</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/settings" className="w-full">Settings</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-white hover:bg-red-600" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog />
          )}
          
          {/* Location Icon */}
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 p-0">
                  <Avatar className="h-8 w-8 bg-gray-700 border border-gray-600">
                    <AvatarFallback className="bg-gray-700 text-white text-sm font-medium">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-800 border-gray-700">
                <DropdownMenuLabel className="text-white">
                  {user?.name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <button onClick={() => navigate('/search')} className="w-full text-left">Browse All</button>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/regions" className="w-full">Regions</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/profile" className="w-full">Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/orders" className="w-full">Orders</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/cart" className="w-full">Cart</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-white hover:bg-red-600" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-800 border-gray-700">
                <DropdownMenuLabel className="text-white">Menu</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <button onClick={() => navigate('/search')} className="w-full text-left">Browse All</button>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <a href="/regions" className="w-full">Regions</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavigationLinks({ vertical = false }: { vertical?: boolean }) {
  const navigate = useNavigate();
  const className = vertical
    ? "flex flex-col space-y-3 text-gray-300 text-base"
    : "flex space-x-8 text-gray-300 text-sm";

  return (
    <div className={className}>
      <button 
        onClick={() => navigate('/search')}
        className="transition-colors hover:text-white px-3 py-2 rounded-md hover:bg-white/5"
      >
        Browse All
      </button>
      <a href="/regions" className="transition-colors hover:text-white flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/5">
        Regions <ChevronDown className="w-3 h-3" />
      </a>
    </div>
  );
}
