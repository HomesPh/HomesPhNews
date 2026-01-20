import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ArticlesHeaderProps {
    onNewArticle?: () => void;
}

/**
 * ArticlesHeader component with title, description and "New Article" button
 */
export default function ArticlesHeader({ onNewArticle }: ArticlesHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">
                    Article Management
                </h1>
                <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
                    Manage and review all articles across the platform
                </p>
            </div>
            <Button
                onClick={onNewArticle}
                className="flex items-center gap-[10px] px-5 py-3 bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors h-[50px]"
            >
                <Plus className="w-[18px] h-[18px]" />
                <span className="text-[16px] font-medium tracking-[-0.5px]">New Article</span>
            </Button>
        </div>
    );
}
