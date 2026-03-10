import { create } from 'zustand';

interface AlertState {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'alert' | 'confirm';
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    confirmLabel: string;
    cancelLabel: string;

    // Actions
    showAlert: (title: string, description?: string, confirmLabel?: string) => Promise<void>;
    showConfirm: (title: string, description?: string, confirmLabel?: string, cancelLabel?: string) => Promise<boolean>;
    close: () => void;
}

export const useAlert = create<AlertState>((set, get) => ({
    isOpen: false,
    title: '',
    description: '',
    type: 'alert',
    onConfirm: null,
    onCancel: null,
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',

    showAlert: (title, description = '', confirmLabel = 'OK') => {
        return new Promise((resolve) => {
            set({
                isOpen: true,
                title,
                description,
                type: 'alert',
                confirmLabel,
                onConfirm: () => {
                    get().close();
                    resolve();
                },
                onCancel: null,
            });
        });
    },

    showConfirm: (title, description = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel') => {
        return new Promise((resolve) => {
            set({
                isOpen: true,
                title,
                description,
                type: 'confirm',
                confirmLabel,
                cancelLabel,
                onConfirm: () => {
                    get().close();
                    resolve(true);
                },
                onCancel: () => {
                    get().close();
                    resolve(false);
                },
            });
        });
    },

    close: () => {
        set({ isOpen: false });
    },
}));
