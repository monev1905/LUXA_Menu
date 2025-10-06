import { Suspense } from "react";
import { getMenuData } from "@/lib/data";
import MenuContent from "./MenuContent";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function MenuPage() {
  // Fetch all data once on the server
  const menuData = await getMenuData();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <MenuContent menuData={menuData} />
    </Suspense>
  );
}
