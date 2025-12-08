-- Create snippets table
CREATE TABLE public.snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own snippets" 
ON public.snippets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own snippets" 
ON public.snippets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets" 
ON public.snippets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets" 
ON public.snippets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_snippets_updated_at
BEFORE UPDATE ON public.snippets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better search performance
CREATE INDEX idx_snippets_user_id ON public.snippets(user_id);
CREATE INDEX idx_snippets_language ON public.snippets(language);
CREATE INDEX idx_snippets_tags ON public.snippets USING GIN(tags);
CREATE INDEX idx_snippets_title ON public.snippets USING GIN(to_tsvector('english', title));