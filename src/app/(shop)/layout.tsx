import { Footer, SideBar, TopMenu } from "@/components";

export default function ShopLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <main className=" min-h-screen">

      <TopMenu />

      <SideBar />

      <div className="sm:px-10">
        { children }
      </div>

      <Footer />
    </main>
  );
}