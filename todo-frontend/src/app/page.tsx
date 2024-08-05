"use client";
import React, { useState, useEffect } from "react";
import Login from './Login';
import SignUp from './SignUp';
import TodoHome from "./TodoHome/page";

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token); 
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      {isLoggedIn ? <TodoHome/> : (
        <div>
          <Login />
          <SignUp />
        </div>
      )}
    </div>
  );
};

export default Page;