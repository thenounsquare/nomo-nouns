# NOMO Nouns

This repository houses the NOMO Nouns project, including the **nomo-nouns-webapp** located in the `packages` folder. The project uses **Lerna** for managing multiple packages, including the web application. Follow these instructions to set up, clean, and run the project in various modes.

## Setup Instructions

To initialize the environment, install all dependencies by running:

```bash
yarn
```

## Cleanup Commands

If you encounter issues or need to reset the environment, you can clean up with the following commands:

1. **Remove `node_modules`** (both in the root and all packages):

   ```bash
   find . -name "node_modules" -type d -exec rm -rf {} +
   ```

2. **Clear Only Vite Cache Files** (in all package `node_modules` directories):

   ```bash
   find . -path "*/node_modules/.cache/vite" -type d -exec rm -rf {} +
   ```

3. **Clear Yarn Cache**:

   ```bash
   yarn cache clean
   ```

After performing these steps, you can start fresh by re-running `yarn` or `yarn install`.

## Running the Project

The project supports different modes, which can be run as described below.

### Dev Mode

To run the project in dev mode, connecting to the Firebase **dev database** (`nomo-nouns-dev`), use:

```bash
npx lerna run dev --scope=nomo-nouns-webapp
```

### Local Emulator Mode with Firebase Export

To run in **local emulator mode** with the Firebase database set to use a local export file:

1. Start the Firebase emulators with the database import option:

   ```bash
   firebase emulators:start --project demo-nomo-nouns --import="packages/nomo-nouns-webapp/fixtures/database_export"
   ```

2. Then, in a separate terminal window, start the web app with:

   ```bash
   npx lerna run dev:emulator --scope=nomo-nouns-webapp
   ```

In this mode, the Firebase emulator will utilize the `demo-nomo-nouns` configuration and the specified local export file.

### Preview Mode

To run the project in **preview mode**, which uses the Firebase **dev database**, use (this is also set as default):

```bash
npx lerna run dev --scope=nomo-nouns-webapp --mode preview
```

## Environment Configuration

The Firebase configuration and project aliases are specified in the `.firebaserc` file:

```json
{
  "projects": {
    "default": "nomo-nouns-dev",
    "dev": "demo-nomo-nouns",
    "preview": "nomo-nouns-dev",
    "prod": "nomo-nouns-prod"
  }
}
```

- **default** and **preview**: Use the `nomo-nouns-dev` database on Firebase.
- **dev**: Uses the `demo-nomo-nouns` configuration for local emulator mode.

### Lerna Configuration

Lerna is configured to manage packages in the `packages` folder. The `lerna.json` configuration includes:

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

### Important Notes

- **Custom `@nomonouns/assets` Package**: This project uses a forked version of the `@nouns/assets` package, maintained by Benbodhi, found [here](https://github.com/benbodhi/nouns-monorepo/tree/master/packages/nouns-assets). This package is included as `@nomonouns/assets` and serves as a custom asset handler for the project. You can choose to use this npm package or the original `@nouns/assets` package in your own project. We decided to maintain our own so we can integrate new nouns traits as soon as they're added to the protocol.

## Additional Commands

- To verify project installation:

  ```bash
  firebase projects:list
  ```

- To set a Firebase project alias, use:

  ```bash
  firebase use --add <alias>
  ```

Replace `<alias>` with the appropriate project alias as defined in `.firebaserc`.

## Troubleshooting

If you experience issues with Firebase authentication, caching, or data loading, consider the following:

1. **Clear Firebase CLI Cache** (if authentication issues arise):

   ```bash
   firebase logout
   firebase login
   ```

2. **Ensure Project Aliases Are Correct**: Verify that the Firebase project aliases in `.firebaserc` match the intended configurations.

3. **Run Emulator UI**: Access the Firebase emulator UI at `http://127.0.0.1:5005` when running emulators.

4. **Check Emulator Logs**: Logs for the Firebase database and functions emulators can be found in `database-debug.log` and `ui-debug.log` within the emulator session.

For detailed debugging information, check `firebase-debug.log` for errors related to the CLI and emulators.
