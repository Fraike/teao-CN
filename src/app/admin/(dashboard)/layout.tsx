import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminNav from "@/components/admin/admin-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-surface lg:flex">
      <AdminNav username={session.username} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
