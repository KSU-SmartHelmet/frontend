import { useNavigate } from "react-router";
import Header from "../Header";
import DashBoardMainContent from "./DashBoardMainContent";
import {useEffect, useState} from "react";
import {MapView} from "@/components/map-view.tsx";

export function DashboardPage() {
  const env = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL,
  };

  const navigate = useNavigate();
  const [userName, setUserName] = useState("로딩 중");
  const [isMapView, setIsMapView] = useState(false);

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
          return '';
        }
        return res.text();
      })
      .then(res => {
        if (res) {
          const user = res.split(' ')[1]
          setUserName(user.substring(0, user.length - 2));
        }
      })
  }, [navigate, env.SERVER_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} isMapView={isMapView} setIsMapView={setIsMapView} />
      { isMapView ?
        <MapView />
        : <DashBoardMainContent />
      }
    </div>
  );
}
