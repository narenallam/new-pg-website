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
interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  x?: number;
  y?: number;
}

interface AnimationStep {
  type: 'insert' | 'delete' | 'search' | 'traverse';
  description: string;
  highlightNodeId?: string;
  newNode?: TreeNode;
  deletedNodeId?: string;
  currentNodeId?: string;
  path?: string[];
  currentStack?: string[];
  currentQueue?: string[];
}

// Animation speeds
const SPEEDS = {
  slow: 1500,
  normal: 800,
  fast: 400,
} as const;

export default function BinarySearchTreeVisualization() {
  // State management
  const [nodes, setNodes] = useState<Record<string, TreeNode>>({});
  const [root, setRoot] = useState<string | null>(null);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const intervalRef = useRef<number | null>(null);

  // Helper functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Calculate node positions for tree layout
  const calculatePositions = useCallback((nodeId: string | null, x: number, y: number, horizontalSpacing: number): TreeNode[] => {
    if (!nodeId || !nodes[nodeId]) return [];
    
    const node = nodes[nodeId];
    const positionedNode: TreeNode = { ...node, x, y };
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

  const getTreeNodes = useCallback((): TreeNode[] => {
    if (!root) return [];
    return calculatePositions(root, 400, 120, 150);
  }, [root, calculatePositions]);

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

  // BST Operations
  const insertNode = useCallback((value: number) => {
    const newNode: TreeNode = {
      id: generateId(),
      value,
      left: null,
      right: null,
    };

    const steps: AnimationStep[] = [];
    
    if (!root) {
      // Insert into empty tree
      setNodes({ [newNode.id]: newNode });
      setRoot(newNode.id);
      steps.push({
        type: 'insert',
        description: `Inserted ${value} as root node`,
        newNode,
        highlightNodeId: newNode.id,
      });
    } else {
      // Find insertion position
      let currentId: string | null = root;
      let parentId: string | null = null;
      let isLeftChild = false;
      const path: string[] = [];
      
      while (currentId) {
        const currentNode: TreeNode | undefined = nodes[currentId];
        if (!currentNode) break;
        
        path.push(currentId);
        steps.push({
          type: 'insert',
          description: `Comparing ${value} with ${currentNode.value}`,
          highlightNodeId: currentId,
          path: [...path],
        });
        
        parentId = currentId;
        
        if (value < currentNode.value) {
          currentId = currentNode.left;
          isLeftChild = true;
          if (!currentId) {
            steps.push({
              type: 'insert',
              description: `${value} < ${currentNode.value}, inserting as left child`,
              highlightNodeId: parentId,
            });
          }
        } else if (value > currentNode.value) {
          currentId = currentNode.right;
          isLeftChild = false;
          if (!currentId) {
            steps.push({
              type: 'insert',
              description: `${value} > ${currentNode.value}, inserting as right child`,
              highlightNodeId: parentId,
            });
          }
        } else {
          // Value already exists
          steps.push({
            type: 'insert',
            description: `Value ${value} already exists in the tree`,
            highlightNodeId: currentId,
          });
          setAnimationSteps(steps);
          setCurrentStepIndex(-1);
          return;
        }
      }
      
      // Insert the new node
      if (parentId) {
        const parentNode = nodes[parentId];
        const updatedParent = {
          ...parentNode,
          [isLeftChild ? 'left' : 'right']: newNode.id,
        };
        
        setNodes(prev => ({
          ...prev,
          [newNode.id]: newNode,
          [parentId]: updatedParent,
        }));
        
        steps.push({
          type: 'insert',
          description: `Successfully inserted ${value}`,
          newNode,
          highlightNodeId: newNode.id,
        });
      }
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [root, nodes]);

  const searchNode = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    let currentId: string | null = root;
    let found = false;
    
    while (currentId) {
      const currentNode = nodes[currentId];
      if (!currentNode) break;
      
      steps.push({
        type: 'search',
        description: `Checking node with value ${currentNode.value}`,
        highlightNodeId: currentId,
      });
      
      if (value === currentNode.value) {
        steps.push({
          type: 'search',
          description: `Found! Value ${value} exists in the tree`,
          highlightNodeId: currentId,
        });
        found = true;
        break;
      } else if (value < currentNode.value) {
        steps.push({
          type: 'search',
          description: `${value} < ${currentNode.value}, searching left subtree`,
          highlightNodeId: currentId,
        });
        currentId = currentNode.left;
      } else {
        steps.push({
          type: 'search',
          description: `${value} > ${currentNode.value}, searching right subtree`,
          highlightNodeId: currentId,
        });
        currentId = currentNode.right;
      }
    }
    
    if (!found) {
      steps.push({
        type: 'search',
        description: `Value ${value} not found in the tree`,
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    return found;
  }, [root, nodes]);

  const traverseInOrder = useCallback((steps: AnimationStep[], visitedValues: number[]) => {
    if (!root) return;
    
    const stack: string[] = [];
    let currentId: string | null = root;
    
    steps.push({
      type: 'traverse',
      description: `🌳 Starting In-order traversal (Stack-based)`,
      currentStack: [...stack],
    });
    
    while (currentId || stack.length > 0) {
      // Go to leftmost node
      while (currentId) {
        stack.push(currentId);
        steps.push({
          type: 'traverse',
          description: `📚 Push ${nodes[currentId]?.value} to stack, go left`,
          highlightNodeId: currentId,
          currentStack: [...stack],
        });
        currentId = nodes[currentId]?.left || null;
      }
      
      // Current must be null here, so we backtrack
      if (stack.length > 0) {
        currentId = stack.pop()!;
        const node = nodes[currentId];
        
        steps.push({
          type: 'traverse',
          description: `🔍 Pop ${node.value} from stack - VISIT`,
          highlightNodeId: currentId,
          currentStack: [...stack],
        });
        
        console.log(`In-order: ${node.value}`);
        visitedValues.push(node.value);
        
        // Go to right subtree
        currentId = node.right;
        if (currentId) {
          steps.push({
            type: 'traverse',
            description: `➡️ Move to right child of ${node.value}`,
            highlightNodeId: currentId,
            currentStack: [...stack],
          });
        }
      }
    }
  }, [nodes, root]);

  const traversePreOrder = useCallback((steps: AnimationStep[], visitedValues: number[]) => {
    if (!root) return;
    
    const stack: string[] = [root];
    
    steps.push({
      type: 'traverse',
      description: `🌳 Starting Pre-order traversal (Stack-based)`,
      currentStack: [...stack],
    });
    
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const node = nodes[currentId];
      
      steps.push({
        type: 'traverse',
        description: `🔍 Pop ${node.value} from stack - VISIT`,
        highlightNodeId: currentId,
        currentStack: [...stack],
      });
      
      console.log(`Pre-order: ${node.value}`);
      visitedValues.push(node.value);
      
      // Push right child first (so left is processed first)
      if (node.right) {
        stack.push(node.right);
        steps.push({
          type: 'traverse',
          description: `📚 Push right child ${nodes[node.right]?.value} to stack`,
          currentStack: [...stack],
        });
      }
      
      if (node.left) {
        stack.push(node.left);
        steps.push({
          type: 'traverse',
          description: `📚 Push left child ${nodes[node.left]?.value} to stack`,
          currentStack: [...stack],
        });
      }
    }
  }, [nodes, root]);

  const traversePostOrder = useCallback((steps: AnimationStep[], visitedValues: number[]) => {
    if (!root) return;
    
    const stack: string[] = [];
    const visited = new Set<string>();
    let currentId: string | null = root;
    
    steps.push({
      type: 'traverse',
      description: `🌳 Starting Post-order traversal (Stack-based)`,
      currentStack: [...stack],
    });
    
    while (currentId || stack.length > 0) {
      if (currentId) {
        stack.push(currentId);
        steps.push({
          type: 'traverse',
          description: `📚 Push ${nodes[currentId]?.value} to stack`,
          highlightNodeId: currentId,
          currentStack: [...stack],
        });
        currentId = nodes[currentId]?.left || null;
      } else {
        const peekId = stack[stack.length - 1];
        const peekNode = nodes[peekId];
        
        if (peekNode.right && !visited.has(peekNode.right)) {
          steps.push({
            type: 'traverse',
            description: `➡️ Move to right child of ${peekNode.value}`,
            currentStack: [...stack],
          });
          currentId = peekNode.right;
        } else {
          const nodeId = stack.pop()!;
          const node = nodes[nodeId];
          visited.add(nodeId);
          
          steps.push({
            type: 'traverse',
            description: `🔍 Pop ${node.value} from stack - VISIT`,
            highlightNodeId: nodeId,
            currentStack: [...stack],
          });
          
          console.log(`Post-order: ${node.value}`);
          visitedValues.push(node.value);
        }
      }
    }
  }, [nodes, root]);

  const traverseLevelOrder = useCallback((steps: AnimationStep[], visitedValues: number[]) => {
    if (!root) return;
    
    const queue: string[] = [root];
    let level = 0;
    
    steps.push({
      type: 'traverse',
      description: `🌳 Starting Level-order traversal (Queue-based)`,
      currentQueue: [...queue],
    });
    
    while (queue.length > 0) {
      const levelSize = queue.length;
      level++;
      
      steps.push({
        type: 'traverse',
        description: `📊 Processing level ${level} (${levelSize} nodes)`,
        currentQueue: [...queue],
      });
      
      for (let i = 0; i < levelSize; i++) {
        steps.push({
          type: 'traverse',
          description: `🔍 Dequeue from FRONT: ${nodes[queue[0]]?.value}`,
          currentQueue: [...queue],
          highlightNodeId: queue[0],
        });
        
        const nodeId = queue.shift()!;
        const node = nodes[nodeId];
        
        if (node) {
          console.log(`Level-order: ${node.value}`);
          visitedValues.push(node.value);
          
          // Add children to queue
          if (node.left) {
            queue.push(node.left);
            steps.push({
              type: 'traverse',
              description: `➕ Enqueue left child ${nodes[node.left]?.value} to REAR`,
              currentQueue: [...queue],
            });
          }
          
          if (node.right) {
            queue.push(node.right);
            steps.push({
              type: 'traverse',
              description: `➕ Enqueue right child ${nodes[node.right]?.value} to REAR`,
              currentQueue: [...queue],
            });
          }
        }
      }
    }
  }, [root, nodes]);

  const handleTraversal = useCallback((type: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
    resetAnimation();
    const steps: AnimationStep[] = [];
    const visitedValues: number[] = [];
    
    switch (type) {
      case 'inorder':
        console.log('--- Starting In-order Traversal ---');
        traverseInOrder(steps, visitedValues);
        console.log('--- In-order Traversal Complete ---');
        setConsoleOutput(prev => [...prev, `In-order Traversal: ${visitedValues.join(' → ')}`]);
        steps.push({
          type: 'traverse',
          description: '✅ In-order traversal complete',
          currentStack: [],
        });
        break;
      case 'preorder':
        console.log('--- Starting Pre-order Traversal ---');
        traversePreOrder(steps, visitedValues);
        console.log('--- Pre-order Traversal Complete ---');
        setConsoleOutput(prev => [...prev, `Pre-order Traversal: ${visitedValues.join(' → ')}`]);
        steps.push({
          type: 'traverse',
          description: '✅ Pre-order traversal complete',
          currentStack: [],
        });
        break;
      case 'postorder':
        console.log('--- Starting Post-order Traversal ---');
        traversePostOrder(steps, visitedValues);
        console.log('--- Post-order Traversal Complete ---');
        setConsoleOutput(prev => [...prev, `Post-order Traversal: ${visitedValues.join(' → ')}`]);
        steps.push({
          type: 'traverse',
          description: '✅ Post-order traversal complete',
          currentStack: [],
        });
        break;
      case 'levelorder':
        console.log('--- Starting Level-order Traversal ---');
        traverseLevelOrder(steps, visitedValues);
        console.log('--- Level-order Traversal Complete ---');
        setConsoleOutput(prev => [...prev, `Level-order Traversal: ${visitedValues.join(' → ')}`]);
        steps.push({
          type: 'traverse',
          description: '✅ Level-order traversal complete',
          currentQueue: [],
        });
        break;
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [traverseInOrder, traversePreOrder, traversePostOrder, traverseLevelOrder, resetAnimation]);

  // Event handlers
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    insertNode(value);
    setConsoleOutput(prev => [...prev, `Inserted node with value: ${value}`]);
    setInputValue('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    const found = searchNode(value);
    setConsoleOutput(prev => [...prev, `Searched for value ${value}: ${found ? 'Found' : 'Not found'}`]);
  };



  const clearTree = () => {
    resetAnimation();
    setNodes({});
    setRoot(null);
    setConsoleOutput(prev => [...prev, 'Tree cleared']);
  };

  const createSampleTree = () => {
    resetAnimation();
    
    const sampleValues = [25, 15, 35, 10, 20, 30, 40];
    const sampleNodes: Record<string, TreeNode> = {};
    let currentRoot: string | null = null;
    
    // Build tree structure
    sampleValues.forEach((value, index) => {
      const id = generateId();
      const node: TreeNode = {
        id,
        value,
        left: null,
        right: null,
      };
      
      if (index === 0) {
        currentRoot = id;
      } else {
        // Insert into existing tree structure
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
    setConsoleOutput(prev => [...prev, `Sample tree created with values: ${sampleValues.join(', ')}`]);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
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

  const treeNodes = getTreeNodes();
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
                Binary Search Tree Visualization
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
                  Search Node
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter value to search"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>

              {/* Traversal Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tree Traversals
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleTraversal('inorder')}
                    disabled={!root || isPlaying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    In-order
                  </button>
                  <button
                    onClick={() => handleTraversal('preorder')}
                    disabled={!root || isPlaying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    Pre-order
                  </button>
                  <button
                    onClick={() => handleTraversal('postorder')}
                    disabled={!root || isPlaying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                  >
                    Post-order
                  </button>
                  <button
                    onClick={() => handleTraversal('levelorder')}
                    disabled={!root || isPlaying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
                  >
                    Level-order
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
                    onClick={createSampleTree}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Sample Tree
                  </button>
                  <button
                    onClick={clearTree}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Clear Tree
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Tree Visualization
              </h2>

              {/* Stack/Queue Visualization */}
              <AnimatePresence>
                {currentStep && (currentStep.currentStack || currentStep.currentQueue) && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                  >
                    {currentStep.currentStack && (
                      <div>
                        <h4 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                          Stack Visualization (DFS Traversal)
                        </h4>
                        <div className="flex items-end gap-2">
                          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mr-2">
                            TOP →
                          </span>
                          <div className="flex flex-col-reverse gap-1">
                            <AnimatePresence>
                              {currentStep.currentStack.map((nodeId, index) => (
                                <motion.div
                                  key={`${nodeId}-${index}`}
                                  initial={{ opacity: 0, scale: 0, x: -20 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0, x: 20 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-center min-w-[60px] border-2 border-indigo-700"
                                >
                                  {nodes[nodeId]?.value}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                          {currentStep.currentStack.length === 0 && (
                            <div className="text-indigo-500 dark:text-indigo-400 italic text-sm">
                              Empty Stack
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep.currentQueue && (
                      <div>
                        <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                          Queue Visualization (BFS Traversal)
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            FRONT
                          </span>
                          <div className="flex gap-1">
                            <AnimatePresence>
                              {currentStep.currentQueue.map((nodeId, index) => (
                                <motion.div
                                  key={`${nodeId}-${index}`}
                                  initial={{ opacity: 0, scale: 0, y: -20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0, y: 20 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-center min-w-[60px] border-2 border-purple-700"
                                >
                                  {nodes[nodeId]?.value}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            REAR
                          </span>
                          {currentStep.currentQueue.length === 0 && (
                            <div className="text-purple-500 dark:text-purple-400 italic text-sm ml-2">
                              Empty Queue
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="overflow-auto">
                <svg 
                  width="800" 
                  height="500" 
                  className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
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
                    {treeNodes.map((node) => {
                      const isHighlighted = highlightedNodeId === node.id;
                      const nodeWidth = 80;
                      const nodeHeight = 60;
                      
                      return (
                        <motion.g
                          key={node.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Connections to children */}
                          {node.left && nodes[node.left] && (
                            <motion.line
                              x1={node.x}
                              y1={node.y! + nodeHeight/2}
                              x2={treeNodes.find(n => n.id === node.left)?.x}
                              y2={treeNodes.find(n => n.id === node.left)?.y! - nodeHeight/2}
                              className="stroke-indigo-700 dark:stroke-indigo-400 stroke-2"
                              markerEnd="url(#arrowhead)"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          )}
                          
                          {node.right && nodes[node.right] && (
                            <motion.line
                              x1={node.x}
                              y1={node.y! + nodeHeight/2}
                              x2={treeNodes.find(n => n.id === node.right)?.x}
                              y2={treeNodes.find(n => n.id === node.right)?.y! - nodeHeight/2}
                              className="stroke-indigo-700 dark:stroke-indigo-400 stroke-2"
                              markerEnd="url(#arrowhead)"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          )}

                          {/* Node Rectangle - Data Part (Top) */}
                          <motion.rect
                            x={node.x! - nodeWidth/2}
                            y={node.y! - nodeHeight/2}
                            width={nodeWidth}
                            height={nodeHeight * 0.6}
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
                          
                          {/* Node Rectangle - Pointer Part (Bottom) */}
                          <motion.rect
                            x={node.x! - nodeWidth/2}
                            y={node.y! - nodeHeight/2 + nodeHeight * 0.6}
                            width={nodeWidth}
                            height={nodeHeight * 0.4}
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
                          
                          {/* Divider line between data and pointer sections */}
                          <line
                            x1={node.x! - nodeWidth/2}
                            y1={node.y! - nodeHeight/2 + nodeHeight * 0.6}
                            x2={node.x! + nodeWidth/2}
                            y2={node.y! - nodeHeight/2 + nodeHeight * 0.6}
                            className="stroke-gray-600 dark:stroke-gray-400 stroke-2"
                          />
                          
                          {/* Vertical divider in pointer section */}
                          <line
                            x1={node.x!}
                            y1={node.y! - nodeHeight/2 + nodeHeight * 0.6}
                            x2={node.x!}
                            y2={node.y! + nodeHeight/2}
                            className="stroke-gray-600 dark:stroke-gray-400 stroke-2"
                          />
                          
                          {/* Node Value in Data section */}
                          <text
                            x={node.x!}
                            y={node.y! - nodeHeight/2 + (nodeHeight * 0.6) / 2 + 6}
                            textAnchor="middle"
                            className="text-lg font-bold fill-white dark:fill-white"
                          >
                            {node.value}
                          </text>
                          
                          {/* Left pointer indicator */}
                          <text
                            x={node.x! - nodeWidth/4}
                            y={node.y! - nodeHeight/2 + nodeHeight * 0.6 + (nodeHeight * 0.4) / 2 + 4}
                            textAnchor="middle"
                            className="text-xs font-bold fill-white dark:fill-white"
                          >
                            {node.left ? 'L' : 'N'}
                          </text>
                          
                          {/* Right pointer indicator */}
                          <text
                            x={node.x! + nodeWidth/4}
                            y={node.y! - nodeHeight/2 + nodeHeight * 0.6 + (nodeHeight * 0.4) / 2 + 4}
                            textAnchor="middle"
                            className="text-xs font-bold fill-white dark:fill-white"
                          >
                            {node.right ? 'R' : 'N'}
                          </text>
                        </motion.g>
                      );
                    })}
                  </AnimatePresence>

                  {/* Root pointer */}
                  {root && treeNodes.length > 0 && (
                    <g>
                      <line
                        x1={treeNodes[0]?.x}
                        y1="40"
                        x2={treeNodes[0]?.x}
                        y2="90"
                        className="stroke-green-600 dark:stroke-green-400 stroke-3"
                        markerEnd="url(#arrowhead)"
                      />
                      <text
                        x={treeNodes[0]?.x}
                        y="30"
                        textAnchor="middle"
                        className="text-lg font-bold fill-green-600 dark:fill-green-400"
                      >
                        ROOT
                      </text>
                    </g>
                  )}

                  {/* Empty state */}
                  {treeNodes.length === 0 && (
                    <text
                      x="400"
                      y="250"
                      textAnchor="middle"
                      className="text-lg fill-gray-400 dark:fill-gray-500"
                    >
                      Empty Binary Search Tree
                    </text>
                  )}
                </svg>
              </div>

              {/* Tree Info */}
              {treeNodes.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Tree Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Nodes:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {treeNodes.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Root:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {root ? nodes[root]?.value : 'NULL'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Height:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {Math.ceil(Math.log2(treeNodes.length + 1))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
  );
} 