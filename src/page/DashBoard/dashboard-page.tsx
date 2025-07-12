import { useNavigate } from "react-router";
import Header from "../Header";
import DashBoardMainContent from "./DashBoardMainContent";
import {useEffect, useState} from "react";
import {MapView} from "@/components/map-view.tsx";

export type DeviceStatus = "정상" | "점검필요" | "비상";
export type PowerStatus = "온라인" | "오프라인";
export type WearStatus = "착용중" | "미착용";

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

const sampleDevices: Device[] = [
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


export function DashboardPage() {
  const env = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL,
  };

  const navigate = useNavigate();
  const [userName, setUserName] = useState("로딩 중");
  const [isMapView, setIsMapView] = useState(false);

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
          setUserName(user.substring(0, user.length - 2));
        }
      })
  }, [navigate, env.SERVER_URL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} isMapView={isMapView} setIsMapView={setIsMapView} />
      { isMapView ?
        <MapView device={sampleDevices} />
        : <DashBoardMainContent device={sampleDevices} />
      }
    </div>
  );
}
