import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Pause, Play, SkipBack, SkipForward, RotateCcw, Plus, Trash2, Search, Minus, Eye, ArrowDown, ArrowUp } from "lucide-react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack2;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack2]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function ClientOnlyEditor({
  language,
  value,
  onChange,
  height = "100%",
  theme = "vs-dark",
  options = {}
}) {
  const [Editor, setEditor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      import("@monaco-editor/react").then((module) => {
        setEditor(() => module.default);
        setIsLoading(false);
      }).catch((error) => {
        console.error("Failed to load Monaco Editor:", error);
        setIsLoading(false);
      });
    }
  }, []);
  if (!isClient) {
    return null;
  }
  if (isLoading || !Editor) {
    return /* @__PURE__ */ jsx("div", {
      className: "flex items-center justify-center h-full bg-gray-800 text-white",
      children: /* @__PURE__ */ jsxs("div", {
        className: "text-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"
        }), /* @__PURE__ */ jsx("p", {
          children: "Loading code editor..."
        })]
      })
    });
  }
  return /* @__PURE__ */ jsx(Editor, {
    height,
    language,
    value,
    onChange,
    theme,
    options: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
      fontLigatures: true,
      ...options
    }
  });
}
function meta({}) {
  return [{
    title: "Algorithm Visualizer"
  }, {
    name: "description",
    content: "Interactive Data Structure & Algorithm Visualizations"
  }];
}
const home = UNSAFE_withComponentProps(function Home2() {
  const [imageError, setImageError] = useState(false);
  return /* @__PURE__ */ jsxs("main", {
    className: "relative min-h-screen overflow-hidden",
    children: [/* @__PURE__ */ jsx("div", {
      className: "absolute inset-0 bg-gradient-animated"
    }), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10 h-screen flex",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "w-1/2 p-8 overflow-y-auto",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mb-8",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center mb-6",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-16 h-16 rounded-full mr-4 ring-4 ring-white/20 shadow-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm",
              children: !imageError ? /* @__PURE__ */ jsx("img", {
                src: "/profile.png",
                alt: "Naren Allam",
                className: "w-full h-full object-cover rounded-full",
                onError: () => setImageError(true)
              }) : /* @__PURE__ */ jsx("div", {
                className: "w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold",
                children: "NA"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-sm font-semibold text-white/90 tracking-wider uppercase",
                children: "NAREN ALLAM"
              }), /* @__PURE__ */ jsx("h1", {
                className: "text-3xl font-bold text-white",
                children: "Algo Visualizer"
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsx(AlgorithmCard, {
            title: "LinkedList",
            description: "Linear data structure with dynamic memory allocation and efficient insertion/deletion",
            href: "/linked-list",
            icon: "🔗",
            status: "available",
            gradient: "from-slate-800 via-slate-700 to-gray-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "BinarySearchTree",
            description: "Hierarchical structure for efficient searching, insertion, and deletion operations",
            href: "/binary-search-tree",
            icon: "🌳",
            status: "available",
            gradient: "from-emerald-800 via-green-700 to-teal-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Stack",
            description: "LIFO (Last In, First Out) data structure for managing function calls and expressions",
            href: "/stack",
            icon: "📚",
            status: "available",
            gradient: "from-indigo-800 via-purple-700 to-violet-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Queue",
            description: "FIFO (First In, First Out) structure for scheduling and breadth-first algorithms",
            href: "/queue",
            icon: "🔄",
            status: "available",
            gradient: "from-cyan-800 via-blue-700 to-indigo-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Graph Algorithms",
            description: "Network structures for modeling relationships and pathfinding algorithms",
            href: "/graph",
            icon: "🕸️",
            status: "available",
            gradient: "from-gray-800 via-slate-700 to-zinc-900",
            iconStyle: "filter: brightness(1.5) contrast(1.2)"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Trie (Prefix Tree)",
            description: "Tree structure optimized for string operations and autocomplete functionality",
            href: "/trie",
            icon: "🌲",
            status: "available",
            gradient: "from-green-800 via-emerald-700 to-teal-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Hash Set",
            description: "Set implementation using hash tables for O(1) average lookup time",
            href: "/hashset",
            icon: "🔢",
            status: "available",
            gradient: "from-orange-800 via-red-700 to-rose-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Hash Table",
            description: "Key-value storage with hash functions for fast data retrieval and storage",
            href: "/hashtable",
            icon: "🔑",
            status: "available",
            gradient: "from-yellow-800 via-amber-700 to-orange-900"
          }), /* @__PURE__ */ jsx(AlgorithmCard, {
            title: "Heap (Priority Queue)",
            description: "Binary tree structure for priority-based operations and efficient sorting",
            href: "/heapq",
            icon: "⛰️",
            status: "available",
            gradient: "from-stone-800 via-neutral-700 to-gray-900"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/2 p-8",
        children: /* @__PURE__ */ jsx(CodingPlayground, {})
      })]
    })]
  });
});
function AlgorithmCard({
  title,
  description,
  href,
  icon,
  status,
  gradient,
  iconStyle
}) {
  const isAvailable = status === "available";
  const CardContent = () => /* @__PURE__ */ jsxs("div", {
    className: `
      relative overflow-hidden p-5 rounded-lg border transition-all duration-300 group
      ${isAvailable ? `bg-gradient-to-br ${gradient} hover:shadow-xl hover:scale-[1.02] cursor-pointer border-white/20 hover:border-white/40 backdrop-blur-sm` : "bg-gray-600/20 cursor-not-allowed border-gray-500/30"}
    `,
    children: [isAvailable && /* @__PURE__ */ jsx("div", {
      className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"
    }), /* @__PURE__ */ jsx("div", {
      className: "relative",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-start gap-4",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-2xl filter drop-shadow-lg flex-shrink-0 mt-1",
          style: iconStyle ? {
            filter: iconStyle
          } : void 0,
          children: icon
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/* @__PURE__ */ jsx("h3", {
              className: `text-lg font-semibold ${isAvailable ? "text-white" : "text-gray-300"}`,
              children: title
            }), !isAvailable && /* @__PURE__ */ jsx("span", {
              className: "text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full",
              children: "Soon"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: `text-sm leading-relaxed ${isAvailable ? "text-white/80" : "text-gray-400"}`,
            children: description
          })]
        })]
      })
    }), isAvailable && /* @__PURE__ */ jsx("div", {
      className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    })]
  });
  if (!isAvailable) {
    return /* @__PURE__ */ jsx(CardContent, {});
  }
  return /* @__PURE__ */ jsx(Link, {
    to: href,
    className: "block",
    children: /* @__PURE__ */ jsx(CardContent, {})
  });
}
function CodingPlayground() {
  const [activeTab, setActiveTab] = useState("python");
  const [code, setCode] = useState({
    python: '# Python Playground\nprint("Hello, World!")\n\n# Try some Python code here\nfor i in range(5):\n    print(f"Number: {i}")',
    cpp: '// C++ Playground\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    java: '// Java Playground\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    go: '// Go Playground\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    javascript: '// JavaScript Playground\nconsole.log("Hello, World!");\n\n// Try some JavaScript code here\nfor (let i = 0; i < 5; i++) {\n    console.log(`Number: ${i}`);\n}'
  });
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(30);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);
  const languages = [{
    id: "python",
    name: "Python",
    ext: ".py",
    monaco: "python"
  }, {
    id: "cpp",
    name: "C/C++",
    ext: ".cpp",
    monaco: "cpp"
  }, {
    id: "java",
    name: "Java",
    ext: ".java",
    monaco: "java"
  }, {
    id: "go",
    name: "Go",
    ext: ".go",
    monaco: "go"
  }, {
    id: "javascript",
    name: "JS",
    ext: ".js",
    monaco: "javascript"
  }];
  const getMonacoLanguage = (langId) => {
    const languageMap = {
      "python": "python",
      "cpp": "cpp",
      "java": "java",
      "go": "go",
      "javascript": "javascript"
    };
    return languageMap[langId] || "javascript";
  };
  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);
  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newHeight = (containerRect.bottom - e.clientY) / containerRect.height * 100;
    setConsoleHeight(Math.max(15, Math.min(60, newHeight)));
  }, [isResizing]);
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);
  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    try {
      if (activeTab === "javascript") {
        const originalLog = console.log;
        let logs = [];
        console.log = (...args) => {
          logs.push(args.join(" "));
        };
        try {
          const func = new Function(code[activeTab]);
          func();
          setOutput(logs.length > 0 ? logs.join("\n") : "Code executed successfully (no output)");
        } catch (error) {
          setOutput(`Error: ${error}`);
        } finally {
          console.log = originalLog;
        }
      } else {
        const sampleOutputs = {
          python: "Hello, World!\nNumber: 0\nNumber: 1\nNumber: 2\nNumber: 3\nNumber: 4",
          cpp: "Hello, World!",
          java: "Hello, World!",
          go: "Hello, World!"
        };
        setOutput(sampleOutputs[activeTab] || "Code executed successfully");
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };
  const clearOutput = () => {
    setOutput("");
  };
  const handleEditorChange = (value) => {
    setCode((prev) => ({
      ...prev,
      [activeTab]: value || ""
    }));
  };
  return /* @__PURE__ */ jsxs("div", {
    ref: containerRef,
    className: "bg-gray-900/90 backdrop-blur-md rounded-lg h-full flex flex-col border border-white/10",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "p-4 border-b border-gray-700 flex-shrink-0",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between mb-3",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-xl font-bold text-white",
          children: "Coding Playground"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex gap-2",
          children: [/* @__PURE__ */ jsx("button", {
            onClick: runCode,
            disabled: isRunning,
            className: "px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-md text-sm font-medium transition-colors",
            children: isRunning ? "Running..." : "Run"
          }), /* @__PURE__ */ jsx("button", {
            onClick: clearOutput,
            className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors",
            children: "Clear"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex gap-1",
        children: languages.map((lang) => /* @__PURE__ */ jsx("button", {
          onClick: () => setActiveTab(lang.id),
          className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === lang.id ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`,
          children: lang.name
        }, lang.id))
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "flex-1 flex flex-col min-h-0",
      style: {
        height: `${100 - consoleHeight}%`
      },
      children: /* @__PURE__ */ jsx("div", {
        className: "flex-1 min-h-0",
        children: /* @__PURE__ */ jsx(ClientOnlyEditor, {
          language: getMonacoLanguage(activeTab),
          value: code[activeTab],
          onChange: handleEditorChange,
          options: {
            minimap: {
              enabled: false
            },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: {
              top: 16,
              bottom: 16
            },
            lineHeight: 1.6,
            letterSpacing: 0.5,
            smoothScrolling: true,
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: "on",
            renderWhitespace: "selection",
            renderControlCharacters: false,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          }
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      ref: resizeRef,
      onMouseDown: handleMouseDown,
      className: `h-1 bg-gray-600 hover:bg-gray-500 cursor-row-resize transition-colors ${isResizing ? "bg-blue-500" : ""} flex-shrink-0`,
      title: "Drag to resize console"
    }), /* @__PURE__ */ jsxs("div", {
      className: "border-t border-gray-700 flex-shrink-0",
      style: {
        height: `${consoleHeight}%`
      },
      children: [/* @__PURE__ */ jsxs("div", {
        className: "bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-sm font-medium text-white",
          children: "Console"
        }), /* @__PURE__ */ jsxs("span", {
          className: "text-xs text-gray-400",
          children: ["Height: ", consoleHeight.toFixed(0), "%"]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "h-full bg-black text-green-400 p-4 font-mono text-sm overflow-y-auto",
        style: {
          height: "calc(100% - 40px)",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
        },
        children: output ? /* @__PURE__ */ jsx("pre", {
          className: "whitespace-pre-wrap",
          children: output
        }) : /* @__PURE__ */ jsx("div", {
          className: "text-gray-500",
          children: "Output will appear here..."
        })
      })]
    })]
  });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$8 = {
  slow: 1500,
  normal: 800,
  fast: 400
};
const linkedList = UNSAFE_withComponentProps(function LinkedListVisualization() {
  var _a, _b;
  const [nodes, setNodes] = useState({});
  const [head, setHead] = useState(null);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [insertPosition, setInsertPosition] = useState("tail");
  const [insertIndex, setInsertIndex] = useState(0);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const getNodeList = useCallback(() => {
    if (!head) return [];
    const result = [];
    let currentId = head;
    const visited = /* @__PURE__ */ new Set();
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const node = nodes[currentId];
      if (node) {
        result.push(node);
        currentId = node.next;
      } else {
        break;
      }
    }
    return result;
  }, [nodes, head]);
  const playAnimation = useCallback(() => {
    if (currentStepIndex >= animationSteps.length - 1) return;
    setIsPlaying(true);
    intervalRef.current = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightNodeId) {
          setHighlightedNodeId(step.highlightNodeId);
        }
        return nextIndex;
      });
    }, SPEEDS$8[speed]);
  }, [currentStepIndex, animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightNodeId) {
        setHighlightedNodeId(step.highlightNodeId);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      setCurrentStepIndex((prev) => prev - 1);
      setHighlightedNodeId(null);
    }
  }, [currentStepIndex]);
  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentStepIndex(-1);
    setHighlightedNodeId(null);
    setAnimationSteps([]);
  }, [pauseAnimation]);
  const insertNode = useCallback((value, position, index) => {
    const newNode = {
      id: generateId(),
      value,
      next: null
    };
    const steps = [];
    if (!head) {
      setNodes({
        [newNode.id]: newNode
      });
      setHead(newNode.id);
      steps.push({
        type: "insert",
        description: `Inserted ${value} as the first node`,
        newNode,
        highlightNodeId: newNode.id
      });
    } else if (position === "head") {
      const updatedNode = {
        ...newNode,
        next: head
      };
      setNodes((prev) => ({
        ...prev,
        [newNode.id]: updatedNode
      }));
      setHead(newNode.id);
      steps.push({
        type: "insert",
        description: `Inserted ${value} at the head`,
        newNode: updatedNode,
        highlightNodeId: newNode.id
      });
    } else if (position === "tail") {
      const nodeList2 = getNodeList();
      const lastNode = nodeList2[nodeList2.length - 1];
      if (lastNode) {
        setNodes((prev) => ({
          ...prev,
          [newNode.id]: newNode,
          [lastNode.id]: {
            ...lastNode,
            next: newNode.id
          }
        }));
        steps.push({
          type: "insert",
          description: `Inserted ${value} at the tail`,
          newNode,
          highlightNodeId: newNode.id
        });
      }
    } else if (position === "position" && typeof index === "number") {
      const nodeList2 = getNodeList();
      if (index === 0) {
        const updatedNode = {
          ...newNode,
          next: head
        };
        setNodes((prev) => ({
          ...prev,
          [newNode.id]: updatedNode
        }));
        setHead(newNode.id);
      } else if (index >= nodeList2.length) {
        const lastNode = nodeList2[nodeList2.length - 1];
        setNodes((prev) => ({
          ...prev,
          [newNode.id]: newNode,
          [lastNode.id]: {
            ...lastNode,
            next: newNode.id
          }
        }));
      } else {
        const prevNode = nodeList2[index - 1];
        const updatedNewNode = {
          ...newNode,
          next: prevNode.next
        };
        const updatedPrevNode = {
          ...prevNode,
          next: newNode.id
        };
        setNodes((prev) => ({
          ...prev,
          [newNode.id]: updatedNewNode,
          [prevNode.id]: updatedPrevNode
        }));
      }
      steps.push({
        type: "insert",
        description: `Inserted ${value} at position ${index}`,
        newNode,
        highlightNodeId: newNode.id
      });
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    if (!head) {
      setConsoleOutput((prev) => [...prev, `Insert: ${value} → added as first node`]);
    } else if (position === "head") {
      setConsoleOutput((prev) => [...prev, `Insert: ${value} → added at head`]);
    } else if (position === "tail") {
      setConsoleOutput((prev) => [...prev, `Insert: ${value} → added at tail`]);
    } else if (position === "position" && typeof index === "number") {
      setConsoleOutput((prev) => [...prev, `Insert: ${value} → added at position ${index}`]);
    }
  }, [head, getNodeList]);
  const deleteNode = useCallback((value) => {
    const nodeList2 = getNodeList();
    const nodeIndex = nodeList2.findIndex((node) => node.value === value);
    if (nodeIndex === -1) {
      alert(`Value ${value} not found in the list`);
      return;
    }
    const nodeToDelete = nodeList2[nodeIndex];
    const steps = [];
    steps.push({
      type: "search",
      description: `Searching for node with value ${value}`,
      highlightNodeId: nodeToDelete.id
    });
    if (nodeIndex === 0) {
      const newHead = nodeToDelete.next;
      setHead(newHead);
      setNodes((prev) => {
        const updated = {
          ...prev
        };
        delete updated[nodeToDelete.id];
        return updated;
      });
    } else {
      const prevNode = nodeList2[nodeIndex - 1];
      const updatedPrevNode = {
        ...prevNode,
        next: nodeToDelete.next
      };
      setNodes((prev) => {
        const updated = {
          ...prev
        };
        updated[prevNode.id] = updatedPrevNode;
        delete updated[nodeToDelete.id];
        return updated;
      });
    }
    steps.push({
      type: "delete",
      description: `Deleted node with value ${value}`,
      deletedNodeId: nodeToDelete.id
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setConsoleOutput((prev) => [...prev, `Delete: ${value} → removed from list`]);
  }, [getNodeList]);
  const searchNode = useCallback((value) => {
    const nodeList2 = getNodeList();
    const steps = [];
    let found = false;
    for (let i = 0; i < nodeList2.length; i++) {
      const node = nodeList2[i];
      steps.push({
        type: "search",
        description: `Checking node at position ${i} (value: ${node.value})`,
        highlightNodeId: node.id,
        currentNodeId: node.id
      });
      if (node.value === value) {
        steps.push({
          type: "search",
          description: `Found! Node with value ${value} is at position ${i}`,
          highlightNodeId: node.id
        });
        found = true;
        break;
      }
    }
    if (!found) {
      steps.push({
        type: "search",
        description: `Value ${value} not found in the list`
      });
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    if (found) {
      setConsoleOutput((prev) => [...prev, `Search: ${value} → found in list`]);
    } else {
      setConsoleOutput((prev) => [...prev, `Search: ${value} → not found`]);
    }
  }, [getNodeList]);
  const traverseList = useCallback(() => {
    const nodeList2 = getNodeList();
    const steps = [];
    nodeList2.forEach((node, index) => {
      steps.push({
        type: "traverse",
        description: `Visiting node at position ${index} (value: ${node.value})`,
        highlightNodeId: node.id,
        currentNodeId: node.id
      });
    });
    steps.push({
      type: "traverse",
      description: "Traversal complete"
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    const values = nodeList2.map((node) => node.value).join(" → ");
    setConsoleOutput((prev) => [...prev, `Traverse: ${values}`]);
  }, [getNodeList]);
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    if (insertPosition === "position") {
      insertNode(value, "position", insertIndex);
    } else {
      insertNode(value, insertPosition);
    }
    setInputValue("");
  };
  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    deleteNode(value);
    setInputValue("");
  };
  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    searchNode(value);
  };
  const handleTraverse = () => {
    resetAnimation();
    traverseList();
  };
  const clearList = () => {
    resetAnimation();
    setNodes({});
    setHead(null);
    setConsoleOutput((prev) => [...prev, "List cleared"]);
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  const createSampleList = () => {
    resetAnimation();
    const sampleValues = [10, 20, 30, 40];
    const sampleNodes = {};
    let currentHead = null;
    sampleValues.forEach((value, index) => {
      const id = generateId();
      const node = {
        id,
        value,
        next: null
      };
      if (index === 0) {
        currentHead = id;
      } else {
        const prevId = Object.keys(sampleNodes)[index - 1];
        sampleNodes[prevId].next = id;
      }
      sampleNodes[id] = node;
    });
    setNodes(sampleNodes);
    setHead(currentHead);
    setConsoleOutput((prev) => [...prev, `Sample list created with values: ${sampleValues.join(", ")}`]);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const nodeList = getNodeList();
  const currentStep = animationSteps[currentStepIndex];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "Linked List Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Insert Node"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  placeholder: "Enter value",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs("label", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "radio",
                      name: "insertPosition",
                      value: "head",
                      checked: insertPosition === "head",
                      onChange: (e) => setInsertPosition(e.target.value)
                    }), "At Head"]
                  }), /* @__PURE__ */ jsxs("label", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "radio",
                      name: "insertPosition",
                      value: "tail",
                      checked: insertPosition === "tail",
                      onChange: (e) => setInsertPosition(e.target.value)
                    }), "At Tail"]
                  }), /* @__PURE__ */ jsxs("label", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "radio",
                      name: "insertPosition",
                      value: "position",
                      checked: insertPosition === "position",
                      onChange: (e) => setInsertPosition(e.target.value)
                    }), "At Position", insertPosition === "position" && /* @__PURE__ */ jsx("input", {
                      type: "number",
                      value: insertIndex,
                      onChange: (e) => setInsertIndex(parseInt(e.target.value) || 0),
                      min: "0",
                      className: "w-16 px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleInsert,
                  disabled: !inputValue || isPlaying,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [/* @__PURE__ */ jsx(Plus, {
                    size: 16
                  }), "Insert"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Delete Node"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  placeholder: "Enter value to delete",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleDelete,
                  disabled: !inputValue || isPlaying || nodeList.length === 0,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Delete"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Search Node"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: searchValue,
                  onChange: (e) => setSearchValue(e.target.value),
                  placeholder: "Enter value to search",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleSearch,
                  disabled: !searchValue || isPlaying || nodeList.length === 0,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [/* @__PURE__ */ jsx(Search, {
                    size: 16
                  }), "Search"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: handleTraverse,
                  disabled: isPlaying || nodeList.length === 0,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: "Traverse List"
                }), /* @__PURE__ */ jsx("button", {
                  onClick: createSampleList,
                  disabled: isPlaying,
                  className: "w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: "Create Sample List"
                }), /* @__PURE__ */ jsx("button", {
                  onClick: clearList,
                  disabled: isPlaying,
                  className: "w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: "Clear List"
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "lg:col-span-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "mb-6",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl font-semibold text-gray-900 dark:text-white mb-2",
                children: "Linked List Structure"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-gray-600 dark:text-gray-400",
                children: nodeList.length === 0 ? "Empty list - add some nodes to get started!" : `List contains ${nodeList.length} node${nodeList.length === 1 ? "" : "s"}`
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "overflow-x-auto",
              children: /* @__PURE__ */ jsxs("svg", {
                width: Math.max(800, nodeList.length * 180 + 100),
                height: "200",
                className: "border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700",
                children: [/* @__PURE__ */ jsx("defs", {
                  children: /* @__PURE__ */ jsx("marker", {
                    id: "arrowhead",
                    markerWidth: "8",
                    markerHeight: "7",
                    refX: "7",
                    refY: "3.5",
                    orient: "auto",
                    children: /* @__PURE__ */ jsx("polygon", {
                      points: "0 0, 7 3.5, 0 7",
                      className: "fill-indigo-700 dark:fill-indigo-400"
                    })
                  })
                }), /* @__PURE__ */ jsx(AnimatePresence, {
                  children: nodeList.map((node, index) => {
                    const x = 120 + index * 160;
                    const y = 120;
                    const nodeWidth = 100;
                    const nodeHeight = 50;
                    const isHighlighted = highlightedNodeId === node.id;
                    return /* @__PURE__ */ jsxs(motion.g, {
                      initial: {
                        opacity: 0,
                        scale: 0
                      },
                      animate: {
                        opacity: 1,
                        scale: 1
                      },
                      exit: {
                        opacity: 0,
                        scale: 0
                      },
                      transition: {
                        duration: 0.3
                      },
                      children: [/* @__PURE__ */ jsx(motion.rect, {
                        x: x - nodeWidth / 2,
                        y: y - nodeHeight / 2,
                        width: nodeWidth * 0.6,
                        height: nodeHeight,
                        rx: "4",
                        ry: "4",
                        className: `stroke-2 ${isHighlighted ? "fill-yellow-400 stroke-yellow-700 dark:fill-yellow-500 dark:stroke-yellow-600" : "fill-blue-500 stroke-blue-700 dark:fill-blue-600 dark:stroke-blue-700"}`,
                        animate: {
                          scale: isHighlighted ? 1.05 : 1
                        },
                        transition: {
                          duration: 0.2
                        }
                      }), /* @__PURE__ */ jsx(motion.rect, {
                        x: x - nodeWidth / 2 + nodeWidth * 0.6,
                        y: y - nodeHeight / 2,
                        width: nodeWidth * 0.4,
                        height: nodeHeight,
                        rx: "4",
                        ry: "4",
                        className: `stroke-2 ${isHighlighted ? "fill-orange-400 stroke-orange-700 dark:fill-orange-500 dark:stroke-orange-600" : "fill-indigo-500 stroke-indigo-700 dark:fill-indigo-600 dark:stroke-indigo-700"}`,
                        animate: {
                          scale: isHighlighted ? 1.05 : 1
                        },
                        transition: {
                          duration: 0.2
                        }
                      }), /* @__PURE__ */ jsx("line", {
                        x1: x - nodeWidth / 2 + nodeWidth * 0.6,
                        y1: y - nodeHeight / 2,
                        x2: x - nodeWidth / 2 + nodeWidth * 0.6,
                        y2: y + nodeHeight / 2,
                        className: "stroke-gray-600 dark:stroke-gray-400 stroke-2"
                      }), /* @__PURE__ */ jsx("text", {
                        x: x - nodeWidth / 2 + nodeWidth * 0.6 / 2,
                        y: y + 6,
                        textAnchor: "middle",
                        className: "text-lg font-bold fill-white dark:fill-white",
                        children: node.value
                      }), node.next ? (
                        // Arrow symbol for nodes with next pointer
                        /* @__PURE__ */ jsx("text", {
                          x: x - nodeWidth / 2 + nodeWidth * 0.8,
                          y: y + 6,
                          textAnchor: "middle",
                          className: "text-lg font-bold fill-white dark:fill-white",
                          children: "→"
                        })
                      ) : (
                        // NULL text for last node
                        /* @__PURE__ */ jsx("text", {
                          x: x - nodeWidth / 2 + nodeWidth * 0.8,
                          y: y + 6,
                          textAnchor: "middle",
                          className: "text-xs font-bold fill-white dark:fill-white",
                          children: "NULL"
                        })
                      ), /* @__PURE__ */ jsxs("text", {
                        x,
                        y: y + 40,
                        textAnchor: "middle",
                        className: "text-xs font-semibold fill-gray-600 dark:fill-gray-300",
                        children: ["[", index, "]"]
                      }), node.next && index < nodeList.length - 1 && /* @__PURE__ */ jsx(motion.line, {
                        x1: x + nodeWidth / 2,
                        y1: y,
                        x2: x + 160 - nodeWidth / 2,
                        y2: y,
                        className: "stroke-indigo-700 dark:stroke-indigo-400 stroke-3",
                        markerEnd: "url(#arrowhead)",
                        initial: {
                          pathLength: 0
                        },
                        animate: {
                          pathLength: 1
                        },
                        transition: {
                          duration: 0.5,
                          delay: 0.1
                        }
                      })]
                    }, node.id);
                  })
                }), head && nodeList.length > 0 && /* @__PURE__ */ jsxs("g", {
                  children: [/* @__PURE__ */ jsx("line", {
                    x1: "120",
                    y1: "50",
                    x2: "120",
                    y2: "90",
                    className: "stroke-green-600 dark:stroke-green-400 stroke-3",
                    markerEnd: "url(#arrowhead)"
                  }), /* @__PURE__ */ jsx("text", {
                    x: "120",
                    y: "40",
                    textAnchor: "middle",
                    className: "text-lg font-bold fill-green-600 dark:fill-green-400",
                    children: "HEAD"
                  })]
                }), nodeList.length === 0 && /* @__PURE__ */ jsx("text", {
                  x: "400",
                  y: "100",
                  textAnchor: "middle",
                  className: "text-lg fill-gray-400 dark:fill-gray-500",
                  children: "Empty Linked List"
                })]
              })
            }), nodeList.length > 0 && /* @__PURE__ */ jsxs("div", {
              className: "mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg",
              children: [/* @__PURE__ */ jsx("h4", {
                className: "font-semibold text-gray-900 dark:text-white mb-2",
                children: "List Information"
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Length:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: nodeList.length
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Head:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: ((_a = nodeList[0]) == null ? void 0 : _a.value) ?? "NULL"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Tail:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: ((_b = nodeList[nodeList.length - 1]) == null ? void 0 : _b.value) ?? "NULL"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Values:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: nodeList.map((n) => n.value).join(" → ")
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between mb-4",
                children: [/* @__PURE__ */ jsx("h2", {
                  className: "text-xl font-semibold text-gray-900 dark:text-white",
                  children: "Console Output"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearConsole,
                  className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 14
                  }), "Clear"]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
                children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                  className: "text-gray-500",
                  children: "Console output will appear here when you perform operations..."
                }) : /* @__PURE__ */ jsx("div", {
                  className: "space-y-2",
                  children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                    className: "whitespace-pre-wrap",
                    children: [/* @__PURE__ */ jsxs("span", {
                      className: "text-gray-400",
                      children: ["[", index + 1, "]"]
                    }), " ", output]
                  }, index))
                })
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: [/* @__PURE__ */ jsx("strong", {
                    children: "Current Step:"
                  }), " ", currentStep.description]
                })
              })]
            })]
          })
        })]
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: linkedList
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$7 = {
  slow: 1500,
  normal: 800,
  fast: 400
};
const binarySearchTree = UNSAFE_withComponentProps(function BinarySearchTreeVisualization() {
  var _a, _b, _c, _d;
  const [nodes, setNodes] = useState({});
  const [root2, setRoot] = useState(null);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const calculatePositions = useCallback((nodeId, x, y, horizontalSpacing) => {
    if (!nodeId || !nodes[nodeId]) return [];
    const node = nodes[nodeId];
    const positionedNode = {
      ...node,
      x,
      y
    };
    const result = [positionedNode];
    const childSpacing = horizontalSpacing / 2;
    if (node.left) {
      result.push(...calculatePositions(node.left, x - horizontalSpacing, y + 100, childSpacing));
    }
    if (node.right) {
      result.push(...calculatePositions(node.right, x + horizontalSpacing, y + 100, childSpacing));
    }
    return result;
  }, [nodes]);
  const getTreeNodes = useCallback(() => {
    if (!root2) return [];
    return calculatePositions(root2, 400, 120, 150);
  }, [root2, calculatePositions]);
  const playAnimation = useCallback(() => {
    if (currentStepIndex >= animationSteps.length - 1) return;
    setIsPlaying(true);
    intervalRef.current = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightNodeId) {
          setHighlightedNodeId(step.highlightNodeId);
        }
        return nextIndex;
      });
    }, SPEEDS$7[speed]);
  }, [currentStepIndex, animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightNodeId) {
        setHighlightedNodeId(step.highlightNodeId);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      setCurrentStepIndex((prev) => prev - 1);
      setHighlightedNodeId(null);
    }
  }, [currentStepIndex]);
  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentStepIndex(-1);
    setHighlightedNodeId(null);
    setAnimationSteps([]);
  }, [pauseAnimation]);
  const insertNode = useCallback((value) => {
    const newNode = {
      id: generateId(),
      value,
      left: null,
      right: null
    };
    const steps = [];
    if (!root2) {
      setNodes({
        [newNode.id]: newNode
      });
      setRoot(newNode.id);
      steps.push({
        type: "insert",
        description: `Inserted ${value} as root node`,
        newNode,
        highlightNodeId: newNode.id
      });
    } else {
      let currentId = root2;
      let parentId = null;
      let isLeftChild = false;
      const path = [];
      while (currentId) {
        const currentNode = nodes[currentId];
        if (!currentNode) break;
        path.push(currentId);
        steps.push({
          type: "insert",
          description: `Comparing ${value} with ${currentNode.value}`,
          highlightNodeId: currentId,
          path: [...path]
        });
        parentId = currentId;
        if (value < currentNode.value) {
          currentId = currentNode.left;
          isLeftChild = true;
          if (!currentId) {
            steps.push({
              type: "insert",
              description: `${value} < ${currentNode.value}, inserting as left child`,
              highlightNodeId: parentId
            });
          }
        } else if (value > currentNode.value) {
          currentId = currentNode.right;
          isLeftChild = false;
          if (!currentId) {
            steps.push({
              type: "insert",
              description: `${value} > ${currentNode.value}, inserting as right child`,
              highlightNodeId: parentId
            });
          }
        } else {
          steps.push({
            type: "insert",
            description: `Value ${value} already exists in the tree`,
            highlightNodeId: currentId
          });
          setAnimationSteps(steps);
          setCurrentStepIndex(-1);
          return;
        }
      }
      if (parentId) {
        const parentNode = nodes[parentId];
        const updatedParent = {
          ...parentNode,
          [isLeftChild ? "left" : "right"]: newNode.id
        };
        setNodes((prev) => ({
          ...prev,
          [newNode.id]: newNode,
          [parentId]: updatedParent
        }));
        steps.push({
          type: "insert",
          description: `Successfully inserted ${value}`,
          newNode,
          highlightNodeId: newNode.id
        });
      }
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [root2, nodes]);
  const searchNode = useCallback((value) => {
    const steps = [];
    let currentId = root2;
    let found = false;
    while (currentId) {
      const currentNode = nodes[currentId];
      if (!currentNode) break;
      steps.push({
        type: "search",
        description: `Checking node with value ${currentNode.value}`,
        highlightNodeId: currentId
      });
      if (value === currentNode.value) {
        steps.push({
          type: "search",
          description: `Found! Value ${value} exists in the tree`,
          highlightNodeId: currentId
        });
        found = true;
        break;
      } else if (value < currentNode.value) {
        steps.push({
          type: "search",
          description: `${value} < ${currentNode.value}, searching left subtree`,
          highlightNodeId: currentId
        });
        currentId = currentNode.left;
      } else {
        steps.push({
          type: "search",
          description: `${value} > ${currentNode.value}, searching right subtree`,
          highlightNodeId: currentId
        });
        currentId = currentNode.right;
      }
    }
    if (!found) {
      steps.push({
        type: "search",
        description: `Value ${value} not found in the tree`
      });
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    return found;
  }, [root2, nodes]);
  const traverseInOrder = useCallback((steps, visitedValues) => {
    var _a2, _b2;
    if (!root2) return;
    const stack2 = [];
    let currentId = root2;
    steps.push({
      type: "traverse",
      description: `🌳 Starting In-order traversal (Stack-based)`,
      currentStack: [...stack2]
    });
    while (currentId || stack2.length > 0) {
      while (currentId) {
        stack2.push(currentId);
        steps.push({
          type: "traverse",
          description: `📚 Push ${(_a2 = nodes[currentId]) == null ? void 0 : _a2.value} to stack, go left`,
          highlightNodeId: currentId,
          currentStack: [...stack2]
        });
        currentId = ((_b2 = nodes[currentId]) == null ? void 0 : _b2.left) || null;
      }
      if (stack2.length > 0) {
        currentId = stack2.pop();
        const node = nodes[currentId];
        steps.push({
          type: "traverse",
          description: `🔍 Pop ${node.value} from stack - VISIT`,
          highlightNodeId: currentId,
          currentStack: [...stack2]
        });
        console.log(`In-order: ${node.value}`);
        visitedValues.push(node.value);
        currentId = node.right;
        if (currentId) {
          steps.push({
            type: "traverse",
            description: `➡️ Move to right child of ${node.value}`,
            highlightNodeId: currentId,
            currentStack: [...stack2]
          });
        }
      }
    }
  }, [nodes, root2]);
  const traversePreOrder = useCallback((steps, visitedValues) => {
    var _a2, _b2;
    if (!root2) return;
    const stack2 = [root2];
    steps.push({
      type: "traverse",
      description: `🌳 Starting Pre-order traversal (Stack-based)`,
      currentStack: [...stack2]
    });
    while (stack2.length > 0) {
      const currentId = stack2.pop();
      const node = nodes[currentId];
      steps.push({
        type: "traverse",
        description: `🔍 Pop ${node.value} from stack - VISIT`,
        highlightNodeId: currentId,
        currentStack: [...stack2]
      });
      console.log(`Pre-order: ${node.value}`);
      visitedValues.push(node.value);
      if (node.right) {
        stack2.push(node.right);
        steps.push({
          type: "traverse",
          description: `📚 Push right child ${(_a2 = nodes[node.right]) == null ? void 0 : _a2.value} to stack`,
          currentStack: [...stack2]
        });
      }
      if (node.left) {
        stack2.push(node.left);
        steps.push({
          type: "traverse",
          description: `📚 Push left child ${(_b2 = nodes[node.left]) == null ? void 0 : _b2.value} to stack`,
          currentStack: [...stack2]
        });
      }
    }
  }, [nodes, root2]);
  const traversePostOrder = useCallback((steps, visitedValues) => {
    var _a2, _b2;
    if (!root2) return;
    const stack2 = [];
    const visited = /* @__PURE__ */ new Set();
    let currentId = root2;
    steps.push({
      type: "traverse",
      description: `🌳 Starting Post-order traversal (Stack-based)`,
      currentStack: [...stack2]
    });
    while (currentId || stack2.length > 0) {
      if (currentId) {
        stack2.push(currentId);
        steps.push({
          type: "traverse",
          description: `📚 Push ${(_a2 = nodes[currentId]) == null ? void 0 : _a2.value} to stack`,
          highlightNodeId: currentId,
          currentStack: [...stack2]
        });
        currentId = ((_b2 = nodes[currentId]) == null ? void 0 : _b2.left) || null;
      } else {
        const peekId = stack2[stack2.length - 1];
        const peekNode = nodes[peekId];
        if (peekNode.right && !visited.has(peekNode.right)) {
          steps.push({
            type: "traverse",
            description: `➡️ Move to right child of ${peekNode.value}`,
            currentStack: [...stack2]
          });
          currentId = peekNode.right;
        } else {
          const nodeId = stack2.pop();
          const node = nodes[nodeId];
          visited.add(nodeId);
          steps.push({
            type: "traverse",
            description: `🔍 Pop ${node.value} from stack - VISIT`,
            highlightNodeId: nodeId,
            currentStack: [...stack2]
          });
          console.log(`Post-order: ${node.value}`);
          visitedValues.push(node.value);
        }
      }
    }
  }, [nodes, root2]);
  const traverseLevelOrder = useCallback((steps, visitedValues) => {
    var _a2, _b2, _c2;
    if (!root2) return;
    const queue2 = [root2];
    let level = 0;
    steps.push({
      type: "traverse",
      description: `🌳 Starting Level-order traversal (Queue-based)`,
      currentQueue: [...queue2]
    });
    while (queue2.length > 0) {
      const levelSize = queue2.length;
      level++;
      steps.push({
        type: "traverse",
        description: `📊 Processing level ${level} (${levelSize} nodes)`,
        currentQueue: [...queue2]
      });
      for (let i = 0; i < levelSize; i++) {
        steps.push({
          type: "traverse",
          description: `🔍 Dequeue from FRONT: ${(_a2 = nodes[queue2[0]]) == null ? void 0 : _a2.value}`,
          currentQueue: [...queue2],
          highlightNodeId: queue2[0]
        });
        const nodeId = queue2.shift();
        const node = nodes[nodeId];
        if (node) {
          console.log(`Level-order: ${node.value}`);
          visitedValues.push(node.value);
          if (node.left) {
            queue2.push(node.left);
            steps.push({
              type: "traverse",
              description: `➕ Enqueue left child ${(_b2 = nodes[node.left]) == null ? void 0 : _b2.value} to REAR`,
              currentQueue: [...queue2]
            });
          }
          if (node.right) {
            queue2.push(node.right);
            steps.push({
              type: "traverse",
              description: `➕ Enqueue right child ${(_c2 = nodes[node.right]) == null ? void 0 : _c2.value} to REAR`,
              currentQueue: [...queue2]
            });
          }
        }
      }
    }
  }, [root2, nodes]);
  const handleTraversal = useCallback((type) => {
    resetAnimation();
    const steps = [];
    const visitedValues = [];
    switch (type) {
      case "inorder":
        console.log("--- Starting In-order Traversal ---");
        traverseInOrder(steps, visitedValues);
        console.log("--- In-order Traversal Complete ---");
        setConsoleOutput((prev) => [...prev, `In-order Traversal: ${visitedValues.join(" → ")}`]);
        steps.push({
          type: "traverse",
          description: "✅ In-order traversal complete",
          currentStack: []
        });
        break;
      case "preorder":
        console.log("--- Starting Pre-order Traversal ---");
        traversePreOrder(steps, visitedValues);
        console.log("--- Pre-order Traversal Complete ---");
        setConsoleOutput((prev) => [...prev, `Pre-order Traversal: ${visitedValues.join(" → ")}`]);
        steps.push({
          type: "traverse",
          description: "✅ Pre-order traversal complete",
          currentStack: []
        });
        break;
      case "postorder":
        console.log("--- Starting Post-order Traversal ---");
        traversePostOrder(steps, visitedValues);
        console.log("--- Post-order Traversal Complete ---");
        setConsoleOutput((prev) => [...prev, `Post-order Traversal: ${visitedValues.join(" → ")}`]);
        steps.push({
          type: "traverse",
          description: "✅ Post-order traversal complete",
          currentStack: []
        });
        break;
      case "levelorder":
        console.log("--- Starting Level-order Traversal ---");
        traverseLevelOrder(steps, visitedValues);
        console.log("--- Level-order Traversal Complete ---");
        setConsoleOutput((prev) => [...prev, `Level-order Traversal: ${visitedValues.join(" → ")}`]);
        steps.push({
          type: "traverse",
          description: "✅ Level-order traversal complete",
          currentQueue: []
        });
        break;
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [traverseInOrder, traversePreOrder, traversePostOrder, traverseLevelOrder, resetAnimation]);
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    insertNode(value);
    setConsoleOutput((prev) => [...prev, `Inserted node with value: ${value}`]);
    setInputValue("");
  };
  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    const found = searchNode(value);
    setConsoleOutput((prev) => [...prev, `Searched for value ${value}: ${found ? "Found" : "Not found"}`]);
  };
  const clearTree = () => {
    resetAnimation();
    setNodes({});
    setRoot(null);
    setConsoleOutput((prev) => [...prev, "Tree cleared"]);
  };
  const createSampleTree = () => {
    resetAnimation();
    const sampleValues = [25, 15, 35, 10, 20, 30, 40];
    const sampleNodes = {};
    let currentRoot = null;
    sampleValues.forEach((value, index) => {
      const id = generateId();
      const node = {
        id,
        value,
        left: null,
        right: null
      };
      if (index === 0) {
        currentRoot = id;
      } else {
        let currentId = currentRoot;
        while (currentId) {
          const currentNode = sampleNodes[currentId];
          if (value < currentNode.value) {
            if (!currentNode.left) {
              currentNode.left = id;
              break;
            }
            currentId = currentNode.left;
          } else {
            if (!currentNode.right) {
              currentNode.right = id;
              break;
            }
            currentId = currentNode.right;
          }
        }
      }
      sampleNodes[id] = node;
    });
    setNodes(sampleNodes);
    setRoot(currentRoot);
    setConsoleOutput((prev) => [...prev, `Sample tree created with values: ${sampleValues.join(", ")}`]);
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const treeNodes = getTreeNodes();
  const currentStep = animationSteps[currentStepIndex];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "Binary Search Tree Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Insert Node"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  placeholder: "Enter value",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleInsert,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                  children: [/* @__PURE__ */ jsx(Plus, {
                    size: 16
                  }), "Insert"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Search Node"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: searchValue,
                  onChange: (e) => setSearchValue(e.target.value),
                  placeholder: "Enter value to search",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleSearch,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700",
                  children: [/* @__PURE__ */ jsx(Search, {
                    size: 16
                  }), "Search"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Tree Traversals"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: () => handleTraversal("inorder"),
                  disabled: !root2 || isPlaying,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400",
                  children: "In-order"
                }), /* @__PURE__ */ jsx("button", {
                  onClick: () => handleTraversal("preorder"),
                  disabled: !root2 || isPlaying,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400",
                  children: "Pre-order"
                }), /* @__PURE__ */ jsx("button", {
                  onClick: () => handleTraversal("postorder"),
                  disabled: !root2 || isPlaying,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400",
                  children: "Post-order"
                }), /* @__PURE__ */ jsx("button", {
                  onClick: () => handleTraversal("levelorder"),
                  disabled: !root2 || isPlaying,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400",
                  children: "Level-order"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleTree,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample Tree"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearTree,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear Tree"]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "Tree Visualization"
            }), /* @__PURE__ */ jsx(AnimatePresence, {
              children: currentStep && (currentStep.currentStack || currentStep.currentQueue) && /* @__PURE__ */ jsxs(motion.div, {
                initial: {
                  opacity: 0,
                  y: -20
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                exit: {
                  opacity: 0,
                  y: -20
                },
                className: "mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800",
                children: [currentStep.currentStack && /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsxs("h4", {
                    className: "text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "w-3 h-3 bg-indigo-600 rounded-full"
                    }), "Stack Visualization (DFS Traversal)"]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex items-end gap-2",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "text-sm font-semibold text-indigo-700 dark:text-indigo-300 mr-2",
                      children: "TOP →"
                    }), /* @__PURE__ */ jsx("div", {
                      className: "flex flex-col-reverse gap-1",
                      children: /* @__PURE__ */ jsx(AnimatePresence, {
                        children: currentStep.currentStack.map((nodeId, index) => {
                          var _a2;
                          return /* @__PURE__ */ jsx(motion.div, {
                            initial: {
                              opacity: 0,
                              scale: 0,
                              x: -20
                            },
                            animate: {
                              opacity: 1,
                              scale: 1,
                              x: 0
                            },
                            exit: {
                              opacity: 0,
                              scale: 0,
                              x: 20
                            },
                            transition: {
                              duration: 0.3,
                              delay: index * 0.1
                            },
                            className: "bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-center min-w-[60px] border-2 border-indigo-700",
                            children: (_a2 = nodes[nodeId]) == null ? void 0 : _a2.value
                          }, `${nodeId}-${index}`);
                        })
                      })
                    }), currentStep.currentStack.length === 0 && /* @__PURE__ */ jsx("div", {
                      className: "text-indigo-500 dark:text-indigo-400 italic text-sm",
                      children: "Empty Stack"
                    })]
                  })]
                }), currentStep.currentQueue && /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsxs("h4", {
                    className: "text-lg font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "w-3 h-3 bg-purple-600 rounded-full"
                    }), "Queue Visualization (BFS Traversal)"]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "text-sm font-semibold text-purple-700 dark:text-purple-300",
                      children: "FRONT"
                    }), /* @__PURE__ */ jsx("div", {
                      className: "flex gap-1",
                      children: /* @__PURE__ */ jsx(AnimatePresence, {
                        children: currentStep.currentQueue.map((nodeId, index) => {
                          var _a2;
                          return /* @__PURE__ */ jsx(motion.div, {
                            initial: {
                              opacity: 0,
                              scale: 0,
                              y: -20
                            },
                            animate: {
                              opacity: 1,
                              scale: 1,
                              y: 0
                            },
                            exit: {
                              opacity: 0,
                              scale: 0,
                              y: 20
                            },
                            transition: {
                              duration: 0.3,
                              delay: index * 0.1
                            },
                            className: "bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-center min-w-[60px] border-2 border-purple-700",
                            children: (_a2 = nodes[nodeId]) == null ? void 0 : _a2.value
                          }, `${nodeId}-${index}`);
                        })
                      })
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-sm font-semibold text-purple-700 dark:text-purple-300",
                      children: "REAR"
                    }), currentStep.currentQueue.length === 0 && /* @__PURE__ */ jsx("div", {
                      className: "text-purple-500 dark:text-purple-400 italic text-sm ml-2",
                      children: "Empty Queue"
                    })]
                  })]
                })]
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "overflow-auto",
              children: /* @__PURE__ */ jsxs("svg", {
                width: "800",
                height: "500",
                className: "border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900",
                children: [/* @__PURE__ */ jsx("defs", {
                  children: /* @__PURE__ */ jsx("marker", {
                    id: "arrowhead",
                    markerWidth: "8",
                    markerHeight: "7",
                    refX: "7",
                    refY: "3.5",
                    orient: "auto",
                    children: /* @__PURE__ */ jsx("polygon", {
                      points: "0 0, 7 3.5, 0 7",
                      className: "fill-indigo-700 dark:fill-indigo-400"
                    })
                  })
                }), /* @__PURE__ */ jsx(AnimatePresence, {
                  children: treeNodes.map((node) => {
                    var _a2, _b2, _c2, _d2;
                    const isHighlighted = highlightedNodeId === node.id;
                    const nodeWidth = 80;
                    const nodeHeight = 60;
                    return /* @__PURE__ */ jsxs(motion.g, {
                      initial: {
                        opacity: 0,
                        scale: 0
                      },
                      animate: {
                        opacity: 1,
                        scale: 1
                      },
                      exit: {
                        opacity: 0,
                        scale: 0
                      },
                      transition: {
                        duration: 0.3
                      },
                      children: [node.left && nodes[node.left] && /* @__PURE__ */ jsx(motion.line, {
                        x1: node.x,
                        y1: node.y + nodeHeight / 2,
                        x2: (_a2 = treeNodes.find((n) => n.id === node.left)) == null ? void 0 : _a2.x,
                        y2: ((_b2 = treeNodes.find((n) => n.id === node.left)) == null ? void 0 : _b2.y) - nodeHeight / 2,
                        className: "stroke-indigo-700 dark:stroke-indigo-400 stroke-2",
                        markerEnd: "url(#arrowhead)",
                        initial: {
                          pathLength: 0
                        },
                        animate: {
                          pathLength: 1
                        },
                        transition: {
                          duration: 0.5,
                          delay: 0.1
                        }
                      }), node.right && nodes[node.right] && /* @__PURE__ */ jsx(motion.line, {
                        x1: node.x,
                        y1: node.y + nodeHeight / 2,
                        x2: (_c2 = treeNodes.find((n) => n.id === node.right)) == null ? void 0 : _c2.x,
                        y2: ((_d2 = treeNodes.find((n) => n.id === node.right)) == null ? void 0 : _d2.y) - nodeHeight / 2,
                        className: "stroke-indigo-700 dark:stroke-indigo-400 stroke-2",
                        markerEnd: "url(#arrowhead)",
                        initial: {
                          pathLength: 0
                        },
                        animate: {
                          pathLength: 1
                        },
                        transition: {
                          duration: 0.5,
                          delay: 0.1
                        }
                      }), /* @__PURE__ */ jsx(motion.rect, {
                        x: node.x - nodeWidth / 2,
                        y: node.y - nodeHeight / 2,
                        width: nodeWidth,
                        height: nodeHeight * 0.6,
                        rx: "4",
                        ry: "4",
                        className: `stroke-2 ${isHighlighted ? "fill-yellow-400 stroke-yellow-700 dark:fill-yellow-500 dark:stroke-yellow-600" : "fill-blue-500 stroke-blue-700 dark:fill-blue-600 dark:stroke-blue-700"}`,
                        animate: {
                          scale: isHighlighted ? 1.05 : 1
                        },
                        transition: {
                          duration: 0.2
                        }
                      }), /* @__PURE__ */ jsx(motion.rect, {
                        x: node.x - nodeWidth / 2,
                        y: node.y - nodeHeight / 2 + nodeHeight * 0.6,
                        width: nodeWidth,
                        height: nodeHeight * 0.4,
                        rx: "4",
                        ry: "4",
                        className: `stroke-2 ${isHighlighted ? "fill-orange-400 stroke-orange-700 dark:fill-orange-500 dark:stroke-orange-600" : "fill-indigo-500 stroke-indigo-700 dark:fill-indigo-600 dark:stroke-indigo-700"}`,
                        animate: {
                          scale: isHighlighted ? 1.05 : 1
                        },
                        transition: {
                          duration: 0.2
                        }
                      }), /* @__PURE__ */ jsx("line", {
                        x1: node.x - nodeWidth / 2,
                        y1: node.y - nodeHeight / 2 + nodeHeight * 0.6,
                        x2: node.x + nodeWidth / 2,
                        y2: node.y - nodeHeight / 2 + nodeHeight * 0.6,
                        className: "stroke-gray-600 dark:stroke-gray-400 stroke-2"
                      }), /* @__PURE__ */ jsx("line", {
                        x1: node.x,
                        y1: node.y - nodeHeight / 2 + nodeHeight * 0.6,
                        x2: node.x,
                        y2: node.y + nodeHeight / 2,
                        className: "stroke-gray-600 dark:stroke-gray-400 stroke-2"
                      }), /* @__PURE__ */ jsx("text", {
                        x: node.x,
                        y: node.y - nodeHeight / 2 + nodeHeight * 0.6 / 2 + 6,
                        textAnchor: "middle",
                        className: "text-lg font-bold fill-white dark:fill-white",
                        children: node.value
                      }), /* @__PURE__ */ jsx("text", {
                        x: node.x - nodeWidth / 4,
                        y: node.y - nodeHeight / 2 + nodeHeight * 0.6 + nodeHeight * 0.4 / 2 + 4,
                        textAnchor: "middle",
                        className: "text-xs font-bold fill-white dark:fill-white",
                        children: node.left ? "L" : "N"
                      }), /* @__PURE__ */ jsx("text", {
                        x: node.x + nodeWidth / 4,
                        y: node.y - nodeHeight / 2 + nodeHeight * 0.6 + nodeHeight * 0.4 / 2 + 4,
                        textAnchor: "middle",
                        className: "text-xs font-bold fill-white dark:fill-white",
                        children: node.right ? "R" : "N"
                      })]
                    }, node.id);
                  })
                }), root2 && treeNodes.length > 0 && /* @__PURE__ */ jsxs("g", {
                  children: [/* @__PURE__ */ jsx("line", {
                    x1: (_a = treeNodes[0]) == null ? void 0 : _a.x,
                    y1: "40",
                    x2: (_b = treeNodes[0]) == null ? void 0 : _b.x,
                    y2: "90",
                    className: "stroke-green-600 dark:stroke-green-400 stroke-3",
                    markerEnd: "url(#arrowhead)"
                  }), /* @__PURE__ */ jsx("text", {
                    x: (_c = treeNodes[0]) == null ? void 0 : _c.x,
                    y: "30",
                    textAnchor: "middle",
                    className: "text-lg font-bold fill-green-600 dark:fill-green-400",
                    children: "ROOT"
                  })]
                }), treeNodes.length === 0 && /* @__PURE__ */ jsx("text", {
                  x: "400",
                  y: "250",
                  textAnchor: "middle",
                  className: "text-lg fill-gray-400 dark:fill-gray-500",
                  children: "Empty Binary Search Tree"
                })]
              })
            }), treeNodes.length > 0 && /* @__PURE__ */ jsxs("div", {
              className: "mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg",
              children: [/* @__PURE__ */ jsx("h4", {
                className: "font-semibold text-gray-900 dark:text-white mb-2",
                children: "Tree Information"
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-2 md:grid-cols-3 gap-4 text-sm",
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Nodes:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: treeNodes.length
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Root:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: root2 ? (_d = nodes[root2]) == null ? void 0 : _d.value : "NULL"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-gray-600 dark:text-gray-400",
                    children: "Height:"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "ml-2 font-semibold text-gray-900 dark:text-white",
                    children: Math.ceil(Math.log2(treeNodes.length + 1))
                  })]
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold text-gray-900 dark:text-white",
                children: "Console Output"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: clearConsole,
                className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                children: [/* @__PURE__ */ jsx(Trash2, {
                  size: 14
                }), "Clear"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
              children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                className: "text-gray-500",
                children: "Console output will appear here when you perform operations..."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                  className: "whitespace-pre-wrap",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "text-gray-400",
                    children: ["[", index + 1, "]"]
                  }), " ", output]
                }, index))
              })
            }), currentStep && /* @__PURE__ */ jsx("div", {
              className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-blue-800 dark:text-blue-200",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Current Step:"
                }), " ", currentStep.description]
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: binarySearchTree
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$6 = {
  slow: 1500,
  normal: 1e3,
  fast: 500
};
const stack = UNSAFE_withComponentProps(function StackVisualization() {
  const [stack2, setStack] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedIndex(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightIndex !== void 0) {
          setHighlightedIndex(step.highlightIndex);
        } else {
          setHighlightedIndex(null);
        }
        return nextIndex;
      });
    }, SPEEDS$6[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightIndex !== void 0) {
        setHighlightedIndex(step.highlightIndex);
      } else {
        setHighlightedIndex(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightIndex !== void 0) {
          setHighlightedIndex(step.highlightIndex);
        } else {
          setHighlightedIndex(null);
        }
      } else {
        setHighlightedIndex(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const pushToStack = useCallback((value) => {
    const steps = [];
    const newItem = {
      id: generateId(),
      value,
      index: stack2.length
    };
    steps.push({
      type: "push",
      description: `Pushing ${value} onto the stack`,
      newItem
    });
    steps.push({
      type: "push",
      description: `${value} added to top of stack (index ${stack2.length})`,
      highlightIndex: stack2.length
    });
    steps.push({
      type: "push",
      description: `Stack size is now ${stack2.length + 1}`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setStack((prev) => [...prev, newItem]);
  }, [stack2]);
  const popFromStack = useCallback(() => {
    if (stack2.length === 0) {
      alert("Stack is empty!");
      return;
    }
    const steps = [];
    const topItem = stack2[stack2.length - 1];
    steps.push({
      type: "pop",
      description: `Popping from top of stack`,
      highlightIndex: stack2.length - 1
    });
    steps.push({
      type: "pop",
      description: `Removed ${topItem.value} from stack`,
      removedItem: topItem
    });
    steps.push({
      type: "pop",
      description: `Stack size is now ${stack2.length - 1}`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setStack((prev) => prev.slice(0, -1));
  }, [stack2]);
  const peekStack = useCallback(() => {
    if (stack2.length === 0) {
      alert("Stack is empty!");
      return;
    }
    const steps = [];
    const topItem = stack2[stack2.length - 1];
    steps.push({
      type: "peek",
      description: `Peeking at top of stack`,
      highlightIndex: stack2.length - 1
    });
    steps.push({
      type: "peek",
      description: `Top element is ${topItem.value}`,
      highlightIndex: stack2.length - 1
    });
    steps.push({
      type: "peek",
      description: `Stack remains unchanged`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [stack2]);
  const clearStack = useCallback(() => {
    const steps = [];
    steps.push({
      type: "clear",
      description: `Clearing all elements from stack`
    });
    steps.push({
      type: "clear",
      description: `Stack is now empty`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setStack([]);
  }, []);
  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    pushToStack(value);
    setInputValue("");
  };
  const handlePop = () => {
    resetAnimation();
    popFromStack();
  };
  const handlePeek = () => {
    resetAnimation();
    peekStack();
  };
  const handleClear = () => {
    resetAnimation();
    clearStack();
  };
  const createSampleStack = () => {
    resetAnimation();
    const sampleValues = [10, 20, 30, 40, 50];
    const sampleStack = sampleValues.map((value, index) => ({
      id: generateId(),
      value,
      index
    }));
    setStack(sampleStack);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "Stack Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Stack Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "number",
                    value: inputValue,
                    onChange: (e) => setInputValue(e.target.value),
                    placeholder: "Enter value",
                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handlePush,
                    className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                    children: [/* @__PURE__ */ jsx(Plus, {
                      size: 16
                    }), "Push"]
                  })]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handlePop,
                  disabled: stack2.length === 0,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400",
                  children: [/* @__PURE__ */ jsx(Minus, {
                    size: 16
                  }), "Pop"]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handlePeek,
                  disabled: stack2.length === 0,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400",
                  children: [/* @__PURE__ */ jsx(Eye, {
                    size: 16
                  }), "Peek"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleStack,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample Stack"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleClear,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear Stack"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Stack Info"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Size: ", stack2.length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Top: ", stack2.length > 0 ? stack2[stack2.length - 1].value : "Empty"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Is Empty: ", stack2.length === 0 ? "Yes" : "No"]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "lg:col-span-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "Stack Visualization"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex justify-center",
              children: /* @__PURE__ */ jsxs("div", {
                className: "relative",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "w-32 border-l-4 border-r-4 border-b-4 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 min-h-[400px] relative",
                  children: [/* @__PURE__ */ jsx(AnimatePresence, {
                    children: stack2.map((item, index) => {
                      const isHighlighted = highlightedIndex === index;
                      const yPosition = 400 - (index + 1) * 60 - 10;
                      return /* @__PURE__ */ jsx(motion.div, {
                        initial: {
                          opacity: 0,
                          y: 50,
                          scale: 0.8
                        },
                        animate: {
                          opacity: 1,
                          y: yPosition,
                          scale: isHighlighted ? 1.05 : 1
                        },
                        exit: {
                          opacity: 0,
                          y: -50,
                          scale: 0.8
                        },
                        transition: {
                          duration: 0.3
                        },
                        className: `absolute left-2 right-2 h-12 rounded-md flex items-center justify-center font-bold text-white ${isHighlighted ? "bg-yellow-500 shadow-lg" : "bg-blue-500"}`,
                        children: item.value
                      }, item.id);
                    })
                  }), stack2.length > 0 && /* @__PURE__ */ jsx("div", {
                    className: "absolute -right-16 text-sm text-gray-600 dark:text-gray-300 font-semibold",
                    style: {
                      top: 400 - stack2.length * 60 + 10
                    },
                    children: "← TOP"
                  }), stack2.length === 0 && /* @__PURE__ */ jsx("div", {
                    className: "absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400",
                    children: "Empty Stack"
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "text-center mt-2 text-sm text-gray-600 dark:text-gray-300 font-semibold",
                  children: "STACK BASE"
                })]
              })
            })]
          })
        })]
      })
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: stack
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$5 = {
  slow: 1500,
  normal: 1e3,
  fast: 500
};
const queue = UNSAFE_withComponentProps(function QueueVisualization() {
  const [queue2, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedIndex(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightIndex !== void 0) {
          setHighlightedIndex(step.highlightIndex);
        } else {
          setHighlightedIndex(null);
        }
        return nextIndex;
      });
    }, SPEEDS$5[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightIndex !== void 0) {
        setHighlightedIndex(step.highlightIndex);
      } else {
        setHighlightedIndex(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightIndex !== void 0) {
          setHighlightedIndex(step.highlightIndex);
        } else {
          setHighlightedIndex(null);
        }
      } else {
        setHighlightedIndex(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const enqueueToQueue = useCallback((value) => {
    const steps = [];
    const newItem = {
      id: generateId(),
      value,
      index: queue2.length
    };
    steps.push({
      type: "enqueue",
      description: `Enqueuing ${value} to the rear of queue`,
      newItem
    });
    steps.push({
      type: "enqueue",
      description: `${value} added to rear of queue (index ${queue2.length})`,
      highlightIndex: queue2.length
    });
    steps.push({
      type: "enqueue",
      description: `Queue size is now ${queue2.length + 1}`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setQueue((prev) => [...prev, newItem]);
    setConsoleOutput((prev) => [...prev, `Enqueue: ${value} → added to rear of queue`]);
  }, [queue2]);
  const dequeueFromQueue = useCallback(() => {
    if (queue2.length === 0) {
      alert("Queue is empty!");
      return;
    }
    const steps = [];
    const frontItem = queue2[0];
    steps.push({
      type: "dequeue",
      description: `Dequeuing from front of queue`,
      highlightIndex: 0
    });
    steps.push({
      type: "dequeue",
      description: `Removed ${frontItem.value} from queue`,
      removedItem: frontItem
    });
    steps.push({
      type: "dequeue",
      description: `Queue size is now ${queue2.length - 1}`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setQueue((prev) => prev.slice(1).map((item, index) => ({
      ...item,
      index
    })));
    setConsoleOutput((prev) => [...prev, `Dequeue: ${frontItem.value} → removed from front of queue`]);
  }, [queue2]);
  const frontQueue = useCallback(() => {
    if (queue2.length === 0) {
      alert("Queue is empty!");
      return;
    }
    const steps = [];
    const frontItem = queue2[0];
    steps.push({
      type: "front",
      description: `Getting front element of queue`,
      highlightIndex: 0
    });
    steps.push({
      type: "front",
      description: `Front element is ${frontItem.value}`,
      highlightIndex: 0
    });
    steps.push({
      type: "front",
      description: `Queue remains unchanged`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setConsoleOutput((prev) => [...prev, `Front: ${frontItem.value} → front element of queue`]);
  }, [queue2]);
  const rearQueue = useCallback(() => {
    if (queue2.length === 0) {
      alert("Queue is empty!");
      return;
    }
    const steps = [];
    const rearItem = queue2[queue2.length - 1];
    steps.push({
      type: "rear",
      description: `Getting rear element of queue`,
      highlightIndex: queue2.length - 1
    });
    steps.push({
      type: "rear",
      description: `Rear element is ${rearItem.value}`,
      highlightIndex: queue2.length - 1
    });
    steps.push({
      type: "rear",
      description: `Queue remains unchanged`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setConsoleOutput((prev) => [...prev, `Rear: ${rearItem.value} → rear element of queue`]);
  }, [queue2]);
  const clearQueue = useCallback(() => {
    const steps = [];
    steps.push({
      type: "clear",
      description: `Clearing all elements from queue`
    });
    steps.push({
      type: "clear",
      description: `Queue is now empty`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setQueue([]);
    setConsoleOutput((prev) => [...prev, "Queue cleared"]);
  }, []);
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    enqueueToQueue(value);
    setInputValue("");
  };
  const handleDequeue = () => {
    resetAnimation();
    dequeueFromQueue();
  };
  const handleFront = () => {
    resetAnimation();
    frontQueue();
  };
  const handleRear = () => {
    resetAnimation();
    rearQueue();
  };
  const handleClear = () => {
    resetAnimation();
    clearQueue();
  };
  const createSampleQueue = () => {
    resetAnimation();
    const sampleValues = [10, 20, 30, 40, 50];
    const sampleQueue = sampleValues.map((value, index) => ({
      id: generateId(),
      value,
      index
    }));
    setQueue(sampleQueue);
    setConsoleOutput((prev) => [...prev, `Sample queue created with values: ${sampleValues.join(", ")}`]);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "Queue Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Queue Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "number",
                    value: inputValue,
                    onChange: (e) => setInputValue(e.target.value),
                    placeholder: "Enter value",
                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handleEnqueue,
                    className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                    children: [/* @__PURE__ */ jsx(Plus, {
                      size: 16
                    }), "Enqueue"]
                  })]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleDequeue,
                  disabled: queue2.length === 0,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400",
                  children: [/* @__PURE__ */ jsx(Minus, {
                    size: 16
                  }), "Dequeue"]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-2",
                  children: [/* @__PURE__ */ jsxs("button", {
                    onClick: handleFront,
                    disabled: queue2.length === 0,
                    className: "flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 text-sm",
                    children: [/* @__PURE__ */ jsx(Eye, {
                      size: 14
                    }), "Front"]
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handleRear,
                    disabled: queue2.length === 0,
                    className: "flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 text-sm",
                    children: [/* @__PURE__ */ jsx(Eye, {
                      size: 14
                    }), "Rear"]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleQueue,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample Queue"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleClear,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear Queue"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Queue Info"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Size: ", queue2.length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Front: ", queue2.length > 0 ? queue2[0].value : "Empty"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Rear: ", queue2.length > 0 ? queue2[queue2.length - 1].value : "Empty"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Is Empty: ", queue2.length === 0 ? "Yes" : "No"]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "lg:col-span-3",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "Queue Visualization"
            }), /* @__PURE__ */ jsx("div", {
              className: "flex justify-center items-center",
              children: /* @__PURE__ */ jsxs("div", {
                className: "relative",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "text-center mb-2 text-sm text-gray-600 dark:text-gray-300 font-semibold",
                  children: "FRONT"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 min-w-[600px] p-4 border-2 border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(AnimatePresence, {
                    children: queue2.map((item, index) => {
                      const isHighlighted = highlightedIndex === index;
                      return /* @__PURE__ */ jsx(motion.div, {
                        initial: {
                          opacity: 0,
                          x: -50,
                          scale: 0.8
                        },
                        animate: {
                          opacity: 1,
                          x: 0,
                          scale: isHighlighted ? 1.05 : 1
                        },
                        exit: {
                          opacity: 0,
                          x: 50,
                          scale: 0.8
                        },
                        transition: {
                          duration: 0.3
                        },
                        className: `w-16 h-16 rounded-md flex items-center justify-center font-bold text-white ${isHighlighted ? "bg-yellow-500 shadow-lg" : "bg-blue-500"}`,
                        children: item.value
                      }, item.id);
                    })
                  }), queue2.length === 0 && /* @__PURE__ */ jsx("div", {
                    className: "flex-1 text-center text-gray-500 dark:text-gray-400 py-8",
                    children: "Empty Queue"
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "text-center mt-2 text-sm text-gray-600 dark:text-gray-300 font-semibold",
                  children: "REAR"
                }), queue2.length > 0 && /* @__PURE__ */ jsx("div", {
                  className: "flex gap-2 mt-4 pl-4",
                  children: queue2.map((_, index) => /* @__PURE__ */ jsxs("div", {
                    className: "w-16 text-center text-xs text-gray-500 dark:text-gray-400",
                    children: ["[", index, "]"]
                  }, index))
                })]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between mb-4",
                children: [/* @__PURE__ */ jsx("h2", {
                  className: "text-xl font-semibold text-gray-900 dark:text-white",
                  children: "Console Output"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearConsole,
                  className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 14
                  }), "Clear"]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
                children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                  className: "text-gray-500",
                  children: "Console output will appear here when you perform operations..."
                }) : /* @__PURE__ */ jsx("div", {
                  className: "space-y-2",
                  children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                    className: "whitespace-pre-wrap",
                    children: [/* @__PURE__ */ jsxs("span", {
                      className: "text-gray-400",
                      children: ["[", index + 1, "]"]
                    }), " ", output]
                  }, index))
                })
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: [/* @__PURE__ */ jsx("strong", {
                    children: "Current Step:"
                  }), " ", currentStep.description]
                })
              })]
            })]
          })
        })]
      })
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: queue
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$4 = {
  slow: 2e3,
  normal: 1500,
  fast: 800
};
const graph = UNSAFE_withComponentProps(function GraphVisualization() {
  const [nodes, setNodes] = useState({});
  const [edges, setEdges] = useState({});
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isDirected, setIsDirected] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [nodeValue, setNodeValue] = useState("");
  const [nodeLabel, setNodeLabel] = useState("");
  const [startNodeId, setStartNodeId] = useState("");
  const [endNodeId, setEndNodeId] = useState("");
  const [fromNodeId, setFromNodeId] = useState("");
  const [toNodeId, setToNodeId] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [highlightedEdgeId, setHighlightedEdgeId] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(/* @__PURE__ */ new Set());
  const intervalRef = useRef(null);
  const svgRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedNodeId(null);
    setHighlightedEdgeId(null);
    setVisitedNodes(/* @__PURE__ */ new Set());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightNodeId) {
          setHighlightedNodeId(step.highlightNodeId);
        }
        if (step.highlightEdgeId) {
          setHighlightedEdgeId(step.highlightEdgeId);
        }
        if (step.visitedNodes) {
          setVisitedNodes(new Set(step.visitedNodes));
        }
        return nextIndex;
      });
    }, SPEEDS$4[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightNodeId) {
        setHighlightedNodeId(step.highlightNodeId);
      }
      if (step.highlightEdgeId) {
        setHighlightedEdgeId(step.highlightEdgeId);
      }
      if (step.visitedNodes) {
        setVisitedNodes(new Set(step.visitedNodes));
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightNodeId) {
          setHighlightedNodeId(step.highlightNodeId);
        }
        if (step.highlightEdgeId) {
          setHighlightedEdgeId(step.highlightEdgeId);
        }
        if (step.visitedNodes) {
          setVisitedNodes(new Set(step.visitedNodes));
        }
      } else {
        setHighlightedNodeId(null);
        setHighlightedEdgeId(null);
        setVisitedNodes(/* @__PURE__ */ new Set());
      }
    }
  }, [currentStepIndex, animationSteps]);
  const breadthFirstSearch = useCallback((startId) => {
    var _a, _b, _c, _d, _e;
    const steps = [];
    const visited = /* @__PURE__ */ new Set();
    const queue2 = [startId];
    steps.push({
      type: "bfs",
      description: `Starting BFS from node ${(_a = nodes[startId]) == null ? void 0 : _a.value}`,
      highlightNodeId: startId,
      currentQueue: [...queue2]
    });
    while (queue2.length > 0) {
      steps.push({
        type: "bfs",
        description: `🔍 Dequeue from FRONT: ${(_b = nodes[queue2[0]]) == null ? void 0 : _b.value}`,
        currentQueue: [...queue2],
        highlightNodeId: queue2[0]
      });
      const currentId = queue2.shift();
      if (visited.has(currentId)) {
        steps.push({
          type: "bfs",
          description: `⚠️ Node ${(_c = nodes[currentId]) == null ? void 0 : _c.value} already visited, skipping`,
          currentQueue: [...queue2]
        });
        continue;
      }
      visited.add(currentId);
      steps.push({
        type: "bfs",
        description: `✅ Mark ${(_d = nodes[currentId]) == null ? void 0 : _d.value} as visited`,
        highlightNodeId: currentId,
        visitedNodes: Array.from(visited),
        currentQueue: [...queue2]
      });
      const neighbors = Object.values(edges).filter((edge) => edge.from === currentId || !isDirected && edge.to === currentId).map((edge) => edge.from === currentId ? edge.to : edge.from).filter((neighborId) => !visited.has(neighborId));
      if (neighbors.length > 0) {
        const newNeighbors = [];
        neighbors.forEach((neighborId) => {
          if (!queue2.includes(neighborId)) {
            queue2.push(neighborId);
            newNeighbors.push(neighborId);
          }
        });
        if (newNeighbors.length > 0) {
          steps.push({
            type: "bfs",
            description: `➕ Enqueue to REAR: ${newNeighbors.map((id) => {
              var _a2;
              return (_a2 = nodes[id]) == null ? void 0 : _a2.value;
            }).join(", ")}`,
            currentQueue: [...queue2]
          });
        }
      } else {
        steps.push({
          type: "bfs",
          description: `🚫 No unvisited neighbors for ${(_e = nodes[currentId]) == null ? void 0 : _e.value}`,
          currentQueue: [...queue2]
        });
      }
    }
    steps.push({
      type: "bfs",
      description: "BFS traversal complete",
      visitedNodes: Array.from(visited),
      output: `BFS Complete: Visited ${visited.size} nodes`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    const visitedValues = Array.from(visited).map((id) => nodes[id].value).join(" → ");
    setConsoleOutput((prev) => [...prev, `BFS Traversal: ${visitedValues}`]);
  }, [nodes, edges, isDirected]);
  const depthFirstSearch = useCallback((startId) => {
    var _a, _b, _c, _d, _e;
    const steps = [];
    const visited = /* @__PURE__ */ new Set();
    const stack2 = [startId];
    steps.push({
      type: "dfs",
      description: `Starting DFS from node ${(_a = nodes[startId]) == null ? void 0 : _a.value}`,
      highlightNodeId: startId,
      currentStack: [...stack2]
    });
    while (stack2.length > 0) {
      steps.push({
        type: "dfs",
        description: `🔍 Pop from TOP: ${(_b = nodes[stack2[stack2.length - 1]]) == null ? void 0 : _b.value}`,
        currentStack: [...stack2],
        highlightNodeId: stack2[stack2.length - 1]
      });
      const currentId = stack2.pop();
      if (visited.has(currentId)) {
        steps.push({
          type: "dfs",
          description: `⚠️ Node ${(_c = nodes[currentId]) == null ? void 0 : _c.value} already visited, skipping`,
          currentStack: [...stack2]
        });
        continue;
      }
      visited.add(currentId);
      steps.push({
        type: "dfs",
        description: `✅ Mark ${(_d = nodes[currentId]) == null ? void 0 : _d.value} as visited`,
        highlightNodeId: currentId,
        visitedNodes: Array.from(visited),
        currentStack: [...stack2]
      });
      const neighbors = Object.values(edges).filter((edge) => edge.from === currentId || !isDirected && edge.to === currentId).map((edge) => edge.from === currentId ? edge.to : edge.from).filter((neighborId) => !visited.has(neighborId)).reverse();
      if (neighbors.length > 0) {
        const newNeighbors = [];
        neighbors.forEach((neighborId) => {
          if (!stack2.includes(neighborId)) {
            stack2.push(neighborId);
            newNeighbors.push(neighborId);
          }
        });
        if (newNeighbors.length > 0) {
          steps.push({
            type: "dfs",
            description: `📚 Push to TOP: ${newNeighbors.map((id) => {
              var _a2;
              return (_a2 = nodes[id]) == null ? void 0 : _a2.value;
            }).join(", ")}`,
            currentStack: [...stack2]
          });
        }
      } else {
        steps.push({
          type: "dfs",
          description: `🚫 No unvisited neighbors for ${(_e = nodes[currentId]) == null ? void 0 : _e.value}`,
          currentStack: [...stack2]
        });
      }
    }
    steps.push({
      type: "dfs",
      description: "DFS traversal complete",
      visitedNodes: Array.from(visited),
      output: `DFS Complete: Visited ${visited.size} nodes`
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    const visitedValues = Array.from(visited).map((id) => nodes[id].value).join(" → ");
    setConsoleOutput((prev) => [...prev, `DFS Traversal: ${visitedValues}`]);
  }, [nodes, edges, isDirected]);
  const dijkstraAlgorithm = useCallback((startId) => {
    var _a, _b;
    const steps = [];
    const distances = {};
    const unvisited = new Set(Object.keys(nodes));
    Object.keys(nodes).forEach((nodeId) => {
      distances[nodeId] = nodeId === startId ? 0 : Infinity;
    });
    steps.push({
      type: "dijkstra",
      description: `Starting Dijkstra's algorithm from node ${(_a = nodes[startId]) == null ? void 0 : _a.value}`,
      highlightNodeId: startId,
      distances: {
        ...distances
      }
    });
    while (unvisited.size > 0) {
      let currentId = "";
      let minDistance = Infinity;
      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentId = nodeId;
        }
      }
      if (minDistance === Infinity) break;
      unvisited.delete(currentId);
      steps.push({
        type: "dijkstra",
        description: `Processing node ${(_b = nodes[currentId]) == null ? void 0 : _b.value} with distance ${distances[currentId]}`,
        highlightNodeId: currentId,
        distances: {
          ...distances
        }
      });
      const neighborEdges = Object.values(edges).filter((edge) => edge.from === currentId || !isDirected && edge.to === currentId);
      neighborEdges.forEach((edge) => {
        var _a2;
        const neighborId = edge.from === currentId ? edge.to : edge.from;
        if (unvisited.has(neighborId)) {
          const newDistance = distances[currentId] + edge.weight;
          if (newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance;
            steps.push({
              type: "dijkstra",
              description: `Updated distance to node ${(_a2 = nodes[neighborId]) == null ? void 0 : _a2.value}: ${newDistance}`,
              highlightNodeId: neighborId,
              highlightEdgeId: edge.id,
              distances: {
                ...distances
              }
            });
          }
        }
      });
    }
    steps.push({
      type: "dijkstra",
      description: "Dijkstra's algorithm complete",
      distances: {
        ...distances
      },
      output: "Dijkstra's algorithm complete - shortest paths computed"
    });
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    let output = `Dijkstra's Results from node ${nodes[startId].value}:
`;
    Object.keys(distances).forEach((nodeId) => {
      if (nodeId !== startId && distances[nodeId] !== Infinity) {
        output += `To node ${nodes[nodeId].value}: distance = ${distances[nodeId]}
`;
      }
    });
    setConsoleOutput((prev) => [...prev, output]);
  }, [nodes, edges, isDirected]);
  const primMST = useCallback(() => {
    if (Object.keys(nodes).length === 0) return;
    const steps = [];
    const nodeIds = Object.keys(nodes);
    const visited = /* @__PURE__ */ new Set();
    const mstEdges = [];
    let totalWeight = 0;
    const startId = nodeIds[0];
    visited.add(startId);
    steps.push({
      type: "prim",
      description: `Starting Prim's MST from node ${nodes[startId].value}`,
      highlightNodeId: startId,
      visitedNodes: [startId],
      output: `Prim's MST Algorithm Started from node ${nodes[startId].value}`
    });
    while (visited.size < nodeIds.length) {
      let minWeight = Infinity;
      let selectedEdge = null;
      for (const edge of Object.values(edges)) {
        const fromVisited = visited.has(edge.from);
        const toVisited = visited.has(edge.to);
        if (fromVisited && !toVisited || !fromVisited && toVisited) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            selectedEdge = edge;
          }
        }
      }
      if (!selectedEdge) break;
      const newNodeId = visited.has(selectedEdge.from) ? selectedEdge.to : selectedEdge.from;
      visited.add(newNodeId);
      mstEdges.push(selectedEdge.id);
      totalWeight += selectedEdge.weight;
      steps.push({
        type: "prim",
        description: `Added edge (${nodes[selectedEdge.from].value}, ${nodes[selectedEdge.to].value}) with weight ${selectedEdge.weight}`,
        highlightNodeId: newNodeId,
        highlightEdgeId: selectedEdge.id,
        visitedNodes: Array.from(visited),
        mstEdges: [...mstEdges],
        output: `Added edge: ${nodes[selectedEdge.from].value} - ${nodes[selectedEdge.to].value} (weight: ${selectedEdge.weight})`
      });
    }
    steps.push({
      type: "prim",
      description: `Prim's MST complete. Total weight: ${totalWeight}`,
      visitedNodes: Array.from(visited),
      mstEdges: [...mstEdges],
      output: `MST Complete! Total weight: ${totalWeight}, Edges: ${mstEdges.length}`
    });
    setAnimationSteps(steps);
    setConsoleOutput((prev) => [...prev, `Prim's MST: Total weight = ${totalWeight}`]);
  }, [nodes, edges]);
  const boruvkaMST = useCallback(() => {
    var _a, _b;
    if (Object.keys(nodes).length === 0) return;
    const steps = [];
    const nodeIds = Object.keys(nodes);
    const mstEdges = [];
    let totalWeight = 0;
    const components = /* @__PURE__ */ new Map();
    nodeIds.forEach((id) => {
      components.set(id, /* @__PURE__ */ new Set([id]));
    });
    steps.push({
      type: "boruvka",
      description: `Starting Borůvka's MST algorithm with ${nodeIds.length} components`,
      output: `Borůvka's Algorithm: Each node starts as separate component`
    });
    while (components.size > 1) {
      const cheapestEdges = /* @__PURE__ */ new Map();
      for (const [compId, compNodes] of components) {
        let cheapest = null;
        for (const edge of Object.values(edges)) {
          const fromComp = (_a = [...components.entries()].find(([_, nodes2]) => nodes2.has(edge.from))) == null ? void 0 : _a[0];
          const toComp = (_b = [...components.entries()].find(([_, nodes2]) => nodes2.has(edge.to))) == null ? void 0 : _b[0];
          if (fromComp !== toComp && (compNodes.has(edge.from) || compNodes.has(edge.to))) {
            if (!cheapest || edge.weight < cheapest.weight) {
              cheapest = edge;
            }
          }
        }
        if (cheapest) {
          cheapestEdges.set(compId, cheapest);
        }
      }
      const addedEdges = /* @__PURE__ */ new Set();
      for (const edge of cheapestEdges.values()) {
        if (!addedEdges.has(edge.id) && !mstEdges.includes(edge.id)) {
          mstEdges.push(edge.id);
          addedEdges.add(edge.id);
          totalWeight += edge.weight;
          const fromComp = [...components.entries()].find(([_, nodes2]) => nodes2.has(edge.from));
          const toComp = [...components.entries()].find(([_, nodes2]) => nodes2.has(edge.to));
          if (fromComp && toComp && fromComp[0] !== toComp[0]) {
            const mergedNodes = /* @__PURE__ */ new Set([...fromComp[1], ...toComp[1]]);
            components.delete(fromComp[0]);
            components.delete(toComp[0]);
            components.set(edge.id, mergedNodes);
          }
          steps.push({
            type: "boruvka",
            description: `Added edge (${nodes[edge.from].value}, ${nodes[edge.to].value}) with weight ${edge.weight}`,
            highlightEdgeId: edge.id,
            mstEdges: [...mstEdges],
            output: `Added edge: ${nodes[edge.from].value} - ${nodes[edge.to].value} (weight: ${edge.weight})`
          });
        }
      }
      if (addedEdges.size === 0) break;
    }
    steps.push({
      type: "boruvka",
      description: `Borůvka's MST complete. Total weight: ${totalWeight}`,
      mstEdges: [...mstEdges],
      output: `MST Complete! Total weight: ${totalWeight}, Edges: ${mstEdges.length}`
    });
    setAnimationSteps(steps);
    setConsoleOutput((prev) => [...prev, `Borůvka's MST: Total weight = ${totalWeight}`]);
  }, [nodes, edges]);
  const floydWarshall = useCallback(() => {
    const nodeIds = Object.keys(nodes);
    if (nodeIds.length === 0) return;
    const steps = [];
    const n = nodeIds.length;
    const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    nodeIds.forEach((id, i) => {
      dist[i][i] = 0;
    });
    Object.values(edges).forEach((edge) => {
      const fromIndex = nodeIds.indexOf(edge.from);
      const toIndex = nodeIds.indexOf(edge.to);
      if (fromIndex !== -1 && toIndex !== -1) {
        dist[fromIndex][toIndex] = edge.weight;
        if (!isDirected) {
          dist[toIndex][fromIndex] = edge.weight;
        }
      }
    });
    steps.push({
      type: "floyd-warshall",
      description: "Floyd-Warshall: Initial distance matrix created",
      distanceMatrix: dist.map((row) => [...row]),
      output: "Floyd-Warshall Algorithm: Computing all-pairs shortest paths"
    });
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            steps.push({
              type: "floyd-warshall",
              description: `Updated distance from ${nodes[nodeIds[i]].value} to ${nodes[nodeIds[j]].value} via ${nodes[nodeIds[k]].value}: ${dist[i][j]}`,
              highlightNodeId: nodeIds[k],
              distanceMatrix: dist.map((row) => [...row]),
              output: `Path ${nodes[nodeIds[i]].value} → ${nodes[nodeIds[j]].value} via ${nodes[nodeIds[k]].value}: distance = ${dist[i][j]}`
            });
          }
        }
      }
    }
    steps.push({
      type: "floyd-warshall",
      description: "Floyd-Warshall algorithm complete",
      distanceMatrix: dist.map((row) => [...row]),
      output: "All-pairs shortest paths computed successfully"
    });
    setAnimationSteps(steps);
    let output = "Floyd-Warshall Results:\n";
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && dist[i][j] !== Infinity) {
          output += `${nodes[nodeIds[i]].value} → ${nodes[nodeIds[j]].value}: ${dist[i][j]}
`;
        }
      }
    }
    setConsoleOutput((prev) => [...prev, output]);
  }, [nodes, edges, isDirected]);
  const handleSvgClick = (event) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const value = nodeValue.trim();
    if (!value) {
      alert("Please enter a node name/value");
      return;
    }
    const newNode = {
      id: generateId(),
      value,
      label: nodeLabel.trim() || void 0,
      x,
      y
    };
    setNodes((prev) => ({
      ...prev,
      [newNode.id]: newNode
    }));
    setNodeValue("");
    setNodeLabel("");
  };
  const addNodeAtPosition = () => {
    const value = nodeValue.trim();
    if (!value) {
      alert("Please enter a node name/value");
      return;
    }
    const newNode = {
      id: generateId(),
      value,
      label: nodeLabel.trim() || void 0,
      x: Math.random() * 600 + 100,
      y: Math.random() * 300 + 100
    };
    setNodes((prev) => ({
      ...prev,
      [newNode.id]: newNode
    }));
    setNodeValue("");
    setNodeLabel("");
  };
  const handleNodeClick = (nodeId) => {
  };
  const addEdgeByNodeIds = () => {
    const weight = parseInt(edgeWeight);
    if (!fromNodeId || !toNodeId || isNaN(weight)) {
      alert("Please select both nodes and enter a valid edge weight");
      return;
    }
    if (fromNodeId === toNodeId) {
      alert("Cannot create edge from a node to itself");
      return;
    }
    const existingEdge = Object.values(edges).find((edge) => edge.from === fromNodeId && edge.to === toNodeId || !isDirected && edge.from === toNodeId && edge.to === fromNodeId);
    if (existingEdge) {
      alert("Edge already exists between these nodes");
      return;
    }
    const newEdge = {
      id: generateId(),
      from: fromNodeId,
      to: toNodeId,
      weight,
      directed: isDirected
    };
    setEdges((prev) => ({
      ...prev,
      [newEdge.id]: newEdge
    }));
    setFromNodeId("");
    setToNodeId("");
  };
  const removeNode = (nodeId) => {
    setNodes((prev) => {
      const newNodes = {
        ...prev
      };
      delete newNodes[nodeId];
      return newNodes;
    });
    setEdges((prev) => {
      const newEdges = {
        ...prev
      };
      Object.keys(newEdges).forEach((edgeId) => {
        if (newEdges[edgeId].from === nodeId || newEdges[edgeId].to === nodeId) {
          delete newEdges[edgeId];
        }
      });
      return newEdges;
    });
    if (fromNodeId === nodeId) setFromNodeId("");
    if (toNodeId === nodeId) setToNodeId("");
  };
  const clearGraph = () => {
    resetAnimation();
    setNodes({});
    setEdges({});
    setFromNodeId("");
    setToNodeId("");
  };
  const createSampleGraph = () => {
    resetAnimation();
    const sampleNodes = {
      "n1": {
        id: "n1",
        value: "A",
        x: 150,
        y: 100
      },
      "n2": {
        id: "n2",
        value: "B",
        x: 300,
        y: 100
      },
      "n3": {
        id: "n3",
        value: "C",
        x: 450,
        y: 100
      },
      "n4": {
        id: "n4",
        value: "D",
        x: 150,
        y: 250
      },
      "n5": {
        id: "n5",
        value: "E",
        x: 300,
        y: 250
      },
      "n6": {
        id: "n6",
        value: "F",
        x: 450,
        y: 250
      }
    };
    const sampleEdges = {
      "e1": {
        id: "e1",
        from: "n1",
        to: "n2",
        weight: 4,
        directed: isDirected
      },
      "e2": {
        id: "e2",
        from: "n1",
        to: "n4",
        weight: 2,
        directed: isDirected
      },
      "e3": {
        id: "e3",
        from: "n2",
        to: "n3",
        weight: 3,
        directed: isDirected
      },
      "e4": {
        id: "e4",
        from: "n2",
        to: "n5",
        weight: 1,
        directed: isDirected
      },
      "e5": {
        id: "e5",
        from: "n3",
        to: "n6",
        weight: 5,
        directed: isDirected
      },
      "e6": {
        id: "e6",
        from: "n4",
        to: "n5",
        weight: 7,
        directed: isDirected
      },
      "e7": {
        id: "e7",
        from: "n5",
        to: "n6",
        weight: 2,
        directed: isDirected
      }
    };
    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setFromNodeId("");
    setToNodeId("");
  };
  const handleBFS = () => {
    if (!startNodeId) {
      alert("Please select a start node");
      return;
    }
    resetAnimation();
    breadthFirstSearch(startNodeId);
  };
  const handleDFS = () => {
    if (!startNodeId) {
      alert("Please select a start node");
      return;
    }
    resetAnimation();
    depthFirstSearch(startNodeId);
  };
  const handleDijkstra = () => {
    if (!startNodeId) {
      alert("Please select a start node");
      return;
    }
    resetAnimation();
    dijkstraAlgorithm(startNodeId);
  };
  const handlePrim = () => {
    resetAnimation();
    primMST();
  };
  const handleBoruvka = () => {
    resetAnimation();
    boruvkaMST();
  };
  const handleFloydWarshall = () => {
    resetAnimation();
    floydWarshall();
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  const nodeList = Object.values(nodes);
  const edgeList = Object.values(edges);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "Graph Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Build Graph"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("div", {
                  children: /* @__PURE__ */ jsxs("label", {
                    className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300",
                    children: [/* @__PURE__ */ jsx("input", {
                      type: "checkbox",
                      checked: isDirected,
                      onChange: (e) => setIsDirected(e.target.checked),
                      className: "rounded"
                    }), "Directed Graph"]
                  })
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "text",
                    value: nodeValue,
                    onChange: (e) => setNodeValue(e.target.value),
                    placeholder: "Node name/value (required)",
                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  }), /* @__PURE__ */ jsx("input", {
                    type: "text",
                    value: nodeLabel,
                    onChange: (e) => setNodeLabel(e.target.value),
                    placeholder: "Node label (optional)",
                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  }), /* @__PURE__ */ jsx("div", {
                    className: "flex gap-2",
                    children: /* @__PURE__ */ jsxs("button", {
                      onClick: addNodeAtPosition,
                      disabled: !nodeValue,
                      className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm",
                      children: [/* @__PURE__ */ jsx(Plus, {
                        size: 14
                      }), "Add Node"]
                    })
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-xs text-gray-500 dark:text-gray-400",
                    children: '• Click "Add Node" or click on canvas to add node • Use words, letters, or numbers for node names • Multiple nodes can have the same name • Use labels to distinguish similar nodes'
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "number",
                    value: edgeWeight,
                    onChange: (e) => setEdgeWeight(e.target.value),
                    placeholder: "Edge weight",
                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "border-t border-gray-200 dark:border-gray-600 pt-2 mt-2",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-xs text-gray-500 dark:text-gray-400 mb-2",
                      children: "Or add edge by selecting nodes:"
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "grid grid-cols-2 gap-2",
                      children: [/* @__PURE__ */ jsxs("select", {
                        value: fromNodeId,
                        onChange: (e) => setFromNodeId(e.target.value),
                        className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm",
                        children: [/* @__PURE__ */ jsx("option", {
                          value: "",
                          children: "From Node"
                        }), nodeList.map((node) => /* @__PURE__ */ jsxs("option", {
                          value: node.id,
                          children: [node.value, " ", node.label ? `(${node.label})` : ""]
                        }, node.id))]
                      }), /* @__PURE__ */ jsxs("select", {
                        value: toNodeId,
                        onChange: (e) => setToNodeId(e.target.value),
                        className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm",
                        children: [/* @__PURE__ */ jsx("option", {
                          value: "",
                          children: "To Node"
                        }), nodeList.map((node) => /* @__PURE__ */ jsxs("option", {
                          value: node.id,
                          children: [node.value, " ", node.label ? `(${node.label})` : ""]
                        }, node.id))]
                      })]
                    }), /* @__PURE__ */ jsxs("button", {
                      onClick: addEdgeByNodeIds,
                      disabled: !fromNodeId || !toNodeId || !edgeWeight,
                      className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 text-sm mt-2",
                      children: [/* @__PURE__ */ jsx(Plus, {
                        size: 14
                      }), "Add Edge by Selection"]
                    })]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Graph Algorithms"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsxs("select", {
                  value: startNodeId,
                  onChange: (e) => setStartNodeId(e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "",
                    children: "Select start node"
                  }), nodeList.map((node) => /* @__PURE__ */ jsx("option", {
                    value: node.id,
                    children: node.value
                  }, node.id))]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs("button", {
                    onClick: handleBFS,
                    disabled: !startNodeId || isPlaying,
                    className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 text-sm",
                    children: [/* @__PURE__ */ jsx(Search, {
                      size: 14
                    }), "BFS"]
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handleDFS,
                    disabled: !startNodeId || isPlaying,
                    className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 text-sm",
                    children: [/* @__PURE__ */ jsx(Search, {
                      size: 14
                    }), "DFS"]
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handleDijkstra,
                    disabled: !startNodeId || isPlaying,
                    className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 text-sm",
                    children: [/* @__PURE__ */ jsx(Search, {
                      size: 14
                    }), "Dijkstra's"]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "border-t border-gray-200 dark:border-gray-600 pt-2 mt-2",
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-xs text-gray-500 dark:text-gray-400 mb-2",
                      children: "Minimum Spanning Tree:"
                    }), /* @__PURE__ */ jsxs("button", {
                      onClick: handlePrim,
                      disabled: isPlaying || Object.keys(nodes).length === 0,
                      className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 text-sm mb-2",
                      children: [/* @__PURE__ */ jsx(Search, {
                        size: 14
                      }), "Prim's MST"]
                    }), /* @__PURE__ */ jsxs("button", {
                      onClick: handleBoruvka,
                      disabled: isPlaying || Object.keys(nodes).length === 0,
                      className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 text-sm mb-2",
                      children: [/* @__PURE__ */ jsx(Search, {
                        size: 14
                      }), "Borůvka's MST"]
                    }), /* @__PURE__ */ jsxs("button", {
                      onClick: handleFloydWarshall,
                      disabled: isPlaying || Object.keys(nodes).length === 0,
                      className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-400 text-sm",
                      children: [/* @__PURE__ */ jsx(Search, {
                        size: 14
                      }), "Floyd-Warshall"]
                    })]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleGraph,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm",
                  children: "Create Sample Graph"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearGraph,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 14
                  }), "Clear Graph"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Graph Info"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Nodes: ", nodeList.length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Edges: ", edgeList.length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Type: ", isDirected ? "Directed" : "Undirected"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Unique Names: ", new Set(nodeList.map((n) => n.value)).size]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-3",
          children: [((currentStep == null ? void 0 : currentStep.currentStack) || (currentStep == null ? void 0 : currentStep.currentQueue)) && /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsxs("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white",
                children: [(currentStep == null ? void 0 : currentStep.currentStack) ? "Stack (DFS)" : "Queue (BFS)", " Operations"]
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-sm text-gray-600 dark:text-gray-400",
                children: ["Step ", currentStepIndex + 1, "/", animationSteps.length]
              })]
            }), (currentStep == null ? void 0 : currentStep.currentStack) && /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col items-center",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-sm text-gray-600 dark:text-gray-400 mb-2",
                children: "Stack (LIFO - Last In, First Out)"
              }), /* @__PURE__ */ jsx("div", {
                className: "border-2 border-indigo-300 dark:border-indigo-600 rounded-lg p-3 min-h-[100px] min-w-[200px] flex flex-col-reverse items-center justify-start gap-1",
                children: currentStep.currentStack.length === 0 ? /* @__PURE__ */ jsx("div", {
                  className: "text-gray-400 dark:text-gray-500 text-sm",
                  children: "Empty Stack"
                }) : currentStep.currentStack.map((nodeId, index) => {
                  var _a, _b, _c;
                  return /* @__PURE__ */ jsxs(motion.div, {
                    initial: {
                      opacity: 0,
                      y: -10,
                      scale: 0.8
                    },
                    animate: {
                      opacity: 1,
                      y: 0,
                      scale: 1
                    },
                    exit: {
                      opacity: 0,
                      y: 10,
                      scale: 0.8
                    },
                    transition: {
                      duration: 0.3,
                      delay: index * 0.1
                    },
                    className: `px-3 py-2 rounded-md font-semibold text-white min-w-[60px] text-center ${index === (((_a = currentStep.currentStack) == null ? void 0 : _a.length) ?? 0) - 1 ? "bg-indigo-600 border-2 border-indigo-400" : "bg-indigo-500"}`,
                    children: [((_b = nodes[nodeId]) == null ? void 0 : _b.value) || nodeId, index === (((_c = currentStep.currentStack) == null ? void 0 : _c.length) ?? 0) - 1 && /* @__PURE__ */ jsx("div", {
                      className: "text-xs text-indigo-200",
                      children: "← TOP"
                    })]
                  }, `${nodeId}-${index}`);
                })
              })]
            }), (currentStep == null ? void 0 : currentStep.currentQueue) && /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col items-center",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-sm text-gray-600 dark:text-gray-400 mb-2",
                children: "Queue (FIFO - First In, First Out)"
              }), /* @__PURE__ */ jsx("div", {
                className: "border-2 border-purple-300 dark:border-purple-600 rounded-lg p-3 min-h-[80px] min-w-[200px] flex items-center justify-center gap-1",
                children: currentStep.currentQueue.length === 0 ? /* @__PURE__ */ jsx("div", {
                  className: "text-gray-400 dark:text-gray-500 text-sm",
                  children: "Empty Queue"
                }) : /* @__PURE__ */ jsxs(Fragment, {
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "text-xs text-purple-600 dark:text-purple-400 mr-2",
                    children: "FRONT →"
                  }), currentStep.currentQueue.map((nodeId, index) => {
                    var _a;
                    return /* @__PURE__ */ jsx(motion.div, {
                      initial: {
                        opacity: 0,
                        x: -20,
                        scale: 0.8
                      },
                      animate: {
                        opacity: 1,
                        x: 0,
                        scale: 1
                      },
                      exit: {
                        opacity: 0,
                        x: 20,
                        scale: 0.8
                      },
                      transition: {
                        duration: 0.3,
                        delay: index * 0.1
                      },
                      className: `px-3 py-2 rounded-md font-semibold text-white min-w-[60px] text-center ${index === 0 ? "bg-purple-600 border-2 border-purple-400" : "bg-purple-500"}`,
                      children: ((_a = nodes[nodeId]) == null ? void 0 : _a.value) || nodeId
                    }, `${nodeId}-${index}`);
                  }), /* @__PURE__ */ jsx("div", {
                    className: "text-xs text-purple-600 dark:text-purple-400 ml-2",
                    children: "→ REAR"
                  })]
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "Graph Visualization"
            }), /* @__PURE__ */ jsx("div", {
              className: "border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden",
              children: /* @__PURE__ */ jsxs("svg", {
                ref: svgRef,
                width: "800",
                height: "500",
                className: "bg-gray-50 dark:bg-gray-900 cursor-crosshair",
                onClick: handleSvgClick,
                children: [/* @__PURE__ */ jsx("defs", {
                  children: /* @__PURE__ */ jsx("marker", {
                    id: "arrowhead",
                    markerWidth: "10",
                    markerHeight: "7",
                    refX: "9",
                    refY: "3.5",
                    orient: "auto",
                    children: /* @__PURE__ */ jsx("polygon", {
                      points: "0 0, 10 3.5, 0 7",
                      className: "fill-gray-600 dark:fill-gray-400"
                    })
                  })
                }), edgeList.map((edge) => {
                  var _a;
                  const fromNode = nodes[edge.from];
                  const toNode = nodes[edge.to];
                  if (!fromNode || !toNode) return null;
                  const isHighlighted = highlightedEdgeId === edge.id;
                  const isMSTEdge = (_a = currentStep == null ? void 0 : currentStep.mstEdges) == null ? void 0 : _a.includes(edge.id);
                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;
                  const dx = toNode.x - fromNode.x;
                  const dy = toNode.y - fromNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const offsetDistance = 12;
                  const offsetX = length > 0 ? -dy / length * offsetDistance : 0;
                  const offsetY = length > 0 ? dx / length * offsetDistance : 0;
                  const labelX = midX + offsetX;
                  const labelY = midY + offsetY;
                  return /* @__PURE__ */ jsxs("g", {
                    children: [/* @__PURE__ */ jsx("line", {
                      x1: fromNode.x,
                      y1: fromNode.y,
                      x2: toNode.x,
                      y2: toNode.y,
                      className: `stroke-2 ${isHighlighted ? "stroke-yellow-500" : isMSTEdge ? "stroke-green-500" : "stroke-gray-600 dark:stroke-gray-400"}`,
                      markerEnd: isDirected ? "url(#arrowhead)" : void 0
                    }), /* @__PURE__ */ jsx("rect", {
                      x: labelX - 8,
                      y: labelY - 8,
                      width: "16",
                      height: "16",
                      rx: "2",
                      ry: "2",
                      className: `${isMSTEdge ? "fill-green-100 dark:fill-green-900 stroke-green-300 dark:stroke-green-600" : "fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"} stroke-1`
                    }), /* @__PURE__ */ jsx("text", {
                      x: labelX,
                      y: labelY + 3,
                      textAnchor: "middle",
                      className: `text-xs font-bold ${isMSTEdge ? "fill-green-800 dark:fill-green-200" : "fill-gray-800 dark:fill-gray-200"}`,
                      children: edge.weight
                    })]
                  }, edge.id);
                }), /* @__PURE__ */ jsx(AnimatePresence, {
                  children: nodeList.map((node) => {
                    const isHighlighted = highlightedNodeId === node.id;
                    const isVisited = visitedNodes.has(node.id);
                    return /* @__PURE__ */ jsxs(motion.g, {
                      initial: {
                        opacity: 0,
                        scale: 0
                      },
                      animate: {
                        opacity: 1,
                        scale: 1
                      },
                      exit: {
                        opacity: 0,
                        scale: 0
                      },
                      transition: {
                        duration: 0.3
                      },
                      children: [/* @__PURE__ */ jsx("circle", {
                        cx: node.x,
                        cy: node.y,
                        r: "20",
                        className: `cursor-pointer stroke-2 ${isHighlighted ? "fill-yellow-400 stroke-yellow-600" : isVisited ? "fill-green-400 stroke-green-600" : "fill-blue-500 stroke-blue-700 hover:fill-blue-400"}`,
                        onClick: (e) => {
                          e.stopPropagation();
                          handleNodeClick(node.id);
                        },
                        onDoubleClick: (e) => {
                          e.stopPropagation();
                          removeNode(node.id);
                        }
                      }), /* @__PURE__ */ jsx("text", {
                        x: node.x,
                        y: node.y + 4,
                        textAnchor: "middle",
                        className: "text-sm font-bold fill-white pointer-events-none",
                        children: node.value
                      }), node.label && /* @__PURE__ */ jsx("text", {
                        x: node.x,
                        y: node.y + 35,
                        textAnchor: "middle",
                        className: "text-xs fill-gray-600 dark:fill-gray-400 pointer-events-none",
                        children: node.label
                      })]
                    }, node.id);
                  })
                }), nodeList.length === 0 && /* @__PURE__ */ jsx("text", {
                  x: "400",
                  y: "250",
                  textAnchor: "middle",
                  className: "text-lg fill-gray-500 dark:fill-gray-400",
                  children: "Enter a node name and click to add nodes"
                })]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-4 text-sm text-gray-600 dark:text-gray-300",
              children: [/* @__PURE__ */ jsx("p", {
                children: "• Click canvas to add nodes • Double-click nodes to remove"
              }), /* @__PURE__ */ jsx("p", {
                children: "• Use dropdown menus to create edges between any nodes"
              }), /* @__PURE__ */ jsx("p", {
                children: "• Nodes can have duplicate names - use labels to distinguish them"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold text-gray-900 dark:text-white",
                children: "Console Output"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: clearConsole,
                className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                children: [/* @__PURE__ */ jsx(Trash2, {
                  size: 14
                }), "Clear"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
              children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                className: "text-gray-500",
                children: "Console output will appear here when you run algorithms..."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                  className: "whitespace-pre-wrap",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "text-gray-400",
                    children: ["[", index + 1, "]"]
                  }), " ", output]
                }, index))
              })
            }), currentStep && currentStep.output && /* @__PURE__ */ jsx("div", {
              className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-blue-800 dark:text-blue-200",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Current Step:"
                }), " ", currentStep.output]
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: graph
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$3 = {
  slow: 1500,
  normal: 1e3,
  fast: 500
};
const trie = UNSAFE_withComponentProps(function TrieVisualization() {
  const [nodes, setNodes] = useState({});
  const [root2, setRoot] = useState(null);
  const [inputWord, setInputWord] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [svgDimensions, setSvgDimensions] = useState({
    width: 800,
    height: 600
  });
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  useEffect(() => {
    if (!root2) {
      const rootId = generateId();
      const rootNode = {
        id: rootId,
        char: "ROOT",
        isEndOfWord: false,
        children: {},
        x: 400,
        // Will be recalculated by calculatePositions
        y: 60,
        // Will be recalculated by calculatePositions
        level: 0
      };
      setNodes({
        [rootId]: rootNode
      });
      setRoot(rootId);
    }
  }, [root2]);
  const calculatePositions = useCallback((nodeMap) => {
    if (!root2 || !nodeMap[root2]) return nodeMap;
    const updatedNodes = {
      ...nodeMap
    };
    const nodesByLevel = {};
    Object.values(updatedNodes).forEach((node) => {
      const level = node.level || 0;
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(node.id);
    });
    const maxNodesInAnyLevel = Object.values(nodesByLevel).reduce((max, nodes2) => Math.max(max, nodes2.length), 0);
    const minWidthRequired = maxNodesInAnyLevel * 60 + 200;
    const svgWidth = Math.max(800, minWidthRequired);
    const baseHeight = 600;
    const nodeRadius = 20;
    const padding = 40;
    const levelHeight = 100;
    const levelCounts = Object.values(nodesByLevel).map((nodes2) => nodes2.length);
    levelCounts.length > 0 ? Math.max(...levelCounts) : 0;
    const levels = Object.keys(nodesByLevel).map((level) => parseInt(level));
    const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;
    const dynamicHeight = Math.max(baseHeight, padding * 2 + (maxLevel + 1) * levelHeight + nodeRadius * 2);
    Object.entries(nodesByLevel).forEach(([levelStr, nodeIds]) => {
      const level = parseInt(levelStr);
      const y = padding + nodeRadius + level * levelHeight;
      const leftBound2 = padding + nodeRadius;
      const rightBound2 = svgWidth - padding - nodeRadius;
      const safeWidth = rightBound2 - leftBound2;
      if (nodeIds.length === 1) {
        const nodeId = nodeIds[0];
        if (updatedNodes[nodeId]) {
          updatedNodes[nodeId] = {
            ...updatedNodes[nodeId],
            x: svgWidth / 2,
            y
          };
        }
      } else {
        nodeIds.forEach((nodeId, index) => {
          if (updatedNodes[nodeId]) {
            let x;
            if (nodeIds.length === 2) {
              x = leftBound2 + (index === 0 ? safeWidth * 0.25 : safeWidth * 0.75);
            } else {
              const step = safeWidth / (nodeIds.length - 1);
              x = leftBound2 + index * step;
            }
            x = Math.max(leftBound2, Math.min(x, rightBound2));
            updatedNodes[nodeId] = {
              ...updatedNodes[nodeId],
              x,
              y
            };
          }
        });
      }
    });
    const leftBound = padding + nodeRadius;
    const rightBound = svgWidth - padding - nodeRadius;
    const topBound = padding + nodeRadius;
    const bottomBound = dynamicHeight - padding - nodeRadius;
    Object.values(updatedNodes).forEach((node) => {
      if (node.x !== void 0 && node.y !== void 0) {
        node.x = Math.max(leftBound, Math.min(node.x, rightBound));
        node.y = Math.max(topBound, Math.min(node.y, bottomBound));
      }
    });
    const finalHeight = Math.max(baseHeight, padding * 2 + (maxLevel + 1) * levelHeight + nodeRadius * 2);
    setSvgDimensions({
      width: svgWidth,
      height: finalHeight
    });
    const positionViolations = Object.values(updatedNodes).filter((node) => node.x !== void 0 && node.y !== void 0 && (node.x < leftBound || node.x > rightBound || node.y < topBound || node.y > bottomBound));
    console.log("Trie positioning debug:", {
      maxNodesInAnyLevel,
      svgWidth,
      finalHeight,
      boundaries: {
        leftBound,
        rightBound,
        topBound,
        bottomBound
      },
      nodesByLevel: Object.fromEntries(Object.entries(nodesByLevel).map(([level, nodes2]) => [level, nodes2.length])),
      positionViolations: positionViolations.length,
      samplePositions: Object.values(updatedNodes).slice(0, 8).map((n) => ({
        char: n.char,
        x: n.x,
        y: n.y
      }))
    });
    return updatedNodes;
  }, [root2, setSvgDimensions]);
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedNodeId(null);
    setHighlightedPath([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightNodeId) {
          setHighlightedNodeId(step.highlightNodeId);
        }
        if (step.highlightPath) {
          setHighlightedPath(step.highlightPath);
        }
        return nextIndex;
      });
    }, SPEEDS$3[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightNodeId) {
        setHighlightedNodeId(step.highlightNodeId);
      }
      if (step.highlightPath) {
        setHighlightedPath(step.highlightPath);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightNodeId) {
          setHighlightedNodeId(step.highlightNodeId);
        }
        if (step.highlightPath) {
          setHighlightedPath(step.highlightPath);
        }
      } else {
        setHighlightedNodeId(null);
        setHighlightedPath([]);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const insertWord = useCallback((word) => {
    if (!root2 || !word) return;
    const steps = [];
    const updatedNodes = {
      ...nodes
    };
    let currentNodeId = root2;
    const path = [root2];
    steps.push({
      type: "insert",
      description: `Inserting word "${word}"`,
      highlightNodeId: root2
    });
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      const currentNode = updatedNodes[currentNodeId];
      steps.push({
        type: "insert",
        description: `Looking for character '${char}' in node '${currentNode.char}'`,
        highlightNodeId: currentNodeId,
        currentChar: char
      });
      if (currentNode.children[char]) {
        currentNodeId = currentNode.children[char];
        path.push(currentNodeId);
        steps.push({
          type: "insert",
          description: `Character '${char}' found, moving to child node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path]
        });
      } else {
        const newNodeId = generateId();
        const newNode = {
          id: newNodeId,
          char,
          isEndOfWord: false,
          children: {},
          parent: currentNodeId,
          level: (currentNode.level || 0) + 1,
          x: 0,
          // Will be calculated later
          y: 0
          // Will be calculated later
        };
        updatedNodes[newNodeId] = newNode;
        updatedNodes[currentNodeId] = {
          ...currentNode,
          children: {
            ...currentNode.children,
            [char]: newNodeId
          }
        };
        currentNodeId = newNodeId;
        path.push(currentNodeId);
        steps.push({
          type: "insert",
          description: `Character '${char}' not found, creating new node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path]
        });
      }
    }
    updatedNodes[currentNodeId] = {
      ...updatedNodes[currentNodeId],
      isEndOfWord: true
    };
    steps.push({
      type: "insert",
      description: `Marking end of word "${word}"`,
      highlightNodeId: currentNodeId,
      highlightPath: [...path]
    });
    steps.push({
      type: "insert",
      description: `Successfully inserted "${word}"`,
      output: `Word "${word}" inserted successfully`
    });
    const positionedNodes = calculatePositions(updatedNodes);
    setNodes(positionedNodes);
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setConsoleOutput((prev) => [...prev, `INSERT: "${word}" - Added to trie`]);
  }, [root2, nodes, calculatePositions]);
  const searchInTrie = useCallback((word) => {
    if (!root2 || !word) return;
    const steps = [];
    let currentNodeId = root2;
    const path = [root2];
    let found = true;
    steps.push({
      type: "search",
      description: `Searching for word "${word}"`,
      highlightNodeId: root2
    });
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      const currentNode = nodes[currentNodeId];
      steps.push({
        type: "search",
        description: `Looking for character '${char}' in node '${currentNode.char}'`,
        highlightNodeId: currentNodeId,
        currentChar: char,
        highlightPath: [...path]
      });
      if (currentNode.children[char]) {
        currentNodeId = currentNode.children[char];
        path.push(currentNodeId);
        steps.push({
          type: "search",
          description: `Character '${char}' found, moving to child node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path]
        });
      } else {
        found = false;
        steps.push({
          type: "search",
          description: `Character '${char}' not found. Word "${word}" does not exist`,
          found: false
        });
        break;
      }
    }
    if (found) {
      const finalNode = nodes[currentNodeId];
      if (finalNode.isEndOfWord) {
        steps.push({
          type: "search",
          description: `Word "${word}" found!`,
          found: true,
          highlightNodeId: currentNodeId,
          highlightPath: [...path],
          output: `FOUND: "${word}" exists in trie`
        });
        setConsoleOutput((prev) => [...prev, `SEARCH: "${word}" - FOUND`]);
      } else {
        steps.push({
          type: "search",
          description: `Path exists but "${word}" is not a complete word`,
          found: false,
          highlightPath: [...path],
          output: `NOT FOUND: "${word}" is not a complete word`
        });
        setConsoleOutput((prev) => [...prev, `SEARCH: "${word}" - NOT FOUND (incomplete word)`]);
      }
    } else {
      setConsoleOutput((prev) => [...prev, `SEARCH: "${word}" - NOT FOUND`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [root2, nodes]);
  const startsWithPrefix = useCallback((prefix) => {
    if (!root2 || !prefix) return;
    const steps = [];
    let currentNodeId = root2;
    const path = [root2];
    let found = true;
    steps.push({
      type: "startsWith",
      description: `Checking if any word starts with "${prefix}"`,
      highlightNodeId: root2
    });
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i].toLowerCase();
      const currentNode = nodes[currentNodeId];
      steps.push({
        type: "startsWith",
        description: `Looking for character '${char}' in node '${currentNode.char}'`,
        highlightNodeId: currentNodeId,
        currentChar: char,
        highlightPath: [...path]
      });
      if (currentNode.children[char]) {
        currentNodeId = currentNode.children[char];
        path.push(currentNodeId);
        steps.push({
          type: "startsWith",
          description: `Character '${char}' found, moving to child node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path]
        });
      } else {
        found = false;
        steps.push({
          type: "startsWith",
          description: `Character '${char}' not found. No words start with "${prefix}"`,
          found: false
        });
        break;
      }
    }
    if (found) {
      steps.push({
        type: "startsWith",
        description: `Prefix "${prefix}" found! Words starting with "${prefix}" exist`,
        found: true,
        highlightNodeId: currentNodeId,
        highlightPath: [...path],
        output: `PREFIX FOUND: Words starting with "${prefix}" exist`
      });
      setConsoleOutput((prev) => [...prev, `STARTS_WITH: "${prefix}" - PREFIX FOUND`]);
    } else {
      setConsoleOutput((prev) => [...prev, `STARTS_WITH: "${prefix}" - PREFIX NOT FOUND`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [root2, nodes]);
  const handleInsert = () => {
    if (!inputWord.trim()) {
      alert("Please enter a word to insert");
      return;
    }
    resetAnimation();
    insertWord(inputWord.trim());
    setInputWord("");
  };
  const handleSearch = () => {
    if (!searchWord.trim()) {
      alert("Please enter a word to search");
      return;
    }
    resetAnimation();
    searchInTrie(searchWord.trim());
  };
  const handleStartsWith = () => {
    if (!searchWord.trim()) {
      alert("Please enter a prefix to check");
      return;
    }
    resetAnimation();
    startsWithPrefix(searchWord.trim());
  };
  const clearTrie = () => {
    resetAnimation();
    const rootId = generateId();
    const rootNode = {
      id: rootId,
      char: "ROOT",
      isEndOfWord: false,
      children: {},
      x: 400,
      y: 50,
      level: 0
    };
    setNodes({
      [rootId]: rootNode
    });
    setRoot(rootId);
    setConsoleOutput((prev) => [...prev, "CLEAR: Trie cleared"]);
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  const createSampleTrie = () => {
    console.log("Create Sample Trie is currently disabled for testing");
    setConsoleOutput((prev) => [...prev, "SAMPLE: Create Sample Trie function is currently disabled"]);
    return;
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  const nodeList = Object.values(nodes).filter((node) => node.x !== void 0 && node.y !== void 0);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "Trie (Prefix Tree) Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Insert Word"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "text",
                  value: inputWord,
                  onChange: (e) => setInputWord(e.target.value),
                  placeholder: "Enter word to insert",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleInsert,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                  children: [/* @__PURE__ */ jsx(Plus, {
                    size: 16
                  }), "Insert"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Search Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "text",
                  value: searchWord,
                  onChange: (e) => setSearchWord(e.target.value),
                  placeholder: "Enter word/prefix",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleSearch,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700",
                  children: [/* @__PURE__ */ jsx(Search, {
                    size: 16
                  }), "Search Word"]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleStartsWith,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700",
                  children: [/* @__PURE__ */ jsx(Eye, {
                    size: 16
                  }), "Starts With"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleTrie,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample Trie"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearTrie,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear Trie"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Trie Info"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Total Nodes: ", nodeList.length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Word Endings: ", nodeList.filter((n) => n.isEndOfWord).length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Max Depth: ", Math.max(...nodeList.map((n) => n.level || 0))]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-4",
                children: [/* @__PURE__ */ jsx("h4", {
                  className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
                  children: "Words in Trie:"
                }), /* @__PURE__ */ jsx("div", {
                  className: "text-xs text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto",
                  children: (() => {
                    const words = [];
                    const findWords = (nodeId, currentWord) => {
                      const node = nodes[nodeId];
                      if (!node) return;
                      if (node.isEndOfWord && currentWord) {
                        words.push(currentWord);
                      }
                      Object.entries(node.children).forEach(([char, childId]) => {
                        findWords(childId, currentWord + char);
                      });
                    };
                    if (root2) {
                      findWords(root2, "");
                    }
                    return words.length > 0 ? words.map((word, index) => /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "w-2 h-2 bg-green-500 rounded-full"
                      }), /* @__PURE__ */ jsxs("span", {
                        children: ['"', word, '"']
                      })]
                    }, index)) : /* @__PURE__ */ jsx("div", {
                      className: "text-gray-500 italic",
                      children: "No words found"
                    });
                  })()
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-4",
                children: [/* @__PURE__ */ jsx("h4", {
                  className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
                  children: "Tree Structure:"
                }), /* @__PURE__ */ jsx("div", {
                  className: "text-xs font-mono text-gray-600 dark:text-gray-400 space-y-0 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-2 rounded",
                  children: (() => {
                    const lines = [];
                    const printTree = (nodeId, prefix, isLast) => {
                      const node = nodes[nodeId];
                      if (!node) return;
                      const connector = isLast ? "└─ " : "├─ ";
                      const nodeLabel = node.char + (node.isEndOfWord ? " (END)" : "");
                      lines.push(prefix + connector + nodeLabel);
                      const children = Object.entries(node.children);
                      children.forEach(([char, childId], index) => {
                        const isLastChild = index === children.length - 1;
                        const childPrefix = prefix + (isLast ? "   " : "│  ");
                        lines.push(childPrefix + "│");
                        lines.push(childPrefix + `├─[${char}]`);
                        printTree(childId, childPrefix + "│  ", isLastChild);
                      });
                    };
                    if (root2) {
                      printTree(root2, "", true);
                    }
                    return lines.length > 0 ? lines.map((line, index) => /* @__PURE__ */ jsx("div", {
                      children: line
                    }, index)) : /* @__PURE__ */ jsx("div", {
                      children: "No structure found"
                    });
                  })()
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "Trie Visualization"
            }), /* @__PURE__ */ jsx("div", {
              className: "overflow-auto max-h-[700px] w-full",
              children: /* @__PURE__ */ jsxs("svg", {
                width: svgDimensions.width,
                height: svgDimensions.height,
                viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
                className: "border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900",
                style: {
                  minWidth: `${svgDimensions.width}px`
                },
                children: [/* @__PURE__ */ jsx("defs", {
                  children: /* @__PURE__ */ jsx("marker", {
                    id: "arrowhead",
                    markerWidth: "6",
                    markerHeight: "4",
                    refX: "5",
                    refY: "2",
                    orient: "auto",
                    children: /* @__PURE__ */ jsx("polygon", {
                      points: "0 0, 5 2, 0 4",
                      className: "fill-gray-600 dark:fill-gray-400"
                    })
                  })
                }), nodeList.map((node) => Object.entries(node.children).map(([char, childId]) => {
                  const childNode = nodes[childId];
                  if (!childNode || childNode.x === void 0 || childNode.y === void 0) return null;
                  const isHighlighted = highlightedPath.includes(node.id) && highlightedPath.includes(childId);
                  return /* @__PURE__ */ jsxs("g", {
                    children: [/* @__PURE__ */ jsx("line", {
                      x1: node.x,
                      y1: node.y + 6,
                      x2: childNode.x,
                      y2: childNode.y - 6,
                      className: `stroke-2 ${isHighlighted ? "stroke-yellow-500" : "stroke-gray-400 dark:stroke-gray-500"}`,
                      markerEnd: "url(#arrowhead)"
                    }), /* @__PURE__ */ jsx("text", {
                      x: (node.x + childNode.x) / 2,
                      y: (node.y + childNode.y) / 2 - 5,
                      textAnchor: "middle",
                      className: "text-xs fill-gray-600 dark:fill-gray-400 font-semibold",
                      children: char
                    })]
                  }, `${node.id}-${childId}`);
                })), /* @__PURE__ */ jsx(AnimatePresence, {
                  children: nodeList.map((node) => {
                    const isHighlighted = highlightedNodeId === node.id;
                    const isInPath = highlightedPath.includes(node.id);
                    const isRoot = node.char === "ROOT";
                    return /* @__PURE__ */ jsxs(motion.g, {
                      initial: {
                        opacity: 0,
                        scale: 0
                      },
                      animate: {
                        opacity: 1,
                        scale: 1
                      },
                      exit: {
                        opacity: 0,
                        scale: 0
                      },
                      transition: {
                        duration: 0.3
                      },
                      children: [/* @__PURE__ */ jsx("circle", {
                        cx: node.x,
                        cy: node.y,
                        r: "20",
                        className: `stroke-2 ${isHighlighted ? "fill-yellow-400 stroke-yellow-600" : isInPath ? "fill-green-400 stroke-green-600" : node.isEndOfWord ? "fill-red-400 stroke-red-600" : isRoot ? "fill-gray-400 stroke-gray-600" : "fill-blue-400 stroke-blue-600"}`
                      }), /* @__PURE__ */ jsx("text", {
                        x: node.x,
                        y: node.y + 4,
                        textAnchor: "middle",
                        className: "text-sm font-bold fill-white",
                        children: isRoot ? "R" : node.char.toUpperCase()
                      }), node.isEndOfWord && /* @__PURE__ */ jsx("circle", {
                        cx: node.x + 15,
                        cy: node.y - 15,
                        r: "5",
                        className: "fill-red-500 stroke-red-700 stroke-1"
                      })]
                    }, node.id);
                  })
                })]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-4 text-sm text-gray-600 dark:text-gray-300",
              children: [/* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-red-400 rounded-full mr-2"
                }), "Red nodes: End of word"]
              }), /* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-gray-400 rounded-full mr-2"
                }), "Gray node: Root"]
              }), /* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-blue-400 rounded-full mr-2"
                }), "Blue nodes: Regular nodes"]
              }), /* @__PURE__ */ jsx("p", {
                children: "• Red dot: Word ending marker"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold text-gray-900 dark:text-white",
                children: "Console Output"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: clearConsole,
                className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                children: [/* @__PURE__ */ jsx(Trash2, {
                  size: 14
                }), "Clear"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
              children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                className: "text-gray-500",
                children: "Console output will appear here when you run operations..."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                  className: "whitespace-pre-wrap",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "text-gray-400",
                    children: ["[", index + 1, "]"]
                  }), " ", output]
                }, index))
              })
            }), currentStep && currentStep.output && /* @__PURE__ */ jsx("div", {
              className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-blue-800 dark:text-blue-200",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Current Step:"
                }), " ", currentStep.output]
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: trie
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$2 = {
  slow: 1500,
  normal: 1e3,
  fast: 500
};
const BUCKET_SIZE$1 = 10;
const hashset = UNSAFE_withComponentProps(function HashSetVisualization() {
  const [buckets, setBuckets] = useState(() => Array.from({
    length: BUCKET_SIZE$1
  }, (_, index) => ({
    index,
    items: []
  })));
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedBucket, setHighlightedBucket] = useState(null);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const hashFunction = (value) => {
    return Math.abs(value) % BUCKET_SIZE$1;
  };
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedBucket(null);
    setHighlightedItem(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightBucket !== void 0) {
          setHighlightedBucket(step.highlightBucket);
        }
        if (step.highlightItem) {
          setHighlightedItem(step.highlightItem);
        }
        return nextIndex;
      });
    }, SPEEDS$2[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightBucket !== void 0) {
        setHighlightedBucket(step.highlightBucket);
      }
      if (step.highlightItem) {
        setHighlightedItem(step.highlightItem);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightBucket !== void 0) {
          setHighlightedBucket(step.highlightBucket);
        }
        if (step.highlightItem) {
          setHighlightedItem(step.highlightItem);
        }
      } else {
        setHighlightedBucket(null);
        setHighlightedItem(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const addToHashSet = useCallback((value) => {
    const steps = [];
    const hash = hashFunction(value);
    steps.push({
      type: "hash",
      description: `Computing hash for ${value}: ${value} % ${BUCKET_SIZE$1} = ${hash}`,
      value,
      hash
    });
    steps.push({
      type: "add",
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash
    });
    const bucket = buckets[hash];
    const existingItem = bucket.items.find((item) => item.value === value);
    if (existingItem) {
      steps.push({
        type: "add",
        description: `Value ${value} already exists in HashSet`,
        highlightBucket: hash,
        highlightItem: existingItem.id
      });
      setConsoleOutput((prev) => [...prev, `Add: ${value} → already exists`]);
    } else {
      const newItem = {
        id: generateId(),
        value,
        hash
      };
      if (bucket.items.length > 0) {
        steps.push({
          type: "collision",
          description: `Collision detected! Bucket ${hash} already has items`,
          highlightBucket: hash
        });
        steps.push({
          type: "add",
          description: `Adding ${value} to chain in bucket ${hash}`,
          highlightBucket: hash
        });
      } else {
        steps.push({
          type: "add",
          description: `Bucket ${hash} is empty, adding ${value}`,
          highlightBucket: hash
        });
      }
      setBuckets((prev) => prev.map((b) => b.index === hash ? {
        ...b,
        items: [...b.items, newItem]
      } : b));
      steps.push({
        type: "add",
        description: `Successfully added ${value} to HashSet`,
        highlightBucket: hash,
        highlightItem: newItem.id
      });
      setConsoleOutput((prev) => [...prev, `Add: ${value} → added to bucket ${hash}`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);
  const removeFromHashSet = useCallback((value) => {
    const steps = [];
    const hash = hashFunction(value);
    steps.push({
      type: "hash",
      description: `Computing hash for ${value}: ${value} % ${BUCKET_SIZE$1} = ${hash}`,
      value,
      hash
    });
    steps.push({
      type: "remove",
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash
    });
    const bucket = buckets[hash];
    const existingItem = bucket.items.find((item) => item.value === value);
    if (existingItem) {
      steps.push({
        type: "remove",
        description: `Found ${value} in bucket ${hash}`,
        highlightBucket: hash,
        highlightItem: existingItem.id
      });
      setBuckets((prev) => prev.map((b) => b.index === hash ? {
        ...b,
        items: b.items.filter((item) => item.value !== value)
      } : b));
      steps.push({
        type: "remove",
        description: `Successfully removed ${value} from HashSet`,
        highlightBucket: hash
      });
      setConsoleOutput((prev) => [...prev, `Remove: ${value} → removed from bucket ${hash}`]);
    } else {
      steps.push({
        type: "remove",
        description: `Value ${value} not found in HashSet`,
        highlightBucket: hash,
        found: false
      });
      setConsoleOutput((prev) => [...prev, `Remove: ${value} → not found`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);
  const containsInHashSet = useCallback((value) => {
    const steps = [];
    const hash = hashFunction(value);
    steps.push({
      type: "hash",
      description: `Computing hash for ${value}: ${value} % ${BUCKET_SIZE$1} = ${hash}`,
      value,
      hash
    });
    steps.push({
      type: "contains",
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash
    });
    const bucket = buckets[hash];
    const existingItem = bucket.items.find((item) => item.value === value);
    if (existingItem) {
      steps.push({
        type: "contains",
        description: `Found ${value} in bucket ${hash}`,
        highlightBucket: hash,
        highlightItem: existingItem.id,
        found: true
      });
      setConsoleOutput((prev) => [...prev, `Contains: ${value} → found in bucket ${hash}`]);
    } else {
      if (bucket.items.length > 0) {
        steps.push({
          type: "contains",
          description: `Searching through chain in bucket ${hash}`,
          highlightBucket: hash
        });
      }
      steps.push({
        type: "contains",
        description: `Value ${value} not found in HashSet`,
        highlightBucket: hash,
        found: false
      });
      setConsoleOutput((prev) => [...prev, `Contains: ${value} → not found`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);
  const handleAdd = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    addToHashSet(value);
    setInputValue("");
  };
  const handleRemove = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    removeFromHashSet(value);
    setInputValue("");
  };
  const handleContains = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    containsInHashSet(value);
  };
  const clearHashSet = () => {
    resetAnimation();
    setBuckets(Array.from({
      length: BUCKET_SIZE$1
    }, (_, index) => ({
      index,
      items: []
    })));
    setConsoleOutput((prev) => [...prev, "HashSet cleared"]);
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  const createSampleHashSet = () => {
    resetAnimation();
    const sampleValues = [15, 25, 35, 12, 22, 32, 18, 28];
    const newBuckets = Array.from({
      length: BUCKET_SIZE$1
    }, (_, index) => ({
      index,
      items: []
    }));
    sampleValues.forEach((value) => {
      const hash = hashFunction(value);
      const item = {
        id: generateId(),
        value,
        hash
      };
      newBuckets[hash].items.push(item);
    });
    setBuckets(newBuckets);
    setConsoleOutput((prev) => [...prev, `Sample HashSet created with values: ${sampleValues.join(", ")}`]);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  const totalItems = buckets.reduce((sum, bucket) => sum + bucket.items.length, 0);
  const loadFactor = totalItems / BUCKET_SIZE$1;
  const collisions = buckets.filter((bucket) => bucket.items.length > 1).length;
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "HashSet Visualization (Hash: n % 10)"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "HashSet Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  placeholder: "Enter value",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-2",
                  children: [/* @__PURE__ */ jsxs("button", {
                    onClick: handleAdd,
                    className: "flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                    children: [/* @__PURE__ */ jsx(Plus, {
                      size: 16
                    }), "Add"]
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handleRemove,
                    className: "flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                    children: [/* @__PURE__ */ jsx(Minus, {
                      size: 16
                    }), "Remove"]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Search Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: searchValue,
                  onChange: (e) => setSearchValue(e.target.value),
                  placeholder: "Enter value to search",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleContains,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700",
                  children: [/* @__PURE__ */ jsx(Search, {
                    size: 16
                  }), "Contains"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleHashSet,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample HashSet"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearHashSet,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear HashSet"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "HashSet Stats"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Total Items: ", totalItems]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Buckets: ", BUCKET_SIZE$1]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Load Factor: ", loadFactor.toFixed(2)]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Collisions: ", collisions]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Hash Function: n % ", BUCKET_SIZE$1]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "HashSet Visualization"
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-3",
              children: buckets.map((bucket) => {
                const isHighlighted = highlightedBucket === bucket.index;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-4",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: `min-w-[100px] text-center p-3 rounded-md font-semibold ${isHighlighted ? "bg-yellow-400 text-yellow-900" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`,
                    children: ["Bucket ", bucket.index]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-h-[60px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-3 flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx(AnimatePresence, {
                      children: bucket.items.map((item, itemIndex) => {
                        const isItemHighlighted = highlightedItem === item.id;
                        return /* @__PURE__ */ jsx(motion.div, {
                          initial: {
                            opacity: 0,
                            x: -20,
                            scale: 0.8
                          },
                          animate: {
                            opacity: 1,
                            x: 0,
                            scale: isItemHighlighted ? 1.05 : 1
                          },
                          exit: {
                            opacity: 0,
                            x: 20,
                            scale: 0.8
                          },
                          transition: {
                            duration: 0.3
                          },
                          className: `w-12 h-12 rounded-md flex items-center justify-center font-bold text-white text-sm ${isItemHighlighted ? "bg-yellow-500 shadow-lg" : "bg-blue-500"}`,
                          children: item.value
                        }, item.id);
                      })
                    }), bucket.items.length === 0 && /* @__PURE__ */ jsx("div", {
                      className: "text-gray-400 dark:text-gray-500 text-sm italic",
                      children: "Empty"
                    }), bucket.items.length > 1 && /* @__PURE__ */ jsxs("div", {
                      className: "ml-2 text-xs text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded",
                      children: ["Chain (", bucket.items.length, ")"]
                    })]
                  })]
                }, bucket.index);
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-6 text-sm text-gray-600 dark:text-gray-300",
              children: [/* @__PURE__ */ jsxs("p", {
                children: ["• Hash Function: ", /* @__PURE__ */ jsx("code", {
                  className: "bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded",
                  children: "hash(n) = n % 10"
                })]
              }), /* @__PURE__ */ jsx("p", {
                children: "• Collisions are resolved using chaining (linked lists)"
              }), /* @__PURE__ */ jsx("p", {
                children: "• Yellow highlighting shows current operation focus"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold text-gray-900 dark:text-white",
                children: "Console Output"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: clearConsole,
                className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                children: [/* @__PURE__ */ jsx(Trash2, {
                  size: 14
                }), "Clear"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
              children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                className: "text-gray-500",
                children: "Console output will appear here when you perform operations..."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                  className: "whitespace-pre-wrap",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "text-gray-400",
                    children: ["[", index + 1, "]"]
                  }), " ", output]
                }, index))
              })
            }), currentStep && /* @__PURE__ */ jsx("div", {
              className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-blue-800 dark:text-blue-200",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Current Step:"
                }), " ", currentStep.description]
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hashset
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS$1 = {
  slow: 1500,
  normal: 1e3,
  fast: 500
};
const BUCKET_SIZE = 10;
const hashtable = UNSAFE_withComponentProps(function HashTableVisualization() {
  const [buckets, setBuckets] = useState(() => Array.from({
    length: BUCKET_SIZE
  }, (_, index) => ({
    index,
    entries: []
  })));
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedBucket, setHighlightedBucket] = useState(null);
  const [highlightedEntry, setHighlightedEntry] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const hashFunction = (key) => {
    return Math.abs(key) % BUCKET_SIZE;
  };
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedBucket(null);
    setHighlightedEntry(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightBucket !== void 0) {
          setHighlightedBucket(step.highlightBucket);
        }
        if (step.highlightEntry) {
          setHighlightedEntry(step.highlightEntry);
        }
        return nextIndex;
      });
    }, SPEEDS$1[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightBucket !== void 0) {
        setHighlightedBucket(step.highlightBucket);
      }
      if (step.highlightEntry) {
        setHighlightedEntry(step.highlightEntry);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightBucket !== void 0) {
          setHighlightedBucket(step.highlightBucket);
        }
        if (step.highlightEntry) {
          setHighlightedEntry(step.highlightEntry);
        }
      } else {
        setHighlightedBucket(null);
        setHighlightedEntry(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const putInHashTable = useCallback((key, value) => {
    const steps = [];
    const hash = hashFunction(key);
    steps.push({
      type: "hash",
      description: `Computing hash for key ${key}: ${key} % ${BUCKET_SIZE} = ${hash}`,
      key,
      hash
    });
    steps.push({
      type: "put",
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash
    });
    const bucket = buckets[hash];
    const existingEntry = bucket.entries.find((entry2) => entry2.key === key);
    if (existingEntry) {
      steps.push({
        type: "update",
        description: `Key ${key} already exists, updating value from "${existingEntry.value}" to "${value}"`,
        highlightBucket: hash,
        highlightEntry: existingEntry.id
      });
      setBuckets((prev) => prev.map((b) => b.index === hash ? {
        ...b,
        entries: b.entries.map((entry2) => entry2.key === key ? {
          ...entry2,
          value
        } : entry2)
      } : b));
      steps.push({
        type: "put",
        description: `Successfully updated key ${key} with value "${value}"`,
        highlightBucket: hash,
        highlightEntry: existingEntry.id
      });
      setConsoleOutput((prev) => [...prev, `Updated: key ${key} → "${value}"`]);
    } else {
      const newEntry = {
        id: generateId(),
        key,
        value,
        hash
      };
      if (bucket.entries.length > 0) {
        steps.push({
          type: "collision",
          description: `Collision detected! Bucket ${hash} already has entries`,
          highlightBucket: hash
        });
        steps.push({
          type: "put",
          description: `Adding key-value pair (${key}, "${value}") to chain in bucket ${hash}`,
          highlightBucket: hash
        });
      } else {
        steps.push({
          type: "put",
          description: `Bucket ${hash} is empty, adding key-value pair (${key}, "${value}")`,
          highlightBucket: hash
        });
      }
      setBuckets((prev) => prev.map((b) => b.index === hash ? {
        ...b,
        entries: [...b.entries, newEntry]
      } : b));
      steps.push({
        type: "put",
        description: `Successfully added key ${key} with value "${value}" to HashTable`,
        highlightBucket: hash,
        highlightEntry: newEntry.id
      });
      setConsoleOutput((prev) => [...prev, `Put: key ${key} → "${value}" (bucket ${hash})`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);
  const getFromHashTable = useCallback((key) => {
    const steps = [];
    const hash = hashFunction(key);
    steps.push({
      type: "hash",
      description: `Computing hash for key ${key}: ${key} % ${BUCKET_SIZE} = ${hash}`,
      key,
      hash
    });
    steps.push({
      type: "get",
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash
    });
    const bucket = buckets[hash];
    const existingEntry = bucket.entries.find((entry2) => entry2.key === key);
    if (existingEntry) {
      steps.push({
        type: "get",
        description: `Found key ${key} in bucket ${hash}`,
        highlightBucket: hash,
        highlightEntry: existingEntry.id
      });
      steps.push({
        type: "get",
        description: `Key ${key} maps to value "${existingEntry.value}"`,
        highlightBucket: hash,
        highlightEntry: existingEntry.id,
        found: true
      });
      setConsoleOutput((prev) => [...prev, `Get: key ${key} → "${existingEntry.value}" (found)`]);
    } else {
      if (bucket.entries.length > 0) {
        steps.push({
          type: "get",
          description: `Searching through chain in bucket ${hash}`,
          highlightBucket: hash
        });
      }
      steps.push({
        type: "get",
        description: `Key ${key} not found in HashTable`,
        highlightBucket: hash,
        found: false
      });
      setConsoleOutput((prev) => [...prev, `Get: key ${key} → not found`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);
  const removeFromHashTable = useCallback((key) => {
    const steps = [];
    const hash = hashFunction(key);
    steps.push({
      type: "hash",
      description: `Computing hash for key ${key}: ${key} % ${BUCKET_SIZE} = ${hash}`,
      key,
      hash
    });
    steps.push({
      type: "remove",
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash
    });
    const bucket = buckets[hash];
    const existingEntry = bucket.entries.find((entry2) => entry2.key === key);
    if (existingEntry) {
      steps.push({
        type: "remove",
        description: `Found key ${key} in bucket ${hash}`,
        highlightBucket: hash,
        highlightEntry: existingEntry.id
      });
      setBuckets((prev) => prev.map((b) => b.index === hash ? {
        ...b,
        entries: b.entries.filter((entry2) => entry2.key !== key)
      } : b));
      steps.push({
        type: "remove",
        description: `Successfully removed key ${key} and its value "${existingEntry.value}" from HashTable`,
        highlightBucket: hash
      });
      setConsoleOutput((prev) => [...prev, `Remove: key ${key} and value "${existingEntry.value}" (removed)`]);
    } else {
      steps.push({
        type: "remove",
        description: `Key ${key} not found in HashTable`,
        highlightBucket: hash,
        found: false
      });
      setConsoleOutput((prev) => [...prev, `Remove: key ${key} → not found`]);
    }
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);
  const handlePut = () => {
    const key = parseInt(inputKey);
    if (isNaN(key)) {
      alert("Please enter a valid key (number)");
      return;
    }
    if (!inputValue.trim()) {
      alert("Please enter a value");
      return;
    }
    resetAnimation();
    putInHashTable(key, inputValue.trim());
    setInputKey("");
    setInputValue("");
  };
  const handleGet = () => {
    const key = parseInt(searchKey);
    if (isNaN(key)) {
      alert("Please enter a valid key (number)");
      return;
    }
    resetAnimation();
    getFromHashTable(key);
  };
  const handleRemove = () => {
    const key = parseInt(searchKey);
    if (isNaN(key)) {
      alert("Please enter a valid key (number)");
      return;
    }
    resetAnimation();
    removeFromHashTable(key);
  };
  const clearHashTable = () => {
    resetAnimation();
    setBuckets(Array.from({
      length: BUCKET_SIZE
    }, (_, index) => ({
      index,
      entries: []
    })));
    setConsoleOutput((prev) => [...prev, "HashTable cleared"]);
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  const createSampleHashTable = () => {
    resetAnimation();
    const sampleData = [{
      key: 15,
      value: "apple"
    }, {
      key: 25,
      value: "banana"
    }, {
      key: 35,
      value: "cherry"
    }, {
      key: 12,
      value: "date"
    }, {
      key: 22,
      value: "elderberry"
    }, {
      key: 32,
      value: "fig"
    }, {
      key: 18,
      value: "grape"
    }, {
      key: 28,
      value: "honeydew"
    }];
    const newBuckets = Array.from({
      length: BUCKET_SIZE
    }, (_, index) => ({
      index,
      entries: []
    }));
    sampleData.forEach(({
      key,
      value
    }) => {
      const hash = hashFunction(key);
      const entry2 = {
        id: generateId(),
        key,
        value,
        hash
      };
      newBuckets[hash].entries.push(entry2);
    });
    setBuckets(newBuckets);
    setConsoleOutput((prev) => [...prev, `Sample HashTable created with ${sampleData.length} entries`]);
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  const totalEntries = buckets.reduce((sum, bucket) => sum + bucket.entries.length, 0);
  const loadFactor = totalEntries / BUCKET_SIZE;
  const collisions = buckets.filter((bucket) => bucket.entries.length > 1).length;
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "HashTable Visualization (Hash: n % 10)"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Put Operation"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: inputKey,
                  onChange: (e) => setInputKey(e.target.value),
                  placeholder: "Enter key (number)",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  placeholder: "Enter value",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handlePut,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                  children: [/* @__PURE__ */ jsx(Plus, {
                    size: 16
                  }), "Put"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Get/Remove Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: searchKey,
                  onChange: (e) => setSearchKey(e.target.value),
                  placeholder: "Enter key to search",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-2",
                  children: [/* @__PURE__ */ jsxs("button", {
                    onClick: handleGet,
                    className: "flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700",
                    children: [/* @__PURE__ */ jsx(Search, {
                      size: 16
                    }), "Get"]
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handleRemove,
                    className: "flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                    children: [/* @__PURE__ */ jsx(Minus, {
                      size: 16
                    }), "Remove"]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleHashTable,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample HashTable"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearHashTable,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear HashTable"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "HashTable Stats"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Total Entries: ", totalEntries]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Buckets: ", BUCKET_SIZE]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Load Factor: ", loadFactor.toFixed(2)]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Collisions: ", collisions]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Hash Function: n % ", BUCKET_SIZE]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: "HashTable Visualization"
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-3",
              children: buckets.map((bucket) => {
                const isHighlighted = highlightedBucket === bucket.index;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-4",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: `min-w-[100px] text-center p-3 rounded-md font-semibold ${isHighlighted ? "bg-yellow-400 text-yellow-900" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`,
                    children: ["Bucket ", bucket.index]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-h-[60px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-3 flex items-center gap-2 overflow-x-auto",
                    children: [/* @__PURE__ */ jsx(AnimatePresence, {
                      children: bucket.entries.map((entry2, entryIndex) => {
                        const isEntryHighlighted = highlightedEntry === entry2.id;
                        return /* @__PURE__ */ jsxs(motion.div, {
                          initial: {
                            opacity: 0,
                            x: -20,
                            scale: 0.8
                          },
                          animate: {
                            opacity: 1,
                            x: 0,
                            scale: isEntryHighlighted ? 1.05 : 1
                          },
                          exit: {
                            opacity: 0,
                            x: 20,
                            scale: 0.8
                          },
                          transition: {
                            duration: 0.3
                          },
                          className: `min-w-[80px] h-12 rounded-md flex flex-col items-center justify-center text-white text-xs px-2 ${isEntryHighlighted ? "bg-yellow-500 shadow-lg" : "bg-blue-500"}`,
                          children: [/* @__PURE__ */ jsx("div", {
                            className: "font-bold text-xs",
                            children: entry2.key
                          }), /* @__PURE__ */ jsx("div", {
                            className: "text-xs opacity-70",
                            children: "→"
                          }), /* @__PURE__ */ jsx("div", {
                            className: "font-semibold text-xs truncate max-w-full",
                            children: entry2.value
                          })]
                        }, entry2.id);
                      })
                    }), bucket.entries.length === 0 && /* @__PURE__ */ jsx("div", {
                      className: "text-gray-400 dark:text-gray-500 text-sm italic",
                      children: "Empty"
                    }), bucket.entries.length > 1 && /* @__PURE__ */ jsxs("div", {
                      className: "ml-2 text-xs text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded",
                      children: ["Chain (", bucket.entries.length, ")"]
                    })]
                  })]
                }, bucket.index);
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-6 text-sm text-gray-600 dark:text-gray-300",
              children: [/* @__PURE__ */ jsxs("p", {
                children: ["• Hash Function: ", /* @__PURE__ */ jsx("code", {
                  className: "bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded",
                  children: "hash(key) = key % 10"
                })]
              }), /* @__PURE__ */ jsx("p", {
                children: "• Collisions are resolved using chaining (linked lists)"
              }), /* @__PURE__ */ jsx("p", {
                children: "• Each entry shows: Key → Value"
              }), /* @__PURE__ */ jsx("p", {
                children: "• Yellow highlighting shows current operation focus"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold text-gray-900 dark:text-white",
                children: "Console Output"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: clearConsole,
                className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                children: [/* @__PURE__ */ jsx(Trash2, {
                  size: 14
                }), "Clear"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
              children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                className: "text-gray-500",
                children: "Console output will appear here when you perform operations..."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                  className: "whitespace-pre-wrap",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "text-gray-400",
                    children: ["[", index + 1, "]"]
                  }), " ", output]
                }, index))
              })
            }), currentStep && /* @__PURE__ */ jsx("div", {
              className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-blue-800 dark:text-blue-200",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Current Step:"
                }), " ", currentStep.description]
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hashtable
}, Symbol.toStringTag, { value: "Module" }));
const SPEEDS = {
  slow: 1500,
  normal: 1e3,
  fast: 500
};
const heapq = UNSAFE_withComponentProps(function HeapQVisualization() {
  const [heap, setHeap] = useState([]);
  const [isMinHeap, setIsMinHeap] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [swapNodes, setSwapNodes] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const intervalRef = useRef(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const getParentIndex = (index) => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index) => 2 * index + 1;
  const getRightChildIndex = (index) => 2 * index + 2;
  const shouldSwap = (parentValue, childValue) => {
    return isMinHeap ? parentValue > childValue : parentValue < childValue;
  };
  const calculatePositions = useCallback((heapArray) => {
    const updatedHeap = [...heapArray];
    updatedHeap.forEach((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      const y = 80 + level * 100;
      const levelWidth = 800;
      const spacing = levelWidth / (totalInLevel + 1);
      const x = spacing * (positionInLevel + 1);
      updatedHeap[index] = {
        ...node,
        x,
        y
      };
    });
    return updatedHeap;
  }, []);
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedNodes([]);
    setSwapNodes(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const playAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        const step = animationSteps[nextIndex];
        if (step.highlightNodes) {
          setHighlightedNodes(step.highlightNodes);
        } else {
          setHighlightedNodes([]);
        }
        if (step.swapNodes) {
          setSwapNodes(step.swapNodes);
        } else {
          setSwapNodes(null);
        }
        return nextIndex;
      });
    }, SPEEDS[speed]);
  }, [animationSteps, speed]);
  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const stepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const step = animationSteps[nextIndex];
      if (step.highlightNodes) {
        setHighlightedNodes(step.highlightNodes);
      } else {
        setHighlightedNodes([]);
      }
      if (step.swapNodes) {
        setSwapNodes(step.swapNodes);
      } else {
        setSwapNodes(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      if (prevIndex >= 0) {
        const step = animationSteps[prevIndex];
        if (step.highlightNodes) {
          setHighlightedNodes(step.highlightNodes);
        } else {
          setHighlightedNodes([]);
        }
        if (step.swapNodes) {
          setSwapNodes(step.swapNodes);
        } else {
          setSwapNodes(null);
        }
      } else {
        setHighlightedNodes([]);
        setSwapNodes(null);
      }
    }
  }, [currentStepIndex, animationSteps]);
  const insertIntoHeap = useCallback((value) => {
    const steps = [];
    const newNode = {
      id: generateId(),
      value,
      index: heap.length
    };
    steps.push({
      type: "insert",
      description: `🌟 Inserting ${value} into ${isMinHeap ? "Min" : "Max"} Heap`,
      newNode,
      currentHeapArray: [...heap]
    });
    let updatedHeap = [...heap, newNode];
    let currentIndex = updatedHeap.length - 1;
    const propagatingNodeId = newNode.id;
    steps.push({
      type: "insert",
      description: `📍 Added ${value} at index ${currentIndex} (last position in array)`,
      highlightNodes: [newNode.id],
      currentHeapArray: [...updatedHeap],
      propagatingNodeId,
      currentPosition: currentIndex
    });
    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      const currentNode = updatedHeap[currentIndex];
      const parentNode = updatedHeap[parentIndex];
      steps.push({
        type: "compare",
        description: `🔍 Comparing ${currentNode.value} at [${currentIndex}] with parent ${parentNode.value} at [${parentIndex}]`,
        highlightNodes: [currentNode.id, parentNode.id],
        compareNodes: [currentNode.id, parentNode.id],
        currentHeapArray: [...updatedHeap],
        propagatingNodeId,
        currentPosition: currentIndex,
        targetPosition: parentIndex
      });
      if (shouldSwap(parentNode.value, currentNode.value)) {
        steps.push({
          type: "swap",
          description: `🔄 Swapping ${currentNode.value} with ${parentNode.value} (${isMinHeap ? currentNode.value + " < " + parentNode.value : currentNode.value + " > " + parentNode.value})`,
          swapNodes: [currentNode.id, parentNode.id],
          currentHeapArray: [...updatedHeap],
          propagatingNodeId,
          currentPosition: currentIndex,
          targetPosition: parentIndex
        });
        [updatedHeap[currentIndex], updatedHeap[parentIndex]] = [updatedHeap[parentIndex], updatedHeap[currentIndex]];
        updatedHeap[currentIndex].index = currentIndex;
        updatedHeap[parentIndex].index = parentIndex;
        currentIndex = parentIndex;
        steps.push({
          type: "heapify-up",
          description: `⬆️ Node ${currentNode.value} propagated up to index ${currentIndex}`,
          highlightNodes: [currentNode.id],
          currentHeapArray: [...updatedHeap],
          propagatingNodeId,
          currentPosition: currentIndex
        });
      } else {
        steps.push({
          type: "heapify-up",
          description: `✅ Heap property satisfied! ${currentNode.value} stays at index ${currentIndex}`,
          highlightNodes: [currentNode.id],
          currentHeapArray: [...updatedHeap],
          propagatingNodeId,
          currentPosition: currentIndex
        });
        break;
      }
    }
    steps.push({
      type: "insert",
      description: `🎉 Successfully inserted ${value} into heap at final position [${currentIndex}]`,
      currentHeapArray: [...updatedHeap],
      highlightNodes: [propagatingNodeId]
    });
    setConsoleOutput((prev) => [...prev, `Insert: ${value} → added to ${isMinHeap ? "min" : "max"} heap at index ${currentIndex}`]);
    setHeap(calculatePositions(updatedHeap));
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [heap, isMinHeap, calculatePositions]);
  const extractFromHeap = useCallback(() => {
    if (heap.length === 0) {
      alert("Heap is empty!");
      return;
    }
    const steps = [];
    const rootNode = heap[0];
    const lastNode = heap[heap.length - 1];
    steps.push({
      type: "extract",
      description: `Extracting ${isMinHeap ? "minimum" : "maximum"} value: ${rootNode.value}`,
      highlightNodes: [rootNode.id],
      extractedNode: rootNode
    });
    if (heap.length === 1) {
      steps.push({
        type: "extract",
        description: `Heap is now empty`
      });
      setHeap([]);
      setAnimationSteps(steps);
      setCurrentStepIndex(-1);
      return;
    }
    let updatedHeap = heap.slice(0, -1);
    updatedHeap[0] = {
      ...lastNode,
      index: 0
    };
    steps.push({
      type: "extract",
      description: `Moving last element ${lastNode.value} to root position`,
      highlightNodes: [lastNode.id]
    });
    let currentIndex = 0;
    while (true) {
      const leftChildIndex = getLeftChildIndex(currentIndex);
      const rightChildIndex = getRightChildIndex(currentIndex);
      let targetIndex = currentIndex;
      const currentNode = updatedHeap[currentIndex];
      let targetNode = currentNode;
      if (leftChildIndex < updatedHeap.length) {
        const leftChild = updatedHeap[leftChildIndex];
        steps.push({
          type: "compare",
          description: `Comparing ${currentNode.value} with left child ${leftChild.value}`,
          highlightNodes: [currentNode.id, leftChild.id]
        });
        if (shouldSwap(currentNode.value, leftChild.value)) {
          targetIndex = leftChildIndex;
          targetNode = leftChild;
        }
      }
      if (rightChildIndex < updatedHeap.length) {
        const rightChild = updatedHeap[rightChildIndex];
        steps.push({
          type: "compare",
          description: `Comparing ${targetNode.value} with right child ${rightChild.value}`,
          highlightNodes: [targetNode.id, rightChild.id]
        });
        if (shouldSwap(targetNode.value, rightChild.value)) {
          targetIndex = rightChildIndex;
          targetNode = rightChild;
        }
      }
      if (targetIndex === currentIndex) {
        steps.push({
          type: "heapify-down",
          description: `Heap property satisfied, ${currentNode.value} stays at index ${currentIndex}`,
          highlightNodes: [currentNode.id]
        });
        break;
      }
      steps.push({
        type: "swap",
        description: `Swapping ${currentNode.value} with ${targetNode.value}`,
        swapNodes: [currentNode.id, targetNode.id]
      });
      [updatedHeap[currentIndex], updatedHeap[targetIndex]] = [updatedHeap[targetIndex], updatedHeap[currentIndex]];
      updatedHeap[currentIndex].index = currentIndex;
      updatedHeap[targetIndex].index = targetIndex;
      currentIndex = targetIndex;
      steps.push({
        type: "heapify-down",
        description: `Moved ${currentNode.value} down to index ${currentIndex}`,
        highlightNodes: [currentNode.id]
      });
    }
    steps.push({
      type: "extract",
      description: `Successfully extracted ${rootNode.value} from heap`
    });
    setConsoleOutput((prev) => [...prev, `Extract: ${rootNode.value} → removed from ${isMinHeap ? "min" : "max"} heap`]);
    setHeap(calculatePositions(updatedHeap));
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [heap, isMinHeap, calculatePositions]);
  const peekHeap = useCallback(() => {
    if (heap.length === 0) {
      alert("Heap is empty!");
      return;
    }
    const steps = [];
    const rootNode = heap[0];
    steps.push({
      type: "peek",
      description: `Peeking at ${isMinHeap ? "minimum" : "maximum"} value`,
      highlightNodes: [rootNode.id]
    });
    steps.push({
      type: "peek",
      description: `${isMinHeap ? "Minimum" : "Maximum"} value is ${rootNode.value}`,
      highlightNodes: [rootNode.id]
    });
    steps.push({
      type: "peek",
      description: `Heap remains unchanged`
    });
    setConsoleOutput((prev) => [...prev, `Peek: ${isMinHeap ? "minimum" : "maximum"} value is ${rootNode.value}`]);
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [heap, isMinHeap]);
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    resetAnimation();
    insertIntoHeap(value);
    setInputValue("");
  };
  const handleExtract = () => {
    resetAnimation();
    extractFromHeap();
  };
  const handlePeek = () => {
    resetAnimation();
    peekHeap();
  };
  const clearHeap = () => {
    resetAnimation();
    setHeap([]);
    setConsoleOutput((prev) => [...prev, "Heap cleared"]);
  };
  const clearConsole = () => {
    setConsoleOutput([]);
  };
  const createSampleHeap = () => {
    resetAnimation();
    const sampleValues = [10, 20, 15, 30, 40, 50, 100, 25, 45];
    const sampleHeap = sampleValues.map((value, index) => ({
      id: generateId(),
      value,
      index
    }));
    let builtHeap = [...sampleHeap];
    for (let i = Math.floor(builtHeap.length / 2) - 1; i >= 0; i--) {
      let currentIndex = i;
      while (true) {
        const leftChildIndex = getLeftChildIndex(currentIndex);
        const rightChildIndex = getRightChildIndex(currentIndex);
        let targetIndex = currentIndex;
        if (leftChildIndex < builtHeap.length && shouldSwap(builtHeap[currentIndex].value, builtHeap[leftChildIndex].value)) {
          targetIndex = leftChildIndex;
        }
        if (rightChildIndex < builtHeap.length && shouldSwap(builtHeap[targetIndex].value, builtHeap[rightChildIndex].value)) {
          targetIndex = rightChildIndex;
        }
        if (targetIndex === currentIndex) break;
        [builtHeap[currentIndex], builtHeap[targetIndex]] = [builtHeap[targetIndex], builtHeap[currentIndex]];
        builtHeap[currentIndex].index = currentIndex;
        builtHeap[targetIndex].index = targetIndex;
        currentIndex = targetIndex;
      }
    }
    setHeap(calculatePositions(builtHeap));
    setConsoleOutput((prev) => [...prev, `Sample ${isMinHeap ? "min" : "max"} heap created with values: ${sampleValues.join(", ")}`]);
  };
  const toggleHeapType = () => {
    setIsMinHeap(!isMinHeap);
    if (heap.length > 0) {
      heap.map((node) => node.value);
      setHeap([]);
      setTimeout(() => {
        createSampleHeap();
      }, 100);
    }
  };
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const currentStep = animationSteps[currentStepIndex];
  const heapWithPositions = calculatePositions(heap);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              children: [/* @__PURE__ */ jsx(Home, {
                size: 20
              }), /* @__PURE__ */ jsx("span", {
                children: "Home"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "h-6 w-px bg-gray-300 dark:bg-gray-600"
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold text-gray-900 dark:text-white",
              children: "HeapQ (Priority Queue) Visualization"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsxs("select", {
              value: speed,
              onChange: (e) => setSpeed(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [/* @__PURE__ */ jsx("option", {
                value: "slow",
                children: "Slow"
              }), /* @__PURE__ */ jsx("option", {
                value: "normal",
                children: "Normal"
              }), /* @__PURE__ */ jsx("option", {
                value: "fast",
                children: "Fast"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "max-w-7xl mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-1",
          children: /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Animation Controls"
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap gap-2 mb-4",
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: isPlaying ? pauseAnimation : playAnimation,
                  disabled: animationSteps.length === 0,
                  className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [isPlaying ? /* @__PURE__ */ jsx(Pause, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Play, {
                    size: 16
                  }), isPlaying ? "Pause" : "Play"]
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepBackward,
                  disabled: currentStepIndex <= -1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipBack, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsx("button", {
                  onClick: stepForward,
                  disabled: currentStepIndex >= animationSteps.length - 1,
                  className: "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsx(SkipForward, {
                    size: 16
                  })
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: resetAnimation,
                  className: "flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                  children: [/* @__PURE__ */ jsx(RotateCcw, {
                    size: 16
                  }), "Reset"]
                })]
              }), currentStep && /* @__PURE__ */ jsx("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md",
                children: /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-blue-800 dark:text-blue-200",
                  children: ["Step ", currentStepIndex + 1, "/", animationSteps.length, ": ", currentStep.description]
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Heap Type"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: toggleHeapType,
                className: `w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold ${isMinHeap ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"}`,
                children: [isMinHeap ? /* @__PURE__ */ jsx(ArrowDown, {
                  size: 16
                }) : /* @__PURE__ */ jsx(ArrowUp, {
                  size: 16
                }), isMinHeap ? "Min Heap" : "Max Heap"]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-gray-500 dark:text-gray-400 mt-2",
                children: isMinHeap ? "Smallest element at root" : "Largest element at root"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Heap Operations"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  placeholder: "Enter value",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleInsert,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                  children: [/* @__PURE__ */ jsx(Plus, {
                    size: 16
                  }), "Insert"]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-2",
                  children: [/* @__PURE__ */ jsxs("button", {
                    onClick: handleExtract,
                    disabled: heap.length === 0,
                    className: "flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400",
                    children: [/* @__PURE__ */ jsx(Minus, {
                      size: 16
                    }), "Extract"]
                  }), /* @__PURE__ */ jsxs("button", {
                    onClick: handlePeek,
                    disabled: heap.length === 0,
                    className: "flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400",
                    children: [/* @__PURE__ */ jsx(Eye, {
                      size: 16
                    }), "Peek"]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Utilities"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx("button", {
                  onClick: createSampleHeap,
                  className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                  children: "Create Sample Heap"
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: clearHeap,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700",
                  children: [/* @__PURE__ */ jsx(Trash2, {
                    size: 16
                  }), "Clear Heap"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-gray-900 dark:text-white mb-4",
                children: "Heap Info"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm text-gray-600 dark:text-gray-300",
                children: [/* @__PURE__ */ jsxs("p", {
                  children: ["Size: ", heap.length]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Type: ", isMinHeap ? "Min Heap" : "Max Heap"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Root: ", heap.length > 0 ? heap[0].value : "Empty"]
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["Height: ", heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0]
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "lg:col-span-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
            children: [/* @__PURE__ */ jsxs("h2", {
              className: "text-xl font-semibold text-gray-900 dark:text-white mb-6",
              children: [isMinHeap ? "Min" : "Max", " Heap Visualization"]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800",
              children: [/* @__PURE__ */ jsxs("h3", {
                className: "text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "w-3 h-3 bg-blue-600 rounded-full"
                }), "Array Representation"]
              }), heap.length > 0 ? /* @__PURE__ */ jsxs("div", {
                className: "space-y-4",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "flex gap-1 flex-wrap",
                  children: /* @__PURE__ */ jsx(AnimatePresence, {
                    children: ((currentStep == null ? void 0 : currentStep.currentHeapArray) || heap).map((node, index) => {
                      (currentStep == null ? void 0 : currentStep.currentHeapArray) || heap;
                      const isPropagating = (currentStep == null ? void 0 : currentStep.propagatingNodeId) === node.id;
                      const isCurrentPosition = (currentStep == null ? void 0 : currentStep.currentPosition) === index;
                      const isTargetPosition = (currentStep == null ? void 0 : currentStep.targetPosition) === index;
                      const isSwapping = swapNodes && (swapNodes[0] === node.id || swapNodes[1] === node.id);
                      return /* @__PURE__ */ jsxs(motion.div, {
                        initial: {
                          opacity: 0,
                          scale: 0
                        },
                        animate: {
                          opacity: 1,
                          scale: isPropagating || isCurrentPosition || isTargetPosition ? 1.1 : 1,
                          y: isPropagating && isCurrentPosition ? -10 : 0
                        },
                        exit: {
                          opacity: 0,
                          scale: 0
                        },
                        transition: {
                          duration: 0.5,
                          type: "spring"
                        },
                        className: `relative flex flex-col items-center min-w-[60px] ${isSwapping ? "transform scale-110" : ""}`,
                        children: [/* @__PURE__ */ jsx("div", {
                          className: `w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-white shadow-lg transition-all duration-300 ${isSwapping ? "bg-orange-500 border-orange-600 animate-pulse" : isPropagating && isCurrentPosition ? "bg-green-500 border-green-600 ring-2 ring-green-300" : isTargetPosition ? "bg-purple-500 border-purple-600 ring-2 ring-purple-300" : highlightedNodes.includes(node.id) ? "bg-yellow-500 border-yellow-600" : index === 0 ? "bg-red-500 border-red-600" : "bg-blue-500 border-blue-600"}`,
                          children: node.value
                        }), /* @__PURE__ */ jsxs("div", {
                          className: "text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold",
                          children: ["[", index, "]"]
                        }), isPropagating && isCurrentPosition && /* @__PURE__ */ jsx(motion.div, {
                          initial: {
                            scale: 0
                          },
                          animate: {
                            scale: 1
                          },
                          className: "absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center",
                          children: /* @__PURE__ */ jsx(ArrowUp, {
                            size: 10,
                            className: "text-white"
                          })
                        }), isTargetPosition && (currentStep == null ? void 0 : currentStep.propagatingNodeId) && /* @__PURE__ */ jsx(motion.div, {
                          initial: {
                            scale: 0
                          },
                          animate: {
                            scale: 1
                          },
                          className: "absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center",
                          children: /* @__PURE__ */ jsx("div", {
                            className: "w-2 h-2 bg-white rounded-full"
                          })
                        })]
                      }, `${node.id}-${index}`);
                    })
                  })
                }), (currentStep == null ? void 0 : currentStep.propagatingNodeId) && /* @__PURE__ */ jsxs(motion.div, {
                  initial: {
                    opacity: 0,
                    y: 10
                  },
                  animate: {
                    opacity: 1,
                    y: 0
                  },
                  className: "flex items-center gap-4 text-sm",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "w-4 h-4 bg-green-500 rounded border flex items-center justify-center",
                      children: /* @__PURE__ */ jsx(ArrowUp, {
                        size: 10,
                        className: "text-white"
                      })
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-green-700 dark:text-green-300 font-semibold",
                      children: "Propagating Node"
                    })]
                  }), (currentStep == null ? void 0 : currentStep.targetPosition) !== void 0 && /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "w-4 h-4 bg-purple-500 rounded border flex items-center justify-center",
                      children: /* @__PURE__ */ jsx("div", {
                        className: "w-2 h-2 bg-white rounded-full"
                      })
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-purple-700 dark:text-purple-300 font-semibold",
                      children: "Target Position"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "text-sm text-blue-700 dark:text-blue-300 space-y-1",
                  children: [/* @__PURE__ */ jsxs("p", {
                    children: ["• ", /* @__PURE__ */ jsx("strong", {
                      children: "Root:"
                    }), " Always at index [0]"]
                  }), /* @__PURE__ */ jsxs("p", {
                    children: ["• ", /* @__PURE__ */ jsx("strong", {
                      children: "Parent of [i]:"
                    }), " index [(i-1)/2]"]
                  }), /* @__PURE__ */ jsxs("p", {
                    children: ["• ", /* @__PURE__ */ jsx("strong", {
                      children: "Left child of [i]:"
                    }), " index [2i+1]"]
                  }), /* @__PURE__ */ jsxs("p", {
                    children: ["• ", /* @__PURE__ */ jsx("strong", {
                      children: "Right child of [i]:"
                    }), " index [2i+2]"]
                  })]
                })]
              }) : /* @__PURE__ */ jsx("div", {
                className: "text-blue-500 dark:text-blue-400 italic text-center py-8",
                children: "Empty heap array"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "overflow-auto",
              children: /* @__PURE__ */ jsxs("svg", {
                width: "800",
                height: "500",
                className: "border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900",
                children: [/* @__PURE__ */ jsx("defs", {
                  children: /* @__PURE__ */ jsx("marker", {
                    id: "arrowhead",
                    markerWidth: "6",
                    markerHeight: "4",
                    refX: "5",
                    refY: "2",
                    orient: "auto",
                    children: /* @__PURE__ */ jsx("polygon", {
                      points: "0 0, 5 2, 0 4",
                      className: "fill-gray-600 dark:fill-gray-400"
                    })
                  })
                }), heapWithPositions.map((node, index) => {
                  const leftChildIndex = getLeftChildIndex(index);
                  const rightChildIndex = getRightChildIndex(index);
                  return /* @__PURE__ */ jsxs("g", {
                    children: [leftChildIndex < heapWithPositions.length && /* @__PURE__ */ jsx("line", {
                      x1: node.x,
                      y1: node.y + 20,
                      x2: heapWithPositions[leftChildIndex].x,
                      y2: heapWithPositions[leftChildIndex].y - 20,
                      className: "stroke-2 stroke-gray-400 dark:stroke-gray-500"
                    }), rightChildIndex < heapWithPositions.length && /* @__PURE__ */ jsx("line", {
                      x1: node.x,
                      y1: node.y + 20,
                      x2: heapWithPositions[rightChildIndex].x,
                      y2: heapWithPositions[rightChildIndex].y - 20,
                      className: "stroke-2 stroke-gray-400 dark:stroke-gray-500"
                    })]
                  }, `edges-${node.id}`);
                }), /* @__PURE__ */ jsx(AnimatePresence, {
                  children: heapWithPositions.map((node, index) => {
                    const isHighlighted = highlightedNodes.includes(node.id);
                    const isSwapping = swapNodes && (swapNodes[0] === node.id || swapNodes[1] === node.id);
                    const isRoot = index === 0;
                    return /* @__PURE__ */ jsxs(motion.g, {
                      initial: {
                        opacity: 0,
                        scale: 0
                      },
                      animate: {
                        opacity: 1,
                        scale: isHighlighted || isSwapping ? 1.1 : 1,
                        x: node.x,
                        y: node.y
                      },
                      exit: {
                        opacity: 0,
                        scale: 0
                      },
                      transition: {
                        duration: 0.3
                      },
                      children: [/* @__PURE__ */ jsx("circle", {
                        cx: 0,
                        cy: 0,
                        r: "20",
                        className: `stroke-2 ${isSwapping ? "fill-orange-400 stroke-orange-600" : isHighlighted ? "fill-yellow-400 stroke-yellow-600" : isRoot ? "fill-red-400 stroke-red-600" : "fill-blue-400 stroke-blue-600"}`
                      }), /* @__PURE__ */ jsx("text", {
                        x: 0,
                        y: 4,
                        textAnchor: "middle",
                        className: "text-sm font-bold fill-white",
                        children: node.value
                      }), /* @__PURE__ */ jsxs("text", {
                        x: 0,
                        y: 35,
                        textAnchor: "middle",
                        className: "text-xs fill-gray-500 dark:fill-gray-400",
                        children: ["[", index, "]"]
                      })]
                    }, node.id);
                  })
                }), heap.length === 0 && /* @__PURE__ */ jsx("text", {
                  x: "400",
                  y: "250",
                  textAnchor: "middle",
                  className: "text-lg fill-gray-500 dark:fill-gray-400",
                  children: "Empty Heap"
                })]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-4 text-sm text-gray-600 dark:text-gray-300",
              children: [/* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-red-400 rounded-full mr-2"
                }), "Root node (priority element)"]
              }), /* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-blue-400 rounded-full mr-2"
                }), "Regular nodes"]
              }), /* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-yellow-400 rounded-full mr-2"
                }), "Highlighted during operations"]
              }), /* @__PURE__ */ jsxs("p", {
                children: ["• ", /* @__PURE__ */ jsx("span", {
                  className: "inline-block w-4 h-4 bg-orange-400 rounded-full mr-2"
                }), "Nodes being swapped"]
              }), /* @__PURE__ */ jsx("p", {
                children: "• Array indices shown below each node"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold text-gray-900 dark:text-white",
                children: "Console Output"
              }), /* @__PURE__ */ jsxs("button", {
                onClick: clearConsole,
                className: "flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm",
                children: [/* @__PURE__ */ jsx(Trash2, {
                  size: 14
                }), "Clear"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto",
              children: consoleOutput.length === 0 ? /* @__PURE__ */ jsx("div", {
                className: "text-gray-500",
                children: "Console output will appear here when you perform operations..."
              }) : /* @__PURE__ */ jsx("div", {
                className: "space-y-2",
                children: consoleOutput.map((output, index) => /* @__PURE__ */ jsxs("div", {
                  className: "whitespace-pre-wrap",
                  children: [/* @__PURE__ */ jsxs("span", {
                    className: "text-gray-400",
                    children: ["[", index + 1, "]"]
                  }), " ", output]
                }, index))
              })
            }), currentStep && /* @__PURE__ */ jsx("div", {
              className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-blue-800 dark:text-blue-200",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Current Step:"
                }), " ", currentStep.description]
              })
            })]
          })]
        })]
      })
    })]
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: heapq
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B6Pcz7n-.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BINDou2b.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js"], "css": ["/assets/root-DVWnVLTQ.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-h-6nEu0A.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/linked-list": { "id": "routes/linked-list", "parentId": "root", "path": "linked-list", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/linked-list-wqpqv_U-.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/search-DrjjuQff.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/binary-search-tree": { "id": "routes/binary-search-tree", "parentId": "root", "path": "binary-search-tree", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/binary-search-tree-D05vyxkX.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/search-DrjjuQff.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/stack": { "id": "routes/stack", "parentId": "root", "path": "stack", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/stack-8gmlkr9C.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/minus-alcnGp7i.js", "/assets/eye-DorOnmru.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/queue": { "id": "routes/queue", "parentId": "root", "path": "queue", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/queue-BdF5lP_V.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/minus-alcnGp7i.js", "/assets/eye-DorOnmru.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/graph": { "id": "routes/graph", "parentId": "root", "path": "graph", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/graph-CAUVpaSF.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/search-DrjjuQff.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/trie": { "id": "routes/trie", "parentId": "root", "path": "trie", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/trie-NVJZ8G_e.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/search-DrjjuQff.js", "/assets/eye-DorOnmru.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/hashset": { "id": "routes/hashset", "parentId": "root", "path": "hashset", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/hashset-G8TDNXL1.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/minus-alcnGp7i.js", "/assets/search-DrjjuQff.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/hashtable": { "id": "routes/hashtable", "parentId": "root", "path": "hashtable", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/hashtable-D4Boq3Ts.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/search-DrjjuQff.js", "/assets/minus-alcnGp7i.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/heapq": { "id": "routes/heapq", "parentId": "root", "path": "heapq", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/heapq-BHUWjys0.js", "imports": ["/assets/chunk-NL6KNZEE-CmHBY1x6.js", "/assets/trash-2-Dh11y13Q.js", "/assets/minus-alcnGp7i.js", "/assets/eye-DorOnmru.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-bc173366.js", "version": "bc173366", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/linked-list": {
    id: "routes/linked-list",
    parentId: "root",
    path: "linked-list",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/binary-search-tree": {
    id: "routes/binary-search-tree",
    parentId: "root",
    path: "binary-search-tree",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/stack": {
    id: "routes/stack",
    parentId: "root",
    path: "stack",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/queue": {
    id: "routes/queue",
    parentId: "root",
    path: "queue",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/graph": {
    id: "routes/graph",
    parentId: "root",
    path: "graph",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/trie": {
    id: "routes/trie",
    parentId: "root",
    path: "trie",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/hashset": {
    id: "routes/hashset",
    parentId: "root",
    path: "hashset",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/hashtable": {
    id: "routes/hashtable",
    parentId: "root",
    path: "hashtable",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/heapq": {
    id: "routes/heapq",
    parentId: "root",
    path: "heapq",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
