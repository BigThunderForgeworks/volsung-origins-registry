# Changelog

All notable changes to the Volsung Origins Registry project will be documented in this file.

---

## [2.0.0] - 2026-08-08

### Added

#### Company System

- Added a complete Company Registry alongside the existing Faction Registry.
- Added public Company directory pages.
- Added individual Company registry pages.
- Added Company creation workflow.
- Added Company ownership and personnel membership support.
- Added Company recruiting controls.
- Added Company profile management.
- Added Company personnel management.
- Added Company membership request and approval workflow.
- Added Company member removal and voluntary leave workflows.
- Added support for independent Companies.
- Added support for Companies operating beneath registered Factions.
- Added Company status information to player dashboards.
- Added Company management controls for Company owners.
- Added administrator access to Company management tools.

#### Company Licensing

- Added operating licenses for Companies.
- Added Company license request workflow.
- Added Company license cancellation workflow.
- Added administrator approval and rejection of Company license requests.
- Added backend enforcement of Company license limits.
- Public Company pages display approved licenses only.
- Company management pages distinguish approved and pending license requests.

#### Company and Faction Affiliation

- Added Company-to-Faction affiliation requests.
- Independent Companies can request affiliation beneath active Factions.
- Faction owners can approve or reject incoming Company affiliation requests.
- Administrators can review Company affiliation requests globally.
- Approved affiliation automatically attaches the Company to the receiving Faction.
- Approved Company personnel are automatically associated with the receiving Faction where appropriate.
- Existing direct Faction memberships are preserved when stronger than Company-derived membership.
- Faction owner and officer roles are preserved during Company affiliation processing.
- Backend validation prevents conflicting Faction memberships during affiliation approval.

#### Organization Migration

- Added V3 organization migration workflow for existing Faction owners.
- Added migration options for retaining a Faction-only structure.
- Added migration support for creating a separate Company.
- Added migration support for placing a Company beneath another Faction.
- Added migration summaries and confirmation flow.
- Added migration validation and duplicate-submission protection.
- Added Company tag validation compatible with Space Engineers faction tag requirements.

#### Player Dashboard

- Added Company Status card.
- Added Company ownership and membership visibility.
- Added Company membership request review controls for Company owners.
- Added Company personnel management controls.
- Added Company affiliation request controls for Faction owners.
- Added Company management navigation for Company owners.
- Expanded organization status presentation to clearly separate Faction and Company relationships.

#### Administration

- Added global Company membership request review tools.
- Added Registered Companies administration panel.
- Added administrator Company management access.
- Added Company license approval and rejection tools.
- Added Company affiliation review tools.
- Added administrator override access for Company profile and recruitment management.
- Expanded administration coverage across Company personnel, licensing, and affiliation workflows.

#### Public Registry

- Added Company Registry navigation to the site header and footer.
- Added Company pages to the public registry.
- Added Company personnel listings.
- Added Company recruiting status.
- Added Company Faction affiliation information.
- Company Registry now groups affiliated Companies beneath their Faction umbrella.
- Added a dedicated Independent Companies section for unaffiliated Companies.
- Added Company counts to homepage registry statistics.

### Changed

#### Organization Model

- Expanded the Registry from a Faction-only organizational model to a two-level Faction and Company structure.
- Factions now represent the primary server-level organizational umbrella.
- Companies represent player-operated organizations and commercial entities.
- Companies may operate independently or beneath a Faction.
- Updated terminology throughout the Registry to distinguish Factions from Companies.

#### Homepage

- Homepage description now includes Companies as part of the Registry network.
- Added Registered Companies to homepage statistics.
- License statistics now include both Faction and Company licenses.
- Updated Faction membership wording to better represent direct and Company-derived personnel.
- Homepage continues to prioritize Factions as the primary server-level organizational structure.

#### Company Registry

- Company directory now groups Companies by Faction affiliation.
- Independent Companies are displayed separately.
- Updated Company Registry messaging to clarify the relationship between Companies and Factions.

#### Navigation

- Added Company Registry to desktop navigation.
- Added Company Registry to footer navigation.
- Updated footer Registry description to include Companies.
- Updated displayed application version to v2.0.0.

#### Architecture

- Added reusable hooks and components for Company creation, membership, management, licensing, and affiliation.
- Continued separating large page logic into reusable components.
- Added shared Company affiliation request component used by both Faction owners and administrators.
- Expanded owner/admin permission-aware UI patterns.
- Continued reducing page-level complexity by moving feature logic into dedicated components and hooks.

