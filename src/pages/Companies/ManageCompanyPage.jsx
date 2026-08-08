import { useParams } from "react-router-dom"
import Card from "../../components/ui/Card"
import CompanyProfileEditor from "./components/CompanyProfileEditor"
import CompanyRecruitingControl from "./components/CompanyRecruitingControl"
import CompanyLicenseManager from "./components/CompanyLicenseManager"
import CompanyAffiliationManager from "./components/CompanyAffiliationManager"
import useManageCompany from "./hooks/useManageCompany"
import CompanyPersonnelManager from "./components/CompanyPersonnelManager"

function ManageCompanyPage() {
  const { companyTag } = useParams()

  const {
    company,
    licenseTypes,
    companyLicenses,
    affiliationRequests,
    isLoading,
    isSaving,
    errorMessage,
    saveError,
    updateCompanyProfile,
    updateRecruiting,
    clearSaveError,
    reload,
  } = useManageCompany(companyTag)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Company Management
            </p>
          </Card>
        </div>
      </main>
    )
  }

  if (errorMessage || !company) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card
            title="Company Management Unavailable"
            subtitle="Access denied or registry record unavailable"
          >
            <p className="leading-7 text-red-400">
              {errorMessage || "Company record unavailable."}
            </p>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 border-b border-[#384A59] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Company Administration
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            {company.name}
          </h1>

          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#737373]">
            [{company.short_name}]
          </p>
        </div>

        {saveError && (
          <div className="mb-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {saveError}
          </div>
        )}

        <div className="space-y-8">
          <CompanyProfileEditor
            company={company}
            isSaving={isSaving}
            onSave={updateCompanyProfile}
            onChange={clearSaveError}
          />

          <CompanyRecruitingControl
            company={company}
            isSaving={isSaving}
            onChange={updateRecruiting}
          />

          <CompanyPersonnelManager
            company={company}
          />

          <CompanyLicenseManager
            company={company}
            licenseTypes={licenseTypes}
            companyLicenses={companyLicenses}
            onChanged={reload}
          />

          <CompanyAffiliationManager
            company={company}
            affiliationRequests={affiliationRequests}
            onChanged={reload}
          />
        </div>
      </div>
    </main>
  )
}

export default ManageCompanyPage