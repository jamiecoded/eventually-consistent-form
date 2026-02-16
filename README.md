# Eventually Consistent Form

A small full-stack Next.js application that simulates **eventual consistency** in real-world distributed systems.

The app demonstrates how modern UIs handle unreliable backends using optimistic UI updates, retries, and idempotent requests — without creating duplicate submissions.

---

## 🚀 Overview

This project implements a single-page form that collects:

- email
- amount (number)

After submission, the UI immediately enters a **pending state** while a mock API responds with:

- instant success (200)
- temporary failure (503)
- delayed success (5–10s)

The goal is to model how production systems remain responsive and consistent despite unstable backend behavior.

---

## 🧠 Key Concepts Demonstrated

### 1. Eventual Consistency

The UI does not wait for the backend to finish before updating state.

Instead:


This mirrors real-world distributed workflows where systems converge to a final state over time.

---

### 2. Idempotent Submissions (Duplicate Prevention)

Each submission generates a unique `requestId`.

A **submission lock** prevents duplicate requests caused by rapid clicking or network delays.

This ensures:

- One logical submission per user action
- No duplicate records visible to the user

---

### 3. Automatic Retry Strategy

Temporary failures (503) trigger automatic retries:

- Maximum retry limit
- Controlled retry delay
- UI reflects `retrying` state

This simulates resilience patterns commonly used in production APIs.

---

### 4. UI State Machine

The interface behaves as a finite state machine:


Each state updates:

- status color
- button interactivity
- visual feedback

---

## 🎨 UX Decisions

- Immediate pending feedback prevents perceived lag
- Disabled submit button during active requests
- Clear visual status indicators
- Glassmorphism UI with responsive design

---

## 🛠 Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Mock API route
- TypeScript

---

## 📦 Running Locally

```bash
npm install
npm run dev
