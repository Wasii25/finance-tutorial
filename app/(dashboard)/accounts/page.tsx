"use client"
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";

//classes for datatable
import { columns } from "./columns"



const AccountsPage = () => {
    const newAccouunt = useNewAccount();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];
    const deleteAccounts = useBulkDeleteAccounts()

    const isDisabled = 
        accountsQuery.isLoading ||
        deleteAccounts.isPending;


    if(accountsQuery.isLoading){
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin"/>
                        </div>
                    </CardContent>
                </Card>    
            </div>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            {/* max-w-2xl mx-auto classes in the above div are so that the div takes up only so much space on zoom out
                i.e it'll stop expanding on zoom out after a limit */}
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Accounts Page
                    </CardTitle>
                    
                    <Button onClick={newAccouunt.onOpen} className="siz-sm">
                        <Plus className="size-4 mr-2"/>
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns} 
                    data={accounts} 
                    filterKey={"name"}
                    onDeleteAction={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteAccounts.mutate({ json: { ids } });
                    }}
                    disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountsPage;