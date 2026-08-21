import { useNavigate } from "react-router-dom";
function TopNavbar({ activePage = 'Dashboard' }) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 border-b shadow-sm lg:left-64 bg-surface border-outline-variant px-lg">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* <button className="lg:hidden text-primary">
          <span className="material-symbols-outlined">
            menu
          </span>
        </button> */}

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
            search
          </span>

          <input
            type="text"
            placeholder="Search clauses..."
            className="
              bg-surface-container-low
              border-none
              rounded-full
              pl-10
              pr-4
              py-1.5
              text-label-md
              w-64
              focus:w-80
              focus:ring-2
              focus:ring-primary/20
              transition-all
              outline-none
            "
          />
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Navigation */}
        <div className="hidden gap-6 md:flex">

          <button onClick={() => navigate("/")} className={
            activePage === "Dashboard"
              ? "font-label-md text-primary border-b-2 border-primary pb-1"
              : "font-label-md text-on-surface-variant hover:text-primary transition-colors"
          }>
            Dashboard
          </button>

          <button onClick={() => navigate("/analysis/demo")} className={
            activePage === "History"
              ? "font-label-md text-primary border-b-2 border-primary pb-1"
              : "font-label-md text-on-surface-variant hover:text-primary transition-colors"
          }>
            Analysis
          </button>

          <button onClick={() => navigate("/recommendations/demo")} className={
            activePage === "Compare"
              ? "font-label-md text-primary border-b-2 border-primary pb-1"
              : "font-label-md text-on-surface-variant hover:text-primary transition-colors"
          }>
            Recommendations
          </button>

        </div>

        {/* User controls */}
        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">

          {/* <button className="relative hover:bg-surface-container-high p-1.5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              notifications
            </span>

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button> */}

          {/* <button className="hover:bg-surface-container-high p-1.5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              settings
            </span>
          </button> */}

          {/* Temporary avatar */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[20px]">
              person
            </span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default TopNavbar;