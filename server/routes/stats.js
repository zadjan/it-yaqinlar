const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const [meetuplar, ishtirokchilar, otgan] = await Promise.all([
      prisma.meetup.count(),
      prisma.registration.count(),
      prisma.meetup.count({ where: { status: 'past' } }),
    ]);
    res.json({ meetuplar, ishtirokchilar, otgan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
