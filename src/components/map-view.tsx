import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { type Device, type DeviceStatus, type BodyProps } from "@/page/DashBoard/dashboard-page";

interface Filters {
  정상: boolean;
  점검필요: boolean;
  비상: boolean;
  온라인: boolean;
  오프라인: boolean;
  착용중: boolean;
  미착용: boolean;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 37.5665,
  lng: 126.978,
};

export function MapView({device}: BodyProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [filters, setFilters] = useState<Filters>({
    정상: true,
    점검필요: true,
    비상: true,
    온라인: true,
    오프라인: true,
    착용중: true,
    미착용: true,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const toggleFilter = (filterKey: keyof Filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const filteredDevices = device.filter((d) => {
    return filters[d.status] && filters[d.powerStatus] && filters[d.wearStatus];
  });

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredDevices.forEach((device) => {
        bounds.extend({ lat: device.lat, lng: device.lng });
      });
      map.fitBounds(bounds);
    },
    [filteredDevices]
  );

  const getMarkerIcon = (status: DeviceStatus) => {
    const color = status === "정상" ? "#10B981" : status === "점검필요" ? "#F59E0B" : "#EF4444";
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2,
    };
  };

  return (
    <>
      <div className="relative w-full h-[calc(100vh-81px)] overflow-hidden">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
            options={{
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
          >
            {filteredDevices.map((device) => (
              <Marker
                key={device.id}
                position={{ lat: device.lat, lng: device.lng }}
                onClick={() => setSelectedDevice(device)}
                icon={getMarkerIcon(device.status)}
              />
            ))}

            {selectedDevice && (
              <InfoWindow
                position={{ lat: selectedDevice.lat, lng: selectedDevice.lng }}
                onCloseClick={() => setSelectedDevice(null)}
              >
                <div className="p-2 min-w-48">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{selectedDevice.name}</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>상태:</span>
                      <Badge
                        className={`text-xs ${
                          selectedDevice.status === "정상"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedDevice.status === "점검필요"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedDevice.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>전원:</span>
                      <span className={selectedDevice.powerStatus === "온라인" ? "text-emerald-600" : "text-red-600"}>
                        {selectedDevice.powerStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>착용:</span>
                      <span>{selectedDevice.wearStatus}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{selectedDevice.lastUpdate}</div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

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

        {/* 필터 패널 */}
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
                    { key: "정상" as const, label: "정상", color: "bg-emerald-500" },
                    { key: "점검필요" as const, label: "점검필요", color: "bg-amber-500" },
                    { key: "비상" as const, label: "비상", color: "bg-red-500" },
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
                    { key: "온라인" as const, label: "온라인", color: "bg-emerald-500" },
                    { key: "오프라인" as const, label: "오프라인", color: "bg-red-500" },
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
                    { key: "착용중" as const, label: "착용중", color: "bg-blue-500" },
                    { key: "미착용" as const, label: "미착용", color: "bg-gray-400" },
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
    </>
  );
}
