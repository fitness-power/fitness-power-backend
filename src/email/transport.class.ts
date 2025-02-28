export default class Transport {
  host: string;
  port: string;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
