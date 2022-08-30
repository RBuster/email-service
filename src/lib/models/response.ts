
interface ResponseError{
    code: number;
    message: string;
    fullError: Error | unknown;
}
export interface EmailResponse{
    status: 'success' | 'failure';
    error?: ResponseError;
}