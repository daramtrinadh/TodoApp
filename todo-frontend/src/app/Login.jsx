"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError(""); 
    try {
      const response = await fetch("https://todoapp-zpso.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push('/TodoHome');
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Error logging in. Please try again.");
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-5 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-center text-2xl font-semibold mb-6">Login</h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Input
          isClearable
          type="email"
          label="Email"
          variant="bordered"
          placeholder="Enter your email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              aria-label="toggle password visibility"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="mb-4"
        />
        <button
          onClick={handleLogin}
          type="button"
          className="w-full py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;