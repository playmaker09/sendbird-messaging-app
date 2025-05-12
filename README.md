# 📨 Sendbird Messaging App – FSD Test Task (05.2025)

This project is a full-stack messaging application built for the FSD test using **Sendbird UIKit**, **Next.js**, and a custom **Express + PostgreSQL** backend. It enables user creation, profile updates, and 1-on-1 channel tracking via custom APIs.

> ✍️ Developed by **Les Paul Mendiola**  
> 🔗 [Submission Repository](https://github.com/playmaker09/sendbird-messaging-app)

---

## 📦 Tech Stack

**Frontend**:

- [Next.js](https://nextjs.org/) (React Framework)
- [Sendbird UIKit for React](https://sendbird.com/docs/chat/uikit/v3/react/overview)
- Tailwind CSS

**Backend**:

- Node.js + Express.js
- Prisma ORM
- PostgreSQL

---

## 🚀 Features

### 👤 User Management

- Auto-generates a user when the app is loaded.
- Editable **nickname** and **profile image** via channel list header.
- Backend persists user info (ID, nickname, profile URL, timestamps, etc.).

### 💬 Channel Tracking

- Automatically saves 1-on-1 channels when created.
- Tracks:
  - Channel URL
  - Creator ID
  - Chatmate ID
  - Deletion status
  - Message count (default: 0)
  - Creation timestamp

### 🛠 Backend APIs

| Endpoint               | Description             |
| ---------------------- | ----------------------- |
| `POST /api/users`      | Save new user to DB     |
| `PATCH /api/users/:id` | Update nickname/image   |
| `POST /api/channels`   | Save new 1-on-1 channel |

---

## 🧑‍💻 Getting Started

### 🔑 Prerequisites

- Node.js v18+
- PostgreSQL (remote or local)
- Sendbird account to get `APP_ID`

### 📁 Clone & Install

```bash
git clone https://github.com/playmaker09/sendbird-messaging-app.git
cd sendbird-messaging-app
pnpm install
```
