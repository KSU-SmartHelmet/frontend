import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Download,
  User,
  Power,
  Wifi,
  HardHat,
  AlertTriangle,
  Map,
} from "lucide-react";
import { MapView } from "./map-view";

export function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(false);

  // 샘플 데이터 (서버가 켜져있을 때 표시될 데이터)
  const sampleDevices = [
    {
      deviceName: "AICT-001",
      powerStatus: "온라인",
      wearStatus: "착용중",
      lastConnection: "2024-01-15 14:30:25",
      lastAccess: "2024-01-15 14:29:45",
      status: "정상",
    },
    {
      deviceName: "AICT-002",
      powerStatus: "오프라인",
      wearStatus: "미착용",
      lastConnection: "2024-01-15 12:15:10",
      lastAccess: "2024-01-15 12:14:30",
      status: "점검필요",
    },
    {
      deviceName: "AICT-003",
      powerStatus: "온라인",
      wearStatus: "착용중",
      lastConnection: "2024-01-15 14:28:15",
      lastAccess: "2024-01-15 14:27:50",
      status: "정상",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "정상":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">정상</Badge>;
      case "점검필요":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">점검필요</Badge>;
      case "비상":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">비상</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPowerStatusIcon = (status: string) => {
    return status === "온라인" ? (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <span className="text-emerald-700">{status}</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-red-700">{status}</span>
      </div>
    );
  };

  const getWearStatusBadge = (status: string) => {
    return status === "착용중" ? (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">착용중</Badge>
    ) : (
      <Badge variant="secondary">미착용</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <p className="text-sm text-gray-500">AICT Smart Safety Helmet</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowMap(!showMap)}>
                <Map className="w-4 h-4" />
                {showMap ? "대시보드" : "지도"}
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">관리자명</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {showMap ? (
        <MapView />
      ) : (
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">총 기기</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Power className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">온라인</p>
                      <p className="text-2xl font-bold text-gray-900">18</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <HardHat className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">착용중</p>
                      <p className="text-2xl font-bold text-gray-900">15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Wifi className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">오프라인</p>
                      <p className="text-2xl font-bold text-gray-900">6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">비상</p>
                      <p className="text-2xl font-bold text-red-600">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Management */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">기기 상태 관리</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      내보내기
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      새로고침
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <div className="flex gap-2">
                      {["전체", "켜짐", "꺼짐", "비상"].map((filter) => (
                        <Button
                          key={filter}
                          variant={activeFilter === filter ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveFilter(filter)}
                          className={
                            activeFilter === filter
                              ? filter === "비상"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                              : filter === "비상"
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : ""
                          }
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="기기명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="font-semibold text-gray-900 py-4">디바이스명</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">전원상태</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">착용상태</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">최근 접속시간</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">마지막 접속시간</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleDevices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">등록된 기기가 없습니다</p>
                                <p className="text-sm text-gray-400">서버 연결을 확인하거나 기기를 등록해주세요</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        sampleDevices.map((device, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 border-b border-gray-100">
                            <TableCell className="font-medium py-4">{device.deviceName}</TableCell>
                            <TableCell className="py-4">{getPowerStatusIcon(device.powerStatus)}</TableCell>
                            <TableCell className="py-4">{getWearStatusBadge(device.wearStatus)}</TableCell>
                            <TableCell className="text-sm text-gray-600 py-4">{device.lastConnection}</TableCell>
                            <TableCell className="text-sm text-gray-600 py-4">{device.lastAccess}</TableCell>
                            <TableCell className="py-4">{getStatusBadge(device.status)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  );
}
