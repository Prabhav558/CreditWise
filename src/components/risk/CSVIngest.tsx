import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { ingestMonthlyCSV } from "@/lib/api";

interface CSVIngestProps {
  onUploaded?: () => void;
}

export default function CSVIngest({ onUploaded }: CSVIngestProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid CSV file",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const result = await ingestMonthlyCSV(selectedFile);
      toast({
        title: "Success",
        description: `Ingested ${result.ingested} rows`
      });
      setSelectedFile(null);
      onUploaded?.();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
        className="max-w-xs"
      />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        variant="outline"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Upload Month CSV
      </Button>
    </div>
  );
}