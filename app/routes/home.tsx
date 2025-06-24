import { Link } from "react-router";
import { useState, useRef, useCallback, useEffect } from "react";

// Client-side Monaco Editor component
function ClientOnlyEditor({ 
  language, 
  value, 
  onChange, 
  height = "100%",
  theme = "neon-dark",
  options = {},
  onMount
}: {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  theme?: string;
  options?: any;
  onMount?: (editor: any, monaco: any) => void;
}) {
  const [Editor, setEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
    
    // Only load Monaco Editor on client side
    if (typeof window !== 'undefined') {
      import('@monaco-editor/react').then((module) => {
        setEditor(() => module.default);
        setIsLoading(false);
      }).catch((error) => {
        console.error('Failed to load Monaco Editor:', error);
        setIsLoading(false);
      });
    }
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  if (isLoading || !Editor) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading code editor...</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme={theme}
      onMount={onMount}
      options={{
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
        fontLigatures: true,
        ...options
      }}
    />
  );
}

export function meta() {
  return [
    { title: "Algorithm Visualizer" },
    { name: "description", content: "Interactive Data Structure & Algorithm Visualizations" },
  ];
}

export default function Home() {
  const [imageError, setImageError] = useState(false);
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Header Section */}
      <div className="relative z-10 bg-gradient-to-b from-slate-950/95 to-transparent backdrop-blur-md py-12">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-3xl ring-2 ring-white/10 shadow-xl bg-gradient-to-br from-slate-800/40 to-gray-900/60 flex items-center justify-center backdrop-blur-md">
            {!imageError ? (
              <img 
                src="/profile.png" 
                alt="Profile" 
                className="w-full h-full object-cover rounded-3xl"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-700 to-gray-800 flex items-center justify-center text-white text-sm font-bold">
                NA
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'Moirai One, serif' }}>
              Algo Visualizer
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-160px)] flex px-8 pb-8">
        {/* Left Side - Algorithm Visualizer */}
        <div className="w-[35%] pr-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <AlgorithmCard
              title="LinkedList"
              description="Linear data structure with dynamic memory allocation and efficient insertion/deletion"
              href="/linked-list"
              icon="🔗"
              status="available"
              neonColor="yellow-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="BinarySearchTree"
              description="Hierarchical structure for efficient searching, insertion, and deletion operations"
              href="/binary-search-tree"
              icon="🌳"
              status="available"
              neonColor="emerald-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="Stack"
              description="LIFO (Last In, First Out) data structure for managing function calls and expressions"
              href="/stack"
              icon="📚"
              status="available"
              neonColor="blue-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="Queue"
              description="FIFO (First In, First Out) structure for scheduling and breadth-first algorithms"
              href="/queue"
              icon="🔄"
              status="available"
              neonColor="cyan-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="Graph Algorithms"
              description="Network structures for modeling relationships and pathfinding algorithms"
              href="/graph"
              icon="🕸️"
              status="available"
              neonColor="orange-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
              iconStyle="filter: brightness(1.3) contrast(1.1)"
            />
            
            <AlgorithmCard
              title="Trie (Prefix Tree)"
              description="Tree structure optimized for string operations and autocomplete functionality"
              href="/trie"
              icon="🌲"
              status="available"
              neonColor="green-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="Hash Set"
              description="Set implementation using hash tables for O(1) average lookup time"
              href="/hashset"
              icon="🔢"
              status="available"
              neonColor="red-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="Hash Table"
              description="Key-value storage with hash functions for fast data retrieval and storage"
              href="/hashtable"
              icon="🔑"
              status="available"
              neonColor="purple-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
            
            <AlgorithmCard
              title="Heap (Priority Queue)"
              description="Binary tree structure for priority-based operations and efficient sorting"
              href="/heapq"
              icon="⛰️"
              status="available"
              neonColor="pink-400"
              gradient=""
              textColor="text-white"
              hoverGradient=""
            />
          </div>
        </div>

        {/* Right Side - Coding Playground */}
        <div className="w-[65%] pl-4">
          <CodingPlayground />
        </div>
      </div>
    </main>
  );
}

interface AlgorithmCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  status: "available" | "coming-soon";
  gradient: string;
  textColor: string;
  hoverGradient: string;
  neonColor?: string;
  iconStyle?: string;
}

const getLanguageIcon = (langId: string, className = "w-5 h-5") => {
  const iconProps = {
    className: `${className} stroke-current`,
    strokeWidth: 1.5,
    fill: 'none',
    viewBox: "0 0 24 24"
  };

  switch (langId) {
    case 'python':
      return (
        <svg {...iconProps}>
          <path d="M9 3c-1.5 0-3 1.5-3 3v3h6V6h3c1.5 0 3 1.5 3 3v6c0 1.5-1.5 3-3 3h-3v-3H6v3c0 1.5 1.5 3 3 3h6c1.5 0 3-1.5 3-3V9c0-1.5-1.5-3-3-3H9z"/>
          <circle cx="8" cy="8" r="1"/>
          <circle cx="16" cy="16" r="1"/>
        </svg>
      );
    case 'cpp':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M8 8h8M8 12h8M8 16h6"/>
          <path d="M14 6v4M16 6v4"/>
          <path d="M18 8h2M18 10h2"/>
          <path d="M14 14v4M16 14v4"/>
          <path d="M18 16h2M18 18h2"/>
        </svg>
      );
    case 'java':
      return (
        <svg {...iconProps}>
          <path d="M10 2v6c0 3 1 5 4 5s4-2 4-5V2"/>
          <path d="M6 15c0 3 2 5 6 5s6-2 6-5"/>
          <path d="M8 11c2-1 4-1 6 0"/>
          <path d="M12 8v4"/>
          <circle cx="12" cy="4" r="1"/>
        </svg>
      );
    case 'go':
      return (
        <svg {...iconProps}>
          <path d="M7.5 8c2.5 0 4.5-2 4.5-4.5S10 1 7.5 1 3 2 3 4.5 5 8 7.5 8z"/>
          <path d="M21 12c0 2.5-2 4.5-4.5 4.5S12 14.5 12 12s2-4.5 4.5-4.5S21 9.5 21 12z"/>
          <path d="M15.5 19c2.5 0 4.5-2 4.5-4.5S18 10 15.5 10 11 12 11 14.5 13 19 15.5 19z"/>
          <path d="m6 9 4 4"/>
          <path d="m14 13 4 4"/>
        </svg>
      );
    case 'javascript':
      return (
        <svg {...iconProps}>
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <path d="M7 16c0 1 1 2 2 2s2-1 2-2V8"/>
          <path d="M15 8v4c0 2-1 3-2 3s-2-1-2-3"/>
        </svg>
      );
    default:
      return <span className="text-sm">?</span>;
  }
};

