const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('./admin');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const meetups = await prisma.meetup.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { _count: { select: { registrations: true } } },
    });
    res.json(meetups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const meetup = await prisma.meetup.findUnique({
      where: { id: Number(req.params.id) },
      include: { registrations: true, history: true },
    });
    if (!meetup) return res.status(404).json({ error: 'Topilmadi' });
    res.json(meetup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, date, venue, topic, status } = req.body;
    const meetup = await prisma.meetup.create({
      data: { title, date: new Date(date), venue, topic, status: status || 'upcoming' },
    });
    res.status(201).json(meetup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, date, venue, topic, status } = req.body;
    const meetup = await prisma.meetup.update({
      where: { id: Number(req.params.id) },
      data: { title, date: new Date(date), venue, topic, status },
    });
    res.json(meetup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.registration.deleteMany({ where: { meetupId: Number(req.params.id) } });
    await prisma.history.deleteMany({ where: { meetupId: Number(req.params.id) } });
    await prisma.meetup.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
