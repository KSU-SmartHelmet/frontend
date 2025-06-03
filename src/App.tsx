import { BrowserRouter, Routes, Route } from "react-router";
import { LoginPage } from "./components/login-page";
import { DashboardPage } from "./page/DashBoard/dashboard-page";
import { MapView } from "./components/map-view";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
