<div align="center">

# Volsung Origins Registry

### Official Personnel, Faction, and Industrial Registry

A modern web application built for the **Volsung Origins** Space Engineers server.

Designed and developed by **Big Thunder Forgeworks (BTF)**.

</div>

---

## Overview

The **Volsung Origins Registry** is the official web portal for the Volsung Origins Space Engineers community.

The project centralizes player registration, faction management, industrial licensing, and administrative workflows into a single application. Instead of relying on spreadsheets, Discord messages, and manual record keeping, the Registry provides an immersive, in-universe system for managing the server.

The goal is to create a living administrative platform that feels like part of the Space Engineers universe while remaining simple and intuitive for players.

---

# Current Features

### Authentication

- Discord OAuth Login
- Passwordless Magic Link Authentication
- Secure Supabase Authentication

### Personnel Registry

- Character Profile Registration
- Discord Profile Integration
- Editable Registry Name
- Player Dashboard

### Faction Registry

- Create Registered Factions
- Public Faction Pages
- Faction Editing
- Logo Upload Support
- Custom Colors
- Motto & Description
- Recruitment Status
- 2–3 Character Faction Tags

### Membership System

- Join Requests
- Owner Approval Workflow
- Administrator Approval Override
- Administrator Member Removal

### Industrial Licensing

- License Applications
- Administrative Review
- Public License Display

### Administration

- Administrative Dashboard
- Personnel Directory
- Registered Factions
- Pending Membership Reviews
- Pending License Reviews

---

# Technology Stack

| Frontend | Backend |
|----------|---------|
| React | Supabase |
| Vite | PostgreSQL |
| Tailwind CSS | Storage |
| React Router | Authentication |

### Deployment

- GitHub Pages
- GitHub Actions CI/CD

---

# Project Structure

```
src/
├── components/
│
├── pages/
│   ├── Admin/
│   ├── Dashboard/
│   ├── Factions/
│   ├── Home/
│   ├── Licenses/
│   ├── Login/
│   └── NotFound/
│
├── lib/
│
└── App.jsx
```

---

# About Big Thunder Forgeworks

**Big Thunder Forgeworks (BTF)** is an independent software and game development studio focused on creating tools, utilities, and immersive experiences for gaming communities.

The Volsung Origins Registry is the first public project developed under the BTF name.

---

# About Volsung Origins

The Volsung Origins Registry was commissioned for the **Volsung Origins** Space Engineers server.

Volsung Origins is affiliated with **Aegir's** YouTube channel and broader gaming community, expanding upon the universe through collaborative gameplay, player-driven industry, and faction-based storytelling.

The Registry exists to support that community by providing immersive infrastructure for players and administrators alike.

---

# Roadmap

## Near-Term Improvements

- Browser polish
- Visual consistency improvements
- Colonial News Network
- Dynamic in-universe news articles

## Future Releases

Version 2 will expand the Registry with additional administrative capabilities, richer faction management, and new gameplay systems while maintaining backwards compatibility with existing registry data.

---

# License

Copyright © Big Thunder Forgeworks.

This project was developed for the Volsung Origins community.

Volsung Origins branding, logos, artwork, lore, and associated intellectual property remain the property of their respective owners.

The underlying application, source code, and tooling developed by **Big Thunder Forgeworks** may not be redistributed or republished without permission.

---

<div align="center">

**Built with React, Supabase, and ☕**

</div>