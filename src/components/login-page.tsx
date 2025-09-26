import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export function LoginPage() {
  const env = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL,
  };

  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.id) {
      setError("아이디를 입력해 주세요.");
      return;
    }
    if (!formData.password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }

    fetch(`${env.SERVER_URL}/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userId": formData.id,
        "password": formData.password,
      }),
    })
        .then(res => {
          if (res.status !== 200)
            throw new Error(res.statusText);
          return res.text();
        })
        .then(res => {
          localStorage.setItem("accessToken", "Bearer " + res.trim());
          navigate("/dashboard");
        })
        .catch(err => {
          setError("아이디 혹은 비밀번호가 올바르지 않습니다.");
          console.error(err);
        })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">HelLoRa 스마트 안전모</CardTitle>
            <CardDescription className="text-gray-600 mt-2">관리자 시스템에 로그인하세요</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-gray-700 font-medium">
                아이디
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="id"
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  className="pl-10"
                  placeholder="아이디를 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
              onClick={handleLogin}
            >
              로그인하기
            </Button>
            <div className="text-center">
              <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-700">
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
