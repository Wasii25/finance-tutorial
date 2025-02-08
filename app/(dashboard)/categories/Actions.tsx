"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";


import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";


type Props = {
  id: string;
};
export const Actions = ({ id }: Props) => {
  const deleteMutation = useDeleteAccount(id)
  const { onOpen } = useOpenAccount();

  const handleDelete = async () => {
    deleteMutation.mutate();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger  asChild>

            <Button variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4"/>
            </Button>

        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem 
                disabled={deleteMutation.isPending}
                onClick={() => { onOpen(id) }}
            > 
                <Edit className="size-4 mr-2"/>
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
            > 
                <Trash className="size-4 mr-2"/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    </>
  );
};
