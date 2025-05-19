
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, Copy } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  onCopy?: () => void;
  className?: string;
}

export function CopyButton({ textToCopy, onCopy, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopy) onCopy();
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-0 h-8 w-8 rounded-full ${copied ? 'text-green-500 animate-pulse-success' : 'text-gray-500'} ${className}`}
      onClick={handleCopy}
    >
      {copied ? <CheckIcon size={16} /> : <Copy size={16} />}
    </Button>
  );
}
