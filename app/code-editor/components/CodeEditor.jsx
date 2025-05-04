"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Play, ChevronDown, Terminal, Loader2, Maximize2, Minimize2 } from "lucide-react";

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[300px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading editor...
        </div>
      </div>
    ),
  }
);

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];

const themes = [
  { value: "vs-dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export function CodeEditor() {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(`// Start coding here\nconsole.log("Hello, world!");`);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState([]);
  const [showOutput, setShowOutput] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const iframeRef = useRef(null);
  const editorRef = useRef(null);

  // Only run on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && language === "python" && !pyodide) {
      const loadPyodideScript = () => {
        setOutput((prev) => [...prev, "⏳ Loading Python runtime..."]);
        
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.crossOrigin = "anonymous";
        
        script.onload = async () => {
          try {
            const loadPyodide = window.loadPyodide;
            const pyodideInstance = await loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
            });
            
            await pyodideInstance.runPythonAsync('print("Pyodide loaded successfully!")');
            
            setPyodide(pyodideInstance);
            setOutput((prev) => [...prev, "✅ Python runtime is ready!"]);
          } catch (err) {
            console.error("Pyodide loading error:", err);
            setOutput((prev) => [...prev, `❌ Error loading Python: ${err instanceof Error ? err.message : String(err)}`]);
          }
        };
        
        script.onerror = () => {
          setOutput((prev) => [...prev, "❌ Failed to load Python runtime. Please check your internet connection and try again."]);
        };
        
        document.head.appendChild(script);
      };

      loadPyodideScript();
    }
  }, [language, pyodide, mounted]);

  const clearOutput = () => {
    setOutput([]);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = "";
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput((prev) => [...prev, `$ Running ${language} code...`]);
    
    try {
      console.clear();
      if (iframeRef.current && language === "html") {
        iframeRef.current.srcdoc = "";
      }

      const captureConsole = (type) => {
        const originalConsole = console[type];
        console[type] = (...args) => {
          originalConsole.apply(console, args);
          setOutput((prev) => [...prev, args.map((arg) => 
            typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(" ")]);
        };
      };

      ["log", "error", "warn", "info"].forEach(captureConsole);

      if (language === "javascript") {
        try {
          // eslint-disable-next-line no-eval
          eval(code);
        } catch (err) {
          setOutput((prev) => [...prev, `❌ Error: ${err.message}`]);
        }
      } else if (language === "python" && pyodide) {
        try {
          await pyodide.runPythonAsync(code);
        } catch (err) {
          setOutput((prev) => [...prev, `❌ Error: ${err.message}`]);
        }
      } else if (language === "html") {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = code;
        }
      }

      // Restore original console methods
      ["log", "error", "warn", "info"].forEach((type) => {
        console[type] = console[type].original || console[type];
      });

    } catch (err) {
      setOutput((prev) => [...prev, `❌ Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Return loading state during SSR
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-[180px] px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full sm:w-[180px] px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {themes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={clearOutput}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Clear
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors ml-auto sm:ml-0"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden min-h-[300px] lg:min-h-[500px]">
          {mounted && (
            <MonacoEditor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "all",
                cursorStyle: "line",
                cursorBlinking: "smooth",
              }}
            />
          )}
        </div>

        <div className="w-full lg:w-1/3 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
          {showOutput && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Output</span>
                </div>
                <button
                  onClick={() => setShowOutput(false)}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900">
                <div className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {output.map((line, i) => (
                    <div key={i} className="py-0.5">{line}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {language === "html" && (
            <div className="h-[300px] lg:h-1/2 border-t border-gray-200 dark:border-gray-700">
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                title="HTML Output"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 