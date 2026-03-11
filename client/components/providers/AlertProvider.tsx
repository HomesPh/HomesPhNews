'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlert } from "@/hooks/useAlert";

/**
 * Global alert provider that listens to the `useAlert` store and displays a shadcn AlertDialog.
 */
export default function AlertProvider() {
    const {
        isOpen,
        title,
        description,
        type,
        onConfirm,
        onCancel,
        close,
        confirmLabel,
        cancelLabel
    } = useAlert();

    // Prevent open duplication
    if (!isOpen) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && close()}>
            <AlertDialogContent className="max-w-[400px] p-6 rounded-[24px] border-none shadow-2xl animate-in zoom-in-95 duration-200 z-[9999]">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-[20px] font-bold text-[#111827] tracking-tight leading-tight">
                        {title}
                    </AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription className="text-[15px] text-[#4b5563] leading-relaxed">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 sm:justify-end gap-3">
                    {type === 'confirm' && (
                        <AlertDialogCancel
                            onClick={(e) => {
                                e.preventDefault();
                                onCancel?.();
                                close();
                            }}
                            className="h-[44px] px-6 rounded-[12px] border-[#e5e7eb] text-[#374151] font-semibold hover:bg-[#f9fafb] transition-all"
                        >
                            {cancelLabel}
                        </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm?.();
                            close();
                        }}
                        className="h-[44px] px-8 rounded-[12px] bg-[#1428AE] text-white font-bold hover:bg-[#000785] transition-all active:scale-[0.98] shadow-lg shadow-[#1428AE]/10 border-none"
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
