import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSnippetData {
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[];
}

export interface UpdateSnippetData extends Partial<CreateSnippetData> {
  is_favorite?: boolean;
}

export function useSnippets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const snippetsQuery = useQuery({
    queryKey: ['snippets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Snippet[];
    },
    enabled: !!user,
  });

  const createSnippet = useMutation({
    mutationFn: async (data: CreateSnippetData) => {
      if (!user) throw new Error('Must be logged in');

      const { data: snippet, error } = await supabase
        .from('snippets')
        .insert({
          ...data,
          user_id: user.id,
          tags: data.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return snippet as Snippet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      toast.success('Snippet created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create snippet: ' + error.message);
    },
  });

  const updateSnippet = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSnippetData }) => {
      if (!user) throw new Error('Must be logged in');

      const { data: snippet, error } = await supabase
        .from('snippets')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return snippet as Snippet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      toast.success('Snippet updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update snippet: ' + error.message);
    },
  });

  const deleteSnippet = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      toast.success('Snippet deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete snippet: ' + error.message);
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, is_favorite }: { id: string; is_favorite: boolean }) => {
      if (!user) throw new Error('Must be logged in');

      const { data: snippet, error } = await supabase
        .from('snippets')
        .update({ is_favorite })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return snippet as Snippet;
    },
    onSuccess: (snippet) => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      toast.success(snippet.is_favorite ? 'Added to favorites!' : 'Removed from favorites');
    },
    onError: (error) => {
      toast.error('Failed to update favorite: ' + error.message);
    },
  });

  return {
    snippets: snippetsQuery.data || [],
    isLoading: snippetsQuery.isLoading,
    error: snippetsQuery.error,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
  };
}
