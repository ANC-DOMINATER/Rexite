'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CopyButtonClient({ content }) {
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
      className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-400 mr-2" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          <span>Copy Letter</span>
        </>
      )}
    </Button>
  );
} 