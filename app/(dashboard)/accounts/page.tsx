"use client"
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";


//classes for datatable
import { Payment, columns } from "./columns"
import { DataTable } from "@/components/data-table";

const data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
]

const AccountsPage = () => {
    const newAccouunt = useNewAccount();

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
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountsPage;