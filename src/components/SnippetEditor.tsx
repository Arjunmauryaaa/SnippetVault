import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Tag, Plus, Loader2 } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSnippets, Snippet } from '@/hooks/useSnippets';
import { LANGUAGES } from '@/lib/languages';
import { toast } from 'sonner';

interface SnippetEditorProps {
  snippet: Snippet | null;
  onClose: () => void;
}

const getLanguageExtension = (language: string) => {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return javascript({ jsx: true, typescript: language === 'typescript' });
    case 'python':
      return python();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    default:
      return javascript();
  }
};

const editorTheme = {
  '&': {
    backgroundColor: 'hsl(222 47% 5%)',
    color: 'hsl(210 40% 98%)',
  },
  '.cm-content': {
    caretColor: 'hsl(190 95% 50%)',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'hsl(190 95% 50%)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'hsla(190, 95%, 50%, 0.2)',
  },
  '.cm-gutters': {
    backgroundColor: 'hsl(222 47% 5%)',
    color: 'hsl(215 20% 45%)',
    border: 'none',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    paddingLeft: '1rem',
    paddingRight: '0.5rem',
  },
  '.cm-activeLine': {
    backgroundColor: 'hsla(222, 47%, 15%, 0.5)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'hsla(222, 47%, 15%, 0.5)',
  },
};

export default function SnippetEditor({ snippet, onClose }: SnippetEditorProps) {
  const { createSnippet, updateSnippet } = useSnippets();
  const isEditing = !!snippet;

  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setDescription(snippet.description || '');
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags(snippet.tags);
    }
  }, [snippet]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && snippet) {
        await updateSnippet.mutateAsync({
          id: snippet.id,
          data: { title, description, code, language, tags }
        });
      } else {
        await createSnippet.mutateAsync({
          title,
          description,
          code,
          language,
          tags
        });
      }
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card glow"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6 scrollbar-thin">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., React useEffect Hook"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this snippet does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none h-20 bg-muted/30 border-border/50"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 flex-wrap items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="tag-chip flex items-center gap-1.5"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-32 h-8 text-sm"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleAddTag}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-2">
            <Label>Code *</Label>
            <div className="code-editor-wrapper overflow-hidden rounded-lg border border-border/30">
              <CodeMirror
                value={code}
                height="300px"
                extensions={[getLanguageExtension(language)]}
                onChange={onChange}
                theme="dark"
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightActiveLine: true,
                  foldGutter: true,
                  autocompletion: true,
                }}
                style={{
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Save Changes' : 'Create Snippet'}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
