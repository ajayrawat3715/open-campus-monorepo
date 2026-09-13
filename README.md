# College Management System Monorepo

> **Production-grade npm workspaces + Turborepo infrastructure supporting 13 feature teams and 43 contributors.**  
> Maintained by **TEAM 01: Platform, Infrastructure, Database Foundation, CI/CD and Testing**.

---

## 🏛️ Project Architecture

```
college-management-system/
├── apps/
│   ├── admin/             # Administrator Portal (Express / Serverless API)
│   ├── student/           # Student Portal
│   ├── teacher/           # Faculty & Teacher Portal
│   └── web/               # Public Web Portal & Landing Pages
│
├── packages/
│   ├── config/            # Centralized environment variable validation (Zod)
│   ├── http/              # Standardized HTTP payloads, asyncHandler, and errorHandler
│   ├── client/            # Universal typed fetch API client
│   ├── models/            # Database connection cache (serverless-safe) and core models
│   └── validation/        # Shared cross-team Zod validation schemas
│
├── scripts/
│   └── seed/              # Multi-team idempotent database seeding engine
│
├── tests/
│   └── e2e/               # Playwright end-to-end testing suite
│
├── docs/
│   ├── onboarding.md      # 15-minute new developer setup guide
│   └── github-branch-rules.md # Branch protection & ruleset documentation
│
├── .github/
│   ├── workflows/ci.yml   # Fast CI pipeline (<3m) with caching
│   ├── CODEOWNERS         # Monorepo code ownership rules
│   └── ISSUE_TEMPLATE/    # RFC template for Week 1 dependency freeze
│
├── package.json           # npm workspaces root configuration
├── turbo.json             # Turborepo task pipeline definition
└── tsconfig.base.json     # Strict shared TypeScript configuration
```

---

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone <repo-url>
cd college-management-system

# 2. Install dependencies (npm workspaces)
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Populate foundational database data
npm run seed

# 5. Launch all portals in development mode
npm run dev
```

For complete setup details, refer to [docs/onboarding.md](docs/onboarding.md).

---

## 🚀 Commands Reference

All core commands are orchestrated through Turborepo or root npm scripts:

| Command             | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Runs all applications concurrently with live hot-reload            |
| `npm run build`     | Builds all packages and applications according to dependency graph |
| `npm run lint`      | Lints all workspaces using ESLint                                  |
| `npm run typecheck` | Validates TypeScript types across all workspaces with zero emit    |
| `npm run test`      | Executes package and app test suites                               |
| `npm run test:e2e`  | Runs Playwright browser end-to-end smoke tests                     |
| `npm run seed`      | Runs the multi-team idempotent MongoDB seed engine                 |
| `npm run format`    | Auto-formats code with Prettier                                    |

---

## 🛡️ Important Development Rules

1. **No Inter-Team HTTP Calls:** Services must not call other internal services over HTTP. Instead, read models directly using `@cms/models` for read-only access.
2. **Dependency Freeze Policy:** All external dependencies are frozen after Week 1. To request a new dependency, file an issue using `.github/ISSUE_TEMPLATE/dependency-request.md`.
3. **Serverless Database Safety:** Always connect to MongoDB using `connectDB()` from `@cms/models`. It implements a global memoized cache to prevent connection pool exhaustion on Vercel.
4. **Model Registration:** Always define Mongoose models with `defineModel()` from `@cms/models` to prevent `OverwriteModelError`.
5. **Standardized Responses:** All HTTP handlers must use `successResponse` or `errorResponse` from `@cms/http`.

---

## 🗄️ Database Foundation & Seeding

### Serverless-Safe Connection Cache

In serverless environments like Vercel, requests can hit cold or warm containers unpredictably. The connection manager in `packages/models/src/db.ts` caches both the connection instance (`conn`) and in-flight connection promise (`promise`) on `global.mongooseCache`. This ensures:

- Existing connections are reused across warm invocations.
- Concurrent requests during cold starts share the exact same handshake promise.
- Zero connection leakage or connection pool exhaustion.

### Multi-Team Seed System

The seeder located in `scripts/seed/` is designed for seamless multi-team contribution:

- `scripts/seed/core.seed.ts`: Seeds core Admins, Teachers, Students, Departments, Courses, and Classes.
- `scripts/seed/index.ts`: Master orchestrator. To add a feature seed:
  1. Create `scripts/seed/<feature>.seed.ts`
  2. Add your function to the `seeders` pipeline in `scripts/seed/index.ts`.

---

## 🧪 Testing & E2E Harness

- **Playwright Configuration:** `playwright.config.ts` auto-starts the web server and captures traces/screenshots on failure.
- **Reusable Test Helpers:** Feature teams can import `loginUser` from `tests/e2e/helpers/auth.ts`.
- **Writing Tests:** Feature teams add tests to `tests/e2e/<feature>.spec.ts`.

---

## ☁️ Deployment Architecture (Vercel)

Each application (`apps/admin`, `apps/student`, `apps/teacher`, `apps/web`) has its own `vercel.json` configured with:

- **Serverless API Support:** Entry point at `apps/*/api/index.ts`.
- **Build Suppression:** `npx turbo-ignore` ensures PRs and commits only build and deploy the applications that have actual changes, preventing Vercel build limit exhaustion.
