-- Enable Row Level Security on risk_snapshots table
ALTER TABLE public.risk_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own risk snapshots
CREATE POLICY "Users can view their own risk snapshots" 
ON public.risk_snapshots 
FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy for users to insert their own risk snapshots
CREATE POLICY "Users can insert their own risk snapshots" 
ON public.risk_snapshots 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to update their own risk snapshots
CREATE POLICY "Users can update their own risk snapshots" 
ON public.risk_snapshots 
FOR UPDATE 
USING (auth.uid()::text = user_id);

-- Create policy for users to delete their own risk snapshots
CREATE POLICY "Users can delete their own risk snapshots" 
ON public.risk_snapshots 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Create policy for service role to manage all risk snapshots (for admin functions)
CREATE POLICY "Service role can manage all risk snapshots" 
ON public.risk_snapshots 
FOR ALL 
USING (current_setting('role'::text) = 'service_role'::text);