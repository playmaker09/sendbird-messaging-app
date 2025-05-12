# 📨 Sendbird Messaging App – FSD Test Task (05.2025)

This project is a full-stack messaging app built using **Sendbird UIKit**, **Next.js**, and a custom **Express + PostgreSQL** backend. It implements dynamic user management, real-time chat channels, and event-based tracking per the FSD Test guidelines.

> ✍️ Developed by **Les Paul Mendiola**  
> 🔗 [GitHub Repository](https://github.com/playmaker09/sendbird-messaging-app)

---

## 📦 Tech Stack

**Frontend**:

- Next.js (React Framework)
- Tailwind CSS
- Sendbird UIKit for React

**Backend**:

- Node.js + Express.js
- Prisma ORM
- PostgreSQL

---

## 🚀 Features

### 👤 User Management

- Auto-creates a user when the app is accessed.
- Allows nickname and profile image updates via the channel list header.
- Backend tracks user creation, updates, and soft deletes.

### 💬 Channel Management

- Saves new **1-on-1 channels** created in Sendbird.
- Persists:
  - Channel URL
  - Creator ID
  - Chatmate ID
  - Creation timestamp
  - Message count (default 0)
  - Deletion status

---

## 🛠 API Endpoints

The project uses file-based API routing via Next.js (`pages/api/`). Below is the structure and usage:

### 📁 `/pages/api/`

#### 📂 `channel/`

| File                         | Endpoint                               | Method  | Purpose                              |
| ---------------------------- | -------------------------------------- | ------- | ------------------------------------ |
| `create-channel.ts`          | `/api/channel/create-channel`          | `POST`  | Save new 1-on-1 channel details      |
| `increment-message-count.ts` | `/api/channel/increment-message-count` | `PATCH` | Increment message count in a channel |

#### 📂 `user/`

| File             | Endpoint                | Method  | Purpose                                     |
| ---------------- | ----------------------- | ------- | ------------------------------------------- |
| `create-user.ts` | `/api/user/create-user` | `POST`  | Save new user to DB (triggered on app load) |
| `update-user.ts` | `/api/user/update-user` | `PATCH` | Update nickname and/or profile image        |

#### 📂 `sendbird/`

| File           | Endpoint                  | Method | Purpose                                     |
| -------------- | ------------------------- | ------ | ------------------------------------------- |
| `token.ts`     | `/api/sendbird/token`     | `GET`  | Handle token-based auth (optional)          |
| `token-get.ts` | `/api/sendbird/token-get` | `GET`  | Get tokens (optional; for internal testing) |

---

## ⚙ Setup Guide

### 🔑 Prerequisites

- Node.js v18+
- PostgreSQL (or use provided remote credentials)
- Sendbird account (to obtain `APP_ID`)

### 📁 Installation

```bash
git clone https://github.com/playmaker09/sendbird-messaging-app.git
cd sendbird-messaging-app
npm install
```
