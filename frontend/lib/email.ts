import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@qrs.app'

// Create transporter (reused for all emails)
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP credentials not configured, using console logger')
    return null
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter()

  if (!transporter) {
    // Dev mode: log to console
    console.log('📧 Email:', {
      to: options.to,
      subject: options.subject,
      html: options.html.substring(0, 100) + '...',
    })
    return true
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      ...options,
    })
    return true
  } catch (error) {
    console.error('Email send failed:', error)
    return false
  }
}

// Email templates mapping form types to confirmation messages
export const emailTemplates: Record<string, (name: string) => string> = {
  contact: (name: string) => `
    <h2>Thank you for contacting us, ${name}!</h2>
    <p>We've received your message and will get back to you within 24 hours.</p>
    <p>Best regards,<br>The QRS Team</p>
  `,

  'demo-request': (name: string) => `
    <h2>Demo Request Received</h2>
    <p>Hi ${name},</p>
    <p>Thank you for your interest in QRS! Our sales team will contact you within 24 hours to schedule your demo.</p>
    <p>In the meantime, check out our <a href="https://qrs.app/features">features page</a>.</p>
  `,

  support: (name: string) => `
    <h2>Support Request Received</h2>
    <p>Hi ${name},</p>
    <p>Your support request has been received. Our support team will respond shortly.</p>
  `,

  newsletter: (name: string) => `
    <h2>Welcome to QRS Newsletter!</h2>
    <p>Thank you for subscribing to our newsletter.</p>
    <p>You'll receive updates about product launches, security news, and best practices.</p>
  `,

  'privacy-request': (name: string) => `
    <h2>Privacy Request Received</h2>
    <p>Hi ${name},</p>
    <p>We've received your privacy request and will process it within the timeframe required by law.</p>
    <p>Our privacy team will contact you if we need additional information.</p>
  `,

  rfp: (name: string) => `
    <h2>RFP Received</h2>
    <p>Hi ${name},</p>
    <p>Thank you for submitting your Request for Proposal. Our team will review it and contact you shortly.</p>
  `,

  'press-inquiry': (name: string) => `
    <h2>Press Inquiry Received</h2>
    <p>Hi ${name},</p>
    <p>Thank you for your press inquiry. Our communications team will respond within 24 hours.</p>
  `,

  'partner-inquiry': (name: string) => `
    <h2>Partner Inquiry Received</h2>
    <p>Hi ${name},</p>
    <p>Thank you for your interest in partnering with QRS. Our partnership team will be in touch shortly.</p>
  `,

  'validation-report-request': (name: string) => `
    <h2>Validation Report Request Received</h2>
    <p>Hi ${name},</p>
    <p>We've received your validation report request. Our analysis team will begin processing it shortly.</p>
  `,
}

// Notification email to admin
export async function notifyAdmin(formType: string, data: Record<string, any>) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@qrs.app'
  
  return sendEmail({
    to: adminEmail,
    subject: `New ${formType} form submission`,
    html: `
      <h3>New ${formType} Form Submission</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `,
  })
}
