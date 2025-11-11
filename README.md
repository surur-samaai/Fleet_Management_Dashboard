# Welcome to your Lovable project

## Project info

**URL**: [https://lovable.dev/projects/ee90576d-a05e-4e5a-80d4-877e2aec5bfa](https://lovable.dev/projects/ee90576d-a05e-4e5a-80d4-877e2aec5bfa)

**Project Overview:** Fleet Management Dashboard

This project is a React/TypeScript application built on Vite and Tailwind CSS (Shadcn UI components) for monitoring and managing a fleet of vehicles.
The Firebase Authentication system is now fully integrated and functional, with environment variables securely configured.

---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ee90576d-a05e-4e5a-80d4-877e2aec5bfa) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

* Navigate to the desired file(s).
* Click the "Edit" button (pencil icon) at the top right of the file view.
* Make your changes and commit the changes.

**Use GitHub Codespaces**

* Navigate to the main page of your repository.
* Click on the "Code" button (green button) near the top right.
* Select the "Codespaces" tab.
* Click on "New codespace" to launch a new Codespace environment.
* Edit files directly within the Codespace and commit and push your changes once you're done.

---

## What technologies are used for this project?

This project is built with:

* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS
* Firebase Authentication
* React Router DOM

---

## 🔐 Authentication Architecture (Current State)

Firebase Authentication is now **fully integrated and functional**.
All credentials are securely loaded from environment variables, and user sessions persist correctly across reloads.

**Key Highlights**


---

## ✅ Current Implementation Summary

* Firebase Authentication (Email/Password) ✅
* `.env` configuration and `.gitignore` setup ✅
* Global AuthContext for login, signup, logout ✅
* Persistent authentication state ✅
* Protected routing via React Router ✅
* UI connection between Sidebar and AuthContext ✅

---

## 🛣️ Next Steps: Role-Based Access Control (RBAC)

The next planned feature is **Role-Based Access Control (RBAC)** to differentiate user experiences (e.g., admin vs driver).

**Implementation Plan:**

1. **Store Roles** — Save each user’s role in Firestore (`users/{uid}/role`).
2. **Expose Role** — Extend `useAuth()` to include the user’s role.
3. **Protected Routes** — Redirect users based on role (e.g., `/admin` vs `/driver-dashboard`).
4. **Sidebar Filtering** — Display navigation links conditionally depending on user role.

---

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ee90576d-a05e-4e5a-80d4-877e2aec5bfa) and click on **Share → Publish**.

---

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to **Project > Settings > Domains** and click **Connect Domain**.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
