import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import AdminPage from "./pages/Admin/AdminPage"
import DashboardPage from "./pages/Dashboard/DashboardPage"
import CreateFactionPage from "./pages/Factions/CreateFactionPage"
import FactionPage from "./pages/Factions/FactionPage"
import HomePage from "./pages/Home/HomePage"
import LicenseDirectoryPage from "./pages/Licenses/LicenseDirectoryPage"
import LicensePage from "./pages/Licenses/LicensePage"
import LoginPage from "./pages/Login/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#171B1F] text-[#D9D9D9]">
        <Header />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/factions" element={<FactionPage />} />
            <Route
              path="/factions/create"
              element={<CreateFactionPage />}
            />

            <Route
              path="/licenses"
              element={<LicenseDirectoryPage />}
            />

            <Route
              path="/licenses/:licenseSlug"
              element={<LicensePage />}
            />

            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App