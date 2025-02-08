import { z } from "zod";

import { insertCategorySchema } from "@/db/schema";

import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { CategoryForm } from "@/features/categories/components/category-form";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"

const formSchema = insertCategorySchema.pick({ name: true });
type FormValues = z.infer<typeof formSchema>;

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory()

    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues) => {
        const validated = formSchema.parse(values);
        mutation.mutate(validated, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to track your transactions
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
                    onSubmit={onSubmit}
                    disable={mutation.isPending}
                    defaultValues={{
                        name: "",
                    }}

                />
            </SheetContent>
        </Sheet>

    )
}