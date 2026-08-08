# Volsung Origins Registry

### Official Personnel, Faction, Company, and Industrial Registry

A modern web application built for the **Volsung Origins** Space Engineers server.

Designed and developed by **Big Thunder Forgeworks (BTF)**.

---

## Overview

The **Volsung Origins Registry** is the official web portal for the Volsung Origins Space Engineers community.

The project centralizes player registration, faction management, company operations, industrial licensing, lore, news, and administrative workflows into a single application. Instead of relying on spreadsheets, Discord messages, and manual record keeping, the Registry provides an immersive, in-universe system for managing the server.

The Registry is designed around a two-level organizational model:

- **Factions** represent the primary server-level organizational umbrella.
- **Companies** represent player-operated organizations and commercial entities.
- Companies may operate independently or beneath a registered Faction.

The goal is to create a living administrative platform that feels like part of the Space Engineers universe while remaining simple and intuitive for players.

---

# Current Features

### Authentication

- Discord OAuth Login
- Passwordless Email Magic Link Authentication
- Secure Supabase Authentication
- Persistent Player Sessions

### Personnel Registry

- Character Profile Registration
- Discord Profile Integration
- Editable Registry Name
- Player Dashboard
- Public Personnel Relationships
- Faction and Company Status Tracking

### Faction Registry

- Create Registered Factions
- Public Faction Pages
- Faction Editing
- Logo Upload Support
- Custom Colors
- Motto & Description
- Recruitment Status
- 2–3 Character Faction Tags
- Faction Membership Management
- Faction License Management
- Company Affiliation Review

### Company Registry

- Create Registered Companies
- Public Company Directory
- Public Company Registry Pages
- Independent Company Support
- Company-to-Faction Affiliation
- Company Profile Management
- Company Recruiting Controls
- Company Personnel Management
- Company Membership Requests
- Company Member Removal
- Voluntary Company Leave Workflow
- 2–3 Character Company Tags compatible with Space Engineers faction requirements

### Membership System

- Faction Join Requests
- Company Join Requests
- Owner Approval Workflows
- Administrator Approval Override
- Administrator Member Removal
- Company-Derived Faction Membership
- Protection for Existing Direct Faction Memberships

### Industrial Licensing

- Faction License Applications
- Company License Applications
- Owner License Request Management
- Pending License Cancellation
- Administrative Review
- Public Approved License Display
- Backend License Limit Enforcement

### Organization Migration

- V3 Organization Migration Workflow
- Existing Faction Migration Support
- Faction-Only Migration Option
- Separate Company Creation During Migration
- Company-Under-Faction Migration Option
- Migration Validation
- Duplicate Submission Protection

### Lore Archive

- Public Lore Archive
- Individual Lore Entry Pages
- Featured Lore Entries
- Modular Lore Block Rendering
- Administrative Lore Management
- Structured Lore Entry Editing

### Colonial News Network

- Public News Feed
- Homepage News Display
- In-Universe News Presentation
- Featured News Support

### Administration

- Administrative Dashboard
- Personnel Directory
- Registered Factions
- Registered Companies
- Pending Faction Membership Reviews
- Pending Company Membership Reviews
- Pending Faction License Reviews
- Pending Company License Reviews
- Company Affiliation Reviews
- Faction Member Removal
- Company Member Management
- Company Profile and Recruitment Override
- Lore Administration

---

# Organization Model

The Registry separates **Factions** and **Companies** to better represent the way organizations operate within Volsung Origins.

## Factions

Factions are the primary server-level organizations and align with the Space Engineers faction structure.

A Faction may:

- Recruit personnel directly.
- Hold operating licenses.
- Contain one or more affiliated Companies.
- Approve Company affiliation requests.
- Maintain direct members independently of Company membership.

## Companies

Companies are player-operated organizations, businesses, and industrial entities.

A Company may:

- Operate independently.
- Request affiliation beneath an existing Faction.
- Recruit and manage its own personnel.
- Hold operating licenses.
- Maintain its own public registry identity.
- Later transition into or support a Space Engineers faction structure.

Approved Company personnel may receive Company-derived membership in the Company's affiliated Faction while existing direct Faction memberships and leadership roles remain protected.

---

# Technology Stack

| Frontend     | Backend        |
| ------------ | -------------- |
| React        | Supabase       |
| Vite         | PostgreSQL     |
| Tailwind CSS | Storage        |
| React Router | Authentication |

### Deployment

- GitHub Pages
- GitHub Actions CI/CD

---

# Project Structure

```text
src/
├── components/
│   ├── layout/
│   └── ui/
│
├── pages/
│   ├── Admin/
│   ├── Companies/
│   ├── Dashboard/
│   ├── Factions/
│   ├── Home/
│   ├── Licenses/
│   ├── Login/
│   ├── Lore/
│   ├── News/
│   └── NotFound/
│
├── lib/
│
└── App.jsx