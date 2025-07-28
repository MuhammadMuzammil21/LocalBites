"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../../lib/utils";
import AuthDialog from "../auth/AuthDailog";
import { useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null); // Replace with auth context later

  return (
    <nav className="w-full border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Logo */}
        <div className="text-xl font-bold text-primary">LocalBites</div>

        {/* Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className={linkClass()}>
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/menu" className={linkClass()}>
                Menu
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/orders" className={linkClass()}>
                Orders
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side: Auth or Avatar */}
        {user ? (
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ) : (
          <AuthDialog />
        )}
      </div>
    </nav>
  );
}

function linkClass() {
  return cn(
    "text-sm font-medium transition-colors hover:text-primary/80",
    "text-muted-foreground"
  );
}