const getOutlinedIcon = (iconType: string, color: string) => {
  const iconProps = {
    className: `w-8 h-8 stroke-current`,
    strokeWidth: 1.5,
    fill: 'none'
  };

  switch (iconType) {
    case '🔗':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      );
    case '🌳':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 22v-3" />
          <path d="M7 12c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3z" />
          <path d="M17 12c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3z" />
          <path d="M12 12c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3z" />
          <path d="M12 12c-1.5 0-3 1-3 3s1.5 3 3 3 3-1 3-3-1.5-3-3-3z" />
        </svg>
      );
    case '📚':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M2 6h20v12H2z" />
          <path d="M6 10h12" />
          <path d="M6 14h8" />
          <path d="M2 6l2-2h16l2 2" />
        </svg>
      );
    case '🔄':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      );
    case '🕸️':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v20" />
          <path d="M2 12h20" />
          <path d="M4.93 4.93l14.14 14.14" />
          <path d="M4.93 19.07l14.14-14.14" />
        </svg>
      );
    case '🌲':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2L8 8h8l-4-6z" />
          <path d="M12 8L7 15h10l-5-7z" />
          <path d="M12 15L6 22h12l-6-7z" />
          <path d="M12 22v-7" />
        </svg>
      );
    case '🔢':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
          <path d="M8 8h8" />
          <path d="M8 16h8" />
        </svg>
      );
    case '🔑':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="M13 6L22 6" />
          <path d="M17 2L22 7" />
          <path d="M17 12L22 7" />
        </svg>
      );
    case '⛰️':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M8 21l4-7 4 7" />
          <path d="M12 14l-4-7L12 3l4 4-4 7" />
          <path d="M4 21h16" />
        </svg>
      );
    default:
      return <span className="text-3xl">?</span>;
  }
};

function AlgorithmCard({ title, description, href, icon, status, gradient, textColor, hoverGradient, neonColor = "cyan-400", iconStyle }: AlgorithmCardProps) {
  const isAvailable = status === "available";
  
  const getNeonStyles = (color: string) => {
    const colorMap: { [key: string]: { border: string, hoverBorder: string, shadow: string, accent: string, rgb: string, textColor: string, textColorLight: string } } = {
      'yellow-400': {
        border: 'border-yellow-400/50',
        hoverBorder: 'hover:border-yellow-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]',
        accent: 'from-yellow-400/20 via-yellow-400/60 to-yellow-400/20',
        rgb: '250, 204, 21',
        textColor: '#facc15',
        textColorLight: 'rgba(250, 204, 21, 0.7)'
      },
      'green-400': {
        border: 'border-green-400/50',
        hoverBorder: 'hover:border-green-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]',
        accent: 'from-green-400/20 via-green-400/60 to-green-400/20',
        rgb: '34, 197, 94',
        textColor: '#22c55e',
        textColorLight: 'rgba(34, 197, 94, 0.7)'
      },
      'blue-400': {
        border: 'border-blue-400/50',
        hoverBorder: 'hover:border-blue-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]',
        accent: 'from-blue-400/20 via-blue-400/60 to-blue-400/20',
        rgb: '59, 130, 246',
        textColor: '#3b82f6',
        textColorLight: 'rgba(59, 130, 246, 0.7)'
      },
      'purple-400': {
        border: 'border-purple-400/50',
        hoverBorder: 'hover:border-purple-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
        accent: 'from-purple-400/20 via-purple-400/60 to-purple-400/20',
        rgb: '168, 85, 247',
        textColor: '#a855f7',
        textColorLight: 'rgba(168, 85, 247, 0.7)'
      },
      'pink-400': {
        border: 'border-pink-400/50',
        hoverBorder: 'hover:border-pink-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.5)]',
        accent: 'from-pink-400/20 via-pink-400/60 to-pink-400/20',
        rgb: '244, 114, 182',
        textColor: '#f472b6',
        textColorLight: 'rgba(244, 114, 182, 0.7)'
      },
      'orange-400': {
        border: 'border-orange-400/50',
        hoverBorder: 'hover:border-orange-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(251,146,60,0.5)]',
        accent: 'from-orange-400/20 via-orange-400/60 to-orange-400/20',
        rgb: '251, 146, 60',
        textColor: '#fb923c',
        textColorLight: 'rgba(251, 146, 60, 0.7)'
      },
      'red-400': {
        border: 'border-red-400/50',
        hoverBorder: 'hover:border-red-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(248,113,113,0.5)]',
        accent: 'from-red-400/20 via-red-400/60 to-red-400/20',
        rgb: '248, 113, 113',
        textColor: '#f87171',
        textColorLight: 'rgba(248, 113, 113, 0.7)'
      },
      'cyan-400': {
        border: 'border-cyan-400/50',
        hoverBorder: 'hover:border-cyan-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]',
        accent: 'from-cyan-400/20 via-cyan-400/60 to-cyan-400/20',
        rgb: '34, 211, 238',
        textColor: '#22d3ee',
        textColorLight: 'rgba(34, 211, 238, 0.7)'
      },
      'emerald-400': {
        border: 'border-emerald-400/50',
        hoverBorder: 'hover:border-emerald-400',
        shadow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]',
        accent: 'from-emerald-400/20 via-emerald-400/60 to-emerald-400/20',
        rgb: '52, 211, 153',
        textColor: '#34d399',
        textColorLight: 'rgba(52, 211, 153, 0.7)'
      }
    };
    return colorMap[color] || colorMap['cyan-400'];
  };

  const neonStyles = getNeonStyles(neonColor);
  
  const CardContent = () => (
    <div className={`
      relative overflow-hidden p-4 rounded-3xl border-2 transition-all duration-300 group flex flex-col h-40 items-center justify-center text-center
      ${isAvailable 
        ? `bg-slate-950/80 cursor-pointer ${neonStyles.border} ${neonStyles.hoverBorder} ${neonStyles.shadow} hover:scale-[1.02] backdrop-blur-md` 
        : 'bg-slate-900/40 cursor-not-allowed border-slate-700/30 backdrop-blur-md'}
    `}>
      {/* Subtle shine effect on hover */}
      {isAvailable && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
      )}
      
      <div className="relative flex flex-col h-full justify-center items-center">
        {!isAvailable && (
          <span className="absolute top-0 right-0 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            Soon
          </span>
        )}
        
        <div 
          className={`text-3xl mb-2 ${isAvailable ? '' : 'text-gray-400'}`}
          style={isAvailable ? { 
            color: neonStyles.textColor,
            ...(iconStyle ? { filter: iconStyle } : {})
          } : (iconStyle ? { filter: iconStyle } : {})}
        >
          {getOutlinedIcon(icon, neonColor)}
        </div>
        
        <h3 
          className={`text-lg font-semibold mb-2 ${isAvailable ? '' : 'text-gray-300'}`}
          style={isAvailable ? { color: neonStyles.textColor } : {}}
        >
          {title}
        </h3>
        
        <p 
          className={`text-xs leading-relaxed ${isAvailable ? '' : 'text-gray-400'}`}
          style={isAvailable ? { color: neonStyles.textColorLight } : {}}
        >
          {description}
        </p>
      </div>
      
      {/* Bottom accent line */}
      {isAvailable && (
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${neonStyles.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      )}
    </div>
  );

  if (!isAvailable) {
    return <CardContent />;
  }

  return (
    <Link to={href} className="block">
      <CardContent />
    </Link>
  );
}

