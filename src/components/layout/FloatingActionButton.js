function FloatingActionButton() {
  return (
    <button
      className="
        fixed
        bottom-24 lg:bottom-6
        right-6
        lg:right-10
        bg-secondary
        text-on-secondary
        w-14
        h-14
        rounded-full
        shadow-lg
        flex
        items-center
        justify-center
        hover:scale-110
        active:scale-95
        transition-all
        z-50
        group
      "
      aria-label="New Analysis"
    >
      <span className="material-symbols-outlined">
        auto_awesome
      </span>

      {/* Hover tooltip */}
      <span
        className="
          absolute
          right-16
          bg-inverse-surface
          text-inverse-on-surface
          px-3
          py-1
          rounded
          text-label-sm
          opacity-0
          group-hover:opacity-100
          transition-opacity
          whitespace-nowrap
          pointer-events-none
        "
      >
        New Analysis
      </span>
    </button>
  );
}

export default FloatingActionButton;