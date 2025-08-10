import {useCallback, useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Download, Filter, HardHat, Power, Search, Shield, Wifi } from "lucide-react";
import DashBoardTable from "./DashBoardTable";
import {type BodyProps, type Device} from "@/page/DashBoard/dashboard-page.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import DateUtils from "@/lib/DateUtils.ts";

export default function DashBoardMainContent({ device }: BodyProps) {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState<Device[]>(device);

  const exportText = useCallback(() => {
    const fileName = `${DateUtils.formattedNow()}.txt`;
    let content = `${fileName}\n\n`;
    device.forEach((d: Device) => {
      content += `${d.name}\n`;
      content += `  위치: ${d.lat}, ${d.lng}\n`;
      content += `  전원: ${d.powerStatus}\n`;
      content += `  착용: ${d.wearStatus}\n`;
      content += `  비상: ${d.status}\n\n`;
    })

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }, [device]);

  const exportExcel = () => {

  }

  const exportPdf = () => {

  }

  useEffect(() => {
    switch (activeFilter) {
      case "전체":
        setFilteredDevices(device.filter(d => {
          return d.name.toLowerCase().includes(searchTerm.toLowerCase());
        }));
        break;
      case "켜짐":
        setFilteredDevices(device.filter(d => {
          return d.powerStatus === "온라인" && d.name.toLowerCase().includes(searchTerm.toLowerCase());
        }));
        break;
      case "꺼짐":
        setFilteredDevices(device.filter(d => {
          return d.powerStatus === "오프라인" && d.name.toLowerCase().includes(searchTerm.toLowerCase());
        }));
        break;
      case "비상":
        setFilteredDevices(device.filter(d => {
          return d.status === "비상" && d.name.toLowerCase().includes(searchTerm.toLowerCase());
        }));
        break;
    }
  }, [activeFilter, searchTerm, device]);

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">총 기기</p>
                  <p className="text-2xl font-bold text-gray-900">{device.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{device.filter(d => {
                    return d.powerStatus === "온라인";
                  }).length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{device.filter(d => {
                    return d.wearStatus === "착용";
                  }).length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{device.filter(d => {
                    return d.powerStatus === "오프라인";
                  }).length}</p>
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
                  <p className="text-2xl font-bold text-red-600">{device.filter(d => {
                    return d.status === "비상";
                  }).length}</p>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      내보내기
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={exportText}>
                      텍스트 파일 (.txt)
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={exportExcel}>
                      엑셀 (.xlsx)
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={exportPdf}>
                      PDF (.pdf)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <DashBoardTable device={filteredDevices} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}