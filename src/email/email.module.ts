import { DynamicModule, Global, Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { CustomException } from 'src/exceptions/custom.exception';
import Transport from './transport.class';
import Context from './context.class';
import { EmailService } from './email.service';
@Global()
@Module({})
export class EmailModule {
  static forRoot(transport: Transport): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: 'EMAIL_TRANSPORT',
          useFactory: (ConfigService: ConfigService) => {
            const transportData = nodemailer.createTransport({
              host: ConfigService.get<string>(transport.host),
              port: ConfigService.get<number>(transport.port),
              secure: transport.secure,
              auth: {
                user: ConfigService.get<string>(transport.auth.user),
                pass: ConfigService.get<string>(transport.auth.pass),
              },
            });
            return transportData;
          },
          inject: [ConfigService],
        },
        {
          provide: 'HANDLEBARS',
          useFactory: () => {
            return {
              compileTemplate: (
                templatePath: string,
                data: Context,
              ): string => {
                try {
                  const filePath = path.join(
                    __dirname,
                    '..',
                    '..',
                    'src',
                    `/templates/${templatePath}`,
                  );
                  const templateContent = fs.readFileSync(filePath, 'utf8');
                  const compiledTemplate = Handlebars.compile(templateContent);
                  return compiledTemplate(data);
                } catch (error) {
                  console.log(error);

                  throw new CustomException(
                    'Email template processing failed.',
                    500,
                  );
                }
              },
            };
          },
        },
        EmailService,
      ],
      exports: [EmailService, 'EMAIL_TRANSPORT', 'HANDLEBARS'],
    };
  }
}
