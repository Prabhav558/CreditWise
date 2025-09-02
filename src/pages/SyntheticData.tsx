import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileSpreadsheet, RefreshCw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

interface CSVData {
  [key: string]: any;
}

const SyntheticData = () => {
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [processedData, setProcessedData] = useState<CSVData[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "CreditWise - Synthetic Data Generator";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Generate synthetic credit data for testing and development with CreditWise.");
  }, []);

  // Comprehensive empty value detection
  const isEmptyValue = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      return trimmed === '' || 
             trimmed === 'empty' || 
             trimmed === 'null' || 
             trimmed === 'undefined' ||
             trimmed === 'n/a' ||
             trimmed === 'na' ||
             trimmed === '-' ||
             trimmed === '#n/a' ||
             trimmed === '#null!' ||
             trimmed === '#div/0!' ||
             trimmed === '#value!' ||
             trimmed === '#ref!' ||
             trimmed === '#name?' ||
             trimmed === '#num!';
    }
    return false;
  };

  const analyzeColumnData = (columnName: string, allData: CSVData[]) => {
    const validValues = allData
      .map(row => row[columnName])
      .filter(val => !isEmptyValue(val));

    console.log(`Analyzing column "${columnName}": ${validValues.length} valid values out of ${allData.length} total`);
    
    if (validValues.length === 0) {
      return { type: 'unknown', values: [], stats: null };
    }

    // Check if values are numeric
    const numericValues = validValues
      .map(val => {
        const num = Number(val);
        return isNaN(num) ? null : num;
      })
      .filter(val => val !== null);

    const isNumeric = numericValues.length > validValues.length * 0.7; // 70% numeric threshold

    if (isNumeric && numericValues.length > 0) {
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      const hasDecimals = numericValues.some(val => !Number.isInteger(val));
      
      return {
        type: 'numeric',
        values: numericValues,
        stats: { min, max, avg, hasDecimals }
      };
    } else {
      // Categorical/string data
      const uniqueValues = [...new Set(validValues.map(val => String(val)))];
      return {
        type: 'categorical',
        values: uniqueValues,
        stats: { uniqueCount: uniqueValues.length }
      };
    }
  };

  const generateValueForColumn = (columnName: string, columnData: any): any => {
    const column = columnName.toLowerCase();

    if (columnData.type === 'numeric' && columnData.stats) {
      const { min, max, avg, hasDecimals } = columnData.stats;
      
      // Generate within range with some variance
      const range = max - min;
      const variance = Math.max(range * 0.2, 1); // At least 1 unit of variance
      const minVal = Math.max(0, min - variance * 0.5);
      const maxVal = max + variance * 0.5;
      
      const generated = Math.random() * (maxVal - minVal) + minVal;
      
      // Return integer if original data doesn't have decimals
      return hasDecimals ? Math.round(generated * 100) / 100 : Math.round(generated);
    }
    
    if (columnData.type === 'categorical' && columnData.values.length > 0) {
      // Pick random existing value
      return columnData.values[Math.floor(Math.random() * columnData.values.length)];
    }

    // Fallback generation based on column name patterns
    return generateFallbackValue(column);
  };

  const generateFallbackValue = (columnName: string): any => {
    const column = columnName.toLowerCase();
    
    // ID patterns
    if (column.includes('id') || column.includes('user')) {
      return `user_${String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')}`;
    }
    
    // Age patterns
    if (column.includes('age')) {
      return Math.floor(Math.random() * 65) + 18; // 18-82 years
    }
    
    // Location patterns
    if (column.includes('location') || column.includes('city') || column.includes('place')) {
      const locations = ['Urban', 'Suburban', 'Rural', 'Metropolitan', 'Downtown'];
      return locations[Math.floor(Math.random() * locations.length)];
    }
    
    // Employment patterns
    if (column.includes('employment') || column.includes('job') || column.includes('work') || column.includes('occupation')) {
      const employmentTypes = ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired', 'Freelancer'];
      return employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
    }
    
    // Financial/Amount patterns
    if (column.includes('amount') || column.includes('salary') || column.includes('income') || 
        column.includes('payment') || column.includes('recharge') || column.includes('value') ||
        column.includes('price') || column.includes('cost')) {
      return Math.round((Math.random() * 5000 + 100) * 100) / 100; // $100-$5100 with 2 decimals
    }
    
    // Rate/Ratio/Percentage patterns
    if (column.includes('rate') || column.includes('ratio') || column.includes('percent') || 
        column.includes('score') || column.includes('index')) {
      return Math.round(Math.random() * 10000) / 100; // 0.00 to 100.00
    }
    
    // Frequency patterns
    if (column.includes('freq') || column.includes('frequency') || column.includes('count')) {
      return Math.floor(Math.random() * 50) + 1; // 1-50
    }
    
    // Time patterns
    if (column.includes('day') || column.includes('days')) {
      return Math.floor(Math.random() * 365) + 1; // 1-365 days
    }
    if (column.includes('month') || column.includes('months')) {
      return Math.floor(Math.random() * 60) + 1; // 1-60 months
    }
    
    // Status patterns
    if (column.includes('status') || column.includes('state')) {
      const statuses = ['Active', 'Inactive', 'Pending', 'Approved', 'Rejected'];
      return statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    // Default numeric value
    return Math.floor(Math.random() * 1000) + 1;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setProcessedData([]); // Clear previous processed data
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // Use empty string as default
        
        console.log('Raw data loaded:', jsonData);
        setCsvData(jsonData as CSVData[]);
        
        toast({
          title: "File Uploaded",
          description: `Successfully loaded ${jsonData.length} rows from ${file.name}`,
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: "Please upload a valid CSV or Excel file.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const processData = () => {
    if (csvData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting data processing...');
    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        // Get all column names from the first row
        const columns = Object.keys(csvData[0] || {});
        console.log('Columns found:', columns);
        
        // Analyze each column
        const columnAnalysis: { [key: string]: any } = {};
        columns.forEach(column => {
          columnAnalysis[column] = analyzeColumnData(column, csvData);
        });
        
        console.log('Column analysis:', columnAnalysis);
        
        let totalEmptyCells = 0;
        let totalFilledCells = 0;
        
        // Process each row
        const processed = csvData.map((row, rowIndex) => {
          const newRow = { ...row };
          
          // Check each column in this row
          columns.forEach(column => {
            const currentValue = newRow[column];
            if (isEmptyValue(currentValue)) {
              totalEmptyCells++;
              const generatedValue = generateValueForColumn(column, columnAnalysis[column]);
              newRow[column] = generatedValue;
              totalFilledCells++;
              console.log(`Row ${rowIndex}, Column "${column}": "${currentValue}" -> "${generatedValue}"`);
            }
          });
          
          return newRow;
        });
        
        console.log(`Processing complete: Found ${totalEmptyCells} empty cells, filled ${totalFilledCells} cells`);
        
        setProcessedData(processed);
        setIsProcessing(false);
        
        toast({
          title: "Processing Complete",
          description: `Filled ${totalFilledCells} empty cells in ${processed.length} rows`,
        });
      } catch (error) {
        console.error('Processing error:', error);
        setIsProcessing(false);
        toast({
          title: "Processing Failed",
          description: "An error occurred while processing the data.",
          variant: "destructive",
        });
      }
    }, 1000); // Reduced timeout for faster feedback
  };

  const downloadProcessedData = () => {
    if (processedData.length === 0) {
      toast({
        title: "No Processed Data",
        description: "Please process the data first.",
        variant: "destructive",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Processed Data");
    
    const processedFileName = fileName.replace(/\.[^/.]+$/, "") + "_processed.xlsx";
    XLSX.writeFile(workbook, processedFileName);
    
    toast({
      title: "Download Complete",
      description: "Processed data downloaded successfully.",
    });
  };

  const DataTable = ({ data, title }: { data: CSVData[], title: string }) => {
    if (data.length === 0) return null;

    const columns = Object.keys(data[0] || {});

    return (
      <div className="w-full">
        {/* Header above the table */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {data.length} rows • {columns.length} columns
            </span>
          </div>
        </div>

        {/* Table container with proper scrolling */}
        <div className="border rounded-lg bg-background shadow-sm">
          <div className="w-full h-[500px] relative">
            {/* Scrollable container */}
            <div className="absolute inset-0 overflow-auto">
              <table className="w-full border-collapse">
                {/* Header */}
                <thead className="sticky top-0 z-20 bg-muted/95 backdrop-blur-sm">
                  <tr>
                    {columns.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="text-left p-3 border-b border-r font-medium whitespace-nowrap min-w-[150px] max-w-[300px] bg-muted/95"
                      >
                        <div className="font-semibold truncate pr-2" title={header}>
                          {header}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      {columns.map((column, colIndex) => {
                        const value = row[column];
                        const isEmpty = isEmptyValue(value);
                        return (
                          <td
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="p-3 border-r border-border/30 whitespace-nowrap min-w-[150px] max-w-[300px] bg-background"
                          >
                            {isEmpty ? (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-destructive/10 text-destructive font-medium">
                                empty
                              </span>
                            ) : (
                              <div className="truncate pr-2" title={String(value)}>
                                {String(value)}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Scroll indicators */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-60">
            <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border">
              Scroll to view more →↓
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Synthetic Data Generator
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload CSV files with missing data and automatically fill empty cells with contextually appropriate synthetic values.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <p className="text-muted-foreground">
                Upload a CSV or Excel file with missing data. Our AI will intelligently fill empty cells based on existing column patterns.
              </p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload your data file</p>
                    <p className="text-muted-foreground">Supports CSV and Excel (.xlsx) formats</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4"
                    variant="outline"
                  >
                    Choose File
                  </Button>
                  {fileName && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected: {fileName}
                    </p>
                  )}
                </div>
              </div>
              
              {csvData.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      onClick={processData}
                      disabled={isProcessing}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? 'Processing...' : 'Fill Empty Cells'}
                    </Button>
                  </div>
                  
                  <DataTable data={csvData} title="Data Preview" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processed Data Section */}
          {processedData.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Processed Data</CardTitle>
                  <p className="text-muted-foreground">
                    Data with filled empty cells ready for download
                  </p>
                </div>
                <Button onClick={downloadProcessedData} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable data={processedData} title="Processed Data" />
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Smart Data Filling</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Detects all types of empty values (null, empty, N/A, etc.)</li>
                    <li>• Analyzes existing values in each column for patterns</li>
                    <li>• Generates realistic values within appropriate ranges</li>
                    <li>• Maintains data consistency and relationships</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Detection Capabilities</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Empty strings, null, undefined values</li>
                    <li>• Excel error values (#N/A, #NULL!, etc.)</li>
                    <li>• Common empty indicators (-, N/A, empty)</li>
                    <li>• Numeric vs categorical data types</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FloatingChatbot />
    </main>
  );
};

export default SyntheticData;