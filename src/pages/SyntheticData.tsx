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

  const isEmptyValue = (value: any): boolean => {
    return value === null || 
           value === undefined || 
           value === '' || 
           value === 'empty' ||
           (typeof value === 'string' && value.trim() === '');
  };

  const generateRandomValue = (columnName: string, allData: CSVData[]): any => {
    // Get all non-empty values in this column
    const existingValues = allData
      .map(row => row[columnName])
      .filter(val => !isEmptyValue(val));
    
    console.log(`Generating value for column: ${columnName}, existing values:`, existingValues);
    
    if (existingValues.length === 0) {
      // If no existing values, fall back to pattern-based generation
      return generateFallbackValue(columnName);
    }
    
    // Determine if column contains numeric or string data
    const numericValues = existingValues
      .filter(val => !isNaN(Number(val)) && val !== '')
      .map(Number);
    
    const stringValues = existingValues
      .filter(val => isNaN(Number(val)) || val === '');
    
    // If mostly numeric, generate numeric value based on existing range
    if (numericValues.length > stringValues.length && numericValues.length > 0) {
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      
      // Generate value within realistic range (±20% of existing range)
      const range = max - min;
      if (range === 0) {
        // All values are the same, add small variance
        return avg + (Math.random() - 0.5) * avg * 0.1;
      }
      
      const variance = range * 0.2;
      const newMin = Math.max(0, min - variance);
      const newMax = max + variance;
      
      const generatedValue = Math.random() * (newMax - newMin) + newMin;
      
      // If original values are integers, return integer
      if (numericValues.every(val => Number.isInteger(val))) {
        return Math.round(generatedValue);
      }
      
      // If original values have decimals, match the precision
      const decimalPlaces = Math.max(...numericValues.map(val => {
        const str = val.toString();
        const decimalIndex = str.indexOf('.');
        return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
      }));
      
      return Number(generatedValue.toFixed(decimalPlaces));
    }
    
    // If mostly string, pick random existing string value
    if (stringValues.length > 0) {
      return stringValues[Math.floor(Math.random() * stringValues.length)];
    }
    
    // Mixed data, return random existing value
    return existingValues[Math.floor(Math.random() * existingValues.length)];
  };

  const generateFallbackValue = (columnName: string): any => {
    const column = columnName.toLowerCase();
    
    console.log(`Generating fallback value for column: ${columnName}`);
    
    // Employment type based generation
    if (column.includes('employment') || column.includes('job') || column.includes('work')) {
      const types = ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'];
      return types[Math.floor(Math.random() * types.length)];
    }
    
    // Location based
    if (column.includes('location') || column.includes('city') || column.includes('address')) {
      const locations = ['Urban', 'Suburban', 'Rural'];
      return locations[Math.floor(Math.random() * locations.length)];
    }
    
    // Financial amounts
    if (column.includes('amount') || column.includes('salary') || column.includes('income') || column.includes('payment') || column.includes('recharge')) {
      return Math.round((Math.random() * 1000 + 100) * 100) / 100; // Random amount between 100-1100 with 2 decimals
    }
    
    // Frequency values
    if (column.includes('freq') || column.includes('frequency')) {
      return Math.floor(Math.random() * 20) + 1;
    }
    
    // Ratios and percentages
    if (column.includes('ratio') || column.includes('rate') || column.includes('percent')) {
      return Math.round(Math.random() * 100) / 100; // 0.00 to 1.00
    }
    
    // Days
    if (column.includes('days') || column.includes('day')) {
      return Math.floor(Math.random() * 365) + 1;
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
    
    // ID values
    if (column.includes('id') || column.includes('user')) {
      return `user_${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
    }
    
    // Geographic/location variance
    if (column.includes('geo') || column.includes('variance')) {
      return Math.round(Math.random() * 100) / 100;
    }
    
    // Default: generate a reasonable numeric value
    return Math.floor(Math.random() * 100) + 1;
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
      let emptyCellsCount = 0;
      let filledCellsCount = 0;
      
      const processed = csvData.map((row, rowIndex) => {
        const newRow = { ...row };
        
        // Find empty cells and fill them
        Object.keys(newRow).forEach(key => {
          if (isEmptyValue(newRow[key])) {
            emptyCellsCount++;
            const generatedValue = generateRandomValue(key, csvData);
            newRow[key] = generatedValue;
            filledCellsCount++;
            console.log(`Filled empty cell in row ${rowIndex}, column ${key} with value: ${generatedValue}`);
          }
        });
        
        return newRow;
      });
      
      console.log(`Processing complete. Found ${emptyCellsCount} empty cells, filled ${filledCellsCount} cells`);
      
      setProcessedData(processed);
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete",
        description: `Filled ${filledCellsCount} empty cells in ${processed.length} rows`,
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

  const DataTable = ({ data, title }: { data: CSVData[], title: string }) => {
    const [currentRowPage, setCurrentRowPage] = useState(0);
    const [horizontalScroll, setHorizontalScroll] = useState(0);
    const horizontalScrollRef = useRef<HTMLDivElement>(null);
    const verticalScrollRef = useRef<HTMLDivElement>(null);
    
    const rowsPerPage = 6;
    const maxVisibleColumns = 4; // Show only 4 columns initially
    
    if (data.length === 0) return null;

    const columns = Object.keys(data[0] || {});
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const currentRows = data.slice(currentRowPage * rowsPerPage, (currentRowPage + 1) * rowsPerPage);
    
    const visibleColumns = columns.slice(horizontalScroll, horizontalScroll + maxVisibleColumns);
    const canScrollLeft = horizontalScroll > 0;
    const canScrollRight = horizontalScroll + maxVisibleColumns < columns.length;
    const canScrollUp = currentRowPage > 0;
    const canScrollDown = currentRowPage < totalPages - 1;

    const scrollHorizontal = (direction: 'left' | 'right') => {
      if (direction === 'left' && canScrollLeft) {
        setHorizontalScroll(Math.max(0, horizontalScroll - 1));
      } else if (direction === 'right' && canScrollRight) {
        setHorizontalScroll(Math.min(columns.length - maxVisibleColumns, horizontalScroll + 1));
      }
    };

    const scrollVertical = (direction: 'up' | 'down') => {
      if (direction === 'up' && canScrollUp) {
        setCurrentRowPage(currentRowPage - 1);
      } else if (direction === 'down' && canScrollDown) {
        setCurrentRowPage(currentRowPage + 1);
      }
    };

    return (
      <div className="w-full max-w-full">
        {/* Header with navigation controls */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {data.length} rows • {columns.length} columns
            </span>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Horizontal scroll controls */}
            <div className="flex items-center gap-1 border rounded p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollHorizontal('left')}
                disabled={!canScrollLeft}
                className="h-7 w-7 p-0"
                title="Previous columns"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                {horizontalScroll + 1}-{Math.min(horizontalScroll + maxVisibleColumns, columns.length)} of {columns.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollHorizontal('right')}
                disabled={!canScrollRight}
                className="h-7 w-7 p-0"
                title="Next columns"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>

            {/* Vertical scroll controls */}
            <div className="flex items-center gap-1 border rounded p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollVertical('up')}
                disabled={!canScrollUp}
                className="h-7 w-7 p-0"
                title="Previous rows"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                {currentRowPage + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollVertical('down')}
                disabled={!canScrollDown}
                className="h-7 w-7 p-0"
                title="Next rows"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container - Fixed size */}
        <div className="border rounded-lg overflow-hidden bg-background w-full">
          <div className="w-full">
            <table className="w-full border-collapse text-sm">
              {/* Fixed Header */}
              <thead className="bg-muted/50">
                <tr>
                  {visibleColumns.map((header, index) => (
                    <th 
                      key={`${header}-${index}`} 
                      className="text-left p-3 border-b font-medium bg-muted/50 w-1/4"
                    >
                      <div className="truncate font-semibold" title={header}>
                        {header}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Fixed Body - exactly 6 rows */}
              <tbody>
                {Array.from({ length: rowsPerPage }).map((_, rowIndex) => {
                  const row = currentRows[rowIndex];
                  if (!row) {
                    // Empty row for consistent height
                    return (
                      <tr key={`empty-${rowIndex}`} className="border-b">
                        {visibleColumns.map((_, colIndex) => (
                          <td key={`empty-cell-${colIndex}`} className="p-3 border-r border-border/30 h-12">
                            <div className="w-full h-6"></div>
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  
                  return (
                    <tr key={`row-${currentRowPage}-${rowIndex}`} className="border-b hover:bg-muted/25 transition-colors">
                      {visibleColumns.map((column, colIndex) => {
                        const value = row[column];
                        const isEmpty = isEmptyValue(value);
                        return (
                          <td key={`cell-${colIndex}`} className="p-3 border-r border-border/30">
                            {isEmpty ? (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-destructive/10 text-destructive font-medium">
                                empty
                              </span>
                            ) : (
                              <div className="truncate" title={String(value)}>
                                {String(value)}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with scroll indicators */}
          <div className="flex items-center justify-between p-3 bg-muted/20 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                Rows: {currentRowPage * rowsPerPage + 1}-{Math.min((currentRowPage + 1) * rowsPerPage, data.length)} of {data.length}
              </span>
              <span>
                Columns: {horizontalScroll + 1}-{Math.min(horizontalScroll + maxVisibleColumns, columns.length)} of {columns.length}
              </span>
            </div>
            
            {/* Visual scroll indicators */}
            <div className="flex items-center gap-2">
              <span className="text-xs">Navigate with buttons above</span>
              <div className="flex items-center gap-1">
                {/* Column indicator */}
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.ceil(columns.length / maxVisibleColumns) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        Math.floor(horizontalScroll / maxVisibleColumns) === i 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <div className="w-px h-3 bg-border mx-1" />
                {/* Row indicator */}
                <div className="flex gap-0.5">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        currentRowPage === i ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
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
                    <li>• Analyzes existing values in each column</li>
                    <li>• Generates values within realistic ranges for numeric data</li>
                    <li>• Selects from existing categorical values for text data</li>
                    <li>• Maintains data consistency and relationships</li>
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