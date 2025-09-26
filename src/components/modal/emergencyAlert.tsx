import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Device, DeviceStatus } from "@/page/DashBoard/dashboard-page.tsx";
import { useCallback, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { mapStyles } from "@/lib/map-styles";
import { Badge } from "@/components/ui/badge.tsx";

interface EmergencyAlertProps {
  isOpen: boolean;
  onClose: () => void;
  helmet: Device[];
  occurrenceAt: string[];
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 37.5665,
  lng: 126.978,
};

export default function EmergencyAlert({
  isOpen,
  onClose,
  helmet,
  occurrenceAt,
}: EmergencyAlertProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script-modal",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      if (helmet.length === 0) {
        map.setCenter(center);
        map.setZoom(13);
        return;
      }

      if (helmet.length === 1) {
        const singleDevice = helmet[0];
        map.setCenter({ lat: singleDevice.lat, lng: singleDevice.lng });
        map.setZoom(15); // Set a fixed, appropriate zoom level
      } else {
        const bounds = new window.google.maps.LatLngBounds();
        helmet.forEach((device) => {
          bounds.extend({ lat: device.lat, lng: device.lng });
        });
        map.fitBounds(bounds);
      }
    },
    [helmet]
  );

  const getMarkerIcon = (status: DeviceStatus) => {
    const color = "#EF4444"; // Always red for emergency

    const svg = `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle cx="24" cy="24" r="7" fill="${color}" stroke="#FFFFFF" stroke-width="2"></circle>
          <circle cx="24" cy="24" r="8" stroke="${color}" stroke-width="2">
            <animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>`;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(48, 48),
      anchor: new window.google.maps.Point(24, 24),
    };
  };

  if (!isOpen) {
    return null;
  }

  const handlePropagation = () => {
    // TODO: Implement situation propagation logic
    console.log(
      `Propagating emergency for helmets: ${helmet.map((h) => h.id).join(", ")}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="absolute w-[1300px] h-[800px] bg-red-500/40 rounded-3xl animate-pulse blur-xl"></div>
      <Card className="w-[1200px] z-10">
        <CardHeader className="pl-8 pr-6 pt-6 pb-4">
          <CardTitle className="text-3xl text-destructive">긴급 상황</CardTitle>
          <CardDescription className="text-base">
            {helmet.length}개의 헬멧에서 긴급 상황이 감지되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] p-0">
          <div className="grid grid-cols-2 h-full">
            <div className="p-6 border-r overflow-y-auto">
              <div className="space-y-4">
                {helmet.map((h, index) => (
                  <div
                    key={h.id}
                    className="rounded-lg p-4 even:bg-muted/40 cursor-pointer hover:bg-muted/80"
                    onClick={() => setSelectedDevice(h)}
                  >
                    <p className="text-xl font-semibold">{h.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-base">
                      <p className="text-muted-foreground">마지막 수신 위치:</p>
                      <p className="font-semibold text-destructive">{h.zone}</p>

                      <p className="text-muted-foreground">마지막 수신 시각:</p>
                      <p className="font-semibold">{h.lastUpdate}</p>

                      <p className="text-muted-foreground">비상 발생 시각:</p>
                      <p className="font-semibold text-destructive">
                        {occurrenceAt[index]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-[500px]">
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
                  {helmet.map((device) => (
                    <Marker
                      key={device.id}
                      position={{ lat: device.lat, lng: device.lng }}
                      onClick={() => setSelectedDevice(device)}
                      icon={getMarkerIcon(device.status)}
                      zIndex={100}
                    />
                  ))}

                  {selectedDevice && (
                    <InfoWindow
                      position={{
                        lat: selectedDevice.lat,
                        lng: selectedDevice.lng,
                      }}
                      onCloseClick={() => setSelectedDevice(null)}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, -40),
                      }}
                    >
                      <div className="p-3 bg-white rounded-lg shadow-xl min-w-[240px]">
                        <div className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                          {selectedDevice.name}
                        </div>
                        <div className="space-y-2 text-base text-gray-700">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-500">상태</span>
                            <Badge
                              className={
                                "bg-red-500 text-white animate-pulse"
                              }
                            >
                              {selectedDevice.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-500">전원</span>
                            <span
                              className={`font-semibold ${
                                selectedDevice.powerStatus === "온라인"
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {selectedDevice.powerStatus}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mt-3 pt-2 border-t">
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
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
          <Button variant="outline" size="lg" onClick={onClose}>
            닫기
          </Button>
          <Button variant="destructive" size="lg" onClick={handlePropagation}>
            상황 전파
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
