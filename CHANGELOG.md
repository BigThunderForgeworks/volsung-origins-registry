# Changelog

All notable changes to the Volsung Origins Registry project will be documented in this file.

---

## [1.0.0] - 2026-08-04

### Added

- Discord OAuth and Email Magic Link authentication
- Personnel registry and character profiles
- Public faction registry
- Faction creation workflow
- Owner faction management
- Administrator faction management
- Membership request and approval workflow
- Industrial licensing system
- Administrator dashboard
- Personnel administration
- Faction administration
- Membership administration
- Colonial News Network
- Homepage news feed
- Daily rotating news selection
- Custom branding and favicon
- GitHub Pages deployment
- Supabase backend integration

### Changed

- Refactored Administrator Portal into reusable components
- Improved dashboard layout and faction editing workflow
- Updated navigation and footer
- Updated project documentation
- Improved overall visual consistency

### Fixed

- Faction tag generation and validation
- Membership approval workflow
- Faction logo validation
- Various UI consistency issues

---

## Planned (Version 2)

### Planned Features

- Server Lore archive
- Data Pad library
- Officer roles
- Admin News Editor
- Expanded Colonial News Network
- Additional administrator tools
- User experience refinements
- Additional visual polish


# Changelog

## v1.1.0 - World Foundations Update

### Added
#### Lore System
- Added a complete Lore Archive accessible to all visitors.
- Added individual Lore Entry pages with immersive historical record formatting.
- Added a reusable block-based lore rendering system.
- Added Lore navigation between entries.
- Added administrative Lore Management tools.
- Added a structured Lore Entry editor with reusable components.
- Added support for modular lore blocks for future story releases.
- Added support for featured lore entries.

#### License Management
- Faction owners can now request additional operating licenses.
- Faction owners can cancel pending license requests.
- Added backend enforcement for a maximum of two active or pending licenses per faction.
- New faction creation now limits license selection to two operating licenses.

### Changed
#### Public Registry
- Public faction registry pages now display only approved operating licenses.
- Homepage faction cards now display only approved operating licenses.
- License counts now reflect approved licenses only.

#### Dashboard
- License management moved into its own reusable component.
- Dashboard now separates approved licenses from pending license requests.
- Hidden rejected and cancelled license requests from normal player views.

#### Architecture
- Continued refactoring large pages into reusable components.
- Expanded the reusable component structure for Lore administration and License management.
- Improved maintainability by reducing page complexity and isolating feature-specific logic.

### Fixed
- Pending and rejected licenses no longer appear on public faction listings.
- Public license counts now accurately reflect approved licenses.
- Owners can safely withdraw pending license requests without administrator intervention.
- Prevented duplicate and excessive license requests through backend validation.

### Database
- Added support for `cancelled` faction license status.
- Added secure RPC functions for requesting and cancelling licenses.
- Added database-level enforcement of the two-license limit.
- Improved validation during faction creation and license management.