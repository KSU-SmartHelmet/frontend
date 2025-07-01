import { useNavigate, useLocation } from "react-router";
import Header from "../Header";
import DashBoardMainContent from "./DashBoardMainContent";

export function DashboardPage() {
  const env = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL,
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isMapView = location.pathname === "/map";

  const handleViewChange = (showMap: boolean) => {
    navigate(showMap ? "/map" : "/dashboard");
  };

  const onLogout = () => {
    fetch(`${env.SERVER_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("accessToken"),
      },
    })
      .then(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showMap={isMapView} setShowMap={handleViewChange} onLogout={onLogout} />
      <DashBoardMainContent />
    </div>
  );
}
