import { getCoverLetter } from "@/actions/cover-letter"
import { notFound } from "next/navigation"
import { Markdown } from "@/components/markdown"
import CopyButtonClient from "./_components/copy-button-client.jsx"
import { FileText, Building2, ArrowBigLeftDash } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditableContentClient from "./_components/editable-content-client.jsx"
import Link from "next/link.js"

export default async function CoverLetterPage({ params }) {
  const { id } = params;
  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
    return notFound()
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-4">
            <Link href="/ai-cover-letter"> 
            <span className="flex items-center gap-2 hover:text-slate-400 cursor-pointer"><ArrowBigLeftDash/> Back </span>
            
            </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Cover Letter</h1>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-medium">{coverLetter.jobTitle}</span>
                  <span>at</span>
                  <span className="font-medium">{coverLetter.companyName}</span>
                </div>
              </div>
            </div>
            <div className="md:ml-auto mt-3 md:mt-0">
              <CopyButtonClient content={coverLetter.content} />
            </div>
          </div>
        </div>

        {/* Cover Letter Content - Full Height */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          {/* Document Header */}
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            </div>
          </div>

          {/* Letter Content - Flex to take available space */}
          <div className="flex-1 p-6 lg:p-8 overflow-auto mb-4 border-b border-slate-700">
            <div className="h-full max-w-none break-words whitespace-pre-wrap text-slate-300 border border-slate-700 rounded-lg p-4">
              <EditableContentClient initialContent={coverLetter.content} />
            </div>
          </div>

          {/* Document Footer */}
          <div className="bg-slate-900 px-6 py-3 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center gap-4">
                <span>Generated with RexiteAI</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Editable</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
