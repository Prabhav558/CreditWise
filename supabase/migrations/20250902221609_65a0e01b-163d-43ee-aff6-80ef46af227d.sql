-- Update RLS policies for documents and chunks to require authentication
-- This fixes the security issue where business documents are publicly accessible

-- Drop existing public access policies
DROP POLICY IF EXISTS "Allow public read access to documents" ON public.documents;
DROP POLICY IF EXISTS "Allow public read access to chunks" ON public.chunks;

-- Create new authentication-required policies for documents
CREATE POLICY "Authenticated users can view documents" 
ON public.documents 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert documents" 
ON public.documents 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents" 
ON public.documents 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete documents" 
ON public.documents 
FOR DELETE 
TO authenticated
USING (true);

-- Create new authentication-required policies for chunks
CREATE POLICY "Authenticated users can view chunks" 
ON public.chunks 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert chunks" 
ON public.chunks 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update chunks" 
ON public.chunks 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete chunks" 
ON public.chunks 
FOR DELETE 
TO authenticated
USING (true);

-- Keep service role policies for backend operations
-- (These already exist and allow full access for service operations)