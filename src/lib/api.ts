import { supabase } from "@/integrations/supabase/client";

export interface TimeseriesData {
  user_id: string;
  month: string;
  pd_percent: number;
  risk_category: string;
  features?: any;
}

export async function ingestMonthlyCSV(file: File): Promise<{ ingested: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    'https://ixtbpnpbswzjrgnkvcfg.supabase.co/functions/v1/ingest-month',
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dGJwbnBic3d6anJnbmt2Y2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTcxOTMsImV4cCI6MjA3MjM5MzE5M30.qSeDWSWbYcwFbQgrL35yTmb7LQWlo-_K_94DKI2ObpU`
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Upload failed');
  }

  return await response.json();
}

export async function getUserTimeseries(
  userId: string, 
  from?: string, 
  to?: string
): Promise<TimeseriesData[]> {
  try {
    // Use direct query approach for compatibility
    let query = `
      SELECT user_id, month, pd_score, risk_category, features 
      FROM risk_snapshots 
      WHERE user_id = '${userId}'
    `;
    
    if (from) {
      query += ` AND month >= '${from}-01'`;
    }
    if (to) {
      query += ` AND month <= '${to}-01'`;
    }
    
    query += ` ORDER BY month ASC`;
    
    const response = await fetch(
      `https://ixtbpnpbswzjrgnkvcfg.supabase.co/rest/v1/rpc/execute_query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dGJwbnBic3d6anJnbmt2Y2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTcxOTMsImV4cCI6MjA3MjM5MzE5M30.qSeDWSWbYcwFbQgrL35yTmb7LQWlo-_K_94DKI2ObpU`,
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dGJwbnBic3d6anJnbmt2Y2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTcxOTMsImV4cCI6MjA3MjM5MzE5M30.qSeDWSWbYcwFbQgrL35yTmb7LQWlo-_K_94DKI2ObpU'
        },
        body: JSON.stringify({ query })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch timeseries data');
    }

    const data = await response.json();
    
    // Transform to match TimeseriesData interface
    return data.map((row: any) => ({
      user_id: row.user_id,
      month: row.month?.slice(0, 7) || '', // Convert YYYY-MM-DD to YYYY-MM
      pd_percent: (row.pd_score || 0) * 100, // Convert 0-1 to 0-100
      risk_category: row.risk_category || '',
      features: row.features
    }));
  } catch (error) {
    console.error('Error fetching timeseries:', error);
    return [];
  }
}

export async function getUsers(): Promise<string[]> {
  try {
    const response = await fetch(
      `https://ixtbpnpbswzjrgnkvcfg.supabase.co/rest/v1/crm_users?select=user_id&order=user_id`,
      {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dGJwbnBic3d6anJnbmt2Y2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTcxOTMsImV4cCI6MjA3MjM5MzE5M30.qSeDWSWbYcwFbQgrL35yTmb7LQWlo-_K_94DKI2ObpU`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dGJwbnBic3d6anJnbmt2Y2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTcxOTMsImV4cCI6MjA3MjM5MzE5M30.qSeDWSWbYcwFbQgrL35yTmb7LQWlo-_K_94DKI2ObpU'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data.map((row: any) => row.user_id);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}