const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./data/db.sqlite');

router.get('/', (req, res) => {
  const plans = db.prepare('SELECT * FROM plans').all();
  res.render('index', { plans });
});

router.get('/dashboard', (req, res) => {
  if(!req.session.user) return res.redirect('/auth/login');
  const orders = db.prepare('SELECT o.*, p.name as plan_name FROM orders o JOIN plans p ON p.id = o.plan_id WHERE o.user_id = ?').all(req.session.user.id);
  res.render('dashboard',{ orders });
});

router.get('/buy/:planId', (req, res) => {
  if(!req.session.user) return res.redirect('/auth/login');
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.planId);
  if(!plan){ req.flash('error','Plan not found'); return res.redirect('/'); }
  res.render('buy',{ plan });
});

router.post('/buy/:planId', (req, res) => {
  if(!req.session.user) return res.redirect('/auth/login');
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.planId);
  const insert = db.prepare('INSERT INTO orders (user_id,plan_id,status) VALUES (?,?,?)');
  const info = insert.run(req.session.user.id, plan.id, 'pending');
  req.flash('success','Order created. Proceed to payment (demo).');
  res.redirect('/dashboard');
});

module.exports = router;
