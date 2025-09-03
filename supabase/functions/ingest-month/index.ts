import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVRow {
  user_id: string;
  month: string;
  payment_delay_ratio: number;
  cart_abandonment_rate: number;
  geo_variance_score: number;
  avg_order_value: number;
  avg_recharge_amt: number;
  months_active: number;
}

function calculatePD(row: CSVRow, datasetMeanAOV: number, datasetMeanRecharge: number): number {
  const tenureFactor = 
    row.months_active < 6 ? 0.25 :
    row.months_active < 12 ? 0.15 : 0.05;

  const aovFactor = 1 - (row.avg_order_value / (datasetMeanAOV * 1.5));
  const rechargeFactor = 1 - (row.avg_recharge_amt / (datasetMeanRecharge * 1.5));

  const pd = 
    0.5 * row.payment_delay_ratio +
    0.25 * row.cart_abandonment_rate +
    0.15 * (row.geo_variance_score / 10) +
    0.06 * Math.max(0, aovFactor) +
    0.03 * Math.max(0, rechargeFactor) +
    tenureFactor;

  return Math.min(1, Math.max(0, pd));
}

function getRiskCategory(pdScore: number): string {
  if (pdScore < 0.3) return 'Low';
  if (pdScore < 0.6) return 'Medium';
  return 'High';
}

function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have header and data rows');
  
  const headers = lines[0].split(',').map(h => h.trim());
  const requiredColumns = [
    'user_id', 'month', 'payment_delay_ratio', 'cart_abandonment_rate',
    'geo_variance_score', 'avg_order_value', 'avg_recharge_amt', 'months_active'
  ];
  
  for (const col of requiredColumns) {
    if (!headers.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, i) => {
      row[header] = values[i];
    });
    
    // Convert numeric fields
    const numericFields = [
      'payment_delay_ratio', 'cart_abandonment_rate', 'geo_variance_score',
      'avg_order_value', 'avg_recharge_amt', 'months_active'
    ];
    
    for (const field of numericFields) {
      const val = parseFloat(row[field]);
      if (isNaN(val)) {
        throw new Error(`Invalid numeric value for ${field} at row ${index + 2}: ${row[field]}`);
      }
      row[field] = val;
    }
    
    return row as CSVRow;
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    const csvText = await file.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      throw new Error('No data rows found in CSV');
    }

    // Calculate dataset means for AOV and recharge
    const meanAOV = rows.reduce((sum, row) => sum + row.avg_order_value, 0) / rows.length;
    const meanRecharge = rows.reduce((sum, row) => sum + row.avg_recharge_amt, 0) / rows.length;

    // Process each row and prepare for database insertion
    const riskSnapshots = rows.map(row => {
      const pdScore = calculatePD(row, meanAOV, meanRecharge);
      const riskCategory = getRiskCategory(pdScore);

      return {
        user_id: row.user_id,
        month: row.month + '-01', // Convert YYYY-MM to YYYY-MM-01
        pd_score: pdScore,
        risk_category: riskCategory,
        features: {
          payment_delay_ratio: row.payment_delay_ratio,
          cart_abandonment_rate: row.cart_abandonment_rate,
          geo_variance_score: row.geo_variance_score,
          avg_order_value: row.avg_order_value,
          avg_recharge_amt: row.avg_recharge_amt,
          months_active: row.months_active
        }
      };
    });

    // Insert/update CRM users
    const userIds = [...new Set(rows.map(row => row.user_id))];
    for (const userId of userIds) {
      await supabase
        .from('crm_users')
        .upsert({ user_id: userId }, { onConflict: 'user_id' });
    }

    // Insert/update risk snapshots
    const { error: snapshotError } = await supabase
      .from('risk_snapshots')
      .upsert(riskSnapshots, { onConflict: 'user_id,month' });

    if (snapshotError) {
      console.error('Snapshot error:', snapshotError);
      throw snapshotError;
    }

    return new Response(
      JSON.stringify({ ingested: rows.length }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Ingest error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Processing failed' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});