# Semantic Versioning (SemVer)

---

## Understanding the Version Number (SemVer)

SemVer uses a `Major.Minor.Patch` format (`3.23.8`).

- **Major (3):** Breaking changes.
- **Minor (23):** New features, but backward compatible.
- **Patch (8):** Bug fixes, backward compatible.

Look for the version that has the most downloads
or is listed as `latest` in the npm tags.

---

### 2. The "NPM Way" to Check Versions

```bash
## Show the "official" current version.
# Always install the version labeled **`latest`**.
npm view zod dist-tags

## View All Recent Versions
# If you want to see a history of what was released and when:
npm view zod versions --json

## How to check what YOU are using
# Shows what you have installed
npm list zod
# Shows if there is a newer stable version available
npm outdated

## Download specific version
npm install zod@3

## Check for Deprecation
npm view zod@3.23.8 deprecated
```
