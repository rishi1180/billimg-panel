const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./data/db.sqlite');
const bcrypt = require('bcrypt');

router.get('/login',(req,res)=> res.render('login'));
router.post('/login',(req,res)=>{
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if(!user){ req.flash('error','Invalid'); return res.redirect('/auth/login'); }
  if(!bcrypt.compareSync(password, user.password)){ req.flash('error','Invalid'); return res.redirect('/auth/login'); }
  req.session.user = { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin };
  if(user.is_admin) return res.redirect('/admin');
  res.redirect('/dashboard');
});

router.get('/register',(req,res)=> res.render('register'));
router.post('/register',(req,res)=>{
  const { name, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    db.prepare('INSERT INTO users (email,password,name) VALUES (?,?,?)').run(email,hash,name);
    req.flash('success','Registered. Please login.');
    res.redirect('/auth/login');
  } catch(e){
    req.flash('error','Email exists or error.');
    res.redirect('/auth/register');
  }
});

router.get('/logout',(req,res)=>{ req.session.destroy(()=>res.redirect('/')); });

module.exports = router;
