import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getUsersWithRole } from "@/data-access/users";

export default async function UserTable() {
  const users = await getUsersWithRole();
  return <DataTable data={users} columns={columns} />;
}
