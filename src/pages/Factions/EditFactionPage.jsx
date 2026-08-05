import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { supabase } from "../../lib/supabase"

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/
const FACTION_TAG_PATTERN = /^[A-Z]{2,3}$/

function EditFactionPage() {
  const navigate = useNavigate()
  const { factionTag } = useParams()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [faction, setFaction] = useState(null)
  const [membership, setMembership] = useState(null)

  const [name, setName] = useState("")
  const [shortName, setShortName] = useState("")
  const [description, setDescription] = useState("")
  const [motto, setMotto] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#384A59")
  const [secondaryColor, setSecondaryColor] = useState("#99692E")
  const [recruiting, setRecruiting] = useState(false)

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("")
  const [existingLogoUrl, setExistingLogoUrl] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadFaction()
  }, [factionTag])

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
      }
    }
  }, [logoPreviewUrl])

  async function loadFaction() {
    setIsLoading(true)
    setErrorMessage("")

    const normalizedTag = factionTag?.trim().toUpperCase()

    if (!normalizedTag) {
      navigate("/factions")
      return
    }

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
      { data: factionRecord, error: factionError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(`
          id,
          character_name,
          role
        `)
        .eq("id", currentUser.id)
        .maybeSingle(),

      supabase
        .from("factions")
        .select(`
          id,
          name,
          short_name,
          description,
          logo_url,
          owner_id,
          founder_name,
          founded_date,
          motto,
          primary_color,
          secondary_color,
          recruiting,
          status
        `)
        .eq("short_name", normalizedTag)
        .maybeSingle(),
    ])

    if (profileError) {
      setErrorMessage(profileError.message)
      setIsLoading(false)
      return
    }

    if (factionError) {
      setErrorMessage(factionError.message)
      setIsLoading(false)
      return
    }

    if (!currentProfile) {
      navigate("/dashboard")
      return
    }

    if (!factionRecord) {
      navigate("/factions")
      return
    }

    const { data: membershipRecord, error: membershipError } =
      await supabase
        .from("faction_memberships")
        .select(`
          id,
          faction_id,
          profile_id,
          member_role,
          status
        `)
        .eq("profile_id", currentUser.id)
        .eq("faction_id", factionRecord.id)
        .maybeSingle()

    if (membershipError) {
      setErrorMessage(membershipError.message)
      setIsLoading(false)
      return
    }

    const isAdmin = currentProfile.role === "admin"

    const isOwner =
      factionRecord.owner_id === currentUser.id ||
      (
        membershipRecord?.member_role === "owner" &&
        membershipRecord?.status === "approved"
      )

    if (!isAdmin && !isOwner) {
      navigate(`/factions/${factionRecord.short_name}`)
      return
    }

    setProfile(currentProfile)
    setFaction(factionRecord)
    setMembership(membershipRecord)

    setName(factionRecord.name ?? "")
    setShortName(factionRecord.short_name ?? "")
    setDescription(factionRecord.description ?? "")
    setMotto(factionRecord.motto ?? "")
    setPrimaryColor(factionRecord.primary_color ?? "#384A59")
    setSecondaryColor(factionRecord.secondary_color ?? "#99692E")
    setRecruiting(Boolean(factionRecord.recruiting))
    setExistingLogoUrl(factionRecord.logo_url ?? "")

    setIsLoading(false)
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
      setLogoPreviewUrl("")
      setErrorMessage(error.message)
    }
  }

  async function uploadFactionLogo() {
    if (!logoFile) {
      return existingLogoUrl || null
    }

    const extension =
      logoFile.name.split(".").pop()?.toLowerCase() || "png"

    const filePath =
      `${user.id}/${faction.id}/${crypto.randomUUID()}.${extension}`

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

  async function handleSaveFaction(event) {
    event.preventDefault()

    setErrorMessage("")

    const trimmedName = name.trim()
    const normalizedTag = shortName.trim().toUpperCase()
    const trimmedDescription = description.trim()
    const trimmedMotto = motto.trim()
    const normalizedPrimaryColor = primaryColor.trim().toUpperCase()
    const normalizedSecondaryColor = secondaryColor.trim().toUpperCase()

    if (trimmedName.length < 3) {
      setErrorMessage(
        "Faction name must contain at least three characters."
      )
      return
    }

    if (trimmedName.length > 50) {
      setErrorMessage(
        "Faction name must be 50 characters or fewer."
      )
      return
    }

    if (
      profile?.role === "admin" &&
      !FACTION_TAG_PATTERN.test(normalizedTag)
    ) {
      setErrorMessage(
        "Faction tag must contain two or three letters."
      )
      return
    }

    if (!trimmedDescription) {
      setErrorMessage("Enter a faction description.")
      return
    }

    if (trimmedDescription.length > 1000) {
      setErrorMessage(
        "Faction description must be 1,000 characters or fewer."
      )
      return
    }

    if (trimmedMotto.length > 160) {
      setErrorMessage(
        "Faction motto must be 160 characters or fewer."
      )
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

    setIsSaving(true)

    try {
      const logoUrl = await uploadFactionLogo()

      const { error } = await supabase.rpc(
        "update_faction_details",
        {
          p_faction_id: faction.id,
          p_name: trimmedName,
          p_short_name: normalizedTag,
          p_description: trimmedDescription,
          p_logo_url: logoUrl,
          p_motto: trimmedMotto,
          p_primary_color: normalizedPrimaryColor,
          p_secondary_color: normalizedSecondaryColor,
          p_recruiting: recruiting,
        }
      )

      if (error) {
        throw error
      }

      navigate(`/factions/${normalizedTag}`)
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
              Loading Faction Management
            </p>
          </Card>
        </div>
      </section>
    )
  }

  const isAdmin = profile?.role === "admin"

  const isOwner =
    faction?.owner_id === user?.id ||
    (
      membership?.member_role === "owner" &&
      membership?.status === "approved"
    )

  const displayedLogoUrl = logoPreviewUrl || existingLogoUrl

  return (
    <section className="bg-[#171B1F] px-6 py-16 text-[#D9D9D9]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-5 border-b border-[#384A59] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#99692E]">
              Faction Management
            </p>

            <h1 className="mt-3 text-5xl font-bold uppercase tracking-wider">
              Edit Faction
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              {isAdmin && (
                <Badge variant="success">
                  Administrator Override
                </Badge>
              )}

              {isOwner && (
                <Badge variant="gold">
                  Faction Owner
                </Badge>
              )}

              <Badge>{faction.short_name}</Badge>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              navigate(`/factions/${faction.short_name}`)
            }
          >
            Cancel Editing
          </Button>
        </div>

        <form className="space-y-8" onSubmit={handleSaveFaction}>
          <Card
            title="Faction Details"
            subtitle="Public registry information"
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
                  minLength={3}
                  maxLength={50}
                  required
                  onChange={(event) => setName(event.target.value)}
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition focus:border-[#99692E]"
                />

                <p className="mt-2 text-sm text-[#737373]">
                  Between 3 and 50 characters.
                </p>
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
                  disabled={!isAdmin}
                  minLength={2}
                  maxLength={3}
                  required
                  onChange={(event) =>
                    setShortName(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z]/g, "")
                        .slice(0, 3)
                    )
                  }
                  className={`mt-3 w-full border px-4 py-3 uppercase outline-none transition ${
                    isAdmin
                      ? "border-[#384A59] bg-[#111519] focus:border-[#99692E]"
                      : "cursor-not-allowed border-[#384A59] bg-[#242C32] text-[#737373]"
                  }`}
                />

                <p className="mt-2 text-sm text-[#737373]">
                  {isAdmin
                    ? "Administrators may change the 2–3 letter faction tag."
                    : "Faction tags may only be changed by an administrator."}
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
                  value={faction.founder_name ?? "Unknown"}
                  disabled
                  className="mt-3 w-full cursor-not-allowed border border-[#384A59] bg-[#242C32] px-4 py-3 text-[#737373]"
                />

                <p className="mt-2 text-sm text-[#737373]">
                  Founder records are preserved separately from ownership.
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
                  rows={7}
                  maxLength={1000}
                  required
                  className="mt-3 w-full resize-y border border-[#384A59] bg-[#111519] px-4 py-3 leading-7 outline-none transition focus:border-[#99692E]"
                />

                <p className="mt-2 text-sm text-[#737373]">
                  {description.length}/1000 characters
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="faction-motto"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Motto
                </label>

                <input
                  id="faction-motto"
                  type="text"
                  value={motto}
                  maxLength={160}
                  placeholder="Optional faction motto"
                  onChange={(event) => setMotto(event.target.value)}
                  className="mt-3 w-full border border-[#384A59] bg-[#111519] px-4 py-3 outline-none transition placeholder:text-[#737373] focus:border-[#99692E]"
                />

                <p className="mt-2 text-sm text-[#737373]">
                  {motto.length}/160 characters
                </p>
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
            subtitle="Logo and registry colors"
          >
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <div className="flex aspect-square items-center justify-center overflow-hidden border border-[#384A59] bg-[#111519]">
                  {displayedLogoUrl ? (
                    <img
                      src={displayedLogoUrl}
                      alt={`${faction.name} logo preview`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm uppercase tracking-wider text-[#737373]">
                      No Logo Uploaded
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="faction-logo"
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                >
                  Replace Faction Logo
                </label>

                <input
                  id="faction-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                  className="mt-3 block w-full border border-[#384A59] bg-[#111519] px-4 py-3 text-sm file:mr-4 file:border-0 file:bg-[#384A59] file:px-4 file:py-2 file:font-bold file:uppercase file:tracking-wider file:text-[#D9D9D9]"
                />

                <div className="mt-4 space-y-2 text-sm text-[#737373]">
                  <p>Leave blank to keep the current logo.</p>
                  <p>Square images only.</p>
                  <p>Minimum: 200 × 200 pixels.</p>
                  <p>Maximum: 512 × 512 pixels.</p>
                  <p>Maximum file size: 1 MB.</p>
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
                        maxLength={7}
                        onChange={(event) =>
                          setPrimaryColor(
                            event.target.value.toUpperCase()
                          )
                        }
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
                        maxLength={7}
                        onChange={(event) =>
                          setSecondaryColor(
                            event.target.value.toUpperCase()
                          )
                        }
                        className="min-w-0 flex-1 border border-[#384A59] bg-[#111519] px-4 py-3 uppercase outline-none transition focus:border-[#99692E]"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="mt-8 border p-5"
                  style={{
                    borderColor: primaryColor,
                    backgroundColor: `${secondaryColor}20`,
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-[0.25em]"
                    style={{ color: secondaryColor }}
                  >
                    Branding Preview
                  </p>

                  <p className="mt-3 text-xl font-bold uppercase tracking-wider">
                    {name || faction.name}
                  </p>

                  <p className="mt-2 text-sm text-[#737373]">
                    Primary and secondary faction colors.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {errorMessage && (
            <div className="border border-red-700 bg-red-900/20 px-5 py-4 text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-4 border-t border-[#384A59] pt-8">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving Faction..." : "Save Faction"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() =>
                navigate(`/factions/${faction.short_name}`)
              }
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default EditFactionPage