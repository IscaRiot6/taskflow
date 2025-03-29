import express from 'express'
import nodemailer from 'nodemailer' // Using ES module import
import dotenv from 'dotenv' // Using ES module import

dotenv.config()

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS // App Password
      }
    })

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Email not sent', error })
  }
})

export default router // Use default export here
