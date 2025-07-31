"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authApi } from "../../api/authApi";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Check Your Email</h3>
          <p className="text-gray-300 text-sm">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            The link will expire in 10 minutes. If you don't see the email, check your spam folder.
          </p>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Forgot Password?</h3>
        <p className="text-gray-300 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
        />
        
        <Button 
          type="submit" 
          className="w-full bg-gray-700 text-white hover:bg-gray-600 border border-gray-600" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <Button
        onClick={onBack}
        variant="ghost"
        className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Login
      </Button>
    </div>
  );
} 