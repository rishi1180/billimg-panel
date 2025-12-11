const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./data/db.sqlite');

function adminOnly(req,res,next){
  if(!req.session.user || !req.session.user.is_admin) return res.redirect('/auth/login');
  next();
}

router.get('/', adminOnly, (req,res)=>{
  const users = db.prepare('SELECT id,email,name,is_admin FROM users').all();
  const orders = db.prepare('SELECT o.*, p.name as plan_name, u.email as user_email FROM orders o JOIN plans p ON p.id=o.plan_id JOIN users u ON u.id=o.user_id').all();
  res.render('admin/index',{ users, orders });
});

router.post('/orders/:id/activate', adminOnly, (req,res)=>{
  const id = req.params.id;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('active', id);
  // generate invoice (simple)
  res.redirect('/admin');
});

module.exports = router;
