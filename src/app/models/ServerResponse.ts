export interface ServerError {
  code: string;
  description?: string;
  errors?: {
    value: any;
    msg: string;
    param: string;
    location: string;
  }[];
  foundedItem?: any;
}

export interface ServerResponse {
  message?: string;
  error?: ServerError;
}
