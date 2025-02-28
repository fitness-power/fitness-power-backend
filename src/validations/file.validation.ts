import { validate } from 'class-validator';
import { CustomException } from 'src/exceptions/custom.exception';

export default async function errors(data: any): Promise<void> {
  const error = await validate(data);
  if (error.length > 0) {
    let messages = [];
    const error_messages = error.map((message) => message.constraints);
    error_messages.forEach((message) =>
      Object.values(message).map((value) => messages.push(value)),
    );
    throw new CustomException(messages, 404);
  }
}
