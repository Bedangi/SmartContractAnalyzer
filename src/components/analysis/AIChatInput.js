import { useState } from "react";

function AIChatInput({ suggestions = [] }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    console.log("AI Question:", question);

    setQuestion("");
  };

  const handleSuggestion = (suggestion) => {
    setQuestion(suggestion);
  };

  return (
    <div className="bg-white border-t p-lg border-outline-variant">

      <form
        onSubmit={handleSubmit}
        className="relative"
      >

        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask AI about this clause..."
          className="w-full py-3 pl-4 pr-12 text-sm transition-all border-none outline-none  bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary focus:bg-white"
        />

        <button
          type="submit"
          className="absolute p-2 transition-all -translate-y-1/2 rounded-lg shadow-md  right-2 top-1/2 bg-primary text-on-primary active:scale-90"
          aria-label="Send question"
        >
          <span className="text-sm material-symbols-outlined">
            send
          </span>
        </button>

      </form>

      {/* Suggestions */}
      <div className="flex gap-2 pb-1 mt-3 overflow-x-auto">

        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestion(suggestion)}
            className="
              whitespace-nowrap
              px-3
              py-1
              bg-surface-container-high
              text-[10px]
              font-bold
              text-on-surface-variant
              rounded-full
              border
              border-outline-variant/30
              hover:border-primary
              transition-colors
            "
          >
            "{suggestion}"
          </button>
        ))}

      </div>

    </div>
  );
}

export default AIChatInput;