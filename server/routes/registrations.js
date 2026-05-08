const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('./admin');
const { sendRegistrationEmail } = require('../emailService');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { name, contact, meetupId } = req.body;
    if (!name || !contact || !meetupId) {
      return res.status(400).json({ error: "Barcha maydonlar to'ldirilishi shart" });
    }
    if (!contact.includes('@')) {
      return res.status(400).json({ error: "Emailni to'g'ri kiriting" });
    }
    const meetup = await prisma.meetup.findUnique({ where: { id: Number(meetupId) } });
    if (!meetup) return res.status(404).json({ error: 'Meetup topilmadi' });

    const existing = await prisma.registration.findFirst({
      where: { contact, meetupId: Number(meetupId) },
    });
    if (existing) {
      return res.status(400).json({ error: "Siz allaqachon bu meetupga ro'yxatdan o'tgansiz!" });
    }

    const registration = await prisma.registration.create({
      data: { name, contact, meetupId: Number(meetupId) },
    });

    sendRegistrationEmail(contact, name, meetup).catch(() => {});

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const { meetupId } = req.query;
    const where = meetupId ? { meetupId: Number(meetupId) } : {};
    const registrations = await prisma.registration.findMany({
      where,
      include: { meetup: { select: { title: true, date: true } } },
      orderBy: { id: 'desc' },
    });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await prisma.registration.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
