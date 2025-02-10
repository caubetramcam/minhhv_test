import { Request } from 'express';

export interface IRequest extends Request {
  user: any | null;
  session: ISession;
}

export interface ISession {
  [key: string]: any;
}

export interface IErrorDetail {
  field?: string;
  value?: string | any | number;
  error?: any;
}
