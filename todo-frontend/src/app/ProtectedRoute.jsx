"use client"
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const token = localStorage.getItem('token');

  // If no token, redirect to login page
  if (!token) {
    router.push('/'); 
    return null; 
  }

  return children; 
};

export default ProtectedRoute;