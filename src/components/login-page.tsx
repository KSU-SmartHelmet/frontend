import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Lock, Key } from "lucide-react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    code: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.id !== "admin" || formData.password !== "admin123" || formData.code !== "admin") {
      setError("아이디, 비밀번호 또는 코드가 올바르지 않습니다.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: formData.id,
        name: "관리자",
      })
    );
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-emerald-500 p-4">
      <div className="absolute inset-0 bg-black/20"></div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">AICT 스마트 안전모</CardTitle>
            <CardDescription className="text-white/80 mt-2">관리자 시스템에 로그인하세요</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-white/90 font-medium">
                아이디
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  id="id"
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/20"
                  placeholder="아이디를 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/20"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-white/90 font-medium">
                코드
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/20"
                  placeholder="인증 코드를 입력하세요"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              로그인하기
            </Button>

            <div className="text-white/70 text-sm text-center space-y-1">
              <p>테스트 계정 정보</p>
              <p>아이디: admin</p>
              <p>비밀번호: admin123</p>
              <p>코드: admin</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
