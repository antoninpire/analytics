"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

type CopySnippetButtonProps = {
  snippet: string;
};

export default function CopySnippetButton(props: CopySnippetButtonProps) {
  const { snippet } = props;
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    toast({
      title: "Snippet Copied to Clipboard!",
    });
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button onClick={handleCopy} className="absolute top-3 right-3">
            <Copy size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy snippet</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
