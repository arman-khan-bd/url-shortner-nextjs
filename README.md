# UrlHum - A Next.js URL Shortener with Firebase

This is a full-stack URL shortener application built with Next.js, TypeScript, ShadCN UI, Tailwind CSS, and Firebase.

## Features

- Shorten long URLs to a unique, short code.
- Custom alias for short URLs.
- User authentication (Email/Password and Google).
- Dashboard for authenticated users to view their created links.
- Click tracking for each short link.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Firebase Project Setup

First, you need to set up a Firebase project to handle authentication and database storage.

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click on "Add project" and follow the on-screen instructions to create a new project.

2.  **Enable Firestore:**
    *   In your new project's dashboard, go to the **Build** section in the left sidebar and click **Firestore Database**.
    *   Click **Create database**.
    *   Start in **test mode**. This will allow open access initially. The repository's `firestore.rules` file will secure it.
    *   Choose a location for your database.

3.  **Enable Firebase Authentication:**
    *   Go to the **Build** section and click **Authentication**.
    *   Click **Get started**.
    *   Under the "Sign-in method" tab, enable **Email/Password** and **Google**.

4.  **Register a Web App:**
    *   Go back to your Project Overview by clicking the project name at the top of the sidebar.
    *   Click the Web icon (`</>`) to add a new web app to your project.
    *   Give your app a nickname (e.g., "UrlHum Web").
    *   Click **Register app**.
    *   You will be shown a `firebaseConfig` object. Copy these keys and values. We'll need them in the next step.

### 2. Local Project Configuration

Now, let's configure the Next.js application to connect to your new Firebase project.

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    *   Rename the `.env.example` file to `.env`.
    *   Open the `.env` file and paste the values you copied from the `firebaseConfig` object in the Firebase console.

    Your `.env` file should look like this:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:123...
    ```

4.  **Configure Authorized Domains:**
    *   For Google Sign-In to work during local development, you need to add `localhost` to the list of authorized domains.
    *   In the Firebase Console, go to **Authentication** > **Settings** tab.
    *   Under **Authorized domains**, click **Add domain**.
    *   Enter `localhost` and click **Add**.

### 3. Run the Development Server

You're all set! Start the development server.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can now register users, log in, and start creating short URLs!
