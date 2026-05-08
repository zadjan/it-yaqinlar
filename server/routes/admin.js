const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'it-yaqinlar-secret-key';

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token talab qilinadi' });
  }
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Noto'g'ri yoki muddati o'tgan token" });
  }
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: "Email yoki parol noto'g'ri" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Email yoki parol noto'g'ri" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({ data: { email, password: hashed } });
    res.status(201).json({ id: admin.id, email: admin.email });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Bu email allaqachon mavjud' });
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
