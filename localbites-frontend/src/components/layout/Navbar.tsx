"use client";
import { Menu, MapPin, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import AuthDialog from "../auth/AuthDialog";
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
  const [user, setUser] = useState(null); // Replace with real auth
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
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
        </div>

        {/* Desktop User Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* User Icon */}
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
            <User className="w-4 h-4 text-white" />
          </div>
          
          {/* Location Icon */}
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
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
                <a href="/regions" className="w-full">Regions</a>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                <a href="/register" className="w-full">Register</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

function NavigationLinks({ vertical = false }: { vertical?: boolean }) {
  const className = vertical
    ? "flex flex-col space-y-3 text-gray-300 text-base"
    : "flex space-x-8 text-gray-300 text-sm";

  return (
    <div className={className}>
      <a href="/regions" className="transition-colors hover:text-white flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/5">
        Regions <ChevronDown className="w-3 h-3" />
      </a>
      <a href="/register" className="transition-colors hover:text-white px-3 py-2 rounded-md hover:bg-white/5">
        Register
      </a>
    </div>
  );
}
