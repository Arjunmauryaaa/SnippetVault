import { motion } from 'framer-motion';
import { Copy, Edit3, Trash2, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Snippet } from '@/hooks/useSnippets';
import { getLanguageLabel } from '@/lib/languages';
import { formatDistanceToNow } from 'date-fns';

interface SnippetCardProps {
  snippet: Snippet;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

const languageColors: Record<string, string> = {
  javascript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  typescript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  python: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  html: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  css: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  json: 'bg-green-500/20 text-green-400 border-green-500/30',
  sql: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  rust: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
  go: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
  java: 'bg-red-500/20 text-red-400 border-red-500/30',
  csharp: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cpp: 'bg-blue-700/20 text-blue-300 border-blue-700/30',
  php: 'bg-purple-600/20 text-purple-300 border-purple-600/30',
  ruby: 'bg-red-600/20 text-red-400 border-red-600/30',
  swift: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  kotlin: 'bg-purple-700/20 text-purple-300 border-purple-700/30',
};

export default function SnippetCard({ 
  snippet, 
  onCopy, 
  onEdit, 
  onDelete, 
  onToggleFavorite 
}: SnippetCardProps) {
  const languageColorClass = languageColors[snippet.language] || 'bg-muted text-muted-foreground border-border';
  
  // Get first 4-6 lines for preview
  const codePreview = snippet.code.split('\n').slice(0, 5).join('\n');
  const hasMoreLines = snippet.code.split('\n').length > 5;

  return (
    <div className="glass-card-hover group overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {snippet.description}
              </p>
            )}
          </div>
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              snippet.is_favorite 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`w-5 h-5 ${snippet.is_favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium uppercase tracking-wider border ${languageColorClass}`}>
            {getLanguageLabel(snippet.language)}
          </span>
          {snippet.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
          {snippet.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{snippet.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* Code Preview */}
      <div className="bg-code-bg p-4 font-mono text-sm overflow-hidden relative">
        <pre className="text-muted-foreground overflow-hidden">
          <code className="block whitespace-pre overflow-hidden">
            {codePreview}
          </code>
        </pre>
        {hasMoreLines && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-code-bg to-transparent" />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onCopy}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
