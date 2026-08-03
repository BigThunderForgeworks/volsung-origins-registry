import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/
const FACTION_TAG_PATTERN = /^[A-Z0-9]{4}$/

function getTodayDate() {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000

  return new Date(now.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0]
}

function CreateFactionPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [licenses, setLicenses] = useState([])

  const [name, setName] = useState("")
  const [shortName, setShortName] = useState("")
  const [description, setDescription] = useState("")
  const [motto, setMotto] = useState("")
  const [foundedDate, setFoundedDate] = useState(getTodayDate())
  const [primaryColor, setPrimaryColor] = useState("#384A59")
  const [secondaryColor, setSecondaryColor] = useState("#99692E")
  const [recruiting, setRecruiting] = useState(true)
  const [selectedLicenseIds, setSelectedLicenseIds] = useState([])
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadPageData()
  }, [])

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
      }
    }
  }, [logoPreviewUrl])

  async function loadPageData() {
    setIsLoading(true)
    setErrorMessage("")

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !currentUser) {
      navigate("/login")
      return
    }

    setUser(currentUser)

    const [
      { data: currentProfile, error: profileError },
      { data: licenseRecords, error: licenseError },
      { data: existingMembership, error: membershipError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single(),

      supabase
        .from("license_types")
        .select("*")
        .eq("status", "active")
        .order("name"),

      supabase
        .from("faction_memberships")
        .select("id, status")
        .eq("profile_id", currentUser.id)
        .maybeSingle(),
    ])

    if (profileError) {
      setErrorMessage(profileError.message)
      setIsLoading(false)
      return
    }

    if (licenseError) {
      setErrorMessage(licenseError.message)
      setIsLoading(false)
      return
    }

    if (membershipError) {
      setErrorMessage(membershipError.message)
      setIsLoading(false)
      return
    }

    if (!currentProfile.character_name) {
      navigate("/dashboard")
      return
    }

    if (existingMembership) {
      setErrorMessage(
        "You already have a faction membership or pending faction request."
      )
    }

    setProfile(currentProfile)
    setLicenses(licenseRecords ?? [])
    setIsLoading(false)
  }

  function toggleLicense(licenseId) {
    setSelectedLicenseIds((currentIds) => {
      if (currentIds.includes(licenseId)) {
        return currentIds.filter((id) => id !== licenseId)
      }

      return [...currentIds, licenseId]
    })
  }

  async function validateLogo(file) {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Logo must be a PNG, JPG, JPEG, or WebP image.")
    }

    if (file.size > 1024 * 1024) {
      throw new Error("Logo must be 1 MB or smaller.")
    }

    const imageUrl = URL.createObjectURL(file)

    try {
      const dimensions = await new Promise((resolve, reject) => {
        const image = new Image()

        image.onload = () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight,
          })
        }

        image.onerror = () => {
          reject(new Error("The selected image could not be read."))
        }

        image.src = imageUrl
      })

      if (dimensions.width !== dimensions.height) {
        throw new Error("Logo must be square.")
      }

      if (dimensions.width < 200 || dimensions.height < 200) {
        throw new Error("Logo must be at least 200 × 200 pixels.")
      }

      if (dimensions.width > 512 || dimensions.height > 512) {
        throw new Error("Logo must be no larger than 512 × 512 pixels.")
      }
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  async function handleLogoChange(event) {
    const file = event.target.files?.[0]

    setErrorMessage("")

    if (!file) {
      setLogoFile(null)

      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
      }

      setLogoPreviewUrl("")
      return
    }

    try {
      await validateLogo(file)

      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
      }

      setLogoFile(file)
      setLogoPreviewUrl(URL.createObjectURL(file))
    } catch (error) {
      event.target.value = ""
      setLogoFile(null)
      setErrorMessage(error.message)
    }
  }

  async function uploadFactionLogo() {
    if (!logoFile) {
      return null
    }

    const extension =
      logoFile.name.split(".").pop()?.toLowerCase() || "png"

    const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from("faction-logos")
      .upload(filePath, logoFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from("faction-logos")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleCreateFaction(event) {
    event.preventDefault()

    setErrorMessage("")

    const trimmedName = name.trim()
    const normalizedTag = shortName.trim().toUpperCase()
    const trimmedDescription = description.trim()
    const trimmedMotto = motto.trim()
    const normalizedPrimaryColor = primaryColor.trim().toUpperCase()
    const normalizedSecondaryColor = secondaryColor.trim().toUpperCase()

    if (!trimmedName) {
      setErrorMessage("Enter a faction name.")
      return
    }

    if (!FACTION_TAG_PATTERN.test(normalizedTag)) {
      setErrorMessage(
        "Faction tag must contain exactly four letters or numbers."
      )
      return
    }

    if (!trimmedDescription) {
      setErrorMessage("Enter a faction description.")
      return
    }

    if (!foundedDate) {
      setErrorMessage("Select the faction's founded date.")
      return
    }

    if (!HEX_COLOR_PATTERN.test(normalizedPrimaryColor)) {
      setErrorMessage("Primary color must be a valid hex code.")
      return
    }

    if (!HEX_COLOR_PATTERN.test(normalizedSecondaryColor)) {
      setErrorMessage("Secondary color must be a valid hex code.")
      return
    }

    if (selectedLicenseIds.length === 0) {
      setErrorMessage("Select at least one operating license.")
      return
    }

    setIsSaving(true)

    try {
      const logoUrl = await uploadFactionLogo()

      const { error } = await supabase.rpc(
        "create_faction_with_licenses",
        {
          p_name: trimmedName,
          p_short_name: normalizedTag,
          p_description: trimmedDescription,
          p_logo_url: logoUrl,
          p_founded_date: foundedDate,
          p_motto: trimmedMotto,
          p_primary_color: normalizedPrimaryColor,
          p_secondary_color: normalizedSecondaryColor,
          p_recruiting: recruiting,
          p_license_type_ids: selectedLicenseIds,
        }
      )

      if (error) {
        throw error
      }

      navigate("/dashboard")
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section className="bg-[#171B1F] px-6 py-20 text-[#D9D9D9]">
        <div className="mx-auto max-w-4xl">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-[#99692E]">
              Loading Faction Registry
            </p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 border-b border-[#384A59] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
            Faction Registration
          </p>

          <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
            Create a Faction
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#737373]">
            Register a faction, select its operating licenses, and establish
            its public identity within Volsung Origins.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleCreateFaction}>
          <Card
            title="Faction Details"
            subtitle="Primary registry information"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="faction-name"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Faction Name
                </label>

                <input
                  id="faction-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Example: Volsung Industries"
                  maxLength={80}
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
                />
              </div>

              <div>
                <label
                  htmlFor="faction-tag"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Faction Tag
                </label>

                <input
                  id="faction-tag"
                  type="text"
                  value={shortName}
                  onChange={(event) =>
                    setShortName(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 4)
                    )
                  }
                  placeholder="VOLS"
                  maxLength={4}
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 uppercase outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
                />

                <p className="mt-2 text-sm text-[#737373]">
                  Exactly four letters or numbers, matching the SE1 faction-tag
                  limit.
                </p>
              </div>

              <div>
                <label
                  htmlFor="founder"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Founder
                </label>

                <input
                  id="founder"
                  type="text"
                  value={profile?.character_name ?? ""}
                  disabled
                  className="mt-3 w-full cursor-not-allowed border border-[#384A59] bg-[#242C32] px-4 py-3 text-[#737373]"
                />

                <p className="mt-2 text-sm text-[#737373]">
                  Automatically assigned from your registry character name.
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="faction-description"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Description
                </label>

                <textarea
                  id="faction-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the faction, its goals, and the players it is looking for."
                  rows={6}
                  maxLength={1000}
                  className="mt-3 w-full resize-y border border-[#384A59] bg-[#111519] px-4 py-3 leading-7 outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
                />
              </div>

              <div>
                <label
                  htmlFor="founded-date"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Founded Date
                </label>

                <input
                  id="founded-date"
                  type="date"
                  value={foundedDate}
                  max={getTodayDate()}
                  onChange={(event) =>
                    setFoundedDate(event.target.value)
                  }
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition focus:border-[#99692E]"
                />
              </div>

              <div>
                <label
                  htmlFor="motto"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Motto
                </label>

                <input
                  id="motto"
                  type="text"
                  value={motto}
                  onChange={(event) => setMotto(event.target.value)}
                  placeholder="Optional faction motto"
                  maxLength={160}
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
                />
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-4 border border-[#384A59] bg-[#111519] p-4">
              <input
                type="checkbox"
                checked={recruiting}
                onChange={(event) =>
                  setRecruiting(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#99692E]"
              />

              <span>
                <span className="block text-sm font-bold uppercase tracking-wider">
                  Open Recruitment
                </span>

                <span className="mt-1 block text-sm leading-6 text-[#737373]">
                  Allow unaffiliated players to request membership.
                </span>
              </span>
            </label>
          </Card>

          <Card
            title="Faction Branding"
            subtitle="Public visual identity"
          >
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <div className="flex aspect-square items-center justify-center overflow-hidden border border-[#384A59] bg-[#111519]">
                  {logoPreviewUrl ? (
                    <img
                      src={logoPreviewUrl}
                      alt="Faction logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm uppercase tracking-wider text-[#737373]">
                      No Logo Selected
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="faction-logo"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Faction Logo
                </label>

                <input
                  id="faction-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                  className="mt-3 block w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-sm file:mr-4 file:border-0 file:bg-[#384A59] file:px-4 file:py-2 file:font-bold file:uppercase file:tracking-wider file:text-[#D9D9D9]"
                />

                <div className="mt-4 space-y-2 text-sm text-[#737373]">
                  <p>Square image only</p>
                  <p>Minimum: 200 × 200 pixels</p>
                  <p>Maximum: 512 × 512 pixels</p>
                  <p>Maximum file size: 1 MB</p>
                  <p>Accepted formats: PNG, JPG, JPEG, or WebP</p>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="primary-color"
                      className="text-xs font-bold uppercase tracking-[0.25em]"
                    >
                      Primary Color
                    </label>

                    <div className="mt-3 flex gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(event) =>
                          setPrimaryColor(
                            event.target.value.toUpperCase()
                          )
                        }
                        className="h-12 w-14 border border-[#384A59] bg-[#111519] p-1"
                      />

                      <input
                        id="primary-color"
                        type="text"
                        value={primaryColor}
                        onChange={(event) =>
                          setPrimaryColor(
                            event.target.value.toUpperCase()
                          )
                        }
                        placeholder="#384A59"
                        maxLength={7}
                        className="min-w-0 flex-1 border border-[#384A59] bg-[#111519] px-4 py-3 uppercase outline-none transition focus:border-[#99692E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="secondary-color"
                      className="text-xs font-bold uppercase tracking-[0.25em]"
                    >
                      Secondary Color
                    </label>

                    <div className="mt-3 flex gap-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(event) =>
                          setSecondaryColor(
                            event.target.value.toUpperCase()
                          )
                        }
                        className="h-12 w-14 border border-[#384A59] bg-[#111519] p-1"
                      />

                      <input
                        id="secondary-color"
                        type="text"
                        value={secondaryColor}
                        onChange={(event) =>
                          setSecondaryColor(
                            event.target.value.toUpperCase()
                          )
                        }
                        placeholder="#99692E"
                        maxLength={7}
                        className="min-w-0 flex-1 border border-[#384A59] bg-[#111519] px-4 py-3 uppercase outline-none transition focus:border-[#99692E]"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[#737373]">
                  Enter six-digit SE1 hex colors, including the # symbol.
                </p>
              </div>
            </div>
          </Card>

          <Card
            title="Operating Licenses"
            subtitle="Select one or more"
          >
            <p className="leading-7 text-[#737373]">
              Select every license under which this faction will operate.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {licenses.map((license) => {
                const isSelected = selectedLicenseIds.includes(license.id)

                return (
                  <button
                    key={license.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleLicense(license.id)}
                    className={`border p-5 text-left transition ${
                      isSelected
                        ? "border-[#99692E] bg-[#99692E]/15"
                        : "border-[#384A59] bg-[#111519] hover:border-[#99692E]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold uppercase tracking-wider">
                          {license.name}
                        </p>

                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#99692E]">
                          {license.short_name}
                        </p>
                      </div>

                      <span
                        className={`flex h-6 w-6 items-center justify-center border text-sm font-bold ${
                          isSelected
                            ? "border-[#99692E] bg-[#99692E] text-[#171B1F]"
                            : "border-[#384A59] text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#737373]">
                      {license.summary}
                    </p>
                  </button>
                )
              })}
            </div>
          </Card>

          {errorMessage && (
            <div className="border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-4 border-t border-[#384A59] pt-8">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creating Faction..." : "Create Faction"}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateFactionPage