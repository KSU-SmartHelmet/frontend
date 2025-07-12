import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield } from "lucide-react";
import { type BodyProps } from "@/page/DashBoard/dashboard-page.tsx";

export default function DashBoardTable({ device }: BodyProps) {
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
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900 py-4">디바이스명</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">전원상태</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">착용상태</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">마지막 접속시간</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {device.length === 0 ? (
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
              device.map((d, index) => (
                <TableRow key={index} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="font-medium py-4">{d.name}</TableCell>
                  <TableCell className="py-4">{getPowerStatusIcon(d.powerStatus)}</TableCell>
                  <TableCell className="py-4">{getWearStatusBadge(d.wearStatus)}</TableCell>
                  <TableCell className="text-sm text-gray-600 py-4">{d.lastUpdate}</TableCell>
                  <TableCell className="py-4">{getStatusBadge(d.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
