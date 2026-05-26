'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductDetailClientProps {
  productName: string;
}

export function ProductDetailClient({ productName }: ProductDetailClientProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check size={16} className="mr-2 text-green-500" />
          Link Copied
        </>
      ) : (
        <>
          <Share2 size={16} className="mr-2" />
          Share
        </>
      )}
    </Button>
  );
}
