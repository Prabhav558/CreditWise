import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

interface UserListProps {
  users: string[];
  selectedUser: string | null;
  onUserSelect: (userId: string) => void;
}

export default function UserList({ users, selectedUser, onUserSelect }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-4 h-full">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filteredUsers.map((userId) => (
            <div
              key={userId}
              onClick={() => onUserSelect(userId)}
              className={`p-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50 text-sm ${
                selectedUser === userId 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "hover:bg-muted"
              }`}
            >
              {userId}
            </div>
          ))}
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No users found
          </div>
        )}
      </div>
    </Card>
  );
}