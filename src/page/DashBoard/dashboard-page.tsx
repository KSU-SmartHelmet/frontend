import { useNavigate } from "react-router";
import Header from "../Header";
import DashBoardMainContent from "./DashBoardMainContent";
import {useEffect, useState} from "react";
import {MapView} from "@/components/map-view.tsx";

export type DeviceStatus = "정상" | "점검필요" | "비상";
export type PowerStatus = "온라인" | "오프라인";
export type WearStatus = "착용" | "미착용";

const env = {
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
};

export interface Device {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
  powerStatus: PowerStatus;
  wearStatus: WearStatus;
  lastUpdate: string;
}

export interface BodyProps {
  device: Device[];
}

export function DashboardPage() {

  const navigate = useNavigate();
  const [userName, setUserName] = useState("로딩 중");
  const [isMapView, setIsMapView] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  const setSSEevents = (eventSource:EventSource, originDevices: Device[]) => {
    eventSource.addEventListener('device-update', (event) => {
      try {
        const data: Device = JSON.parse(event.data);
        setDevices(originDevices.map((device) => {
          return device.id === data.id ? data : device;
        }));
      } catch (error) {
        console.error("Failed to parse SSE 'device-update' event data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error(`SSE connection error:`, error);
      eventSource.close();
    }
  }

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
          setUserName(user.substring(0, user.length - 2).trim());
        }
      });

    const eventSource = new EventSource('http://localhost:8080/subscribe');

    fetch(`${env.SERVER_URL}/dashboard`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        const originDevices: Device[] = data as Device[];
        setDevices(originDevices);
        setSSEevents(eventSource, originDevices);
      })
      .catch(error => {
        console.error("헬멧 데이터를 가져오는 중 오류가 발생했습니다:", error);
      });

    return () => { eventSource.close(); }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} isMapView={isMapView} setIsMapView={setIsMapView} />
      { isMapView ?
        <MapView device={devices} />
        : <DashBoardMainContent device={devices} />
      }
    </div>
  );
}
