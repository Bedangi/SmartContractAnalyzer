import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";
import FloatingActionButton from "./FloatingActionButton";

function AppLayout({ children }) {
  return (
    <div className="h-screen bg-background text-on-surface overflow-hidden">

      <Sidebar />

      <main className="lg:ml-64 h-full flex flex-col overflow-hidden">

        <TopNavbar />

        <div className="flex-1 mt-16 overflow-y-auto p-lg lg:p-xl scroll-smooth">

          <div className="max-w-container-max mx-auto">
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