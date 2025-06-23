import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Search, Trash2, Eye } from 'lucide-react';

interface TrieNode {
  id: string;
  char: string;
  isEndOfWord: boolean;
  children: Record<string, string>; // char -> nodeId
  parent?: string;
  x?: number;
  y?: number;
  level?: number;
}

interface AnimationStep {
  type: 'insert' | 'search' | 'startsWith' | 'delete';
  description: string;
  highlightNodeId?: string;
  highlightPath?: string[];
  currentChar?: string;
  found?: boolean;
  word?: string;
  output?: string;
}

const SPEEDS = {
  slow: 1500,
  normal: 1000,
  fast: 500,
};

export default function TrieVisualization() {
  const [nodes, setNodes] = useState<Record<string, TrieNode>>({});
  const [root, setRoot] = useState<string | null>(null);
  const [inputWord, setInputWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Initialize root node
  useEffect(() => {
    if (!root) {
      const rootId = generateId();
      const rootNode: TrieNode = {
        id: rootId,
        char: 'ROOT',
        isEndOfWord: false,
        children: {},
        x: 400, // Will be recalculated by calculatePositions
        y: 60,  // Will be recalculated by calculatePositions
        level: 0,
      };
      setNodes({ [rootId]: rootNode });
      setRoot(rootId);
    }
  }, [root]);

  // Calculate node positions
  const calculatePositions = useCallback((nodeMap: Record<string, TrieNode>) => {
    if (!root || !nodeMap[root]) return nodeMap;
    
    const updatedNodes = { ...nodeMap };
    const nodesByLevel: Record<number, string[]> = {};
    
    // Group nodes by level
    Object.values(updatedNodes).forEach(node => {
      const level = node.level || 0;
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(node.id);
    });
    
    // SVG dimensions and padding - optimize for vertical growth
    const maxNodesInAnyLevel = Object.values(nodesByLevel).reduce((max, nodes) => Math.max(max, nodes.length), 0);
    const minWidthRequired = maxNodesInAnyLevel * 60 + 200; // Reduced horizontal spacing
    const svgWidth = Math.max(800, minWidthRequired); // Reduced minimum width to encourage vertical growth
    const baseHeight = 600; // Increased base height for vertical expansion
    const nodeRadius = 20;
    const padding = 40; // Further reduced padding
    const levelHeight = 100; // Increased level height for more vertical expansion
    
    // Calculate maximum level count for dynamic spacing
    const levelCounts = Object.values(nodesByLevel).map(nodes => nodes.length);
    const maxNodesInLevel = levelCounts.length > 0 ? Math.max(...levelCounts) : 0;
    const levels = Object.keys(nodesByLevel).map(level => parseInt(level));
    const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;
    const dynamicHeight = Math.max(baseHeight, padding * 2 + (maxLevel + 1) * levelHeight + nodeRadius * 2);
    
    // Position nodes with simple and reliable algorithm
    Object.entries(nodesByLevel).forEach(([levelStr, nodeIds]) => {
      const level = parseInt(levelStr);
      const y = padding + nodeRadius + level * levelHeight;
      
      // Define safe boundaries
      const leftBound = padding + nodeRadius;
      const rightBound = svgWidth - padding - nodeRadius;
      const safeWidth = rightBound - leftBound;
      
      if (nodeIds.length === 1) {
        // Single node: center it
        const nodeId = nodeIds[0];
        if (updatedNodes[nodeId]) {
          updatedNodes[nodeId] = {
            ...updatedNodes[nodeId],
            x: svgWidth / 2,
            y,
          };
        }
      } else {
        // Multiple nodes: distribute evenly within safe boundaries
        nodeIds.forEach((nodeId, index) => {
          if (updatedNodes[nodeId]) {
            let x;
            
            if (nodeIds.length === 2) {
              // Two nodes: place at 1/4 and 3/4 of safe width
              x = leftBound + (index === 0 ? safeWidth * 0.25 : safeWidth * 0.75);
            } else {
              // Three or more nodes: evenly distribute
              const step = safeWidth / (nodeIds.length - 1);
              x = leftBound + (index * step);
            }
            
            // Force clamp to ensure no overflow
            x = Math.max(leftBound, Math.min(x, rightBound));
            
            updatedNodes[nodeId] = {
              ...updatedNodes[nodeId],
              x,
              y,
            };
          }
        });
      }
    });
    
    // Final safety check: ensure ALL nodes are within bounds
    const leftBound = padding + nodeRadius;
    const rightBound = svgWidth - padding - nodeRadius;
    const topBound = padding + nodeRadius;
    const bottomBound = dynamicHeight - padding - nodeRadius;
    
    Object.values(updatedNodes).forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        // Force clamp all coordinates
        node.x = Math.max(leftBound, Math.min(node.x, rightBound));
        node.y = Math.max(topBound, Math.min(node.y, bottomBound));
      }
    });
    
    // Update SVG dimensions based on content
    const finalHeight = Math.max(baseHeight, padding * 2 + (maxLevel + 1) * levelHeight + nodeRadius * 2);
    setSvgDimensions({ width: svgWidth, height: finalHeight });
    
    // Debug: Log positioning info and check for violations
    const positionViolations = Object.values(updatedNodes).filter(node => 
      node.x !== undefined && node.y !== undefined && (
        node.x < leftBound || node.x > rightBound || 
        node.y < topBound || node.y > bottomBound
      )
    );
    
    console.log('Trie positioning debug:', {
      maxNodesInAnyLevel,
      svgWidth,
      finalHeight,
      boundaries: { leftBound, rightBound, topBound, bottomBound },
      nodesByLevel: Object.fromEntries(Object.entries(nodesByLevel).map(([level, nodes]) => [level, nodes.length])),
      positionViolations: positionViolations.length,
      samplePositions: Object.values(updatedNodes).slice(0, 8).map(n => ({ char: n.char, x: n.x, y: n.y }))
    });
    
    return updatedNodes;
  }, [root, setSvgDimensions]);

  // Animation control functions
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
      setCurrentStepIndex(prev => {
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

  // Trie operations
  const insertWord = useCallback((word: string) => {
    if (!root || !word) return;
    
    const steps: AnimationStep[] = [];
    const updatedNodes = { ...nodes };
    let currentNodeId = root;
    const path: string[] = [root];
    
    steps.push({
      type: 'insert',
      description: `Inserting word "${word}"`,
      highlightNodeId: root,
    });
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      const currentNode = updatedNodes[currentNodeId];
      
      steps.push({
        type: 'insert',
        description: `Looking for character '${char}' in node '${currentNode.char}'`,
        highlightNodeId: currentNodeId,
        currentChar: char,
      });
      
      if (currentNode.children[char]) {
        // Character exists, move to child
        currentNodeId = currentNode.children[char];
        path.push(currentNodeId);
        
        steps.push({
          type: 'insert',
          description: `Character '${char}' found, moving to child node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path],
        });
      } else {
        // Character doesn't exist, create new node
        const newNodeId = generateId();
        const newNode: TrieNode = {
          id: newNodeId,
          char,
          isEndOfWord: false,
          children: {},
          parent: currentNodeId,
          level: (currentNode.level || 0) + 1,
          x: 0, // Will be calculated later
          y: 0, // Will be calculated later
        };
        
        updatedNodes[newNodeId] = newNode;
        updatedNodes[currentNodeId] = {
          ...currentNode,
          children: { ...currentNode.children, [char]: newNodeId },
        };
        
        currentNodeId = newNodeId;
        path.push(currentNodeId);
        
        steps.push({
          type: 'insert',
          description: `Character '${char}' not found, creating new node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path],
        });
      }
    }
    
    // Mark end of word
    updatedNodes[currentNodeId] = {
      ...updatedNodes[currentNodeId],
      isEndOfWord: true,
    };
    
    steps.push({
      type: 'insert',
      description: `Marking end of word "${word}"`,
      highlightNodeId: currentNodeId,
      highlightPath: [...path],
    });
    
    steps.push({
      type: 'insert',
      description: `Successfully inserted "${word}"`,
      output: `Word "${word}" inserted successfully`
    });
    
    // Calculate positions for the updated nodes
    const positionedNodes = calculatePositions(updatedNodes);
    
    setNodes(positionedNodes);
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setConsoleOutput(prev => [...prev, `INSERT: "${word}" - Added to trie`]);
  }, [root, nodes, calculatePositions]);

  const searchInTrie = useCallback((word: string) => {
    if (!root || !word) return;
    
    const steps: AnimationStep[] = [];
    let currentNodeId = root;
    const path: string[] = [root];
    let found = true;
    
    steps.push({
      type: 'search',
      description: `Searching for word "${word}"`,
      highlightNodeId: root,
    });
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      const currentNode = nodes[currentNodeId];
      
      steps.push({
        type: 'search',
        description: `Looking for character '${char}' in node '${currentNode.char}'`,
        highlightNodeId: currentNodeId,
        currentChar: char,
        highlightPath: [...path],
      });
      
      if (currentNode.children[char]) {
        currentNodeId = currentNode.children[char];
        path.push(currentNodeId);
        
        steps.push({
          type: 'search',
          description: `Character '${char}' found, moving to child node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path],
        });
      } else {
        found = false;
        steps.push({
          type: 'search',
          description: `Character '${char}' not found. Word "${word}" does not exist`,
          found: false,
        });
        break;
      }
    }
    
    if (found) {
      const finalNode = nodes[currentNodeId];
      if (finalNode.isEndOfWord) {
        steps.push({
          type: 'search',
          description: `Word "${word}" found!`,
          found: true,
          highlightNodeId: currentNodeId,
          highlightPath: [...path],
          output: `FOUND: "${word}" exists in trie`
        });
        setConsoleOutput(prev => [...prev, `SEARCH: "${word}" - FOUND`]);
      } else {
        steps.push({
          type: 'search',
          description: `Path exists but "${word}" is not a complete word`,
          found: false,
          highlightPath: [...path],
          output: `NOT FOUND: "${word}" is not a complete word`
        });
        setConsoleOutput(prev => [...prev, `SEARCH: "${word}" - NOT FOUND (incomplete word)`]);
      }
    } else {
      setConsoleOutput(prev => [...prev, `SEARCH: "${word}" - NOT FOUND`]);
    }
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [root, nodes]);

  const startsWithPrefix = useCallback((prefix: string) => {
    if (!root || !prefix) return;
    
    const steps: AnimationStep[] = [];
    let currentNodeId = root;
    const path: string[] = [root];
    let found = true;
    
    steps.push({
      type: 'startsWith',
      description: `Checking if any word starts with "${prefix}"`,
      highlightNodeId: root,
    });
    
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i].toLowerCase();
      const currentNode = nodes[currentNodeId];
      
      steps.push({
        type: 'startsWith',
        description: `Looking for character '${char}' in node '${currentNode.char}'`,
        highlightNodeId: currentNodeId,
        currentChar: char,
        highlightPath: [...path],
      });
      
      if (currentNode.children[char]) {
        currentNodeId = currentNode.children[char];
        path.push(currentNodeId);
        
        steps.push({
          type: 'startsWith',
          description: `Character '${char}' found, moving to child node`,
          highlightNodeId: currentNodeId,
          highlightPath: [...path],
        });
      } else {
        found = false;
        steps.push({
          type: 'startsWith',
          description: `Character '${char}' not found. No words start with "${prefix}"`,
          found: false,
        });
        break;
      }
    }
    
    if (found) {
      steps.push({
        type: 'startsWith',
        description: `Prefix "${prefix}" found! Words starting with "${prefix}" exist`,
        found: true,
        highlightNodeId: currentNodeId,
        highlightPath: [...path],
        output: `PREFIX FOUND: Words starting with "${prefix}" exist`
      });
      setConsoleOutput(prev => [...prev, `STARTS_WITH: "${prefix}" - PREFIX FOUND`]);
    } else {
      setConsoleOutput(prev => [...prev, `STARTS_WITH: "${prefix}" - PREFIX NOT FOUND`]);
    }
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [root, nodes]);

  // Event handlers
  const handleInsert = () => {
    if (!inputWord.trim()) {
      alert('Please enter a word to insert');
      return;
    }
    
    resetAnimation();
    insertWord(inputWord.trim());
    setInputWord('');
  };

  const handleSearch = () => {
    if (!searchWord.trim()) {
      alert('Please enter a word to search');
      return;
    }
    
    resetAnimation();
    searchInTrie(searchWord.trim());
  };

  const handleStartsWith = () => {
    if (!searchWord.trim()) {
      alert('Please enter a prefix to check');
      return;
    }
    
    resetAnimation();
    startsWithPrefix(searchWord.trim());
  };

  const clearTrie = () => {
    resetAnimation();
    const rootId = generateId();
    const rootNode: TrieNode = {
      id: rootId,
      char: 'ROOT',
      isEndOfWord: false,
      children: {},
      x: 400,
      y: 50,
      level: 0,
    };
    setNodes({ [rootId]: rootNode });
    setRoot(rootId);
    setConsoleOutput(prev => [...prev, 'CLEAR: Trie cleared']);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const createSampleTrie = () => {
    // Disabled for testing layout changes
    console.log('Create Sample Trie is currently disabled for testing');
    setConsoleOutput(prev => [...prev, 'SAMPLE: Create Sample Trie function is currently disabled']);
    return;
    
    /* DISABLED - Original code:
    resetAnimation();
    const words = ['bee', 'bear', 'bare', 'beer', 'apex', 'apron'];
    
    // Clear first
    const rootId = generateId();
    let updatedNodes: Record<string, TrieNode> = {
      [rootId]: {
        id: rootId,
        char: 'ROOT',
        isEndOfWord: false,
        children: {},
        x: 400,
        y: 50,
        level: 0,
      }
    };
    
    // Insert each word
    words.forEach(word => {
      let currentNodeId = rootId;
      
      for (let i = 0; i < word.length; i++) {
        const char = word[i].toLowerCase();
        const currentNode = updatedNodes[currentNodeId];
        
        if (currentNode.children[char]) {
          currentNodeId = currentNode.children[char];
        } else {
          const newNodeId = generateId();
          const newNode: TrieNode = {
            id: newNodeId,
            char,
            isEndOfWord: false,
            children: {},
            parent: currentNodeId,
            level: (currentNode.level || 0) + 1,
            x: 0, // Will be calculated later
            y: 0, // Will be calculated later
          };
          
          updatedNodes[newNodeId] = newNode;
          updatedNodes[currentNodeId] = {
            ...currentNode,
            children: { ...currentNode.children, [char]: newNodeId },
          };
          
          currentNodeId = newNodeId;
        }
      }
      
      // Mark end of word
      updatedNodes[currentNodeId] = {
        ...updatedNodes[currentNodeId],
        isEndOfWord: true,
      };
    });
    
    // Calculate positions for the sample nodes
    const positionedNodes = calculatePositions(updatedNodes);
    
    setNodes(positionedNodes);
    setRoot(rootId);
    setConsoleOutput(prev => [...prev, `SAMPLE: Created sample trie with words: ${words.join(', ')}`]);
    */
  };

  // Auto-pause effect when animation finishes
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPlaying]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentStep = animationSteps[currentStepIndex];
  const nodeList = Object.values(nodes).filter(node => node.x !== undefined && node.y !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trie (Prefix Tree) Visualization
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value as keyof typeof SPEEDS)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
              {/* Animation Controls */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Animation Controls
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={isPlaying ? pauseAnimation : playAnimation}
                    disabled={animationSteps.length === 0}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  
                  <button
                    onClick={stepBackward}
                    disabled={currentStepIndex <= -1}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack size={16} />
                  </button>
                  
                  <button
                    onClick={stepForward}
                    disabled={currentStepIndex >= animationSteps.length - 1}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward size={16} />
                  </button>
                  
                  <button
                    onClick={resetAnimation}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
                
                {currentStep && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Step {currentStepIndex + 1}/{animationSteps.length}: {currentStep.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Trie Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Insert Word
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value)}
                    placeholder="Enter word to insert"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleInsert}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Plus size={16} />
                    Insert
                  </button>
                </div>
              </div>

              {/* Search Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search Operations
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    placeholder="Enter word/prefix"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <Search size={16} />
                    Search Word
                  </button>
                  <button
                    onClick={handleStartsWith}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Eye size={16} />
                    Starts With
                  </button>
                </div>
              </div>

              {/* Utilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Utilities
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={createSampleTrie}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Sample Trie
                  </button>
                  <button
                    onClick={clearTrie}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                    Clear Trie
                  </button>
                </div>
              </div>

              {/* Trie Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Trie Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Total Nodes: {nodeList.length}</p>
                  <p>Word Endings: {nodeList.filter(n => n.isEndOfWord).length}</p>
                  <p>Max Depth: {Math.max(...nodeList.map(n => n.level || 0))}</p>
                </div>
                
                {/* Debug: Show all words in trie */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Words in Trie:
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                    {(() => {
                      const words: string[] = [];
                      
                      const findWords = (nodeId: string, currentWord: string) => {
                        const node = nodes[nodeId];
                        if (!node) return;
                        
                        if (node.isEndOfWord && currentWord) {
                          words.push(currentWord);
                        }
                        
                        Object.entries(node.children).forEach(([char, childId]) => {
                          findWords(childId, currentWord + char);
                        });
                      };
                      
                      if (root) {
                        findWords(root, '');
                      }
                      
                      return words.length > 0 ? (
                        words.map((word, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>"{word}"</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">No words found</div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Debug: Show tree structure */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tree Structure:
                  </h4>
                  <div className="text-xs font-mono text-gray-600 dark:text-gray-400 space-y-0 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    {(() => {
                      const lines: string[] = [];
                      
                      const printTree = (nodeId: string, prefix: string, isLast: boolean) => {
                        const node = nodes[nodeId];
                        if (!node) return;
                        
                        const connector = isLast ? '└─ ' : '├─ ';
                        const nodeLabel = node.char + (node.isEndOfWord ? ' (END)' : '');
                        lines.push(prefix + connector + nodeLabel);
                        
                        const children = Object.entries(node.children);
                        children.forEach(([char, childId], index) => {
                          const isLastChild = index === children.length - 1;
                          const childPrefix = prefix + (isLast ? '   ' : '│  ');
                          lines.push(childPrefix + '│');
                          lines.push(childPrefix + `├─[${char}]`);
                          printTree(childId, childPrefix + '│  ', isLastChild);
                        });
                      };
                      
                      if (root) {
                        printTree(root, '', true);
                      }
                      
                      return lines.length > 0 ? (
                        lines.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))
                      ) : (
                        <div>No structure found</div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Trie Visualization
              </h2>
              
              <div className="overflow-auto max-h-[700px] w-full">
                <svg 
                  width={svgDimensions.width} 
                  height={svgDimensions.height} 
                  viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                  style={{ minWidth: `${svgDimensions.width}px` }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="6"
                      markerHeight="4"
                      refX="5"
                      refY="2"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 5 2, 0 4"
                        className="fill-gray-600 dark:fill-gray-400"
                      />
                    </marker>
                  </defs>

                  {/* Edges */}
                  {nodeList.map(node => 
                    Object.entries(node.children).map(([char, childId]) => {
                      const childNode = nodes[childId];
                      if (!childNode || childNode.x === undefined || childNode.y === undefined) return null;
                      
                      const isHighlighted = highlightedPath.includes(node.id) && highlightedPath.includes(childId);
                      
                      return (
                        <g key={`${node.id}-${childId}`}>
                          <line
                            x1={node.x}
                            y1={node.y! + 6}
                            x2={childNode.x}
                            y2={childNode.y! - 6}
                            className={`stroke-2 ${
                              isHighlighted
                                ? 'stroke-yellow-500'
                                : 'stroke-gray-400 dark:stroke-gray-500'
                            }`}
                            markerEnd="url(#arrowhead)"
                          />
                          {/* Edge label */}
                          <text
                            x={(node.x! + childNode.x!) / 2}
                            y={(node.y! + childNode.y!) / 2 - 5}
                            textAnchor="middle"
                            className="text-xs fill-gray-600 dark:fill-gray-400 font-semibold"
                          >
                            {char}
                          </text>
                        </g>
                      );
                    })
                  )}

                  {/* Nodes */}
                  <AnimatePresence>
                    {nodeList.map(node => {
                      const isHighlighted = highlightedNodeId === node.id;
                      const isInPath = highlightedPath.includes(node.id);
                      const isRoot = node.char === 'ROOT';
                      
                      return (
                        <motion.g
                          key={node.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="20"
                            className={`stroke-2 ${
                              isHighlighted
                                ? 'fill-yellow-400 stroke-yellow-600'
                                : isInPath
                                ? 'fill-green-400 stroke-green-600'
                                : node.isEndOfWord
                                ? 'fill-red-400 stroke-red-600'
                                : isRoot
                                ? 'fill-gray-400 stroke-gray-600'
                                : 'fill-blue-400 stroke-blue-600'
                            }`}
                          />
                          <text
                            x={node.x}
                            y={node.y! + 4}
                            textAnchor="middle"
                            className="text-sm font-bold fill-white"
                          >
                            {isRoot ? 'R' : node.char.toUpperCase()}
                          </text>
                          {node.isEndOfWord && (
                            <circle
                              cx={node.x! + 15}
                              cy={node.y! - 15}
                              r="5"
                              className="fill-red-500 stroke-red-700 stroke-1"
                            />
                          )}
                        </motion.g>
                      );
                    })}
                  </AnimatePresence>
                </svg>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                <p>• <span className="inline-block w-4 h-4 bg-red-400 rounded-full mr-2"></span>Red nodes: End of word</p>
                <p>• <span className="inline-block w-4 h-4 bg-gray-400 rounded-full mr-2"></span>Gray node: Root</p>
                <p>• <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mr-2"></span>Blue nodes: Regular nodes</p>
                <p>• Red dot: Word ending marker</p>
              </div>
            </div>
            
            {/* Console Output */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Console Output
                </h2>
                <button
                  onClick={clearConsole}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto">
                {consoleOutput.length === 0 ? (
                  <div className="text-gray-500">
                    Console output will appear here when you run operations...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {consoleOutput.map((output, index) => (
                      <div key={index} className="whitespace-pre-wrap">
                        <span className="text-gray-400">[{index + 1}]</span> {output}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {currentStep && currentStep.output && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Current Step:</strong> {currentStep.output}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 