# NOMO Nouns

This repository houses the NOMO Nouns project, a monorepo containing multiple packages:

- **nomo-nouns-webapp**: The web application and Firebase functions
- **nomo-nouns-contracts**: Smart contracts for the NOMO Nouns protocol
- **contract-sdks**: TypeScript SDK for interacting with deployed contracts

The project uses **Lerna** for managing multiple packages. Follow these instructions to set up, clean, and run the project.

## Setup Instructions

This project requires Node.js version 18.17. If you use nvm, you can install and use the correct version with:

```bash
nvm install 18.17
nvm use 18.17
```

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

## Running the Web Application

See the [nomo-nouns-webapp README](./packages/nomo-nouns-webapp/README.md) for detailed instructions on running the web application.

## Contract Deployment

See the [nomo-nouns-contracts README](./packages/nomo-nouns-contracts/README.md) for detailed instructions on deploying and interacting with the smart contracts.

## SDK Development

See the [contract-sdks README](./packages/contract-sdks/README.md) for detailed instructions on updating and building the contract SDK.

## Lerna Configuration

Lerna is configured to manage packages in the `packages` folder. The `lerna.json` configuration includes:

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

## Important Notes

- **Custom `@nomonouns/assets` Package**: This project uses a forked version of the `@nouns/assets` package, maintained by Benbodhi, found [here](https://github.com/benbodhi/nouns-monorepo/tree/master/packages/nouns-assets). This package is included as `@nomonouns/assets` and serves as a custom asset handler for the project. We decided to maintain our own so we can integrate new nouns traits as soon as they're added to the protocol.

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
