import { z } from "zod";

import { insertTransactionSchema } from "@/db/schema";

import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({ id: true });
type FormValues = z.infer<typeof formSchema>;

export const NewTransactionsheet = () => {
    const { isOpen, onClose } = useNewTransaction()

    const createMutation = useCreateTransaction();

    


    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));


    //below variable disables the form
    const isPending = 
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

    //below variable doesnt even show the form
    const isLoading = 
    categoryQuery.isLoading ||
    accountQuery.isLoading;


    const onSubmit = (values: FormValues) => {
        const validated = formSchema.parse(values);
        createMutation.mutate(validated, {
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
                        New Transactions
                    </SheetTitle>
                    <SheetDescription>
                        Create a new transaction to track your transactions
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    )
                    :
                    (
                    <TransactionForm
                    onSubmit={onSubmit}
                    disabled={isPending}
                    categoryOptions={categoryOptions}
                    onCreateCategory={onCreateCategory}
                    accountOptions={accountOptions}
                    onCreateAccount={onCreateAccount}
                />
                    )
                }
                
            </SheetContent>
        </Sheet>

    )
}