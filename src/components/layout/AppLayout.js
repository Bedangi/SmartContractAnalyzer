import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";
import FloatingActionButton from "./FloatingActionButton";

function AppLayout({ children ,activePage = "Dashboard"}) {
  return (
    <div className="h-screen overflow-hidden bg-background text-on-surface">

      <Sidebar activePage={activePage}/>

      <main className="flex flex-col h-full overflow-hidden lg:ml-64">

        <TopNavbar activePage={activePage} />

        <div className="flex-1 mt-16 overflow-y-auto p-lg lg:p-xl scroll-smooth">

          <div className="mx-auto max-w-container-max">
            {children}
          </div>

        </div>

      </main>

      <FloatingActionButton />

      <BottomNavbar />

    </div>
  );
}

export default AppLayout;