import { HashRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import AdminPage from "./pages/Admin/AdminPage"
import DashboardPage from "./pages/Dashboard/DashboardPage"
import CreateFactionPage from "./pages/Factions/CreateFactionPage"
import EditFactionPage from "./pages/Factions/EditFactionPage"
import FactionPage from "./pages/Factions/FactionPage"
import FactionRegistryPage from "./pages/Factions/FactionRegistryPage"
import HomePage from "./pages/Home/HomePage"
import LicenseDirectoryPage from "./pages/Licenses/LicenseDirectoryPage"
import LicensePage from "./pages/Licenses/LicensePage"
import LoginPage from "./pages/Login/LoginPage"
import LoreEntryPage from "./pages/Lore/LoreEntryPage"
import LorePage from "./pages/Lore/LorePage"
import NewsPage from "./pages/News/NewsPage"
import NotFoundPage from "./pages/NotFound/NotFoundPage"
import ScrollToTop from "./components/layout/ScrollToTop"
import OrganizationMigrationPage from "./pages/OrganizationMigration/OrganizationMigrationPage"
import CompanyDirectoryPage from "./pages/Companies/CompanyDirectoryPage"
import CompanyPage from "./pages/Companies/CompanyPage"
import CreateCompanyPage from "./pages/Companies/CreateCompanyPage"
import ManageCompanyPage from "./pages/Companies/ManageCompanyPage"

function App() {
  return (
    <HashRouter>
      <ScrollToTop />

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
              path="/factions/:factionTag/edit"
              element={<EditFactionPage />}
            />

            <Route
              path="/factions/:factionTag"
              element={<FactionRegistryPage />}
            />

            <Route
              path="/licenses"
              element={<LicenseDirectoryPage />}
            />

            <Route
              path="/companies"
              element={<CompanyDirectoryPage />}
            />

            <Route
              path="/licenses/:licenseSlug"
              element={<LicensePage />}
            />

            <Route path="/news" element={<NewsPage />} />

            <Route path="/lore" element={<LorePage />} />

            <Route
              path="/lore/:loreSlug"
              element={<LoreEntryPage />}
            />

            <Route
              path="/companies/:companyTag"
              element={<CompanyPage />}
            />

            <Route
              path="/companies/create"
              element={<CreateCompanyPage />}
            />

            <Route
              path="/companies/:companyTag/manage"
              element={<ManageCompanyPage />}
            />

            <Route path="/admin" element={<AdminPage />} />

            <Route path="*" element={<NotFoundPage />} />

            <Route
              path="/organization-migration"
              element={<OrganizationMigrationPage />}
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </HashRouter>
  )
}

export default App