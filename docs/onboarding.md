# Developer Onboarding Guide

Welcome to the **College Management System Monorepo**! This repository hosts services and packages developed across 13 engineering teams.

This guide is designed to get you from a fresh clone to a running local development environment in **under 15 minutes**.

---

## ⏱️ Quickstart Checklist

```
git clone <repo-url>
   ↓
cd college-management-system
   ↓
npm install
   ↓
cp .env.example .env
   ↓
npm run seed
   ↓
npm run dev
```

---

## 1. Prerequisites

Before installing, ensure your environment meets the minimum version requirements:

| Tool        | Version Required              | Verification Command |
| ----------- | ----------------------------- | -------------------- |
| **Node.js** | `>= 20.0.0` (LTS recommended) | `node -v`            |
| **npm**     | `>= 10.0.0`                   | `npm -v`             |
| **Git**     | `>= 2.30.0`                   | `git --version`      |
| **MongoDB** | `>= 6.0` (Local or Atlas)     | `mongosh --version`  |

> ⚠️ **Package Manager Rule:** Use **npm only**. Do not use Yarn or pnpm, as this monorepo relies on npm workspaces.

---

## 2. Step 1: Clone Repository

```bash
git clone https://github.com/your-org/college-management-system.git
cd college-management-system
```

---

## 3. Step 2: Install Dependencies

Install all root, workspace app, and package dependencies using `npm install`:

```bash
npm install
```

> **Note on Dependencies:** All dependencies are frozen after Week 1. Do not install new external npm packages directly. See [Dependency Policy](#dependency-freeze-policy).

---

## 4. Step 3: Configure Environment Variables

Create your local environment configuration file:

```bash
cp .env.example .env
```

Open `.env` in your editor and verify:

```ini
# Local MongoDB (if running Docker / brew / local service):
MONGODB_URI=mongodb://127.0.0.1:27017/college-cms

# Runtime mode:
NODE_ENV=development

# Optional overrides:
PORT=4000
API_URL=http://localhost:4000
```

---

## 5. Step 4: Run the Database Seed

Seed the foundational data (Admin users, Teachers, Students, Departments, Courses, Classes):

```bash
npm run seed
```

You should see:

```text
🌱 Starting database seed...
✓ Connected to MongoDB database

▶ Executing: Core Platform Foundation
  → Seeding Departments...
  ✓ Departments created / verified
  → Seeding Academic Courses...
  ✓ Courses created / verified
  → Seeding Class Cohorts...
  ✓ Classes created / verified
  → Seeding Admin Users...
  ✓ Admin created
  → Seeding Faculty Members (Teachers)...
  ✓ Teachers created
  → Seeding Students...
  ✓ Students created

✓ Database seeded successfully in 0.84s! 🚀
✓ Disconnected cleanly from database
```

> **Idempotency Guarantee:** The seed script is completely idempotent. You can re-run `npm run seed` at any time without creating duplicate records.

---

## 6. Step 5: Start Development Servers

Start all applications and packages concurrently through Turborepo:

```bash
npm run dev
```

The portals will start on their assigned ports:

- **Public Web Portal:** [http://localhost:4000](http://localhost:4000)
- **Admin Portal:** [http://localhost:4001](http://localhost:4001)
- **Student Portal:** [http://localhost:4002](http://localhost:4002)
- **Teacher Portal:** [http://localhost:4003](http://localhost:4003)

To develop a specific application alone, filter via Turbo:

```bash
npx turbo run dev --filter=@cms/admin
```

---

## 7. Quality & Verification Commands

Before pushing any branch or opening a pull request, run the verification scripts:

### Linting

```bash
npm run lint
```

### Typechecking

```bash
npm run typecheck
```

### Unit & Integration Tests

```bash
npm run test
```

### E2E Smoke Tests (Playwright)

```bash
npm run test:e2e
```

### Format Code (Prettier)

```bash
npm run format
```

---

## 8. Cross-Platform Guidelines (Windows, WSL, macOS, Linux)

Our repository supports macOS, Linux, and Windows/WSL contributors seamlessly.

### Recommended Environments:

- **macOS / Linux:** Native terminal (Zsh / Bash).
- **Windows:** **WSL 2 (Windows Subsystem for Linux)** is strongly recommended.

### Platform Nuances:

1. **Path Separators:**
   Always use forward slashes (`/`) in all import paths, script globs, and configurations. Never hardcode Windows backslashes (`\`).

2. **Environment Variables:**
   - On Linux/macOS/WSL: `export NODE_ENV=development`
   - On Windows PowerShell: `$env:NODE_ENV="development"`
   - To avoid cross-platform divergence, always define variables in `.env` rather than inline shell exports.

3. **Line Endings:**
   Ensure Git checks out LF line endings:
   ```bash
   git config --global core.autocrlf input
   ```

---

## 9. Dependency Freeze Policy

Dependencies are strictly frozen after Week 1. If your team requires a new package:

1. Open a GitHub Issue using the **Dependency Request (RFC)** template.
2. Fill in the justification, alternatives evaluated, bundle size, and security considerations.
3. Team 01 reviews RFCs and adds approved packages in a single Friday weekly batch PR.
