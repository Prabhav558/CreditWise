-- Enable Row Level Security on public tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;

-- Create policies for documents table
-- Allow public read access to documents (for the chat functionality to work)
CREATE POLICY "Allow public read access to documents" 
ON public.documents 
FOR SELECT 
USING (true);

-- Only allow service role to insert/update/delete documents
CREATE POLICY "Service role can manage documents" 
ON public.documents 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- Create policies for chunks table  
-- Allow public read access to chunks (for vector search to work)
CREATE POLICY "Allow public read access to chunks" 
ON public.chunks 
FOR SELECT 
USING (true);

-- Only allow service role to insert/update/delete chunks
CREATE POLICY "Service role can manage chunks" 
ON public.chunks 
FOR ALL 
USING (current_setting('role') = 'service_role');