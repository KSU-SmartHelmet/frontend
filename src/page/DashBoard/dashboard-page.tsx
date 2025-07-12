import { useNavigate } from "react-router";
import Header from "../Header";
import DashBoardMainContent from "./DashBoardMainContent";
import {useEffect} from "react";

export function DashboardPage() {
  const env = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL,
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${env.SERVER_URL}/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("accessToken") || '',
      },
    })
      .then(res => {
        if (!res.ok) {
          alert("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
          navigate("/login");
          return;
        }
      })
  }, [navigate, env.SERVER_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashBoardMainContent />
    </div>
  );
}
