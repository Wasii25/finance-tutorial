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

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

//classes for datatable
import { columns } from "./columns"



const CategoriesPage = () => {
    const newAccouunt = useNewCategory();
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];
    const deleteCategories = useBulkDeleteCategories()

    const isDisabled = 
        categoriesQuery.isLoading ||
        deleteCategories.isPending;


    if(categoriesQuery.isLoading){
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
                        Categories Page
                    </CardTitle>
                    
                    <Button onClick={newAccouunt.onOpen} className="siz-sm">
                        <Plus className="size-4 mr-2"/>
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    columns={columns} 
                    data={categories} 
                    filterKey={"name"}
                    onDeleteAction={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteCategories.mutate({ json: { ids } });
                    }}
                    disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesPage;