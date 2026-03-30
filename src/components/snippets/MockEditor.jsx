const MockEditor = ({ value, onChange, language = "Editor" }) => {
  return (
    <div className="flex flex-col w-full border border-gray-100 rounded-2xl overflow-hidden bg-[#1e1e1e] shadow-xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#252526] border-b border-[#3c3c3c]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {language}
        </div>
      </div>

      <div className="flex min-h-[450px] font-mono text-base leading-relaxed relative">
        {/* Line Numbers Mock */}
        <div className="w-12 bg-[#1e1e1e] border-r border-[#3c3c3c] flex flex-col items-center pt-4 text-[#858585] text-xs select-none space-y-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-6 flex items-center">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <div className="flex-1 focus-within:outline-none bg-[#1e1e1e]">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 bg-transparent resize-none border-none focus:ring-0 focus:outline-none text-[#d4d4d4] font-mono overflow-auto custom-scrollbar leading-[1.6]"
            spellCheck="false"
            placeholder="// Paste or write your professional code here..."
            style={{
              fontFamily: '"Fira Code", "Source Code Pro", monospace',
              fontSize: "16px",
            }}
          />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 5px;
        }
      `,
        }}
      />
    </div>
  );
};

export default MockEditor;
