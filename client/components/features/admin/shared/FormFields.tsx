import React from 'react';
import { ChevronDown } from 'lucide-react';
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

interface FormMultiSelectProps {
    label?: string;
    required?: boolean;
    options: { value: string; label: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
    helperText?: string;
    placeholder?: string;
    allLabel?: string;
}

export const FormMultiSelect = ({
    label,
    required,
    options,
    value,
    onChange,
    error,
    helperText,
    placeholder = "Select options..."
}: FormMultiSelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const removeValue = (e: React.MouseEvent, valToRemove: string) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== valToRemove));
    };

    return (
        <div className="w-full relative" ref={containerRef}>
            {label && <FormLabel required={required}>{label}</FormLabel>}

            <div
                className={cn(
                    "w-full px-3 py-2 min-h-[46px] border border-[#d1d5db] rounded-[6px] bg-white text-[15px] text-[#111827] focus-within:ring-2 focus-within:ring-[#C10007] focus-within:border-transparent tracking-[-0.5px] transition-all cursor-pointer flex flex-wrap gap-2 items-center",
                    error && "border-[#ef4444] focus-within:ring-[#ef4444]"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {value.length === 0 && (
                    <span className="text-[#9ca3af]">{placeholder}</span>
                )}

                {value.map(val => {
                    const option = options.find(o => o.value === val);
                    return (
                        <span key={val} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                            {option?.label || val}
                            <button
                                type="button"
                                onClick={(e) => removeValue(e, val)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </span>
                    );
                })}
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#d1d5db] rounded-[6px] shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={cn(
                                "px-4 py-2 cursor-pointer hover:bg-gray-50 text-[14px] flex items-center gap-2",
                                value.includes(option.value) && "bg-blue-50 text-blue-700"
                            )}
                            onClick={() => toggleOption(option.value)}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(option.value)}
                                readOnly
                                className="w-4 h-4 text-[#C10007] rounded border-gray-300 focus:ring-[#C10007]"
                            />
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-[12px] text-[#ef4444] mt-1 tracking-[-0.5px]">{error}</p>}
            {helperText && !error && <p className="text-[12px] text-[#9ca3af] mt-1 tracking-[-0.5px]">{helperText}</p>}
        </div>
    );
};

