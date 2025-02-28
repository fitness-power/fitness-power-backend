import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
type nodemailerTransport = nodemailer.Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
>;
export default nodemailerTransport;
