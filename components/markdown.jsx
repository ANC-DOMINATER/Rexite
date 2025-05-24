import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Markdown({ content }) {
  if (!content) return null;
  
  // Process the content to remove LLM instructions
  let displayContent = content;
  
  // Identify and remove the instruction part at the beginning
  const instructionMatch = displayContent.match(/^(Okay|Remember).*?experience\.\s*/s);
  if (instructionMatch) {
    displayContent = displayContent.substring(instructionMatch[0].length);
  }
  
  return (
    <div className="prose prose-gray dark:prose-invert max-w-full">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
} 