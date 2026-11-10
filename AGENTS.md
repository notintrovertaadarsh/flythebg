# Mandatory Engineering Rules — FlyThe BG

These rules apply to every human, AI agent, automation, and contributor changing this repository. They are release gates, not suggestions. If a required check cannot be run, do not claim the change is verified or production-ready.

## 1. Inspect before editing
- Read this file, `README.md`, `docs/DEPLOYMENT_RUNBOOK.md`, the relevant source files, and the applicable workflow before changing anything.
- Identify the actual failing environment and exact failing step from its logs. Distinguish Cloudflare Workers Builds from GitHub Actions; they are separate systems.
- Reproduce the failure where possible. Record the failing command, error, expected behavior, and affected paths.
- Check recent commits and existing local conventions before proposing a fix. Do not make unrelated changes or rewrite working architecture.

## 2. Review the complete change
- Read every file that will be changed and its callers, dependencies, configuration, tests, and deployment workflow.
- Trace the affected user flow end to end, including error handling, empty/null states, permissions, network boundaries, and mobile behavior where applicable.
- Review the final diff line by line. Search for stale references, broken routes, accidental deletions, duplicate logic, debug output, TODOs, and unintended formatting or generated-file changes.
- Preserve existing product behavior, privacy promises, accessibility, SEO metadata, and security boundaries unless an explicit requirement says otherwise.

## 3. Mandatory pre-commit verification
Do not commit a code or configuration change until all applicable checks below have passed:
1. Install dependencies from the lockfile using the repository's documented package manager. Do not silently regenerate or replace the lockfile.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Run `node scripts/check-secrets.mjs`.
5. Run `node scripts/check-build.mjs` after building.
6. Run the relevant unit, integration, route, accessibility, and regression tests. Add a regression test for every reproducible bug when practical.
7. Validate the actual Cloudflare Worker bundle with Wrangler dry-run, and check required static assets and routes.
8. Inspect the final diff and confirm only intended files changed.

If a check fails: stop, inspect the full error, fix the root cause, rerun the failed check and all dependent checks. Never bypass a failing check, suppress its output, mark it optional to obtain a green result, or commit first and promise to repair it later. If a check is impossible in the available environment, explicitly report it as NOT RUN and do not describe the change as fully verified.

## 4. Debugging discipline
- Fix root causes, not symptoms. Do not guess at errors or change unrelated code to make a build appear green.
- Never use `continue-on-error`, broad catch-and-ignore logic, or unconditional success summaries to hide required failures.
- Preserve useful failure logs. Redact secrets; never print environment variables, tokens, private keys, or user data.
- After a fix, verify the original failure is gone and that adjacent behavior still works.
- If Cloudflare Workers Builds is stuck at **Initializing** before cloning/installing/building, treat it as a Cloudflare/GitHub integration, authorization, queue, or platform-status problem—not as an application compile error. Check Cloudflare status, project-to-repository connection, production branch, GitHub App repository access, and Cloudflare build logs. Do not claim a source-code commit fixes a pre-clone platform failure.
- If Cloudflare reaches clone/install/build/deploy, diagnose the exact failed phase and command. Verify the deployed Worker and production URL separately; GitHub CI success alone is not proof of deployment.

## 5. Secrets and privacy are absolute gates
- Never commit real credentials, API tokens, private keys, `.env`, `.dev.vars`, production data, or personal data. Example files may contain placeholders only.
- Keep Cloudflare deployment credentials in GitHub Actions encrypted secrets and runtime credentials in Cloudflare Worker secrets, according to the deployment runbook.
- Never move Hugging Face runtime credentials into browser code, public assets, build output, or logs.
- A working-tree scan is not a history scan. If exposure is suspected, stop deployment, revoke/rotate the credential, and inspect Git history and logs.

## 6. Deployment and release rules
- Do not deploy until mandatory validation has passed.
- Use the documented production branch and deployment route. Avoid simultaneous Cloudflare auto-deploy and manual fallback deployments.
- Verify the deployed Worker, custom domain, key routes, and relevant API behavior after deployment.
- Report separately: code checks, artifact checks, deployment result, and live-site verification. Never conflate them.
- Do not claim "fixed", "passed", or "deployed" unless the corresponding check or platform result confirms it.

## 7. Change and commit hygiene
- Make the smallest safe change that addresses the confirmed cause.
- Do not remove features, security controls, privacy protections, SEO routes, or existing configuration to make a build pass.
- Do not commit temporary diagnostics, downloaded artifacts, local environment files, or generated output unless the project explicitly tracks them.
- Use a descriptive commit message. Include the root cause and verification performed in the change summary.
- If verification is incomplete, do not commit the affected code/configuration. Ask for the missing logs or access instead.

## 8. Required completion report
Every completed task must state:
- Confirmed root cause (or clearly say it remains unconfirmed).
- Files changed and why.
- Exact checks run and their pass/fail/NOT RUN results.
- Whether Cloudflare actually deployed the new commit.
- Whether the production URL and affected feature were verified.
- Any remaining blocker and the exact action needed.

**Default rule: inspect → reproduce → diagnose → patch → test → review diff → commit → deploy → verify. Never reverse this order.**
