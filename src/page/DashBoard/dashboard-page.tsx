import { useNavigate, useLocation } from "react-router";
import Header from "../Header";
import DashBoardMainContent from "./DashBoardMainContent";

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMapView = location.pathname === "/map";

  const handleViewChange = (showMap: boolean) => {
    navigate(showMap ? "/map" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showMap={isMapView} setShowMap={handleViewChange} />
      <DashBoardMainContent />
    </div>
  );
}
