const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendRegistrationEmail(to, name, meetup) {
  await transporter.sendMail({
    from: `"IT Yaqinlar" <${process.env.EMAIL_USER}>`,
    to,
    subject: "IT Yaqinlar meetupiga muvaffaqiyatli ro'yxatdan o'tdingiz! 🎉",
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4ade80;">Assalomu alaykum, ${name}! 👋</h2>
        <p>Siz <strong>${meetup.title}</strong> meetupiga muvaffaqiyatli ro'yxatdan o'tdingiz!</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>📅 <strong>Sana:</strong> ${new Date(meetup.date).toLocaleDateString('uz-UZ')}</p>
          <p>📍 <strong>Joy:</strong> ${meetup.venue}</p>
          <p>📌 <strong>Mavzu:</strong> ${meetup.topic}</p>
        </div>
        <p>Uchrashuv kuni siz bilan ko'rishguncha! 💚</p>
        <p style="color: #4ade80;"><strong>IT Yaqinlar jamoasi</strong></p>
      </div>
    `,
  });
}

async function sendReminderEmail(to, name, meetup) {
  await transporter.sendMail({
    from: `"IT Yaqinlar" <${process.env.EMAIL_USER}>`,
    to,
    subject: '⏰ Ertaga IT Yaqinlar meetupi!',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4ade80;">Ertaga ko'rishamiz, ${name}! 🚀</h2>
        <p><strong>${meetup.title}</strong> meetupi ertaga!</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>📅 <strong>Sana:</strong> ${new Date(meetup.date).toLocaleDateString('uz-UZ')}</p>
          <p>📍 <strong>Joy:</strong> ${meetup.venue}</p>
          <p>📌 <strong>Mavzu:</strong> ${meetup.topic}</p>
        </div>
        <p>Tayyor bo'ling! 💚</p>
        <p style="color: #4ade80;"><strong>IT Yaqinlar jamoasi</strong></p>
      </div>
    `,
  });
}

module.exports = { sendRegistrationEmail, sendReminderEmail };
