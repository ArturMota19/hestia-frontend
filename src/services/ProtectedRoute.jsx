// Imports
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function ProtectedRoute({
  requiresAuth,
  component: Component,
}) {
  const token = localStorage.getItem("AHtoken");
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateToken = () => {
      const conditions = [
        {
          condition: requiresAuth && !token,
          message: "É necessário estar logado para acessar esta página.",
          redirect: "/login",
          autoClose: 2500,
        },
        {
          condition: !requiresAuth && token,
          message: "Você já está logado. Esta página não está disponível para usuários autenticados.",
          redirect: "/home",
          autoClose: 2500,
        },
      ];
      const unauthorized = conditions.find(({ condition }) => condition);
      if (unauthorized) {
        toast.error(unauthorized.message, {
          position: "top-center",
          autoClose: unauthorized.autoClose,
          id: `${unauthorized.redirect}-unauthorizedAccess`,
        });
        navigate(unauthorized.redirect);
        return;
      }
      setIsAuthorized(true);
    };
    validateToken();
  }, [navigate, requiresAuth, token]);
  return isAuthorized ? <Component /> : null;
}