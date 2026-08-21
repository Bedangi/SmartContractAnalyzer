import { useNavigate } from "react-router-dom";
function FloatingActionButton() {
  const navigate = useNavigate();
  return (
    <button
      className="fixed z-50 flex items-center justify-center transition-all rounded-full shadow-lg bottom-24 lg:bottom-6 right-6 lg:right-10 bg-secondary text-on-secondary w-14 h-14 hover:scale-110 active:scale-95 group"
      aria-label="New Analysis"
      onClick={() => navigate("/analysis/new")}
    >
      <span className="material-symbols-outlined">
        auto_awesome
      </span>

      {/* Hover tooltip */}
      <span
        className="absolute px-3 py-1 transition-opacity rounded opacity-0 pointer-events-none right-16 bg-inverse-surface text-inverse-on-surface text-label-sm group-hover:opacity-100 whitespace-nowrap"
      >
        New Analysis
      </span>
    </button>
  );
}

export default FloatingActionButton;