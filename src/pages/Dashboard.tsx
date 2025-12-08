import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Code2, Star, Trash2, Edit3, Copy, 
  LogOut, Terminal, X, ChevronDown, Download, Upload, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useSnippets, Snippet } from '@/hooks/useSnippets';
import { LANGUAGES, getLanguageLabel } from '@/lib/languages';
import { toast } from 'sonner';
import SnippetCard from '@/components/SnippetCard';
import SnippetEditor from '@/components/SnippetEditor';
import SnippetSkeleton from '@/components/SnippetSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { snippets, isLoading, deleteSnippet, toggleFavorite } = useSnippets();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const matchesSearch = 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
      const matchesFavorite = !showFavorites || snippet.is_favorite;
      
      return matchesSearch && matchesLanguage && matchesFavorite;
    });
  }, [snippets, searchQuery, selectedLanguage, showFavorites]);

  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    snippets.forEach((snippet) => {
      counts[snippet.language] = (counts[snippet.language] || 0) + 1;
    });
    return counts;
  }, [snippets]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out successfully');
  };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet.mutate(id);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(snippets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'snippets-export.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Snippets exported successfully!');
  };

  const handleNewSnippet = () => {
    setEditingSnippet(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingSnippet(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 bg-hero-gradient" />
      
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">SnippetVault</span>
          </div>

          {/* New Snippet Button */}
          <Button 
            variant="hero" 
            className="w-full mb-6" 
            onClick={handleNewSnippet}
          >
            <Plus className="w-5 h-5" />
            New Snippet
          </Button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => { setSelectedLanguage(null); setShowFavorites(false); }}
              className={`sidebar-item w-full ${!selectedLanguage && !showFavorites ? 'active' : ''}`}
            >
              <Code2 className="w-5 h-5" />
              All Snippets
              <span className="ml-auto text-sm bg-muted px-2 py-0.5 rounded">{snippets.length}</span>
            </button>
            
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`sidebar-item w-full ${showFavorites ? 'active' : ''}`}
            >
              <Heart className="w-5 h-5" />
              Favorites
              <span className="ml-auto text-sm bg-muted px-2 py-0.5 rounded">
                {snippets.filter(s => s.is_favorite).length}
              </span>
            </button>

            <div className="pt-4 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Languages
              </span>
            </div>

            {Object.entries(languageCounts).map(([lang, count]) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
                className={`sidebar-item w-full ${selectedLanguage === lang ? 'active' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full bg-primary`} />
                {getLanguageLabel(lang)}
                <span className="ml-auto text-sm bg-muted px-2 py-0.5 rounded">{count}</span>
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {showFavorites ? 'Favorites' : selectedLanguage ? getLanguageLabel(selectedLanguage) : 'All Snippets'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleExport} title="Export snippets">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass">
                  <Filter className="w-4 h-4" />
                  {selectedLanguage ? getLanguageLabel(selectedLanguage) : 'All Languages'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSelectedLanguage(null)}>
                  All Languages
                </DropdownMenuItem>
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.value}
                    onClick={() => setSelectedLanguage(lang.value)}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(selectedLanguage || showFavorites || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedLanguage(null);
                  setShowFavorites(false);
                  setSearchQuery('');
                }}
              >
                <X className="w-4 h-4" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Snippets Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SnippetSkeleton key={i} />
              ))}
            </div>
          ) : filteredSnippets.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Code2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedLanguage 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first snippet to get started'}
              </p>
              {!searchQuery && !selectedLanguage && (
                <Button variant="hero" onClick={handleNewSnippet}>
                  <Plus className="w-5 h-5" />
                  Create Snippet
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSnippets.map((snippet, index) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SnippetCard
                      snippet={snippet}
                      onCopy={() => handleCopy(snippet.code)}
                      onEdit={() => handleEdit(snippet)}
                      onDelete={() => handleDelete(snippet.id)}
                      onToggleFavorite={() => toggleFavorite.mutate({ 
                        id: snippet.id, 
                        is_favorite: !snippet.is_favorite 
                      })}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Snippet Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <SnippetEditor 
            snippet={editingSnippet} 
            onClose={handleCloseEditor} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
