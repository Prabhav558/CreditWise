import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileSpreadsheet, RefreshCw } from "lucide-react";

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

  const generateRandomValue = (columnName: string, rowData: CSVData): any => {
    const column = columnName.toLowerCase();
    
    // Employment type based generation
    if (column.includes('employment') || column.includes('job')) {
      const types = ['employed', 'self_employed', 'unemployed', 'student', 'retired'];
      return types[Math.floor(Math.random() * types.length)];
    }
    
    // Financial amounts
    if (column.includes('amount') || column.includes('salary') || column.includes('income') || column.includes('payment')) {
      return Math.floor(Math.random() * 100000) + 1000;
    }
    
    // Frequency values
    if (column.includes('freq') || column.includes('frequency')) {
      return Math.floor(Math.random() * 20) + 1;
    }
    
    // Ratios and percentages
    if (column.includes('ratio') || column.includes('rate') || column.includes('percent')) {
      return (Math.random()).toFixed(2);
    }
    
    // Days
    if (column.includes('days') || column.includes('day')) {
      return Math.floor(Math.random() * 30);
    }
    
    // Months
    if (column.includes('month') || column.includes('months')) {
      return Math.floor(Math.random() * 60) + 1;
    }
    
    // Age
    if (column.includes('age')) {
      return Math.floor(Math.random() * 50) + 18;
    }
    
    // Score values
    if (column.includes('score')) {
      return Math.floor(Math.random() * 850) + 300;
    }
    
    // Geographic/location variance
    if (column.includes('geo') || column.includes('location') || column.includes('variance')) {
      return (Math.random()).toFixed(2);
    }
    
    // Default: try to infer from other row values
    const numericValues = Object.values(rowData).filter(val => 
      val !== null && val !== undefined && val !== '' && !isNaN(Number(val))
    ).map(Number);
    
    if (numericValues.length > 0) {
      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      const variance = avg * 0.2; // 20% variance
      return Math.floor(avg + (Math.random() - 0.5) * variance);
    }
    
    // String values
    const stringValues = Object.values(rowData).filter(val => 
      val !== null && val !== undefined && val !== '' && isNaN(Number(val))
    );
    
    if (stringValues.length > 0) {
      return stringValues[Math.floor(Math.random() * stringValues.length)];
    }
    
    // Fallback
    return Math.floor(Math.random() * 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setCsvData(jsonData as CSVData[]);
        toast({
          title: "File Uploaded",
          description: `Successfully loaded ${jsonData.length} rows from ${file.name}`,
        });
      } catch (error) {
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

    setIsProcessing(true);
    
    setTimeout(() => {
      const processed = csvData.map((row, index) => {
        const newRow = { ...row };
        
        // Find empty cells and fill them
        Object.keys(newRow).forEach(key => {
          if (newRow[key] === null || newRow[key] === undefined || newRow[key] === '') {
            newRow[key] = generateRandomValue(key, newRow);
          }
        });
        
        return newRow;
      });
      
      setProcessedData(processed);
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete",
        description: `Filled empty cells in ${processed.length} rows`,
      });
    }, 2000);
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
                Upload a CSV or Excel file with missing data. Our AI will intelligently fill empty cells based on row context.
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
                    <p className="text-sm text-muted-foreground">
                      Loaded {csvData.length} rows with {Object.keys(csvData[0] || {}).length} columns
                    </p>
                    <Button 
                      onClick={processData}
                      disabled={isProcessing}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? 'Processing...' : 'Fill Empty Cells'}
                    </Button>
                  </div>
                  
                   {/* Data Preview */}
                  <div className="border rounded-lg overflow-hidden">
                    <ScrollArea className="h-80 w-full overflow-auto">
                      <div className="min-w-max w-fit">
                        <table className="text-sm border-collapse">
                          <thead className="bg-muted/50 sticky top-0 z-10">
                            <tr>
                              {Object.keys(csvData[0] || {}).map((header) => (
                                <th key={header} className="text-left p-3 border-b font-medium whitespace-nowrap w-[200px] min-w-[200px]">
                                  <div className="truncate" title={header}>
                                    {header}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvData.map((row, index) => (
                              <tr key={index} className="border-b hover:bg-muted/25 transition-colors">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={cellIndex} className="p-3 w-[200px] min-w-[200px] border-r border-border/50">
                                    {value === null || value === undefined || value === '' ? (
                                      <span className="text-muted-foreground italic bg-destructive/10 px-2 py-1 rounded text-xs whitespace-nowrap">
                                        empty
                                      </span>
                                    ) : (
                                      <div className="text-foreground truncate" title={String(value)}>
                                        {String(value)}
                                      </div>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                    <div className="p-2 text-center text-sm text-muted-foreground bg-muted/20 border-t">
                      Showing all {csvData.length} rows • Scroll to view more data
                    </div>
                  </div>
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
                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea className="h-80 w-full overflow-auto">
                    <div className="min-w-max w-fit">
                      <table className="text-sm border-collapse">
                        <thead className="bg-muted/50 sticky top-0 z-10">
                          <tr>
                            {Object.keys(processedData[0] || {}).map((header) => (
                              <th key={header} className="text-left p-3 border-b font-medium whitespace-nowrap w-[200px] min-w-[200px]">
                                <div className="truncate" title={header}>
                                  {header}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {processedData.map((row, index) => (
                            <tr key={index} className="border-b hover:bg-muted/25 transition-colors">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="p-3 w-[200px] min-w-[200px] border-r border-border/50">
                                  <div className="text-foreground truncate" title={String(value)}>
                                    {String(value)}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                  <div className="p-2 text-center text-sm text-muted-foreground bg-muted/20 border-t">
                    Showing all {processedData.length} processed rows • Scroll horizontally and vertically to view all data
                  </div>
                </div>
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
                    <li>• Analyzes column names and existing data patterns</li>
                    <li>• Generates contextually appropriate values</li>
                    <li>• Maintains data relationships within rows</li>
                    <li>• Supports various data types (numeric, categorical, etc.)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Supported Patterns</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Employment types and job categories</li>
                    <li>• Financial amounts and payment data</li>
                    <li>• Ratios, percentages, and scores</li>
                    <li>• Time-based values (days, months)</li>
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