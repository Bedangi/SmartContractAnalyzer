const navItems = [
  {
    name: "Dashboard",
    icon: "dashboard",
  },
  {
    name: "History",
    icon: "history",
  },
  {
    name: "Reports",
    icon: "description",
  },
  {
    name: "Saved",
    icon: "bookmark",
  },
  {
    name: "Compare",
    icon: "compare_arrows",
  },
  {
    name: "Settings",
    icon: "settings",
  },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 py-xl px-md w-64 overflow-y-auto bg-surface-container-low border-r border-outline-variant z-50">

      <div className="flex flex-col gap-6 h-full">

        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">
              gavel
            </span>
          </div>

          <div>
            <h1 className="font-display-lg text-title-md font-extrabold text-primary">
              LexisAI
            </h1>

            <p className="font-label-md text-on-surface-variant opacity-70">
              Legal Intelligence
            </p>
          </div>
        </div>

        {/* New Analysis */}
        <button className="mt-4 flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 rounded-xl font-bold active:scale-95 transition-transform">
          <span className="material-symbols-outlined">
            add
          </span>

          New Analysis
        </button>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-1">

          {navItems.map((item) => {
            const isActive = item.name === "Dashboard";

            return (
              <button
                key={item.name}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                  ${
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }
                `}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

                <span className="font-label-md">
                  {item.name}
                </span>
              </button>
            );
          })}

        </nav>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-outline-variant space-y-1">

          <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">
              help_outline
            </span>

            <span className="font-label-md">
              Support
            </span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined">
              logout
            </span>

            <span className="font-label-md">
              Sign Out
            </span>
          </button>

        </div>

      </div>
    </aside>
  );
}

export default Sidebar;