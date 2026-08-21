
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
const navItems = [
  {
    name: "Dashboard",
    icon: "dashboard",
    path: "/",
  },
  {
    name: "History",
    icon: "history",
    path: "/analysis/demo",
  },
  {
    name: "Compare",
    icon: "compare_arrows",
    path: "/recommendations/demo",
  },
];

function Sidebar({activePage='Dashboard'}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <aside className="fixed top-0 left-0 z-50 flex-col hidden w-64 h-screen overflow-y-auto border-r lg:flex py-xl px-md bg-surface-container-low border-outline-variant">

      <div className="flex flex-col h-full gap-6">

        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-on-primary">
            <span className="material-symbols-outlined">
              gavel
            </span>
          </div>

          <div>
            <h1 className="font-extrabold font-display-lg text-title-md text-primary">
              Smart Contract Analyzer
            </h1>

            <p className="font-label-md text-on-surface-variant opacity-70">
              
            </p>
          </div>
        </div>

        {/* New Analysis */}
        <button onClick={() => navigate("/analysis/new")} className="flex items-center justify-center gap-2 px-4 py-3 mt-4 font-bold transition-transform bg-primary text-on-primary rounded-xl active:scale-95">
          <span className="material-symbols-outlined">
            add
          </span>

          New Analysis
        </button>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-1">

          {navItems.map((item) => {
            const isActive = item.name === activePage;

            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.path !== "#") {
                    navigate(item.path);
                  }
                }}
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
        <div className="pt-6 space-y-1 border-t border-outline-variant">

          {/* <button className="flex items-center w-full gap-3 px-4 py-3 transition-colors rounded-lg text-on-surface-variant hover:bg-surface-container-high">
            <span className="material-symbols-outlined">
              help_outline
            </span>

            <span className="font-label-md">
              Support
            </span>
          </button> */}

          <button className="flex items-center w-full gap-3 px-4 py-3 transition-colors rounded-lg text-error hover:bg-error-container/10">
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