import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronDown, HardHat, LogOut, Map, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userName: string;
  isMapView: boolean;
  setIsMapView: (isMapView: boolean) => void;
}

export default function Header({ userName, isMapView, setIsMapView }: HeaderProps) {
  const navigate = useNavigate();

  const onLogout = () => {
    const env = {
      SERVER_URL: import.meta.env.VITE_SERVER_URL,
    };

    fetch(`${env.SERVER_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("accessToken") || '',
      },
    })
      .then(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }

  const handleViewChange = () => {
    setIsMapView(!isMapView);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <Link to="/dashboard">
                  <h1 className="text-xl font-bold text-gray-900">스마트 안전모 관리시스템</h1>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleViewChange}>
                <Map className="w-4 h-4" />
                {isMapView ? "대시보드" : "지도"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
