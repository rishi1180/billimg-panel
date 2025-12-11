const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./data/db.sqlite');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

router.get('/download/:orderId', (req,res)=>{
  const order = db.prepare('SELECT o.*, p.name as plan_name, p.price FROM orders o JOIN plans p ON p.id=o.plan_id WHERE o.id = ?').get(req.params.orderId);
  if(!order) return res.status(404).send('Order not found');
  // create pdf
  const doc = new PDFDocument();
  const filename = `invoice_order_${order.id}.pdf`;
  const filepath = path.join(__dirname,'..','data',filename);
  doc.pipe(fs.createWriteStream(filepath));
  doc.fontSize(20).text('Invoice', {align:'center'});
  doc.moveDown();
  doc.text('Order ID: ' + order.id);
  doc.text('Plan: ' + order.plan_name);
  doc.text('Amount: ₹' + order.price);
  doc.end();
  // save invoice record
  db.prepare('INSERT INTO invoices (order_id, amount, file_path) VALUES (?,?,?)').run(order.id, order.price, filepath);
  res.download(filepath);
});

module.exports = router;
