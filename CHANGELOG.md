# Changelog

All notable changes to the Volsung Origins Registry project will be documented in this file.

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

---

## Planned (v1.2.0)

### Planned Features

- Server Milestone System
- Admin News Editor
- Expanded Colonial News Network
- Lore publishing workflow improvements
- Dashboard enhancements
- Additional administrator tools
- Data Pad library
- Officer roles
- Additional visual polish