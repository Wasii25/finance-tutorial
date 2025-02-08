import { Loader2 } from "lucide-react";

import { z } from "zod";

import { insertCategorySchema } from "@/db/schema";

import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";


import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"

const formSchema = insertCategorySchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const categoryQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isLoading = categoryQuery.isLoading;

    const isPending =
        editMutation.isPending ||
        deleteMutation.isPending;


    const onSubmit = (values: FormValues) => {
        const validated = formSchema.parse(values);
        editMutation.mutate(validated, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: ""
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Category
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing category
                    </SheetDescription>
                </SheetHeader>

                {isLoading
                ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                ) : (

                    <CategoryForm
                    id={id}
                    onSubmit={onSubmit}
                    disable={isPending}
                    defaultValues={defaultValues}
                    onDelete={() => deleteMutation.mutate()}
                    />
                )}
            </SheetContent>
        </Sheet>

    )
}