import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, Zap, AlertTriangle, HardHat, Wifi, Filter } from "lucide-react";
import { useState } from "react";

// 샘플 기기 위치 데이터
const deviceLocations = [
  {
    id: "AICT-001",
    name: "AICT-001",
    lat: 37.5665,
    lng: 126.978,
    status: "정상",
    powerStatus: "온라인",
    wearStatus: "착용중",
    lastUpdate: "2024-01-15 14:30:25",
  },
  {
    id: "AICT-002",
    name: "AICT-002",
    lat: 37.5651,
    lng: 126.9895,
    status: "점검필요",
    powerStatus: "오프라인",
    wearStatus: "미착용",
    lastUpdate: "2024-01-15 12:15:10",
  },
  {
    id: "AICT-003",
    name: "AICT-003",
    lat: 37.5707,
    lng: 126.9772,
    status: "정상",
    powerStatus: "온라인",
    wearStatus: "착용중",
    lastUpdate: "2024-01-15 14:28:15",
  },
  {
    id: "AICT-004",
    name: "AICT-004",
    lat: 37.5689,
    lng: 126.9831,
    status: "비상",
    powerStatus: "온라인",
    wearStatus: "착용중",
    lastUpdate: "2024-01-15 14:35:12",
  },
];

export function MapView() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    정상: true,
    점검필요: true,
    비상: true,
    온라인: true,
    오프라인: true,
    착용중: true,
    미착용: true,
  });

  const toggleFilter = (filterKey: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const filteredDevices = deviceLocations.filter((device) => {
    return filters[device.status] && filters[device.powerStatus] && filters[device.wearStatus];
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "정상":
        return "bg-emerald-500";
      case "점검필요":
        return "bg-amber-500";
      case "비상":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "정상":
        return <HardHat className="w-4 h-4" />;
      case "점검필요":
        return <Zap className="w-4 h-4" />;
      case "비상":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-81px)] bg-gradient-to-br from-blue-50 to-emerald-50 overflow-hidden">
      {/* 지도 배경 (실제 지도 API 대신 시각적 표현) */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-100"></div>
        {/* 격자 패턴으로 지도 느낌 연출 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* 상단 컨트롤 버튼들 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white shadow-lg"
          onClick={() => setShowFilterModal(true)}
        >
          <Filter className="w-4 h-4" />
          필터
        </Button>
      </div>

      {/* 기기 마커들 */}
      {filteredDevices.map((device, index) => (
        <div
          key={device.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
          style={{
            left: `${20 + index * 20}%`,
            top: `${30 + index * 15}%`,
          }}
        >
          {/* 마커 */}
          <div
            className={`w-8 h-8 ${getStatusColor(
              device.status
            )} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
          >
            {getStatusIcon(device.status)}
          </div>

          {/* 펄스 효과 (비상 상태일 때) */}
          {device.status === "비상" && (
            <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-75"></div>
          )}

          {/* 호버 시 정보 카드 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white rounded-lg shadow-lg p-3 min-w-48 border">
              <div className="text-sm font-semibold text-gray-900 mb-1">{device.name}</div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>상태:</span>
                  <Badge
                    className={`text-xs ${
                      device.status === "정상"
                        ? "bg-emerald-100 text-emerald-800"
                        : device.status === "점검필요"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {device.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>전원:</span>
                  <span className={device.powerStatus === "온라인" ? "text-emerald-600" : "text-red-600"}>
                    {device.powerStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>착용:</span>
                  <span>{device.wearStatus}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">{device.lastUpdate}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">상태 범례</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-gray-600">정상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-gray-600">점검필요</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">비상</span>
          </div>
        </div>
      </div>

      {/* 줌 컨트롤 */}
      <div className="absolute top-20 right-4 flex flex-col gap-1 z-10">
        <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white shadow-lg">
          +
        </Button>
        <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white shadow-lg">
          -
        </Button>
      </div>

      {/* 필터 패널 (지도 내부에 표시) */}
      {showFilterModal && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64 z-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-900">마커 필터링</h3>
            <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* 상태 필터 */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">기기 상태</h4>
              <div className="space-y-2">
                {[
                  { key: "정상", label: "정상", color: "bg-emerald-500" },
                  { key: "점검필요", label: "점검필요", color: "bg-amber-500" },
                  { key: "비상", label: "비상", color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFilter(item.key)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        filters[item.key] ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}
                    >
                      {filters[item.key] && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 전원 상태 필터 */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">전원 상태</h4>
              <div className="space-y-2">
                {[
                  { key: "온라인", label: "온라인", color: "bg-emerald-500" },
                  { key: "오프라인", label: "오프라인", color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFilter(item.key)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        filters[item.key] ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}
                    >
                      {filters[item.key] && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 착용 상태 필터 */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">착용 상태</h4>
              <div className="space-y-2">
                {[
                  { key: "착용중", label: "착용중", color: "bg-blue-500" },
                  { key: "미착용", label: "미착용", color: "bg-gray-400" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFilter(item.key)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        filters[item.key] ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}
                    >
                      {filters[item.key] && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
