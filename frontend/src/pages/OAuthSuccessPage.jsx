// src/pages/OAuthSuccessPage.jsx
import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function OAuthSuccessPage() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      localStorage.setItem("token", token); // optional persistence
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login");
    }
  }, [location.search, navigate, setToken]);

  return <p>Logging you in...</p>;
}
