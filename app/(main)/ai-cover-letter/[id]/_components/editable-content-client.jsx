'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Edit, Eye } from 'lucide-react';

export default function EditableContentClient({ initialContent }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialContent) {
      let processedContent = initialContent;
      const instructionPatterns = [
        /Okay, here is a professional cover letter.*?experience\.\s*/s,
        /Remember to replace.*?experience\.\s*/s,
        /.*?\[Your Name\]/s  
      ];
      
      // Try each pattern until one works
      for (const pattern of instructionPatterns) {
        const match = processedContent.match(pattern);
        if (match && match.index === 0) {
          processedContent = processedContent.substring(match[0].length);
          break;
        }
      }
      
      setContent(processedContent);
    }
  }, [initialContent]);

  // Handle content editing
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Toggle between view and edit modes
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="relative h-full flex flex-col ">
      {/* Toggle Buttons */}
      <div className="flex mb-4 bg-slate-800 rounded-md border border-slate-700 self-end overflow-hidden">
        <button
          onClick={() => setIsEditing(false)}
          className={`px-4 py-2 flex items-center gap-2 text-sm z${!isEditing ? 'text-slate-400 hover:text-white'  :'bg-slate-700 text-white' }`}
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className={`px-4 py-2 flex items-center gap-2 text-sm ${isEditing ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Content Area - Take up remaining height */}
      {isEditing ? (
        <div className="flex-1 relative w-full h-full">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="absolute inset-0 w-full h-full p-6 font-mono text-slate-300 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none text-base leading-relaxed"
            style={{ 
              overflowWrap: 'break-word', 
              whiteSpace: 'pre-wrap',
              minHeight: '750px' 
            }}
          />
        </div>
      ) : (
        <div className="flex-1 font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-words overflow-auto p-2">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="mb-1" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-600 pl-4 italic mb-4" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
} 