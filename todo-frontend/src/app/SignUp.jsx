"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";

const SignUp = () => {
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignUp = async () => {
    setError(""); 
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/TodoHome');
      } else {
        setError(data.error || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-5 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-center text-2xl font-semibold mb-6">Sign Up</h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Input
          type="text"
          label="Username"
          variant="bordered"
          placeholder="Enter your username"
          value={signupUsername}
          onChange={(e) => setSignupUsername(e.target.value)}
          className="mb-4"
        />
        <Input
          type="email"
          label="Email"
          variant="bordered"
          placeholder="Enter your email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
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
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          className="mb-4"
        />
        <button
          onClick={handleSignUp}
          type="button"
          className="w-full py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;