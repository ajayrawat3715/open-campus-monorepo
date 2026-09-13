# GitHub Branch Protection & Ruleset Configuration Guide

This document instructs repository administrators on configuring GitHub branch rulesets for the `main` branch to guarantee codebase stability across 13 engineering teams.

---

## 🎯 Target Policy Objectives

1. **Protect `main`:** Direct pushes to `main` are strictly blocked.
2. **Mandatory Peer Reviews:** Every change must arrive via Pull Request with at least one code approval.
3. **Mandatory CI Pipeline Pass:** No PR can merge unless all checks (`lint`, `typecheck`, `test`, `build`) pass.
4. **Preserve Linear History:** Force pushes (`git push --force`) are permanently disabled.
5. **Enforce CODEOWNERS:** Any changes touching infrastructure owned by Team 01 require Team 01 approval.

---

## 🛠️ Step-by-Step GitHub Setup Guide

### Method A: GitHub Repository Rulesets (Recommended)

1. Navigate to your repository on GitHub: `https://github.com/<org>/college-management-system`.
2. Click **Settings** > **Rules** > **Rulesets**.
3. Click **New ruleset** > **New branch ruleset**.
4. Set **Ruleset Name:** `main-branch-protection`.
5. Set **Enforcement status:** `Active`.
6. Under **Target branches**, select **Add target** > **Include default branch**.

### Configuration Rules:

#### 1. Restrict Deletions & Force Pushes

- Check `Restrict deletions` (prevents deleting `main`).
- Check `Block force pushes` (prevents history rewriting).

#### 2. Require a Pull Request Before Merging

- Check `Require a pull request before merging`.
- **Required approvals:** `1` (or `2` for production branches).
- Check `Dismiss stale pull request approvals when new commits are pushed`.
- Check `Require review from Code Owners`.
- Check `Require conversation resolution before merging`.

#### 3. Require Status Checks to Pass Before Merging

- Check `Require status checks to pass`.
- Check `Require branches to be up to date before merging`.
- Add the required jobs from our `.github/workflows/ci.yml`:
  - `Lint, Typecheck, Test & Build` (or individual job identifiers).

---

## 🔍 Required CI Status Checks Table

| Check Name                     | Source Workflow | Purpose                                                 |
| ------------------------------ | --------------- | ------------------------------------------------------- |
| `Run Linter`                   | `ci.yml`        | Validates ESLint rules and no unused variables          |
| `Run Typecheck`                | `ci.yml`        | Strict TypeScript compiler validation across workspaces |
| `Run Unit & Integration Tests` | `ci.yml`        | Executes package and app test suites                    |
| `Build Monorepo Artifacts`     | `ci.yml`        | Verifies clean distribution builds                      |

---

## 🚨 Emergency Bypass & Escalation

- Only repository administrators and designated Team 01 infrastructure leads hold bypass authorization for production emergencies.
- Any emergency bypass requires an associated post-incident review (PIR) and tracking issue.
