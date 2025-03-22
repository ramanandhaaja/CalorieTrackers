import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const resendTransport = {
  verify: () => Promise.resolve(),
  async send({ from, to, subject, html }: { from?: string; to: string | string[]; subject: string; html: string }) {
    try {
      const result = await resend.emails.send({
        from: from || 'noreply@codefoundry.co.id',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};
