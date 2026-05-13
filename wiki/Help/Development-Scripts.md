# Development Scripts

---

## NPM

```bash
npm init -y
npm i "package_name"
npm i -D "package_name"
```

---

## TypeScript

```bash
npx types-sync

npx tsc --init
npx tsc
npx tsc --noEmit

npx tsx ./src/server.ts
node ./dist/server.js
```

---

## Vitest

```bash
npx vitest
npx vitest run
npx vitest ./tests/
npx vitest ./tests/unit
```

---

## Prisma

```bash
npx prisma init
npx prisma generate
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma db push
npx prisma db pull
```

---

## Git

```bash
# Ignore Files
echo "node_modules/" >>.gitignore
echo ".env" >>.gitignore
git rm --cached filename # if you file already committed it

# Branches
git branch    # List All Branches
git branch Branch_Name # Create new branch
git checkout Branch_Name # Checking Out Branch
git branch -m old_name new_name # Renaming a Branch

## Merging
git checkout main     # 1. Switch to the destination:
git merge Branch_Name # 2. Pull in the changes:

## Workflow
git status -s
git add .
git add file1 file2
git diff
git diff --staged
git commit -m "docs: good message"
git push
git pull
```
