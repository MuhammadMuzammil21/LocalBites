"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// @ts-ignore
import API from "../../api/axios.js";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useAuthDialog } from "../../context/AuthDialogContext";
import ForgotPassword from "./ForgotPassword";

export default function AuthDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { isOpen, closeAuthDialog } = useAuthDialog();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      toast.success("Registered successfully!");
      console.log(res.data);
      // Auto-login after successful registration
      const { token, name: userName, email: userEmail, role, _id } = res.data;
      login({ _id, name: userName, email: userEmail, role }, token);
      closeAuthDialog();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, name: userName, email: userEmail, role, _id } = res.data;

      login({ _id, name: userName, email: userEmail, role }, token);
      toast.success(`Welcome back, ${userName}!`);
      closeAuthDialog();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Reset form and go back to login tab
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Welcome to LocalBites</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 bg-gray-800 border border-gray-700">
            <TabsTrigger value="login" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Register</TabsTrigger>
            <TabsTrigger value="forgot" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Forgot</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4 mt-4">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
              />
              <Button type="submit" className="w-full bg-gray-700 text-white hover:bg-gray-600 border border-gray-600" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4 mt-4">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
              />
              <Button type="submit" className="w-full bg-gray-700 text-white hover:bg-gray-600 border border-gray-600" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="forgot">
            <ForgotPassword onBack={handleBackToLogin} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
