import { Inject, Injectable } from '@nestjs/common';
import nodemailerTransport from './nodemailer.type';
import Context from './context.class';

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_TRANSPORT')
    private readonly nodemailer: nodemailerTransport,
    @Inject('HANDLEBARS') private readonly handlebars,
  ) {}
  async send_email(
    email: string,
    from: string,
    subject: string,
    template: string,
    context: Context,
  ) {
    const html = await this.handlebars.compileTemplate(template, context);
    const Options = {
      from,
      subject,
      html,
      to: email,
    };
    await this.nodemailer.sendMail(Options);
  }
}
