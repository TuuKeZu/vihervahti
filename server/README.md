# kayttis — Minimal TypeScript project

This repository is a minimal TypeScript project where source files live in `src/` and compiled output is emitted to `bin/`.

Quick commands (fish shell):

```fish
# install dev dependencies
npm install

# build TypeScript (outputs to ./bin)
npm run build

# run the compiled output
npm start
```

Project layout created by the setup:

- `src/` — TypeScript source
- `tsconfig.json` — compiler configuration (rootDir: `src`, outDir: `bin`)
- `bin/` — compiled JavaScript output (ignored by git)
