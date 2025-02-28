# NOMO Nouns Web Application

This package contains the NOMO Nouns web application and Firebase functions.

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
   firebase emulators:start --project demo-nomo-nouns --import="fixtures/database_export"
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

## Firebase Functions

The Firebase functions are located in the `functions` directory. To build and deploy them:

```bash
# Navigate to the functions directory
cd functions

# Build the functions
yarn build

# Deploy to preview environment
yarn deploy

# Deploy to production environment
yarn deploy:prod
```

## Updating the Contract SDK

When new contracts are deployed or contract addresses change, you'll need to update the contract SDK:

1. Follow the instructions in the [contract-sdks README](../contract-sdks/README.md) to update and build the SDK.

2. Move the generated tarball to the functions directory:
   ```bash
   mv ../contract-sdks/nomo-nouns-contract-sdks-x.y.z.tgz ./functions/
   ```

3. Update the functions package.json:
   ```bash
   cd functions
   yarn add file:./nomo-nouns-contract-sdks-x.y.z.tgz
   ```

4. Build the functions:
   ```bash
   yarn build
   ```

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