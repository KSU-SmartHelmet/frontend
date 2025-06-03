import { HardHat, Map, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showMap: boolean;
  onViewChange: () => void;
}

export default function Header({ showMap, onViewChange }: HeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">스마트 안전모 관리시스템</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={onViewChange}>
                <Map className="w-4 h-4" />
                {showMap ? "테이블 보기" : "지도 보기"}
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">관리자명</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