### Fixed

- Company owners now appear correctly in public Company personnel listings.
- Approved Company personnel are visible publicly while pending membership requests remain private.
- Corrected RLS policies for Company membership visibility.
- Added owner and administrator update permissions for Companies.
- Fixed ambiguous Supabase relationship embedding for Company affiliation requests.
- Prevented Company owners from using the normal member leave workflow.
- Prevented duplicate or conflicting Company membership relationships.
- Improved Company membership error visibility.
- Company license and affiliation requests now correctly respect pending, approved, rejected, and cancelled states.
- Improved public Registry terminology to reduce confusion between Factions and Companies.

### Database

- Added Company records and Company ownership support.
- Added `company_memberships`.
- Added `company_licenses`.
- Added `company_affiliation_requests`.
- Added secure Company creation RPC.
- Added Company membership request, review, leave, and removal RPCs.
- Added Company license request, cancellation, review, and enforcement RPCs.
- Added Company affiliation request and review RPCs.
- Added Company migration support.
- Added Company-related Row Level Security policies.
- Added administrator visibility and update permissions for Company systems.
- Added public visibility for approved Company memberships and licenses.
- Added backend enforcement preventing invalid organization relationships.
- Added automatic Company-derived Faction membership handling during affiliation approval.

### Release Validation

- Completed end-to-end Company creation testing.
- Verified Company Registry and Company detail pages.
- Verified Company membership request and approval workflow.
- Verified Company personnel visibility.
- Verified Company owner dashboard integration.
- Verified administrator Company management access.
- Verified Company license workflow and administrator review path.
- Verified Company affiliation review workflow.
- Verified Organization Migration interface.
- Completed production Vite build successfully.

---

## [1.1.0] - 2026-08-06

### Added

#### Lore System

- Added a complete Lore Archive accessible to all visitors.
- Added individual Lore Entry pages with immersive historical record formatting.
- Added a reusable block-based lore rendering system.
- Added navigation between lore entries.
- Added administrative Lore Management tools.
- Added a structured Lore Entry editor built from reusable components.
- Added support for modular lore blocks for future story releases.
- Added support for featured lore entries.

#### License Management

- Faction owners can request additional operating licenses.
- Faction owners can cancel pending license requests.
- Added backend enforcement limiting factions to two active or pending licenses.
- New faction creation now limits license selection to two operating licenses.

### Changed

#### Public Registry

- Public faction registry pages now display only approved operating licenses.
- Homepage faction cards now display only approved operating licenses.
- Faction directory now displays only approved operating licenses.
- Public license counts now reflect approved licenses only.

#### Dashboard

- License management has been moved into a dedicated reusable component.
- Dashboard now separates approved licenses from pending license requests.
- Rejected and cancelled license requests are hidden from standard player views.

#### Navigation

- Added automatic scroll-to-top behavior when navigating between pages.

#### Architecture

- Continued refactoring large pages into reusable components.
- Expanded reusable component structure for Lore administration and License Management.
- Improved maintainability by separating feature-specific logic into dedicated components.

### Fixed

- Pending and rejected licenses no longer appear on public faction listings.
- Corrected public license counts across the registry.
- Owners can safely withdraw pending license requests without administrator intervention.
- Prevented duplicate and excessive license requests through backend validation.
- Improved routing behavior by resetting page scroll position during navigation.

### Database

- Added support for the `cancelled` faction license status.
- Added secure RPC functions for requesting and cancelling faction licenses.
- Added database-level enforcement of the two-license limit.
- Improved validation during faction creation and license management.

---

## [1.0.0] - 2026-08-04

### Added

- Discord OAuth and Email Magic Link authentication.
- Personnel registry and character profiles.
- Public faction registry.
- Faction creation workflow.
- Owner faction management.
- Administrator faction management.
- Membership request and approval workflow.
- Industrial licensing system.
- Administrator dashboard.
- Personnel administration.
- Faction administration.
- Membership administration.
- Colonial News Network.
- Homepage news feed.
- Daily rotating featured news selection.
- Custom branding and favicon.
- GitHub Pages deployment.
- Supabase backend integration.

### Changed

- Refactored Administrator Portal into reusable components.
- Improved dashboard layout and faction editing workflow.
- Updated navigation and footer.
- Updated project documentation.
- Improved overall visual consistency.

### Fixed

- Faction tag generation and validation.
- Membership approval workflow.
- Faction logo validation.
- Various UI consistency issues.