import nodemailer, { Transporter } from 'nodemailer'

interface EmailSettingsData {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  smtpSecure: boolean
  senderName: string
  contactFormEmail: string
  privacyRequestEmail: string
  sendContactConfirmation: boolean
  contactConfirmationTemplate: string
}

class EmailService {
  private transporter: Transporter | null = null
  private settings: EmailSettingsData | null = null

  async initializeTransporter(settings: EmailSettingsData) {
    this.settings = settings

    this.transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpSecure, // true for 465, false for other ports
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    })
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.transporter) {
        return { success: false, message: 'Transporter not initialized' }
      }

      await this.transporter.verify()
      return { success: true, message: 'SMTP connection successful' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  async sendContactFormNotification(
    contactEmail: string,
    submitterName: string,
    message: string,
    formData: any
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.transporter || !this.settings) {
        return { success: false, error: 'Email service not initialized' }
      }

      // Email to admin
      const adminMailOptions = {
        from: `${this.settings.senderName} <${this.settings.smtpUser}>`,
        to: this.settings.contactFormEmail,
        subject: `New Contact Form Submission from ${submitterName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${submitterName}</p>
          <p><strong>Email:</strong> ${contactEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toISOString()}</small></p>
        `,
      }

      const adminResult = await this.transporter.sendMail(adminMailOptions)

      // Send confirmation to user if enabled
      if (this.settings.sendContactConfirmation) {
        const confirmationText = this.settings.contactConfirmationTemplate
          .replace('{{name}}', submitterName)
          .replace('{{email}}', contactEmail)

        const userMailOptions = {
          from: `${this.settings.senderName} <${this.settings.smtpUser}>`,
          to: contactEmail,
          subject: 'We received your message',
          html: confirmationText.replace(/\n/g, '<br>'),
        }

        await this.transporter.sendMail(userMailOptions)
      }

      return { success: true, messageId: adminResult.messageId }
    } catch (error: any) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }
  }

  async sendPrivacyRequestNotification(
    contactEmail: string,
    submitterName: string,
    requestType: string,
    details: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.transporter || !this.settings) {
        return { success: false, error: 'Email service not initialized' }
      }

      // Email to privacy team
      const adminMailOptions = {
        from: `${this.settings.senderName} <${this.settings.smtpUser}>`,
        to: this.settings.privacyRequestEmail,
        subject: `Privacy Request (${requestType}) from ${submitterName}`,
        html: `
          <h2>Privacy Request Received</h2>
          <p><strong>Type:</strong> ${requestType}</p>
          <p><strong>Name:</strong> ${submitterName}</p>
          <p><strong>Email:</strong> ${contactEmail}</p>
          <p><strong>Details:</strong></p>
          <p>${details.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toISOString()}</small></p>
        `,
      }

      const result = await this.transporter.sendMail(adminMailOptions)

      return { success: true, messageId: result.messageId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

export const emailService = new EmailService()
