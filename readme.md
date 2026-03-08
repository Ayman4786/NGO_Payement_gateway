# NGO Donation System – Backend

This backend powers an NGO donation platform where users can donate through Razorpay and receive an automated email receipt with a PDF attachment.

The system includes payment verification, webhook handling, database storage, email delivery, and security protections.

---

# Tech Stack

Frontend

* React
* Vite
* TypeScript

Backend

* Node.js
* Express.js

Payments

* Razorpay

Database

* PostgreSQL

Email Service

* SendGrid

PDF Generation

* PDFKit

Security

* express-validator
* express-rate-limit

Local Webhook Testing

* ngrok

---

# Backend Folder Structure

```
ngo-backend/
│
├── server.js
├── receiptGenerator.js
├── package.json
└── .env
```

---

# Installation Guide

## 1. Clone the Repository

```
git clone <repository-url>
```

Enter the backend folder:

```
cd NGO_Payment_Gateway/ngo-backend
```

---

# Install Dependencies

Run:

```
npm install
```

Packages used in this project:

```
express
cors
razorpay
body-parser
dotenv
crypto
pg
express-validator
express-rate-limit
@sendgrid/mail
pdfkit
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

Example:

```
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

SENDGRID_API_KEY=your_sendgrid_api_key

RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

# PostgreSQL Setup

Install PostgreSQL and create a database.

Open PostgreSQL terminal:

```
psql -U postgres
```

Create database:

```
CREATE DATABASE ngo_donations;
```

Connect to database:

```
\c ngo_donations
```

Create donations table:

```
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_name TEXT NOT NULL,
    email TEXT NOT NULL,
    amount INTEGER NOT NULL,
    order_id TEXT,
    payment_id TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Running the Backend

Inside the backend folder run:

```
node server.js
```

Expected output:

```
Server running on port 5000
```

---

# Razorpay Setup

Create a Razorpay account.

Go to:

```
Dashboard → Settings → API Keys
```

Generate:

```
Key ID
Key Secret
```

Add them to `.env`.

---

# Razorpay Webhook Setup

A webhook is required to confirm payments even if the frontend fails.

Webhook endpoint:

```
POST /razorpay-webhook
```

---

# ngrok Setup (for Local Webhook Testing)

Install ngrok:

```
npm install -g ngrok
```

Login and add authtoken:

```
ngrok config add-authtoken YOUR_TOKEN
```

Start tunnel:

```
ngrok http 5000
```

Example output:

```
Forwarding https://xxxxx.ngrok-free.app -> http://localhost:5000
```

Use the HTTPS URL for Razorpay webhook.

Example:

```
https://xxxxx.ngrok-free.app/razorpay-webhook
```

---

# SendGrid Email Setup

Create account:

```
https://sendgrid.com
```

Create API key:

```
Settings → API Keys
```

Add API key to `.env`.

Verify sender email:

```
Settings → Sender Authentication
```

Use the verified sender email inside `server.js`.

---

# Donation Flow

1. User enters name, email, amount
2. Frontend calls:

```
POST /create-order
```

3. Backend:

* validates input
* creates Razorpay order
* stores donation in database

4. Razorpay checkout opens.

5. After payment success frontend calls:

```
POST /payment-success
```

6. Backend verifies payment signature.

7. Donation record updated:

```
status = paid
payment_id stored
```

8. SendGrid sends email receipt.

9. Email includes PDF donation receipt.

---

# Security Implemented

The backend includes:

* Razorpay signature verification
* Webhook signature verification
* Input validation
* Rate limiting
* Idempotency protection
* Environment variables

---

# API Endpoints

Create Razorpay Order

```
POST /create-order
```

Verify Payment

```
POST /payment-success
```

Razorpay Webhook

```
POST /razorpay-webhook
```

---

# Email Receipt

When a payment succeeds:

* SendGrid sends a confirmation email
* A PDF donation receipt is generated
* The PDF is attached to the email

---

# Notes

Emails may appear in spam during development because domain authentication is not configured.

Production systems should enable:

```
SendGrid Domain Authentication
```

---

# Future Improvements

Possible production upgrades:

* Deploy backend to Render / Railway
* Deploy frontend to Vercel
* Domain authentication for SendGrid
* Admin dashboard
* Donation analytics
* Monitoring and logging

---

# Author

Backend developed as part of an NGO Donation Payment System project.
