require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendReminderEmail } = require('./emailService');

const meetupsRouter = require('./routes/meetups');
const registrationsRouter = require('./routes/registrations');
const historyRouter = require('./routes/history');
const adminRouter = require('./routes/admin');
const statsRouter = require('./routes/stats');

const prisma = new PrismaClient();

// Har kuni ertalab 9:00 da eslatma emaillar yuboriladi
cron.schedule('0 9 * * *', async () => {
  const ertaga = new Date();
  ertaga.setDate(ertaga.getDate() + 1);

  const meetuplar = await prisma.meetup.findMany({
    where: {
      date: {
        gte: new Date(ertaga.setHours(0, 0, 0, 0)),
        lte: new Date(ertaga.setHours(23, 59, 59, 999)),
      },
    },
    include: { registrations: true },
  });

  for (const meetup of meetuplar) {
    for (const reg of meetup.registrations) {
      if (reg.contact.includes('@')) {
        await sendReminderEmail(reg.contact, reg.name, meetup);
      }
    }
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/meetups', meetupsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/history', historyRouter);
app.use('/api/admin', adminRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'IT Yaqinlar API' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