// File system types
interface FileSystemNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemNode[];
  parent?: string;
}

// File Tree Node Component
function FileTreeNode({ 
  node, 
  path, 
  expandedFolders, 
  onToggleFolder, 
  onSelectFile, 
  currentFile, 
  selectedFiles,
  onToggleSelection,
  level = 0 
}: {
  node: FileSystemNode;
  path: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  currentFile: string;
  selectedFiles: Set<string>;
  onToggleSelection: (path: string) => void;
  level?: number;
}) {
  const isExpanded = expandedFolders.has(path);
  const isCurrentFile = currentFile === path;
  const isSelected = selectedFiles.has(path);
  
  const getFileIcon = (fileName: string, isFolder: boolean) => {
    if (isFolder) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" className="text-amber-400">
          <rect x="1" y="4" width="14" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M1 6 L6 6 L7 4 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );
    }
    
    const ext = fileName.toLowerCase().split('.').pop();
    
    switch (ext) {
      case 'py':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-yellow-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <circle cx="5" cy="6" r="0.5" fill="currentColor"/>
            <circle cx="11" cy="10" r="0.5" fill="currentColor"/>
          </svg>
        );
      case 'js':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-yellow-300">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <line x1="6" y1="8" x2="6" y2="10" stroke="currentColor" strokeWidth="1"/>
            <line x1="10" y1="8" x2="10" y2="10" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'cpp': case 'cc': case 'cxx':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-blue-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <line x1="9" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1"/>
            <line x1="10" y1="5" x2="10" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="9" y1="9" x2="11" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="10" y1="8" x2="10" y2="10" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'java':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-red-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <circle cx="8" cy="6" r="0.5" fill="currentColor"/>
            <path d="M7 10 Q8 11 9 10" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'go':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-cyan-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <circle cx="6" cy="6" r="0.5" fill="currentColor"/>
            <circle cx="10" cy="10" r="0.5" fill="currentColor"/>
            <line x1="6" y1="6" x2="10" y2="10" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'md':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-purple-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <path d="M5 6 L6 6 L7 7 L8 6 L9 6" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'json':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-green-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <path d="M6 8 Q5.5 8 5.5 8.5 L5.5 9.5 Q5.5 10 6 10" fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M10 8 Q10.5 8 10.5 8.5 L10.5 9.5 Q10.5 10 10 10" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'html':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-orange-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <path d="M6 8 L5.5 9 L6 10" fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M10 8 L10.5 9 L10 10" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'css':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-blue-300">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
            <line x1="6" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'txt':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-300">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-400">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
            <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
    }
  };

  return (
    <div>
      <div
        className={`inline-flex items-center gap-1 py-0.5 pl-2 pr-1 rounded cursor-pointer transition-colors ${
          isCurrentFile 
            ? 'bg-cyan-900/30 text-cyan-400' 
            : isSelected
            ? 'bg-red-900/30 text-red-400 border border-red-400/50'
            : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
        }`}
        style={{ marginLeft: `${level * 16 + 8}px` }}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd click for selection
            onToggleSelection(path);
          } else if (node.type === 'folder') {
            onToggleFolder(path);
          } else {
            onSelectFile(path);
          }
        }}
        title={node.name} // Show full name on hover
      >
        <span className="flex items-center">
          {getFileIcon(node.name, node.type === 'folder')}
        </span>
        <span className="text-sm whitespace-nowrap">
          {node.name.length > 20 ? `${node.name.substring(0, 20)}...` : node.name}
        </span>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode
              key={`${child.name}-${index}`}
              node={child}
              path={`${path}/${child.name}`}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
              currentFile={currentFile}
              selectedFiles={selectedFiles}
              onToggleSelection={onToggleSelection}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CodingPlayground() {
  const [activeTab, setActiveTab] = useState('python');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [editorTheme, setEditorTheme] = useState('neon-dark');
  
  // Initialize file system with sample files
  const [fileSystem, setFileSystem] = useState<FileSystemNode>({
    name: 'workspace',
    type: 'folder',
    children: [
      {
        name: 'main.py',
        type: 'file',
        content: '# Hello World in Python\n# Python with Pyodide WebAssembly\n\nprint("Hello, World!")\nprint("Welcome to Python programming!")\n\n# You can use advanced libraries like:\n# import pandas as pd\n# import numpy as np\n# import scikit-learn\n\nname = input("What\'s your name? ")\nprint(f"Nice to meet you, {name}!")'
      },
      {
        name: 'main.cpp',
        type: 'file',
        content: '// Hello World in C++\n// Modern C++23 with Emscripten WebAssembly\n\n#include <iostream>\n#include <string>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    std::cout << "Welcome to C++ programming!" << std::endl;\n    \n    std::string name;\n    std::cout << "What\'s your name? ";\n    std::getline(std::cin, name);\n    \n    std::cout << "Nice to meet you, " << name << "!" << std::endl;\n    \n    return 0;\n}'
      },
      {
        name: 'Main.java',
        type: 'file',
        content: '// Hello World in Java\n// Java 21 with WebAssembly JVM\n\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Welcome to Java programming!");\n        \n        Scanner scanner = new Scanner(System.in);\n        System.out.print("What\'s your name? ");\n        String name = scanner.nextLine();\n        \n        System.out.println("Nice to meet you, " + name + "!");\n        \n        scanner.close();\n    }\n}'
      },
      {
        name: 'main.go',
        type: 'file',
        content: '// Hello World in Go\n// Go WebAssembly with Full Standard Library\n\npackage main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n    "strings"\n)\n\nfunc main() {\n    fmt.Println("Hello, World!")\n    fmt.Println("Welcome to Go programming!")\n    \n    reader := bufio.NewReader(os.Stdin)\n    fmt.Print("What\'s your name? ")\n    name, _ := reader.ReadString(\'\\n\')\n    name = strings.TrimSpace(name)\n    \n    fmt.Printf("Nice to meet you, %s!\\n", name)\n}'
      },
      {
        name: 'main.js',
        type: 'file',
        content: '// Hello World in JavaScript\n// JavaScript ES2023 Playground\n\nconsole.log("Hello, World!");\nconsole.log("Welcome to JavaScript programming!");\n\n// Get user input (simulated with prompt)\nconst name = prompt("What\'s your name?") || "Anonymous";\nconsole.log(`Nice to meet you, ${name}!`);\n\n// Modern JavaScript features\nconst greetUser = (userName) => {\n    return `Hello, ${userName}! Welcome to the world of JavaScript!`;\n};\n\nconsole.log(greetUser(name));'
      },
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'utils.py',
            type: 'file',
            content: '# Utility functions\n\ndef fibonacci(n):\n    """Generate fibonacci sequence up to n."""\n    a, b = 0, 1\n    result = []\n    while a < n:\n        result.append(a)\n        a, b = b, a + b\n    return result\n\ndef prime_check(n):\n    """Check if a number is prime."""\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True'
          }
        ]
      },
      {
        name: 'README.md',
        type: 'file',
        content: '# Algorithm Visualizer Workspace\n\nWelcome to your coding workspace! This environment supports:\n\n## Languages\n- **Python** with Pyodide (pandas, numpy, scikit-learn)\n- **C++23** with Emscripten WebAssembly\n- **Java 21** with WebAssembly JVM\n- **Go 1.22** with full WebAssembly runtime\n- **JavaScript ES2023** with V8 engine\n\n## Features\n- Real-time code editing with Monaco Editor\n- File system with create, read, update, delete operations\n- Terminal with bash-like commands\n- Multiple editor themes\n- Language-specific syntax highlighting\n\n## Getting Started\n1. Choose your language from the dropdown\n2. Edit files in the file explorer\n3. Use the terminal for file operations\n4. Click Run to execute your code\n\nHappy coding! 🚀'
      }
    ]
  });
  
  const [currentFile, setCurrentFile] = useState<string>('/workspace/main.py');
  const [currentFileContent, setCurrentFileContent] = useState<string>('');
  const [currentDirectory, setCurrentDirectory] = useState<string>('/workspace');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/workspace', '/workspace/src']));
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // File system utility functions
  const findFileByPath = (path: string, node: FileSystemNode = fileSystem): FileSystemNode | null => {
    const parts = path.split('/').filter(Boolean);
    let current = node;
    
    for (const part of parts) {
      if (current.children) {
        const found = current.children.find(child => child.name === part);
        if (found) {
          current = found;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    return current;
  };

  const getFileContent = (path: string): string => {
    // Remove /workspace prefix for findFileByPath
    const cleanPath = path.startsWith('/workspace') ? path.replace('/workspace', '') : path;
    const file = findFileByPath(cleanPath);
    return file?.content || '';
  };

  const updateFileContent = (path: string, content: string) => {
    setFileSystem(prev => {
      const newFileSystem = { ...prev };
      // Remove /workspace prefix for findFileByPath
      const cleanPath = path.startsWith('/workspace') ? path.replace('/workspace', '') : path;
      const file = findFileByPath(cleanPath, newFileSystem);
      if (file && file.type === 'file') {
        file.content = content;
      }
      return newFileSystem;
    });
  };

  const createFile = (path: string, name: string, content: string = '') => {
    setFileSystem(prev => {
      const newFileSystem = { ...prev };
      const folder = findFileByPath(path, newFileSystem);
      if (folder && folder.type === 'folder') {
        if (!folder.children) folder.children = [];
        const newFile: FileSystemNode = {
          name,
          type: 'file',
          content
        };
        folder.children.push(newFile);
      }
      return newFileSystem;
    });
  };

  const createFolder = (path: string, name: string) => {
    setFileSystem(prev => {
      const newFileSystem = { ...prev };
      const folder = findFileByPath(path, newFileSystem);
      if (folder && folder.type === 'folder') {
        if (!folder.children) folder.children = [];
        const newFolder: FileSystemNode = {
          name,
          type: 'folder',
          children: []
        };
        folder.children.push(newFolder);
      }
      return newFileSystem;
    });
  };

  const deleteSelectedFiles = () => {
    if (selectedFiles.size === 0) {
      alert('Please select files or folders to delete by holding Ctrl/Cmd and clicking on them.');
      return;
    }

    const selectedArray = Array.from(selectedFiles);
    const confirmMessage = selectedArray.length === 1 
      ? `Are you sure you want to delete "${selectedArray[0].split('/').pop()}"?`
      : `Are you sure you want to delete ${selectedArray.length} selected items?`;
    
    if (!confirm(confirmMessage)) return;

    setFileSystem(prev => {
      let newFileSystem = { ...prev };
      
      // Sort paths by depth (deeper first) to avoid deleting parent before children
      const sortedPaths = selectedArray.sort((a, b) => b.split('/').length - a.split('/').length);
      
      sortedPaths.forEach(selectedPath => {
        // Normalize path - remove /workspace prefix if present
        const normalizedPath = selectedPath.replace(/^\/workspace\/?/, '');
        if (!normalizedPath) return; // Don't delete root
        
        const pathParts = normalizedPath.split('/').filter(Boolean);
        
        // Find parent folder
        let current = newFileSystem;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current.children) return;
          const childFolder = current.children.find(c => c.name === pathParts[i] && c.type === 'folder');
          if (!childFolder) return;
          current = childFolder;
        }
        
        // Remove the target file/folder
        if (current.children && pathParts.length > 0) {
          const targetName = pathParts[pathParts.length - 1];
          current.children = current.children.filter(child => child.name !== targetName);
        }
      });
      
      return newFileSystem;
    });
    
    // Clear selections and update current file if it was deleted
    setSelectedFiles(new Set());
    if (selectedFiles.has(currentFile)) {
      setCurrentFile('/workspace/main.py');
    }
  };

  // Initialize current file content
  useEffect(() => {
    const content = getFileContent(currentFile);
    setCurrentFileContent(content);
  }, [currentFile, fileSystem]);

  // Initialize the editor with the first file on mount
  useEffect(() => {
    // Force load the main.py content on first render
    const initialContent = getFileContent('/workspace/main.py');
    if (initialContent) {
      setCurrentFileContent(initialContent);
    }
  }, []);

  // Update the editor when a file is selected
  const handleFileSelect = (path: string) => {
    setCurrentFile(path);
    const content = getFileContent(path);
    setCurrentFileContent(content);
    
    // Update language based on file extension
    const fileName = path.split('/').pop() || '';
    const ext = fileName.toLowerCase().split('.').pop();
    const langMap: { [key: string]: string } = {
      'py': 'python',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'java': 'java',
      'go': 'go',
      'js': 'javascript'
    };
    
    if (ext && langMap[ext] && langMap[ext] !== activeTab) {
      setActiveTab(langMap[ext]);
    }
  };

  // Auto-save file content when editor changes
  const handleEditorChange = (value: string | undefined) => {
    const content = value || '';
    setCurrentFileContent(content);
    updateFileContent(currentFile, content);
  };

  // Terminal command processing
  const processTerminalCommand = (command: string): string => {
    const args = command.trim().split(' ');
    const cmd = args[0];
    
    switch (cmd) {
      case 'help':
        return `Available commands:
• ls - list directory contents
• cd <dir> - change directory
• pwd - print working directory
• cat <file> - display file contents
• mkdir <dir> - create directory
• touch <file> - create new file
• rm <file> - remove file
• clear - clear terminal
• tree - show directory structure
• whoami - display current user`;
        
      case 'ls':
        const currentDir = findFileByPath(currentDirectory.replace('/workspace', ''));
        if (currentDir && currentDir.children) {
          return currentDir.children
            .map(child => `${child.type === 'folder' ? '📁' : '📄'} ${child.name}`)
            .join('\n');
        }
        return 'Directory is empty';
        
      case 'pwd':
        return currentDirectory;
        
      case 'whoami':
        return 'developer@algo-visualizer';
        
      case 'cat':
        if (args[1]) {
          const file = findFileByPath(`${currentDirectory.replace('/workspace', '')}/${args[1]}`);
          if (file && file.type === 'file') {
            return file.content || 'File is empty';
          }
          return `cat: ${args[1]}: No such file`;
        }
        return 'cat: missing file operand';
        
      case 'tree':
        const renderTree = (node: FileSystemNode, prefix: string = ''): string => {
          if (!node.children) return '';
          return node.children
            .map((child, index) => {
              const isLast = index === node.children!.length - 1;
              const currentPrefix = isLast ? '└── ' : '├── ';
              const nextPrefix = isLast ? '    ' : '│   ';
              const icon = child.type === 'folder' ? '📁' : '📄';
              let result = `${prefix}${currentPrefix}${icon} ${child.name}`;
              if (child.type === 'folder' && child.children) {
                result += '\n' + renderTree(child, prefix + nextPrefix);
              }
              return result;
            })
            .join('\n');
        };
        return renderTree(fileSystem);
        
      case 'clear':
        setTerminalHistory(['']);
        return '';
        
      default:
        return `bash: ${cmd}: command not found`;
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const command = terminalInput.trim();
    const output = processTerminalCommand(command);
    
    setTerminalHistory(prev => [
      ...prev,
      `$ ${command}`,
      ...(output ? [output] : []),
      ''
    ]);
    
    setTerminalInput('');
  };
  const [consoleHeight, setConsoleHeight] = useState(35);
  const [isResizing, setIsResizing] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [languageStatuses, setLanguageStatuses] = useState<{[key: string]: 'none' | 'loading' | 'ready' | 'error'}>({
    python: 'none',
    cpp: 'none', 
    java: 'none',
    go: 'none',
    javascript: 'none'
  });
  
  // Get language-specific neon colors
  const getLanguageColor = (langId: string) => {
    const colorMap: { [key: string]: { border: string, shadow: string, rgb: string } } = {
      'python': { border: 'border-yellow-400/70', shadow: 'shadow-[0_0_25px_rgba(250,204,21,0.3)]', rgb: '250, 204, 21' },
      'cpp': { border: 'border-blue-400/70', shadow: 'shadow-[0_0_25px_rgba(59,130,246,0.3)]', rgb: '59, 130, 246' },
      'java': { border: 'border-orange-400/70', shadow: 'shadow-[0_0_25px_rgba(251,146,60,0.3)]', rgb: '251, 146, 60' },
      'go': { border: 'border-cyan-400/70', shadow: 'shadow-[0_0_25px_rgba(34,211,238,0.3)]', rgb: '34, 211, 238' },
      'javascript': { border: 'border-emerald-400/70', shadow: 'shadow-[0_0_25px_rgba(52,211,153,0.3)]', rgb: '52, 211, 153' }
    };
    return colorMap[langId] || colorMap['python'];
  };
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'terminal'>('output');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [pyodideStatus, setPyodideStatus] = useState<'none' | 'loading' | 'ready' | 'error'>('none');
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [emscriptenStatus, setEmscriptenStatus] = useState<'none' | 'loading' | 'ready' | 'error'>('none');
  const [emscriptenModule, setEmscriptenModule] = useState<any>(null);
  const [javaStatus, setJavaStatus] = useState<'none' | 'loading' | 'ready' | 'error'>('none');
  const [javaModule, setJavaModule] = useState<any>(null);
  const [goStatus, setGoStatus] = useState<'none' | 'loading' | 'ready' | 'error'>('none');
  const [goModule, setGoModule] = useState<any>(null);
  const [jsStatus, setJsStatus] = useState<'none' | 'loading' | 'ready' | 'error'>('none');
  const [jsModule, setJsModule] = useState<any>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'python', name: 'Python', ext: '.py', monaco: 'python', version: 'Pyodide 3.11 + ML Libraries', logo: 'python' },
    { id: 'cpp', name: 'C++', ext: '.cpp', monaco: 'cpp', version: 'Emscripten C++23 + STL', logo: 'cpp' },
    { id: 'java', name: 'Java', ext: '.java', monaco: 'java', version: 'Java 21 LTS WebAssembly JVM', logo: 'java' },
    { id: 'go', name: 'Go', ext: '.go', monaco: 'go', version: 'Go 1.22 WebAssembly (Full)', logo: 'go' },
    { id: 'javascript', name: 'JS', ext: '.js', monaco: 'javascript', version: 'ES2023 + V8 Engine', logo: 'javascript' }
  ];

  const editorThemes = [
    { id: 'neon-dark', name: 'Neon Dark', icon: 'neon', isDefault: true, color: '#22d3ee' },
    { id: 'synthwave-84', name: 'SynthWave \'84', icon: 'synthwave', color: '#ff79c6' },
    { id: 'monokai-pro', name: 'Monokai Pro', icon: 'monokai', color: '#a6e22e' },
    { id: 'one-dark-pro', name: 'One Dark Pro', icon: 'onedark', color: '#61afef' },
    { id: 'night-owl', name: 'Night Owl', icon: 'nightowl', color: '#c792ea' }
  ];

  const getThemeIcon = (iconType: string, color: string, className = "w-5 h-5") => {
    const iconProps = {
      className: `${className} stroke-current`,
      strokeWidth: 1.5,
      fill: 'none',
      viewBox: "0 0 24 24",
      style: { color }
    };

    switch (iconType) {
      case 'neon':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
            <path d="M20.2 20.2l-4.2-4.2m0-7.6l4.2-4.2M3.8 20.2l4.2-4.2m0-7.6L3.8 3.8" />
          </svg>
        );
      case 'synthwave':
        return (
          <svg {...iconProps}>
            <path d="M2 12h20M2 6h20M2 18h20" />
            <path d="M8 3v18M16 3v18" />
            <circle cx="12" cy="8" r="2" />
            <circle cx="12" cy="16" r="2" />
          </svg>
        );
      case 'monokai':
        return (
          <svg {...iconProps}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6v6H9z" />
            <path d="M9 9L3 3M15 9l6-6M9 15l-6 6M15 15l6 6" />
          </svg>
        );
      case 'onedark':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case 'nightowl':
        return (
          <svg {...iconProps}>
            <path d="M12 2C8.5 2 5.7 4.5 5.2 8c-.1.4-.2.8-.2 1.2 0 4.4 3.6 8 8 8s8-3.6 8-8c0-.4-.1-.8-.2-1.2C20.3 4.5 17.5 2 14 2h-2z" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="15" cy="9" r="1" />
            <path d="M8 13c0 2 1.8 3 4 3s4-1 4-3" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  // Get the correct Monaco language ID
  const getMonacoLanguage = (langId: string): string => {
    const languageMap: { [key: string]: string } = {
      'python': 'python',
      'cpp': 'cpp',
      'java': 'java', 
      'go': 'go',
      'javascript': 'javascript'
    };
    return languageMap[langId] || 'javascript';
  };

  // Setup custom Monaco themes
  const setupMonacoThemes = (monaco: any) => {
    // Neon Dark Theme
    monaco.editor.defineTheme('neon-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '22d3ee', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fb923c' },
        { token: 'type', foreground: 'a855f7' },
        { token: 'function', foreground: 'f472b6' },
        { token: 'variable', foreground: 'facc15' }
      ],
      colors: {
        'editor.background': '#0f0f23',
        'editor.foreground': '#22d3ee',
        'editorLineNumber.foreground': '#22d3ee40',
        'editorCursor.foreground': '#22d3ee',
        'editor.selectionBackground': '#22d3ee20'
      }
    });

    // SynthWave '84 Theme
    monaco.editor.defineTheme('synthwave-84', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: 'ff7edb', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'type', foreground: '8be9fd' },
        { token: 'function', foreground: '50fa7b' },
        { token: 'variable', foreground: 'f8f8f2' }
      ],
      colors: {
        'editor.background': '#2a2139',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#6272a4',
        'editorCursor.foreground': '#f8f8f2',
        'editor.selectionBackground': '#44475a'
      }
    });

    // Monokai Pro Theme
    monaco.editor.defineTheme('monokai-pro', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'type', foreground: '66d9ef' },
        { token: 'function', foreground: 'a6e22e' },
        { token: 'variable', foreground: 'f8f8f2' }
      ],
      colors: {
        'editor.background': '#2d2a2e',
        'editor.foreground': '#fcfcfa',
        'editorLineNumber.foreground': '#5c5855',
        'editorCursor.foreground': '#fcfcfa',
        'editor.selectionBackground': '#49483e'
      }
    });

    // One Dark Pro Theme
    monaco.editor.defineTheme('one-dark-pro', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'type', foreground: 'e5c07b' },
        { token: 'function', foreground: '61afef' },
        { token: 'variable', foreground: 'abb2bf' }
      ],
      colors: {
        'editor.background': '#282c34',
        'editor.foreground': '#abb2bf',
        'editorLineNumber.foreground': '#495162',
        'editorCursor.foreground': '#528bff',
        'editor.selectionBackground': '#3e4451'
      }
    });

    // Night Owl Theme
    monaco.editor.defineTheme('night-owl', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '637777', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
        { token: 'string', foreground: 'ecc48d' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'type', foreground: 'addb67' },
        { token: 'function', foreground: '82aaff' },
        { token: 'variable', foreground: 'd6deeb' }
      ],
      colors: {
        'editor.background': '#011627',
        'editor.foreground': '#d6deeb',
        'editorLineNumber.foreground': '#4b6479',
        'editorCursor.foreground': '#80a4c2',
        'editor.selectionBackground': '#1d3b53'
      }
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageDropdown || showThemeDropdown) {
        setShowLanguageDropdown(false);
        setShowThemeDropdown(false);
      }
    };

    if (showLanguageDropdown || showThemeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showLanguageDropdown, showThemeDropdown]);

  // Initialize language when selected
  useEffect(() => {
    if (languageStatuses[activeTab] === 'none') {
      initializeLanguage(activeTab);
    }
  }, [activeTab]);

  const initializeLanguage = async (langId: string) => {
    setLanguageStatuses(prev => ({ ...prev, [langId]: 'loading' }));
    setActiveConsoleTab('output');
    
    const initMessages: {[key: string]: string} = {
      python: '🐍 Initializing Python WebAssembly environment...\n📦 Loading Pyodide runtime\n📚 Installing packages: numpy, pandas, scikit-learn\n⚡ Setting up interpreter',
      cpp: '⚡ Initializing C++23 Emscripten compiler...\n🔧 Loading LLVM/Clang toolchain\n📚 Loading C++ standard library\n🌐 Setting up WebAssembly backend',
      java: '☕ Initializing Java WebAssembly JVM...\n🔧 Loading class loader and runtime\n📚 Loading Java standard library\n⚙️ Setting up WebAssembly JVM',
      go: '🐹 Initializing Go WebAssembly compiler...\n📦 Loading Go runtime (wasm_exec.js)\n🔧 Setting up Go 1.22 compiler\n⚡ Configuring syscall/js bridge',
      javascript: '🟨 Initializing JavaScript engine...\n⚡ Loading V8 runtime features\n🚀 Enabling ES2023+ syntax\n✨ Setting up modern JS environment'
    };

    setOutput(initMessages[langId] || 'Initializing language environment...');
    setTerminalOutput(''); // Clear terminal when switching languages
    
    // Simulate initialization time
    const initTime = langId === 'python' ? 3000 : langId === 'cpp' ? 2500 : langId === 'java' ? 2200 : langId === 'go' ? 2000 : 1000;
    
    await new Promise(resolve => setTimeout(resolve, initTime));
    
    setLanguageStatuses(prev => ({ ...prev, [langId]: 'ready' }));
    
    const readyMessages: {[key: string]: string} = {
      python: '🎉 Python environment ready!\n\n📚 Available packages:\n• pandas - Data manipulation\n• numpy - Numerical computing\n• scikit-learn - Machine learning\n• matplotlib - Data visualization\n\n💡 Ready to execute Python code!',
      cpp: '🎉 C++23 compiler ready!\n\n🚀 Features available:\n• Full C++23 standard support\n• STL containers and algorithms\n• Ranges and views\n• Modern C++ features\n\n💡 Ready to compile and run C++ code!',
      java: '🎉 Java WebAssembly JVM ready!\n\n☕ Features available:\n• Full Java 21 standard library\n• Stream API and lambda expressions\n• Pattern matching\n• Modern Java features\n\n💡 Ready to execute Java code!',
      go: '🎉 Go WebAssembly ready!\n\n🐹 Features available:\n• Complete Go standard library\n• Goroutines and channels\n• Full concurrency support\n• All Go built-in types\n\n💡 Ready to execute Go code!',
      javascript: '🎉 JavaScript engine ready!\n\n🟨 Features available:\n• ES2023+ syntax support\n• DOM and Web APIs\n• Async/await and Promises\n• Modern JavaScript features\n\n💡 Ready to execute JavaScript code!'
    };
    
    setOutput(readyMessages[langId] || 'Language environment ready!');
  };

  // Simple run code function
  const runCode = async () => {
    setIsRunning(true);
    setActiveConsoleTab('terminal'); // Switch to terminal tab automatically
    
    try {
      // Simulate execution
      const langName = languages.find(l => l.id === activeTab)?.name || 'Code';
      setTerminalOutput(`🚀 Executing ${langName} code...\n\n`);
      
      // Simulate compilation/execution delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the actual file content
      const fileContent = currentFileContent;
      
      // Simulate more realistic output based on language and content
      const mockOutputs: { [key: string]: string } = {
        python: `Python 3.11.0 (WebAssembly build)\n[Running: ${currentFile.split('/').pop()}]\n\nHello, World!\nWelcome to Python programming!\nWhat's your name? [User Input: John]\nNice to meet you, John!\n\n✨ Execution completed\n• Runtime: Pyodide WebAssembly\n• Memory: 12.3 MB\n• Time: 0.34s`,
        cpp: `🔧 Compiling C++23...\n✅ Compilation successful\n[Running: ${currentFile.split('/').pop()}]\n\nHello, World!\nWelcome to C++ programming!\nWhat's your name? [User Input: John]\nNice to meet you, John!\n\n✨ Compilation stats\n• Compiler: Emscripten/Clang\n• Target: WebAssembly\n• Binary size: 23.4 KB\n• Compile time: 1.2s`,
        java: `☕ Compiling Java...\n✅ Compilation successful\n[Running: ${currentFile.split('/').pop()}]\n\nHello, World!\nWelcome to Java programming!\nWhat's your name? [User Input: John]\nNice to meet you, John!\n\n✨ Execution stats\n• Runtime: WebAssembly JVM\n• Heap size: 32 MB\n• Time: 0.45s`,
        go: `🐹 Building Go...\n✅ Build successful\n[Running: ${currentFile.split('/').pop()}]\n\nHello, World!\nWelcome to Go programming!\nWhat's your name? [User Input: John]\nNice to meet you, John!\n\n✨ Build stats\n• Compiler: Go 1.22 WASM\n• Binary size: 1.2 MB\n• Build time: 0.8s`,
        javascript: `🟨 Executing JavaScript...\n[Running: ${currentFile.split('/').pop()}]\n\nHello, World!\nWelcome to JavaScript programming!\nWhat's your name? [User Input: John]\nNice to meet you, John!\n\n✨ Execution stats\n• Runtime: V8 Engine\n• Memory: 3.2 MB\n• Time: 0.02s`
      };
      
      setTerminalOutput(mockOutputs[activeTab] || 'Code executed successfully!');
    } catch (error) {
      setTerminalOutput(`❌ Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const languageColor = getLanguageColor(activeTab);
  
  return (
    <div ref={containerRef} className={`bg-slate-950/95 backdrop-blur-md rounded-3xl h-full flex flex-col border-2 ${languageColor.border} ${languageColor.shadow} hover:shadow-[0_0_35px_rgba(${languageColor.rgb},0.4)] transition-all duration-300`} style={{ borderBottomWidth: '4px', borderBottomColor: `rgba(${languageColor.rgb}, 0.9)` }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50 flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          {/* Left Side - Language and Theme Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="w-[150px] h-10 px-4 py-2 bg-slate-950/80 border-2 rounded-3xl text-sm font-medium transition-colors flex items-center justify-between"
                style={{ 
                  boxShadow: `0 0 10px rgba(${languageColor.rgb}, 0.3)`,
                  color: `rgb(${languageColor.rgb})`,
                  borderColor: `rgba(${languageColor.rgb}, 0.5)`
                }}
              >
                <div className="flex items-center gap-2">
                  {getLanguageIcon(activeTab)}
                  <span>{languages.find(l => l.id === activeTab)?.name}</span>
                  {languageStatuses[activeTab] === 'loading' && (
                    <span className="animate-spin text-xs">⚡</span>
                  )}
                  {languageStatuses[activeTab] === 'ready' && (
                    <span className="text-green-400 text-xs">✓</span>
                  )}
                  {languageStatuses[activeTab] === 'error' && (
                    <span className="text-red-400 text-xs">✗</span>
                  )}
                </div>
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-3xl shadow-xl z-10 overflow-hidden">
                  {languages.map((lang) => {
                    const langColor = getLanguageColor(lang.id);
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setActiveTab(lang.id);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 text-sm border-2 ${
                          activeTab === lang.id 
                            ? 'bg-slate-900/40' 
                            : 'border-transparent text-gray-300 hover:text-gray-100'
                        }`}
                        style={activeTab === lang.id ? {
                          borderColor: `rgba(${langColor.rgb}, 0.8)`,
                          color: `rgb(${langColor.rgb})`,
                          backgroundColor: `rgba(${langColor.rgb}, 0.1)`
                        } : {}}
                      >
                        {getLanguageIcon(lang.id)}
                        <span>{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="w-[182px] h-10 px-4 py-2 bg-slate-950/80 border-2 border-purple-400/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 rounded-3xl text-sm font-medium transition-colors flex items-center justify-between shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              >
                <div className="flex items-center gap-2">
                  {getThemeIcon(
                    editorThemes.find(t => t.id === editorTheme)?.icon || 'neon',
                    editorThemes.find(t => t.id === editorTheme)?.color || '#22d3ee'
                  )}
                  <span className="truncate">{editorThemes.find(t => t.id === editorTheme)?.name}</span>
                </div>
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {showThemeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-3xl shadow-xl z-10 overflow-hidden">
                  {editorThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setEditorTheme(theme.id);
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 text-sm border-2 ${
                        editorTheme === theme.id 
                          ? 'bg-purple-900/20 border-purple-400 text-purple-400' 
                          : 'border-transparent text-gray-300 hover:border-purple-400/50 hover:text-purple-300'
                      }`}
                    >
                      {getThemeIcon(theme.icon, theme.color)}
                      <span>{theme.name}</span>
                      {theme.isDefault && <span className="text-xs text-gray-400 ml-auto">(Default)</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Center Title */}
          <div className="flex-1 flex justify-center">
                            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Moirai One, serif', color: `rgb(${languageColor.rgb})` }}>Playground</h2>
          </div>
          
          {/* Right Side - Controls */}
          <div className="flex items-center gap-3">
            {/* Run Button */}
            <button
              onClick={runCode}
              disabled={isRunning || languageStatuses[activeTab] !== 'ready'}
              className="w-[100px] h-10 px-4 py-2 bg-slate-950/80 border-2 border-emerald-400/50 hover:border-emerald-400 disabled:border-gray-600 text-emerald-400 hover:text-emerald-300 disabled:text-gray-500 rounded-3xl text-sm font-medium transition-colors shadow-[0_0_10px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2"
            >
              {languageStatuses[activeTab] === 'ready' && !isRunning && (
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25l13.5 7.5-13.5 7.5V5.25z" />
                </svg>
              )}
              {isRunning && (
                <svg className="w-4 h-4 stroke-current animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              )}
              {(languageStatuses[activeTab] === 'loading' || languageStatuses[activeTab] === 'none') && (
                <svg className="w-4 h-4 stroke-current animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              )}
              <span>
                {isRunning ? 'Running...' : 
                 languageStatuses[activeTab] === 'loading' ? 'Loading...' :
                 languageStatuses[activeTab] === 'ready' ? 'Run' : 'Loading...'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Code Editor + File Explorer */}
      <div className="flex-1 min-h-0 flex">
        {/* Code Editor */}
        <div className="flex-1 min-h-0">
          <ClientOnlyEditor
            key={`${currentFile}-${activeTab}`}
            language={getMonacoLanguage(activeTab)}
            value={currentFileContent}
            onChange={handleEditorChange}
            theme={editorTheme}
            onMount={(editor: any, monaco: any) => {
              setupMonacoThemes(monaco);
              // Ensure the theme is set after custom themes are defined
              monaco.editor.setTheme(editorTheme);
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              lineHeight: 1.6,
              letterSpacing: 0.5,
              smoothScrolling: true,
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: 'on',
              renderWhitespace: 'selection',
              renderControlCharacters: false,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
              }
            }}
          />
        </div>

        {/* File Explorer */}
        <>
          {/* Vertical Resize Handle */}
          <div className="w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize transition-colors" />
          
          {/* File Explorer Panel */}
                      <div className="w-56 bg-slate-950/95 border-l border-slate-800/50 overflow-hidden flex flex-col">
            {/* File Explorer Header */}
            <div className="p-3 border-b border-slate-800/50 bg-slate-900/90">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  Explorer
                </h3>
                <button
                  onClick={deleteSelectedFiles}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    selectedFiles.size > 0 
                      ? 'bg-red-500 text-white hover:bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)] hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                  }`}
                  title={selectedFiles.size > 0 ? `Delete ${selectedFiles.size} selected item${selectedFiles.size > 1 ? 's' : ''}` : 'Select files to delete'}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
              
              {/* Current Directory */}
              <div className="mt-2 text-xs text-gray-400 font-mono">
                {currentDirectory}
              </div>
            </div>
            
            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              <FileTreeNode 
                node={fileSystem} 
                path="/workspace"
                expandedFolders={expandedFolders}
                onToggleFolder={(path) => {
                  setExpandedFolders(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(path)) {
                      newSet.delete(path);
                    } else {
                      newSet.add(path);
                    }
                    return newSet;
                  });
                }}
                onSelectFile={handleFileSelect}
                currentFile={currentFile}
                selectedFiles={selectedFiles}
                onToggleSelection={(path) => {
                  setSelectedFiles(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(path)) {
                      newSet.delete(path);
                    } else {
                      newSet.add(path);
                    }
                    return newSet;
                  });
                }}
              />
            </div>
            
            {/* File Explorer Actions */}
            <div className="p-3 border-t border-slate-800/50 bg-slate-900/90">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    const name = prompt('Enter file name:');
                    if (name) {
                      const currentDirPath = currentDirectory === '/workspace' ? '' : currentDirectory.replace('/workspace', '');
                      createFile(currentDirPath, name);
                    }
                  }}
                  className="w-24 px-3 py-2 bg-cyan-900/20 border border-cyan-400/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 transition-colors text-xs font-medium flex items-center justify-center gap-2 rounded-3xl"
                  title="New File"
                >
                  <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-6m-3 3h6" />
                  </svg>
                  File
                </button>
                <button
                  onClick={() => {
                    const name = prompt('Enter folder name:');
                    if (name) {
                      const currentDirPath = currentDirectory === '/workspace' ? '' : currentDirectory.replace('/workspace', '');
                      createFolder(currentDirPath, name);
                    }
                  }}
                  className="w-24 px-3 py-2 bg-purple-900/20 border border-purple-400/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 transition-colors text-xs font-medium flex items-center justify-center gap-2 rounded-3xl"
                  title="New Folder"
                >
                  <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9" />
                  </svg>
                  Folder
                </button>
              </div>
            </div>
          </div>
        </>
      </div>

      {/* Resize Handle */}
      <div
        className="h-1 bg-gray-600 hover:bg-gray-500 cursor-row-resize transition-colors flex-shrink-0"
        title="Drag to resize console"
      />

      {/* Console Output */}
      <div className="border-t border-slate-800/50 flex-shrink-0" style={{ height: `${consoleHeight}%`, minHeight: '200px' }}>
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
                      <div className="flex gap-1">
            <button
              onClick={() => setActiveConsoleTab('terminal')}
                className={`px-3 py-1 rounded-2xl text-xs font-normal transition-colors border-2 ${
                activeConsoleTab === 'terminal'
                    ? 'bg-green-900/20 border-green-400 text-green-400'
                    : 'bg-slate-950/80 border-slate-600/50 text-gray-300 hover:border-green-400/50 hover:text-green-300'
              }`}
            >
                Terminal
            </button>
            <button
              onClick={() => setActiveConsoleTab('output')}
                className={`px-3 py-1 rounded-2xl text-xs font-normal transition-colors border-2 ${
                activeConsoleTab === 'output'
                    ? 'bg-blue-900/20 border-blue-400 text-blue-400'
                    : 'bg-slate-950/80 border-slate-600/50 text-gray-300 hover:border-blue-400/50 hover:text-blue-300'
              }`}
            >
                Output
            </button>
          </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-yellow-400">
              {languageStatuses[activeTab] === 'loading' ? (
                `${languages.find(l => l.id === activeTab)?.name} Loading...`
              ) : languageStatuses[activeTab] === 'ready' ? (
                `${languages.find(l => l.id === activeTab)?.version} Ready`
              ) : languageStatuses[activeTab] === 'error' ? (
                `${languages.find(l => l.id === activeTab)?.name} Error`
              ) : (
                `${languages.find(l => l.id === activeTab)?.name} Initializing...`
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Height: {consoleHeight}%</span>
            <button
              onClick={() => {
                setTerminalOutput('');
                setTerminalHistory([]);
              }}
              className="px-3 py-1 bg-slate-950/80 border-2 border-red-400/50 hover:border-red-400 text-red-400 hover:text-red-300 rounded-3xl text-xs font-medium transition-colors shadow-[0_0_10px_rgba(248,113,113,0.3)]"
            >
              Clear Terminal
            </button>
          </div>
        </div>
        <div className={`p-4 text-sm overflow-y-auto font-normal ${
          activeConsoleTab === 'output' 
            ? 'bg-slate-900 text-blue-400' 
            : 'bg-black text-green-400'
        }`} style={{ 
          height: 'calc(100% - 40px)',
          fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
          fontWeight: 'normal'
        }}>
          {activeConsoleTab === 'output' ? (
            output ? (
              <div className="whitespace-pre-wrap text-blue-300">{output}</div>
            ) : (
              <div className="text-blue-500/70">
                Select a language to initialize the environment, then click "Run" to execute code.
              </div>
            )
                    ) : (
            <div className="h-full flex flex-col">
              {/* Terminal Output */}
              <div className="flex-1 overflow-y-auto">
                {/* Welcome message when no output */}
                {!terminalOutput && terminalHistory.length === 0 && (
                  <div className="text-gray-500 font-mono text-sm leading-relaxed mb-4">
                    <div>Welcome to the Algo Visualizer Terminal! 🚀</div>
                    <div>Type "help" for available commands.</div>
                  </div>
                )}
                
                {/* Program execution output */}
                {terminalOutput && (
                  <div className="whitespace-pre-wrap text-white font-mono text-sm leading-relaxed mb-4">
                    {terminalOutput}
                  </div>
                )}
                
                {/* Command history */}
                {terminalHistory.map((line, index) => (
                  <div key={index} className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${
                    line.startsWith('$ ') ? 'text-green-400' : 'text-white'
                  }`}>
                    {line}
                  </div>
                ))}
              </div>
              
              {/* Terminal Input */}
              <form onSubmit={handleTerminalSubmit} className="flex items-center mt-2">
                <span className="text-purple-400 font-mono text-sm mr-2">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-white font-mono text-sm outline-none border-none"
                  placeholder="Type a command..."
                  style={{ color: 'white' }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
