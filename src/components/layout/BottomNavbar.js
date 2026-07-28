const mobileNavItems = [
  {
    name: "Home",
    icon: "home",
  },
  {
    name: "History",
    icon: "history",
  },
  {
    name: "Vault",
    icon: "folder_special",
  },
  {
    name: "Profile",
    icon: "person",
  },
];

function BottomNavbar() {
  return (
    <nav
      className="
        lg:hidden
        fixed
        bottom-0
        left-0
        w-full
        z-50
        flex
        justify-around
        items-center
        px-4
        py-2
        bg-surface
        shadow-lg
        border-t
        border-outline-variant
      "
    >
      {mobileNavItems.map((item) => {
        const isActive = item.name === "Home";

        return (
          <button
            key={item.name}
            className={`
              flex
              flex-col
              items-center
              justify-center
              transition-colors
              ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
                  : "text-on-surface-variant px-4 py-1"
              }
            `}
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>

            <span className="font-label-sm">
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavbar;