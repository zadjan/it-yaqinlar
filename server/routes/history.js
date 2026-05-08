const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('./admin');

const router = express.Router();
const prisma = new PrismaClient();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Faqat rasm fayllari qabul qilinadi'));
  },
});

router.get('/', async (req, res) => {
  try {
    const histories = await prisma.history.findMany({
      include: { meetup: { select: { title: true, date: true, topic: true } } },
      orderBy: { id: 'desc' },
    });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const history = await prisma.history.findUnique({
      where: { id: Number(req.params.id) },
      include: { meetup: true },
    });
    if (!history) return res.status(404).json({ error: 'Topilmadi' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, upload.array('photos', 20), async (req, res) => {
  try {
    const { meetupId, recap } = req.body;
    const photos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const existing = await prisma.history.findUnique({ where: { meetupId: Number(meetupId) } });
    if (existing) {
      return res.status(409).json({ error: 'Bu meetup uchun tarix allaqachon mavjud' });
    }

    const history = await prisma.history.create({
      data: { meetupId: Number(meetupId), recap, photos },
    });
    await prisma.meetup.update({
      where: { id: Number(meetupId) },
      data: { status: 'past' },
    });
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, upload.array('photos', 20), async (req, res) => {
  try {
    const { recap } = req.body;
    const newPhotos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const existing = await prisma.history.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) return res.status(404).json({ error: 'Topilmadi' });

    const photos = [...existing.photos, ...newPhotos];
    const history = await prisma.history.update({
      where: { id: Number(req.params.id) },
      data: { recap, photos },
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.history.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
