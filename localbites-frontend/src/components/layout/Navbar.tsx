"use client";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { NavigationMenuLink } from "../ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import AuthDialog from "../auth/AuthDialog";
import { cn } from "../../lib/utils";
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

  return (
    <nav className="w-full border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-primary">LocalBites</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationLinks />
        </div>

        {/* Desktop Cart Dropdown */}
        <div className="relative hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
                         <Button
               variant="ghost"
               size="icon"
               className="relative hover:bg-accent transition-all duration-200 ease-in-out hover:scale-105"
             >
              <ShoppingCart className="w-5 h-5" />
                              <Badge
                  className="absolute -top-1 -right-1 h-4 w-4 text-[10px] p-0 animate-in fade-in duration-200"
                  variant="secondary"
                >
                  {cartItems.length}
                </Badge>
            </Button>
          </DropdownMenuTrigger>
                     <DropdownMenuContent
             align="end"
             className="w-64 animate-in fade-in slide-in-from-top-2 duration-200"
           >
            <DropdownMenuLabel>Cart Items</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cartItems.map((item) => (
              <DropdownMenuItem key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = "/cart")}
              className="flex justify-between font-bold text-primary cursor-pointer hover:bg-muted"
            >
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        </div>

        {/* Auth or Avatar */}
        <div className="hidden md:block">
          {user ? (
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ) : (
            <AuthDialog />
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-6">
                <h2 className="text-lg font-semibold text-primary">Menu</h2>
                <NavigationLinks vertical />
                <Separator />

                {/* Mobile Cart Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart ({cartItems.length})
                    </Button>
                  </DropdownMenuTrigger>
                                     <DropdownMenuContent className="w-64 animate-in fade-in slide-in-from-top-2 duration-200">
                    <DropdownMenuLabel>Cart Items</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {cartItems.map((item) => (
                      <DropdownMenuItem key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => (window.location.href = "/cart")}
                      className="flex justify-between font-bold text-primary cursor-pointer hover:bg-muted"
                    >
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>


                <Separator />
                {user ? (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ) : (
                  <AuthDialog />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function NavigationLinks({ vertical = false }: { vertical?: boolean }) {
  const className = vertical
    ? "flex flex-col space-y-3 text-muted-foreground text-base"
    : "flex space-x-6 text-muted-foreground text-sm";

  return (
    <div className={className}>
      <NavLink href="/" text="Home" />
      <NavLink href="/menu" text="Menu" />
      <NavLink href="/orders" text="Orders" />
    </div>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <NavigationMenuLink
      href={href}
      className={cn("transition-colors hover:text-primary")}
    >
      {text}
    </NavigationMenuLink>
  );
}
