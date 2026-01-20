import React from 'react';
import { cn } from "@/lib/utils";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export const FormLabel = ({ children, className, required, ...props }: FormLabelProps) => (
    <label
        className={cn("block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]", className)}
        {...props}
    >
        {children} {required && <span className="text-[#ef4444]">*</span>}
    </label>
);

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, required, error, helperText, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <FormLabel required={required}>{label}</FormLabel>}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all",
                        error && "border-[#ef4444] focus:ring-[#ef4444]",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-[12px] text-[#ef4444] mt-1 tracking-[-0.5px]">{error}</p>}
                {helperText && !error && <p className="text-[12px] text-[#9ca3af] mt-1 tracking-[-0.5px]">{helperText}</p>}
            </div>
        );
    }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    required?: boolean;
    error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, required, error, className, rows = 3, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <FormLabel required={required}>{label}</FormLabel>}
                <textarea
                    ref={ref}
                    rows={rows}
                    className={cn(
                        "w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all resize-none",
                        error && "border-[#ef4444] focus:ring-[#ef4444]",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-[12px] text-[#ef4444] mt-1 tracking-[-0.5px]">{error}</p>}
            </div>
        );
    }
);
FormTextarea.displayName = "FormTextarea";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    required?: boolean;
    options: { value: string; label: string }[];
    error?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, required, options, error, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <FormLabel required={required}>{label}</FormLabel>}
                <select
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all cursor-pointer",
                        error && "border-[#ef4444] focus:ring-[#ef4444]",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-[12px] text-[#ef4444] mt-1 tracking-[-0.5px]">{error}</p>}
            </div>
        );
    }
);
FormSelect.displayName = "FormSelect";

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
    ({ label, className, ...props }, ref) => {
        return (
            <label className="flex items-center gap-3 cursor-pointer group">
                <input
                    ref={ref}
                    type="checkbox"
                    className={cn(
                        "w-5 h-5 border-[#d1d5db] rounded text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0 transition-all cursor-pointer",
                        className
                    )}
                    {...props}
                />
                <span className="text-[14px] text-[#111827] group-hover:text-[#C10007] transition-colors tracking-[-0.5px]">
                    {label}
                </span>
            </label>
        );
    }
);
FormCheckbox.displayName = "FormCheckbox";
