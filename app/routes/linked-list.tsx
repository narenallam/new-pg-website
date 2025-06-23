import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Search,
  Home,
  Settings
} from "lucide-react";
import { Link } from "react-router";

// Types
interface ListNode {
  id: string;
  value: number;
  next: string | null;
}

interface AnimationStep {
  type: 'insert' | 'delete' | 'search' | 'traverse';
  description: string;
  highlightNodeId?: string;
  highlightConnection?: string;
  newNode?: ListNode;
  deletedNodeId?: string;
  currentNodeId?: string;
}

// Animation speeds
const SPEEDS = {
  slow: 1500,
  normal: 800,
  fast: 400,
} as const;

export default function LinkedListVisualization() {
  // State management
  const [nodes, setNodes] = useState<Record<string, ListNode>>({});
  const [head, setHead] = useState<string | null>(null);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [insertPosition, setInsertPosition] = useState<'head' | 'tail' | 'position'>('tail');
  const [insertIndex, setInsertIndex] = useState(0);

  const intervalRef = useRef<number | null>(null);

  // Helper functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getNodeList = useCallback((): ListNode[] => {
    if (!head) return [];
    
    const result: ListNode[] = [];
    let currentId: string | null = head;
    const visited = new Set<string>();
    
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const node: ListNode | undefined = nodes[currentId];
      if (node) {
        result.push(node);
        currentId = node.next;
      } else {
        break;
      }
    }
    
    return result;
  }, [nodes, head]);

  // Animation control functions
  const playAnimation = useCallback(() => {
    if (currentStepIndex >= animationSteps.length - 1) return;
    
    setIsPlaying(true);
    intervalRef.current = window.setInterval(() => {
      setCurrentStepIndex(prev => {
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
    }, SPEEDS[speed]);
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
      setCurrentStepIndex(prev => prev - 1);
      setHighlightedNodeId(null);
    }
  }, [currentStepIndex]);

  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentStepIndex(-1);
    setHighlightedNodeId(null);
    setAnimationSteps([]);
  }, [pauseAnimation]);

  // CRUD Operations
  const insertNode = useCallback((value: number, position: 'head' | 'tail' | 'position', index?: number) => {
    const newNode: ListNode = {
      id: generateId(),
      value,
      next: null,
    };

    const steps: AnimationStep[] = [];
    
    if (!head) {
      // Insert into empty list
      setNodes({ [newNode.id]: newNode });
      setHead(newNode.id);
      steps.push({
        type: 'insert',
        description: `Inserted ${value} as the first node`,
        newNode,
        highlightNodeId: newNode.id,
      });
    } else if (position === 'head') {
      // Insert at head
      const updatedNode = { ...newNode, next: head };
      setNodes(prev => ({ ...prev, [newNode.id]: updatedNode }));
      setHead(newNode.id);
      steps.push({
        type: 'insert',
        description: `Inserted ${value} at the head`,
        newNode: updatedNode,
        highlightNodeId: newNode.id,
      });
    } else if (position === 'tail') {
      // Insert at tail
      const nodeList = getNodeList();
      const lastNode = nodeList[nodeList.length - 1];
      
      if (lastNode) {
        setNodes(prev => ({
          ...prev,
          [newNode.id]: newNode,
          [lastNode.id]: { ...lastNode, next: newNode.id },
        }));
        
        steps.push({
          type: 'insert',
          description: `Inserted ${value} at the tail`,
          newNode,
          highlightNodeId: newNode.id,
        });
      }
    } else if (position === 'position' && typeof index === 'number') {
      // Insert at specific position
      const nodeList = getNodeList();
      
      if (index === 0) {
        const updatedNode = { ...newNode, next: head };
        setNodes(prev => ({ ...prev, [newNode.id]: updatedNode }));
        setHead(newNode.id);
      } else if (index >= nodeList.length) {
        // Insert at end
        const lastNode = nodeList[nodeList.length - 1];
        setNodes(prev => ({
          ...prev,
          [newNode.id]: newNode,
          [lastNode.id]: { ...lastNode, next: newNode.id },
        }));
      } else {
        // Insert in middle
        const prevNode = nodeList[index - 1];
        const updatedNewNode = { ...newNode, next: prevNode.next };
        const updatedPrevNode = { ...prevNode, next: newNode.id };
        
        setNodes(prev => ({
          ...prev,
          [newNode.id]: updatedNewNode,
          [prevNode.id]: updatedPrevNode,
        }));
      }
      
      steps.push({
        type: 'insert',
        description: `Inserted ${value} at position ${index}`,
        newNode,
        highlightNodeId: newNode.id,
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    // Add console output
    if (!head) {
      setConsoleOutput(prev => [...prev, `Insert: ${value} → added as first node`]);
    } else if (position === 'head') {
      setConsoleOutput(prev => [...prev, `Insert: ${value} → added at head`]);
    } else if (position === 'tail') {
      setConsoleOutput(prev => [...prev, `Insert: ${value} → added at tail`]);
    } else if (position === 'position' && typeof index === 'number') {
      setConsoleOutput(prev => [...prev, `Insert: ${value} → added at position ${index}`]);
    }
  }, [head, getNodeList]);

  const deleteNode = useCallback((value: number) => {
    const nodeList = getNodeList();
    const nodeIndex = nodeList.findIndex(node => node.value === value);
    
    if (nodeIndex === -1) {
      alert(`Value ${value} not found in the list`);
      return;
    }
    
    const nodeToDelete = nodeList[nodeIndex];
    const steps: AnimationStep[] = [];
    
    steps.push({
      type: 'search',
      description: `Searching for node with value ${value}`,
      highlightNodeId: nodeToDelete.id,
    });

    if (nodeIndex === 0) {
      // Delete head
      const newHead = nodeToDelete.next;
      setHead(newHead);
      setNodes(prev => {
        const updated = { ...prev };
        delete updated[nodeToDelete.id];
        return updated;
      });
    } else {
      // Delete middle or tail
      const prevNode = nodeList[nodeIndex - 1];
      const updatedPrevNode = { ...prevNode, next: nodeToDelete.next };
      
      setNodes(prev => {
        const updated = { ...prev };
        updated[prevNode.id] = updatedPrevNode;
        delete updated[nodeToDelete.id];
        return updated;
      });
    }

    steps.push({
      type: 'delete',
      description: `Deleted node with value ${value}`,
      deletedNodeId: nodeToDelete.id,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    setConsoleOutput(prev => [...prev, `Delete: ${value} → removed from list`]);
  }, [getNodeList]);

  const searchNode = useCallback((value: number) => {
    const nodeList = getNodeList();
    const steps: AnimationStep[] = [];
    
    let found = false;
    
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      steps.push({
        type: 'search',
        description: `Checking node at position ${i} (value: ${node.value})`,
        highlightNodeId: node.id,
        currentNodeId: node.id,
      });
      
      if (node.value === value) {
        steps.push({
          type: 'search',
          description: `Found! Node with value ${value} is at position ${i}`,
          highlightNodeId: node.id,
        });
        found = true;
        break;
      }
    }
    
    if (!found) {
      steps.push({
        type: 'search',
        description: `Value ${value} not found in the list`,
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    if (found) {
      setConsoleOutput(prev => [...prev, `Search: ${value} → found in list`]);
    } else {
      setConsoleOutput(prev => [...prev, `Search: ${value} → not found`]);
    }
  }, [getNodeList]);

  const traverseList = useCallback(() => {
    const nodeList = getNodeList();
    const steps: AnimationStep[] = [];
    
    nodeList.forEach((node, index) => {
      steps.push({
        type: 'traverse',
        description: `Visiting node at position ${index} (value: ${node.value})`,
        highlightNodeId: node.id,
        currentNodeId: node.id,
      });
    });
    
    steps.push({
      type: 'traverse',
      description: 'Traversal complete',
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    const values = nodeList.map(node => node.value).join(' → ');
    setConsoleOutput(prev => [...prev, `Traverse: ${values}`]);
  }, [getNodeList]);

  // Event handlers
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    
    if (insertPosition === 'position') {
      insertNode(value, 'position', insertIndex);
    } else {
      insertNode(value, insertPosition);
    }
    
    setInputValue('');
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    deleteNode(value);
    setInputValue('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
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
    setConsoleOutput(prev => [...prev, 'List cleared']);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const createSampleList = () => {
    resetAnimation();
    
    const sampleValues = [10, 20, 30, 40];
    const sampleNodes: Record<string, ListNode> = {};
    let currentHead: string | null = null;
    
    sampleValues.forEach((value, index) => {
      const id = generateId();
      const node: ListNode = {
        id,
        value,
        next: null,
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
    setConsoleOutput(prev => [...prev, `Sample list created with values: ${sampleValues.join(', ')}`]);
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

  const nodeList = getNodeList();
  const currentStep = animationSteps[currentStepIndex];

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
                Linked List Visualization
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

              {/* Insert Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Insert Node
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="insertPosition"
                        value="head"
                        checked={insertPosition === 'head'}
                        onChange={(e) => setInsertPosition(e.target.value as 'head')}
                      />
                      At Head
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="insertPosition"
                        value="tail"
                        checked={insertPosition === 'tail'}
                        onChange={(e) => setInsertPosition(e.target.value as 'tail')}
                      />
                      At Tail
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="insertPosition"
                        value="position"
                        checked={insertPosition === 'position'}
                        onChange={(e) => setInsertPosition(e.target.value as 'position')}
                      />
                      At Position
                      {insertPosition === 'position' && (
                        <input
                          type="number"
                          value={insertIndex}
                          onChange={(e) => setInsertIndex(parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      )}
                    </label>
                  </div>
                  
                  <button
                    onClick={handleInsert}
                    disabled={!inputValue || isPlaying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                    Insert
                  </button>
                </div>
              </div>

              {/* Delete Operation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Delete Node
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value to delete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleDelete}
                    disabled={!inputValue || isPlaying || nodeList.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Search Operation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search Node
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter value to search"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!searchValue || isPlaying || nodeList.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>

              {/* Utility Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Utilities
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleTraverse}
                    disabled={isPlaying || nodeList.length === 0}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Traverse List
                  </button>
                  <button
                    onClick={createSampleList}
                    disabled={isPlaying}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Sample List
                  </button>
                  <button
                    onClick={clearList}
                    disabled={isPlaying}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Linked List Structure
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {nodeList.length === 0 
                    ? "Empty list - add some nodes to get started!" 
                    : `List contains ${nodeList.length} node${nodeList.length === 1 ? '' : 's'}`
                  }
                </p>
              </div>

              {/* SVG Visualization */}
              <div className="overflow-x-auto">
                <svg
                  width={Math.max(800, nodeList.length * 180 + 100)}
                  height="200"
                  className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="8"
                      markerHeight="7"
                      refX="7"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 7 3.5, 0 7"
                        className="fill-indigo-700 dark:fill-indigo-400"
                      />
                    </marker>
                  </defs>

                  <AnimatePresence>
                    {nodeList.map((node, index) => {
                      const x = 120 + index * 160;
                      const y = 120;
                      const nodeWidth = 100;
                      const nodeHeight = 50;
                      const isHighlighted = highlightedNodeId === node.id;
                      
                      return (
                        <motion.g
                          key={node.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Node Rectangle - Data Part (Left) */}
                          <motion.rect
                            x={x - nodeWidth/2}
                            y={y - nodeHeight/2}
                            width={nodeWidth * 0.6}
                            height={nodeHeight}
                            rx="4"
                            ry="4"
                            className={`stroke-2 ${
                              isHighlighted
                                ? 'fill-yellow-400 stroke-yellow-700 dark:fill-yellow-500 dark:stroke-yellow-600'
                                : 'fill-blue-500 stroke-blue-700 dark:fill-blue-600 dark:stroke-blue-700'
                            }`}
                            animate={{
                              scale: isHighlighted ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                          />
                          
                          {/* Node Rectangle - Pointer Part (Right) */}
                          <motion.rect
                            x={x - nodeWidth/2 + nodeWidth * 0.6}
                            y={y - nodeHeight/2}
                            width={nodeWidth * 0.4}
                            height={nodeHeight}
                            rx="4"
                            ry="4"
                            className={`stroke-2 ${
                              isHighlighted
                                ? 'fill-orange-400 stroke-orange-700 dark:fill-orange-500 dark:stroke-orange-600'
                                : 'fill-indigo-500 stroke-indigo-700 dark:fill-indigo-600 dark:stroke-indigo-700'
                            }`}
                            animate={{
                              scale: isHighlighted ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                          />
                          
                          {/* Divider line between data and pointer */}
                          <line
                            x1={x - nodeWidth/2 + nodeWidth * 0.6}
                            y1={y - nodeHeight/2}
                            x2={x - nodeWidth/2 + nodeWidth * 0.6}
                            y2={y + nodeHeight/2}
                            className="stroke-gray-600 dark:stroke-gray-400 stroke-2"
                          />
                          
                          {/* Node Value in Data section */}
                          <text
                            x={x - nodeWidth/2 + (nodeWidth * 0.6) / 2}
                            y={y + 6}
                            textAnchor="middle"
                            className="text-lg font-bold fill-white dark:fill-white"
                          >
                            {node.value}
                          </text>
                          
                          {/* Pointer content */}
                          {node.next ? (
                            // Arrow symbol for nodes with next pointer
                            <text
                              x={x - nodeWidth/2 + nodeWidth * 0.8}
                              y={y + 6}
                              textAnchor="middle"
                              className="text-lg font-bold fill-white dark:fill-white"
                            >
                              →
                            </text>
                          ) : (
                            // NULL text for last node
                            <text
                              x={x - nodeWidth/2 + nodeWidth * 0.8}
                              y={y + 6}
                              textAnchor="middle"
                              className="text-xs font-bold fill-white dark:fill-white"
                            >
                              NULL
                            </text>
                          )}
                          
                          {/* Node Index */}
                          <text
                            x={x}
                            y={y + 40}
                            textAnchor="middle"
                            className="text-xs font-semibold fill-gray-600 dark:fill-gray-300"
                          >
                            [{index}]
                          </text>
                          
                          {/* Arrow from pointer section to next node */}
                          {node.next && index < nodeList.length - 1 && (
                            <motion.line
                              x1={x + nodeWidth/2}
                              y1={y}
                              x2={x + 160 - nodeWidth/2}
                              y2={y}
                              className="stroke-indigo-700 dark:stroke-indigo-400 stroke-3"
                              markerEnd="url(#arrowhead)"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          )}
                        </motion.g>
                      );
                    })}
                  </AnimatePresence>

                  {/* HEAD pointer */}
                  {head && nodeList.length > 0 && (
                    <g>
                      <line
                        x1="120"
                        y1="50"
                        x2="120"
                        y2="90"
                        className="stroke-green-600 dark:stroke-green-400 stroke-3"
                        markerEnd="url(#arrowhead)"
                      />
                      <text
                        x="120"
                        y="40"
                        textAnchor="middle"
                        className="text-lg font-bold fill-green-600 dark:fill-green-400"
                      >
                        HEAD
                      </text>
                    </g>
                  )}

                  {/* Empty state */}
                  {nodeList.length === 0 && (
                    <text
                      x="400"
                      y="100"
                      textAnchor="middle"
                      className="text-lg fill-gray-400 dark:fill-gray-500"
                    >
                      Empty Linked List
                    </text>
                  )}
                </svg>
              </div>

              {/* List Info */}
              {nodeList.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    List Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Length:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {nodeList.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Head:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {nodeList[0]?.value ?? 'NULL'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Tail:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {nodeList[nodeList.length - 1]?.value ?? 'NULL'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Values:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {nodeList.map(n => n.value).join(' → ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
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
                      Console output will appear here when you perform operations...
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
                
                {currentStep && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Current Step:</strong> {currentStep.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 