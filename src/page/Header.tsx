import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronDown, HardHat, LogOut, Map, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMapView = location.pathname === "/map";

  const handleViewChange = () => {
    if (isMapView) {
      navigate("/dashboard");
    } else {
      navigate("/map");
    }
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
                <Link to="/">
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
                    <span className="text-sm font-medium text-gray-700">관리자명</span>
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
