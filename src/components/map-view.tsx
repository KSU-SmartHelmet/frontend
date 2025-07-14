import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { type Device, type DeviceStatus, type BodyProps } from "@/page/DashBoard/dashboard-page";
import { mapStyles } from "@/lib/map-styles";

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
    const statusKey = d.status as keyof Filters;
    const powerStatusKey = d.powerStatus as keyof Filters;
    const wearStatusKey = d.wearStatus as keyof Filters;
    return filters[statusKey] && filters[powerStatusKey] && filters[wearStatusKey];
  });

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      if (filteredDevices.length === 0) {
        map.setCenter(center);
        map.setZoom(13);
        return;
      }
      const bounds = new window.google.maps.LatLngBounds();
      filteredDevices.forEach((device) => {
        bounds.extend({ lat: device.lat, lng: device.lng });
      });
      map.fitBounds(bounds);
    },
    [filteredDevices]
  );

  const getMarkerIcon = (status: DeviceStatus) => {
    const isEmergency = status === "비상";
    const color = isEmergency ? "#EF4444" : status === "점검필요" ? "#F59E0B" : "#10B981";

    const pulseSvg = (pulseColor: string, scale: number) => `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle cx="24" cy="24" r="7" fill="${color}" stroke="#FFFFFF" stroke-width="2"></circle>
          <circle cx="24" cy="24" r="8" stroke="${pulseColor}" stroke-width="2">
            <animate attributeName="r" from="8" to="${scale}" dur="1.5s" begin="0s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>`;

    const svg = isEmergency
      ? pulseSvg(color, 20)
      : pulseSvg("rgba(255, 255, 255, 0.5)", 14);

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(48, 48),
      anchor: new window.google.maps.Point(24, 24),
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
              styles: mapStyles,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {filteredDevices.map((device) => (
              <Marker
                key={device.id}
                position={{ lat: device.lat, lng: device.lng }}
                onClick={() => setSelectedDevice(device)}
                icon={getMarkerIcon(device.status)}
                zIndex={device.status === '비상' ? 100 : 1}
              />
            ))}

            {selectedDevice && (
              <InfoWindow
                position={{ lat: selectedDevice.lat, lng: selectedDevice.lng }}
                onCloseClick={() => setSelectedDevice(null)}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -40)
                }}
              >
                <div className="p-3 bg-white rounded-lg shadow-xl min-w-[240px]">
                  <div className="text-base font-bold text-gray-800 mb-3 border-b pb-2">{selectedDevice.name}</div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-gray-500">상태</span>
                      <Badge
                        className={`text-xs font-semibold ${
                          selectedDevice.status === "정상"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedDevice.status === "점검필요"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-500 text-white animate-pulse"
                        }`}
                      >
                        {selectedDevice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-gray-500">전원</span>
                      <span className={`font-semibold ${selectedDevice.powerStatus === "온라인" ? "text-emerald-600" : "text-red-600"}`}>
                        {selectedDevice.powerStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-gray-500">착용</span>
                      <span className="font-semibold">{selectedDevice.wearStatus}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-3 pt-2 border-t">
                    마지막 업데이트: {selectedDevice.lastUpdate}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* 상단 컨트롤 버튼들 */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white shadow-lg hover:bg-gray-50"
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <Filter className="w-4 h-4" />
            필터
          </Button>
        </div>

        {/* 필터 패널 */}
        {showFilterModal && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64 z-20 animate-in fade-in-0 slide-in-from-top-2 duration-300">
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
                      <input
                        type="checkbox"
                        id={`filter-${item.key}`}
                        checked={filters[item.key]}
                        onChange={() => toggleFilter(item.key)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <label htmlFor={`filter-${item.key}`} className="text-xs text-gray-700">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 전원 상태 필터 */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">전원 상태</h4>
                <div className="space-y-2">
                  {[
                    { key: "온라인" as const, label: "온라인" },
                    { key: "오프라인" as const, label: "오프라인" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                       <input
                        type="checkbox"
                        id={`filter-${item.key}`}
                        checked={filters[item.key as keyof Filters]}
                        onChange={() => toggleFilter(item.key as keyof Filters)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`filter-${item.key}`} className="text-xs text-gray-700">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 착용 상태 필터 */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">착용 상태</h4>
                <div className="space-y-2">
                  {[
                    { key: "착용중" as const, label: "착용중" },
                    { key: "미착용" as const, label: "미착용" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                       <input
                        type="checkbox"
                        id={`filter-${item.key}`}
                        checked={filters[item.key as keyof Filters]}
                        onChange={() => toggleFilter(item.key as keyof Filters)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`filter-${item.key}`} className="text-xs text-gray-700">{item.label}</label>
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
