import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountForm } from "./forms/account-form";
import UserTable from "./forms/user-table";
import { getUser } from "@/auth/dal";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Settings() {
  const getRole = await getUser();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div className="" x-chunk="dashboard-02-chunk-1">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            {getRole?.role === "admin" || getRole?.role === "system" ? (
              <TabsTrigger value="users">Users</TabsTrigger>
            ) : (
              ""
            )}
          </TabsList>
          <TabsContent value="account">
            <AccountForm />
          </TabsContent>
          <TabsContent value="users">
            <UserTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
