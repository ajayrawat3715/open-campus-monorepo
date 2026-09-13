---
name: "Dependency Request (RFC)"
about: "Request adding or updating an npm package dependency"
title: "[DEP-REQUEST]: <package-name>"
labels: ["dependencies", "needs-team01-review"]
assignees: ["team01-member1"]
---

### ⚠️ Dependency Freeze Policy Notice

> **IMPORTANT**: To maintain codebase stability, fast build pipelines, and prevent dependency bloat across 13 teams, **all dependencies are frozen after Week 1**.
>
> - Direct modification of `package.json` or `package-lock.json` in feature PRs will be automatically blocked by CI.
> - New dependencies must be formally requested and justified using this template.
> - Approved dependencies will be consolidated and integrated by Team 01 in **one batch PR per week**.

---

### 1. Dependency Details

- **Dependency Name:** `[e.g. date-fns]`
- **Target Version:** `[e.g. ^3.6.0]`
- **Target Location:** `[Root / packages/<pkg> / apps/<app>]`

### 2. Team Information

- **Requesting Team:** `[e.g. Team 05 - Attendance / Team 06 - Marks]`
- **Feature Area / Ticket Link:** `[Link to feature ticket]`

### 3. Business & Architectural Justification

- **Why is this package strictly required?**
  > _Explain why this cannot be solved using existing libraries in the repo (e.g. Zod, Mongoose, Native Node/Browser APIs)._

### 4. Alternatives Considered

- **Native Implementation Feasibility:**
  > _Can standard JavaScript/TypeScript language features achieve this?_
- **Other Packages Evaluated:**
  > _Why was this specific package chosen over lighter or more widely-adopted alternatives?_

### 5. Bundle & Performance Impact

- **Bundlephobia Size:** `[e.g. Minified: 12 KB, Gzipped: 3.8 KB]`
- **Tree-shaking Support:** `[Yes / No]`
- **Transitive Dependency Count:** `[e.g. 0 dependencies]`

### 6. Security & Maintenance Audit

- **Weekly NPM Downloads:** `[e.g. > 2,000,000]`
- **Open Security Advisories / CVEs:** `[None / Link to audit]`
- **Maintenance Status:** `[Actively maintained / Last commit date]`

---

### Team 01 Signoff Checklist (Internal)

- [ ] Validated non-redundancy with existing monorepo dependencies
- [ ] Audited `npm audit` impact
- [ ] Tested compatibility with Turborepo task graph & TypeScript strict mode
- [ ] Scheduled for Friday weekly batch dependency update
