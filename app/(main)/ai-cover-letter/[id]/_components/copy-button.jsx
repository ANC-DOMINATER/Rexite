'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CopyButton({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Process the content to remove LLM instructions
    let cleanContent = content;
    
    // Remove the LLM instructions at the beginning
    const instructionPatterns = [
      /Okay, here is a professional cover letter.*?experience\.\s*/s,
      /Remember to replace.*?experience\.\s*/s,
      /.*?\[Your Name\]/s  // Match everything up to the first [Your Name]
    ];
    
    // Try each pattern until one works
    for (const pattern of instructionPatterns) {
      const match = cleanContent.match(pattern);
      if (match && match.index === 0) {
        cleanContent = cleanContent.substring(match[0].length);
        break;
      }
    }
    
    // Remove any placeholder instructions
    cleanContent = cleanContent.replace(/\[.*?'s Address - Optional, but company name is essential\]/g, '');
    
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button 
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </>
      )}
    </Button>
  );
} 