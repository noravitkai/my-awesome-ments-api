# A Hungarian Mythical Creatures API

![Build Status](https://github.com/noravitkai/my-awesome-ments-api/actions/workflows/main.yaml/badge.svg)

A REST API built with **Express** and **MongoDB** to manage and browse mythical creatures from Hungarian folklore.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Cloud Services**: Cloudinary (image uploads)
- **Testing**: Playwright
- **CI/CD**: GitHub Actions + Render Deploy Hooks
- **Documentation**: Swagger UI

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run start-dev
```

### Configure environment variables

#### .env example

```
PORT=
TOKEN_SECRET=
DBHOST=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### .env.development example

```
DBHOST=
```

#### .env.test example

```
DBHOST=
```

## Running Tests

Run the tests with:

```bash
npm test
```

Or run the server is test mode:

```bash
npm run test-db
```

## Deployment

This project is deployed using GitHub Actions and Render Deploy Hooks.
Every push to the `master` branch:

1. Runs the test suite
2. Deploys the app to production if tests pass

## API Docs

Swagger UI is available at: [https://my-awesome-ments-api.onrender.com/api/docs/](https://my-awesome-ments-api.onrender.com/api/docs/)
