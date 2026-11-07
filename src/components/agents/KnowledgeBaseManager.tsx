import { useState } from 'react'
import {
  FileText,
  Upload,
  Globe,
  Database,
  Trash2,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import type { KnowledgeDocument } from '@/lib/agentsData'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

interface KnowledgeBaseManagerProps {
  sources: KnowledgeDocument[]
  onAddSource: (source: KnowledgeDocument) => void
  onRemoveSource: (id: string) => void
}

export function KnowledgeBaseManager({
  sources,
  onAddSource,
  onRemoveSource,
}: KnowledgeBaseManagerProps) {
  const { toast } = useToast()
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState<KnowledgeDocument['type']>('pdf')
  const [isUploading, setIsUploading] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!docName.trim()) return

    setIsUploading(true)
    setTimeout(() => {
      const newDoc: KnowledgeDocument = {
        id: `kb-${Date.now()}`,
        name: docName,
        type: docType,
        size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        chunkCount: Math.floor(Math.random() * 150) + 40,
        lastSynced: 'Just now',
        status: 'indexed',
      }
      onAddSource(newDoc)
      setDocName('')
      setIsUploading(false)
      toast({
        type: 'success',
        title: 'Knowledge Source Indexed',
        description: `Chunked & embedded ${newDoc.chunkCount} vector embeddings.`,
      })
    }, 700)
  }

  const getTypeIcon = (type: KnowledgeDocument['type']) => {
    switch (type) {
      case 'url':
        return <Globe size={15} className="text-blue-500" />
      case 'notion':
        return <Database size={15} className="text-purple-500" />
      default:
        return <FileText size={15} className="text-violet-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload/Add Knowledge Bar */}
      <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 space-y-3">
        <span className="text-xs font-bold text-violet-900 dark:text-violet-300 block">
          Connect New Knowledge Base Source
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Document filename, URL, or API endpoint..."
            className="sm:col-span-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <div className="flex gap-2">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2 py-2 outline-none flex-1"
            >
              <option value="pdf">PDF Document</option>
              <option value="url">Website URL</option>
              <option value="notion">Notion Workspace</option>
              <option value="faq">FAQ Structured</option>
            </select>
            <Button variant="primary" size="xs" type="submit" loading={isUploading}>
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>
      </form>

      {/* Indexed Documents List */}
      <div className="space-y-2">
        {sources.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No knowledge sources indexed yet. Add PDF policies, help center URLs, or FAQ guides.
          </div>
        ) : (
          sources.map((src) => (
            <div
              key={src.id}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-200 dark:hover:border-violet-700/60 transition-all flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0">
                  {getTypeIcon(src.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{src.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {src.chunkCount} vectors &bull; {src.size} &bull; Synced {src.lastSynced}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="green" dot>
                  Indexed
                </Badge>
                <button
                  onClick={() => onRemoveSource(src.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Remove knowledge document"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
