import React, { useEffect, useState } from "react";
import { supabase } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        navigate("/Login");
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (isCheckingAuth) return null; // or a loading spinner

  return children;
}