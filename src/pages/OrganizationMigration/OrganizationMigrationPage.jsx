import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import MigrationChoiceList from "./components/MigrationChoiceList"
import MigrationCompanyForm from "./components/MigrationCompanyForm"
import MigrationFactionSelector from "./components/MigrationFactionSelector"
import MigrationSummary from "./components/MigrationSummary"
import useOrganizationMigration from "./hooks/useOrganizationMigration"

function OrganizationMigrationPage() {
  const navigate = useNavigate()

  const [selectedChoice, setSelectedChoice] = useState("")
  const [selectedFactionId, setSelectedFactionId] = useState("")

  const [companyData, setCompanyData] = useState({
    name: "",
    shortName: "",
  })

  const {
    faction,
    migrationRecord,
    availableFactions,
    isLoading,
    isSubmitting,
    errorMessage,
    submitError,
    submitMigration,
    clearSubmitError,
  } = useOrganizationMigration()

  const targetFaction =
    availableFactions.find(
      (item) => item.id === selectedFactionId
    ) ?? null

  async function handleSubmitMigration() {
    if (selectedChoice === "faction_and_separate_company") {
        if (!companyData.name.trim()) {
        await submitMigration({
            migrationType: selectedChoice,
            companyData,
            selectedFactionId,
        })
        return
        }

        if (companyData.shortName.trim().length < 2) {
        await submitMigration({
            migrationType: selectedChoice,
            companyData,
            selectedFactionId,
        })
        return
        }
    }

    if (
        selectedChoice === "company_under_faction" &&
        !selectedFactionId
    ) {
        await submitMigration({
        migrationType: selectedChoice,
        companyData,
        selectedFactionId,
        })
        return
    }

    const confirmed = window.confirm(
        "Confirm this organization migration? This selection will be recorded and cannot be submitted again."
    )

    if (!confirmed) {
        return
    }

    await submitMigration({
        migrationType: selectedChoice,
        companyData,
        selectedFactionId,
    })
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-5xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Organization Migration
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
            V3 Corporate Structure
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Organization Migration
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#737373]">
            Define how your existing organization will be represented under
            the new Company and Faction structure.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
            {errorMessage}
          </div>
        )}

        {!faction ? (
          <Card
            title="No Organization Available"
            subtitle="Faction ownership required"
          >
            <p className="leading-7 text-[#737373]">
              You do not currently own an organization that requires migration.
            </p>

            <Button
              className="mt-6"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </Card>
        ) : migrationRecord ? (
          <Card
            title="Migration Already Recorded"
            subtitle={faction.name}
          >
            <p className="leading-7 text-[#737373]">
              This organization has already completed or recorded its V3
              structure selection.
            </p>

            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#99692E]">
              Status: {migrationRecord.status}
            </p>

            <Button
              className="mt-6"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card
              title={faction.name}
              subtitle={`Current Faction ${faction.short_name}`}
            >
              <p className="leading-7 text-[#737373]">
                This organization is eligible for V3 migration.
              </p>

              <p className="mt-4 leading-7 text-[#737373]">
                Your existing faction will remain intact while you define how
                its Company identity should be represented.
              </p>
            </Card>

            <Card>
              <MigrationChoiceList
                selectedChoice={selectedChoice}
                onSelectChoice={(choice) => {
                    setSelectedChoice(choice)
                    clearSubmitError()
                }}
              />
            </Card>

            {selectedChoice &&
              selectedChoice !== "faction_only" && (
                <Card>
                  <MigrationCompanyForm
                    migrationType={selectedChoice}
                    faction={faction}
                    companyData={companyData}
                    onChange={(values) => {
                        setCompanyData(values)
                        clearSubmitError()
                    }}
                  />
                </Card>
              )}

            {selectedChoice === "company_under_faction" && (
              <Card>
                <MigrationFactionSelector
                  factions={availableFactions}
                  selectedFactionId={selectedFactionId}
                  onSelectFaction={(factionId) => {
                    setSelectedFactionId(factionId)
                    clearSubmitError()
                  }}
                />
              </Card>
            )}

            {selectedChoice && (
              <Card>
                <MigrationSummary
                  migrationType={selectedChoice}
                  faction={faction}
                  companyData={companyData}
                  targetFaction={targetFaction}
                />
              </Card>
            )}

            {selectedChoice && (
              <Card>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#99692E]">
                      Confirm Migration
                    </p>

                    <p className="mt-2 max-w-2xl leading-7 text-[#737373]">
                      Review the information above carefully before recording
                      your V3 organization structure.
                    </p>
                  </div>

                  <Button
                    disabled={isSubmitting}
                    onClick={handleSubmitMigration}
                  >
                    {isSubmitting
                      ? "Migrating..."
                      : "Confirm Migration"}
                  </Button>
                </div>

                {submitError && (
                  <div className="mt-5 border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
                    {submitError}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default OrganizationMigrationPage