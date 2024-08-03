"use client"
import React, { useState, useEffect } from "react";
import Login from './Login';
import SignUp from './SignUp';
import TodoHome from "./TodoHome/page";

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, []);

  return (
    <div>
      {isLoggedIn ? <TodoHome/> : (
        <>
          <Login />
          <SignUp />
        </>
      )}
    </div>
  );
};

export default Page;