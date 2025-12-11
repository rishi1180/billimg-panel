# Simple Hosting Billing Panel (Demo)

This is a lightweight demo of a hosting billing panel with:
- Admin panel (manage plans, users, orders)
- User panel (register, buy plan, view invoices)
- Invoice PDF generation (no real payment gateways included — placeholders only)

## Quick start

1. Install Node.js (v16+ recommended).
2. Extract the zip and run:
   ```bash
   cd simple-hosting-billing
   npm install
   cp .env.example .env
   # Edit .env if you want, then:
   npm run init-db
   npm start
   ```
3. Open `http://localhost:3000` in your browser.
4. Admin login: use ADMIN_EMAIL and ADMIN_PASSWORD from `.env`.

## Notes
- Payment integrations are stubbed. See `routes/payment.js` and README sections for how to add Razorpay / Stripe.
- This project uses SQLite (file `data/db.sqlite`) for simplicity.
