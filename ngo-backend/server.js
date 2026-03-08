const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const sgMail = require("@sendgrid/mail");
const generateReceipt = require("./receiptGenerator");


dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ngo_donations",
  password: "admin",
  port: 5432,
});


const app = express();
app.use(cors());
app.use(bodyParser.json());

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// CREATE ORDER
app.post(
  "/create-order",
  createOrderLimiter,
  [
    body("donorName").notEmpty().withMessage("Name is required"),
    body("donorEmail").isEmail().withMessage("Valid email required"),
    body("amount").isInt({ min: 10 }).withMessage("Minimum donation is ₹10"),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    console.log("🔥 /create-order HIT");
    console.log("Request Body:", req.body);

    const { amount, donorName, donorEmail } = req.body;

    try {

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };

      const order = await razorpay.orders.create(options);

      console.log("🔥 Razorpay Order Response:", order);

      await pool.query(
        `INSERT INTO donations (donor_name, email, amount, order_id, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [donorName, donorEmail, amount, order.id, "created"]
      );

      res.json({
        success: true,
        order,
      });

    } catch (error) {

      console.error("Error creating Razorpay order:", error);

      res.status(500).json({
        success: false
      });
    }
});



// PAYMENT SUCCESS
app.post("/payment-success", async (req, res) => {

  console.log("🔥 /payment-success endpoint hit");

  const {
    donorName,
    donorEmail,
    amount,
    orderId,
    paymentId,
    razorpay_signature
  } = req.body;

  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }

  const emailHtml = `
    <h2>Thank You for Your Donation!</h2>
    <p>Dear <b>${donorName}</b>,</p>
    <p>Your donation of <b>₹${amount}</b> has been received successfully.</p>

    <h3>Your Donation Receipt</h3>
    <p><b>Order ID:</b> ${orderId}</p>
    <p><b>Payment ID:</b> ${paymentId}</p>

    <br/>
    <p>We truly appreciate your support ❤️</p>
  `;

  try {

    await pool.query(
      `UPDATE donations
       SET payment_id = $1, status = $2
       WHERE order_id = $3`,
      [paymentId, "paid", orderId]
    );

    console.log("✅ Donation record updated safely");

    // Generate PDF receipt
    const pdfBuffer = await generateReceipt(
      donorName,
      amount,
      orderId,
      paymentId
    );

    console.log("📨 Attempting to send email via SendGrid");

    const msg = {
      to: donorEmail,
      from: "khanayman4786@gmail.com",
      subject: "Thank You for Your Donation!",
      html: emailHtml,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: "donation-receipt.pdf",
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    };

    const response = await sgMail.send(msg);

    console.log("📧 SendGrid response:", response);
    console.log("📧 Email with PDF receipt sent");

    res.json({ success: true });

  } catch (error) {

    console.error("❌ Payment-success error:", error.response?.body || error);

    res.status(500).json({
      success: false,
      message: "Email not sent"
    });
  }

});



// WEBHOOK
app.post("/razorpay-webhook", async (req, res) => {

  console.log("🔥 Razorpay webhook received");

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const razorpaySignature = req.headers["x-razorpay-signature"];

  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    console.log("❌ Invalid webhook signature");
    return res.status(400).send("Invalid signature");
  }

  console.log("✅ Webhook signature verified");

  const event = req.body.event;

  if (event === "payment.captured") {

    const payment = req.body.payload.payment.entity;

    const orderId = payment.order_id;
    const paymentId = payment.id;

    console.log("💰 Payment captured via webhook:", paymentId);

    const existingPayment = await pool.query(
      `SELECT payment_id FROM donations WHERE order_id = $1`,
      [orderId]
    );

    if (existingPayment.rows[0]?.payment_id) {

      console.log("⚠️ Payment already processed, skipping...");

    } else {

      await pool.query(
        `UPDATE donations
         SET payment_id = $1, status = $2
         WHERE order_id = $3`,
        [paymentId, "paid", orderId]
      );

      console.log("✅ Donation record updated safely");
    }
  }

  res.json({ status: "ok" });
});



app.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);