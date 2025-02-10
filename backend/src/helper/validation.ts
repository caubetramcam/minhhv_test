import { ValidationError } from 'class-validator';

export interface ErrorFormat {
  property: string;
  constraints: { [type: string]: string };
}

// We move the nested children error to the top level parent error
// This is where we will get a single dimension array of errors
// It is much easier to read and maintain in frontend
export const extractAllErrors = (e: ValidationError): ErrorFormat[] => {
  if (!!e.children && e.children.length) {
    const errors: ErrorFormat[] = [];
    e.children.forEach((child) => {
      errors.push(...extractAllErrors(child).map((childErr) => childErr));
    });
    return errors;
  } else {
    return [{ property: e.property, constraints: e.constraints }];
  }
};
