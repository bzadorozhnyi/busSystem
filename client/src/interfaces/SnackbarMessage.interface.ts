export interface SnackbarMessage {
    active: boolean;
    message: string;
    severity: 'success' | 'error';
};