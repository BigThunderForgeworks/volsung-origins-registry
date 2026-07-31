import { BrowserRouter, Route, Routes } from "react-router-dom"

import Header from "./components/layout/Header"
import AdminPage from "./pages/Admin/AdminPage"
import DashboardPage from "./pages/Dashboard/DashboardPage"
import FactionPage from "./pages/Factions/FactionPage"
import HomePage from "./pages/Home/HomePage"
import LoginPage from "./pages/Login/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-[#171B1F] text-[#D9D9D9]">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/factions" element={<FactionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App