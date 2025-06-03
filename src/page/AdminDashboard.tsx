import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardPage } from "@/components/dashboard-page";
import { LoginPage } from "@/components/login-page";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<"login" | "dashboard">("login");

  if (currentPage === "login") {
    return (
      <div>
        <LoginPage />
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setCurrentPage("dashboard")}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
          >
            대시보드 미리보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardPage />
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setCurrentPage("login")} variant="outline">
          로그인 페이지로
        </Button>
      </div>
    </div>
  );
}
