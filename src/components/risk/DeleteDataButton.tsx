import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteAllRiskData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DeleteDataButtonProps {
  onDeleted?: () => void;
}

export default function DeleteDataButton({ onDeleted }: DeleteDataButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllRiskData();
      toast({
        title: "Success",
        description: `Deleted ${result.deleted} risk records`
      });
      onDeleted?.();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete risk data",
        variant: "destructive"
      });
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isDeleting}>
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete All Data"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Risk Data</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all risk
            snapshots and user timeseries data from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete All Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}