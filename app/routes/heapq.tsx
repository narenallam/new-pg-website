import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Minus, Eye, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface HeapNode {
  id: string;
  value: number;
  index: number;
  x?: number;
  y?: number;
}

interface AnimationStep {
  type: 'insert' | 'extract' | 'peek' | 'heapify-up' | 'heapify-down' | 'swap' | 'compare';
  description: string;
  highlightNodes?: string[];
  swapNodes?: [string, string];
  newNode?: HeapNode;
  extractedNode?: HeapNode;
  compareNodes?: [string, string];
  currentHeapArray?: HeapNode[];
  propagatingNodeId?: string;
  currentPosition?: number;
  targetPosition?: number;
}

const SPEEDS = {
  slow: 1500,
  normal: 1000,
  fast: 500,
};

export default function HeapQVisualization() {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [isMinHeap, setIsMinHeap] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [swapNodes, setSwapNodes] = useState<[string, string] | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Heap utility functions
  const getParentIndex = (index: number): number => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index: number): number => 2 * index + 1;
  const getRightChildIndex = (index: number): number => 2 * index + 2;

  const shouldSwap = (parentValue: number, childValue: number): boolean => {
    return isMinHeap ? parentValue > childValue : parentValue < childValue;
  };

  // Calculate node positions for tree visualization
  const calculatePositions = useCallback((heapArray: HeapNode[]) => {
    const updatedHeap = [...heapArray];
    
    updatedHeap.forEach((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      
      const y = 80 + level * 100;
      const levelWidth = 800;
      const spacing = levelWidth / (totalInLevel + 1);
      const x = spacing * (positionInLevel + 1);
      
      updatedHeap[index] = { ...node, x, y };
    });
    
    return updatedHeap;
  }, []);

  // Animation control functions
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
      setCurrentStepIndex(prev => {
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

  // Heap operations
  const insertIntoHeap = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    const newNode: HeapNode = {
      id: generateId(),
      value,
      index: heap.length,
    };
    
    steps.push({
      type: 'insert',
      description: `🌟 Inserting ${value} into ${isMinHeap ? 'Min' : 'Max'} Heap`,
      newNode,
      currentHeapArray: [...heap],
    });
    
    let updatedHeap = [...heap, newNode];
    let currentIndex = updatedHeap.length - 1;
    const propagatingNodeId = newNode.id;
    
    steps.push({
      type: 'insert',
      description: `📍 Added ${value} at index ${currentIndex} (last position in array)`,
      highlightNodes: [newNode.id],
      currentHeapArray: [...updatedHeap],
      propagatingNodeId,
      currentPosition: currentIndex,
    });
    
    // Heapify up - track propagation path
    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      const currentNode = updatedHeap[currentIndex];
      const parentNode = updatedHeap[parentIndex];
      
      steps.push({
        type: 'compare',
        description: `🔍 Comparing ${currentNode.value} at [${currentIndex}] with parent ${parentNode.value} at [${parentIndex}]`,
        highlightNodes: [currentNode.id, parentNode.id],
        compareNodes: [currentNode.id, parentNode.id],
        currentHeapArray: [...updatedHeap],
        propagatingNodeId,
        currentPosition: currentIndex,
        targetPosition: parentIndex,
      });
      
      if (shouldSwap(parentNode.value, currentNode.value)) {
        // Swap needed
        steps.push({
          type: 'swap',
          description: `🔄 Swapping ${currentNode.value} with ${parentNode.value} (${isMinHeap ? currentNode.value + ' < ' + parentNode.value : currentNode.value + ' > ' + parentNode.value})`,
          swapNodes: [currentNode.id, parentNode.id],
          currentHeapArray: [...updatedHeap],
          propagatingNodeId,
          currentPosition: currentIndex,
          targetPosition: parentIndex,
        });
        
        // Perform swap
        [updatedHeap[currentIndex], updatedHeap[parentIndex]] = [updatedHeap[parentIndex], updatedHeap[currentIndex]];
        updatedHeap[currentIndex].index = currentIndex;
        updatedHeap[parentIndex].index = parentIndex;
        
        currentIndex = parentIndex;
        
        steps.push({
          type: 'heapify-up',
          description: `⬆️ Node ${currentNode.value} propagated up to index ${currentIndex}`,
          highlightNodes: [currentNode.id],
          currentHeapArray: [...updatedHeap],
          propagatingNodeId,
          currentPosition: currentIndex,
        });
      } else {
        steps.push({
          type: 'heapify-up',
          description: `✅ Heap property satisfied! ${currentNode.value} stays at index ${currentIndex}`,
          highlightNodes: [currentNode.id],
          currentHeapArray: [...updatedHeap],
          propagatingNodeId,
          currentPosition: currentIndex,
        });
        break;
      }
    }
    
    steps.push({
      type: 'insert',
      description: `🎉 Successfully inserted ${value} into heap at final position [${currentIndex}]`,
      currentHeapArray: [...updatedHeap],
      highlightNodes: [propagatingNodeId],
    });
    
    setConsoleOutput(prev => [...prev, `Insert: ${value} → added to ${isMinHeap ? 'min' : 'max'} heap at index ${currentIndex}`]);
    
    setHeap(calculatePositions(updatedHeap));
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [heap, isMinHeap, calculatePositions]);

  const extractFromHeap = useCallback(() => {
    if (heap.length === 0) {
      alert('Heap is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const rootNode = heap[0];
    const lastNode = heap[heap.length - 1];
    
    steps.push({
      type: 'extract',
      description: `Extracting ${isMinHeap ? 'minimum' : 'maximum'} value: ${rootNode.value}`,
      highlightNodes: [rootNode.id],
      extractedNode: rootNode,
    });
    
    if (heap.length === 1) {
      steps.push({
        type: 'extract',
        description: `Heap is now empty`,
      });
      
      setHeap([]);
      setAnimationSteps(steps);
      setCurrentStepIndex(-1);
      return;
    }
    
    // Move last element to root
    let updatedHeap = heap.slice(0, -1);
    updatedHeap[0] = { ...lastNode, index: 0 };
    
    steps.push({
      type: 'extract',
      description: `Moving last element ${lastNode.value} to root position`,
      highlightNodes: [lastNode.id],
    });
    
    // Heapify down
    let currentIndex = 0;
    
    while (true) {
      const leftChildIndex = getLeftChildIndex(currentIndex);
      const rightChildIndex = getRightChildIndex(currentIndex);
      let targetIndex = currentIndex;
      
      const currentNode = updatedHeap[currentIndex];
      let targetNode = currentNode;
      
      // Find the target index (min/max among current, left child, right child)
      if (leftChildIndex < updatedHeap.length) {
        const leftChild = updatedHeap[leftChildIndex];
        steps.push({
          type: 'compare',
          description: `Comparing ${currentNode.value} with left child ${leftChild.value}`,
          highlightNodes: [currentNode.id, leftChild.id],
        });
        
        if (shouldSwap(currentNode.value, leftChild.value)) {
          targetIndex = leftChildIndex;
          targetNode = leftChild;
        }
      }
      
      if (rightChildIndex < updatedHeap.length) {
        const rightChild = updatedHeap[rightChildIndex];
        steps.push({
          type: 'compare',
          description: `Comparing ${targetNode.value} with right child ${rightChild.value}`,
          highlightNodes: [targetNode.id, rightChild.id],
        });
        
        if (shouldSwap(targetNode.value, rightChild.value)) {
          targetIndex = rightChildIndex;
          targetNode = rightChild;
        }
      }
      
      if (targetIndex === currentIndex) {
        steps.push({
          type: 'heapify-down',
          description: `Heap property satisfied, ${currentNode.value} stays at index ${currentIndex}`,
          highlightNodes: [currentNode.id],
        });
        break;
      }
      
      // Swap with target
      steps.push({
        type: 'swap',
        description: `Swapping ${currentNode.value} with ${targetNode.value}`,
        swapNodes: [currentNode.id, targetNode.id],
      });
      
      [updatedHeap[currentIndex], updatedHeap[targetIndex]] = [updatedHeap[targetIndex], updatedHeap[currentIndex]];
      updatedHeap[currentIndex].index = currentIndex;
      updatedHeap[targetIndex].index = targetIndex;
      
      currentIndex = targetIndex;
      
      steps.push({
        type: 'heapify-down',
        description: `Moved ${currentNode.value} down to index ${currentIndex}`,
        highlightNodes: [currentNode.id],
      });
    }
    
    steps.push({
      type: 'extract',
      description: `Successfully extracted ${rootNode.value} from heap`,
    });
    
    setConsoleOutput(prev => [...prev, `Extract: ${rootNode.value} → removed from ${isMinHeap ? 'min' : 'max'} heap`]);
    
    setHeap(calculatePositions(updatedHeap));
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [heap, isMinHeap, calculatePositions]);

  const peekHeap = useCallback(() => {
    if (heap.length === 0) {
      alert('Heap is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const rootNode = heap[0];
    
    steps.push({
      type: 'peek',
      description: `Peeking at ${isMinHeap ? 'minimum' : 'maximum'} value`,
      highlightNodes: [rootNode.id],
    });
    
    steps.push({
      type: 'peek',
      description: `${isMinHeap ? 'Minimum' : 'Maximum'} value is ${rootNode.value}`,
      highlightNodes: [rootNode.id],
    });
    
    steps.push({
      type: 'peek',
      description: `Heap remains unchanged`,
    });
    
    setConsoleOutput(prev => [...prev, `Peek: ${isMinHeap ? 'minimum' : 'maximum'} value is ${rootNode.value}`]);
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [heap, isMinHeap]);

  // Event handlers
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    insertIntoHeap(value);
    setInputValue('');
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
    setConsoleOutput(prev => [...prev, 'Heap cleared']);
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
      index,
    }));
    
    // Build heap properly
    let builtHeap = [...sampleHeap];
    
    // Heapify from bottom up
    for (let i = Math.floor(builtHeap.length / 2) - 1; i >= 0; i--) {
      let currentIndex = i;
      
      while (true) {
        const leftChildIndex = getLeftChildIndex(currentIndex);
        const rightChildIndex = getRightChildIndex(currentIndex);
        let targetIndex = currentIndex;
        
        if (leftChildIndex < builtHeap.length && 
            shouldSwap(builtHeap[currentIndex].value, builtHeap[leftChildIndex].value)) {
          targetIndex = leftChildIndex;
        }
        
        if (rightChildIndex < builtHeap.length && 
            shouldSwap(builtHeap[targetIndex].value, builtHeap[rightChildIndex].value)) {
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
    setConsoleOutput(prev => [...prev, `Sample ${isMinHeap ? 'min' : 'max'} heap created with values: ${sampleValues.join(', ')}`]);
  };

  const toggleHeapType = () => {
    setIsMinHeap(!isMinHeap);
    if (heap.length > 0) {
      // Rebuild heap with new type
      const values = heap.map(node => node.value);
      setHeap([]);
      setTimeout(() => {
        createSampleHeap();
      }, 100);
    }
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
  const heapWithPositions = calculatePositions(heap);

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
                HeapQ (Priority Queue) Visualization
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

              {/* Heap Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Heap Type
                </h3>
                <button
                  onClick={toggleHeapType}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold ${
                    isMinHeap
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isMinHeap ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                  {isMinHeap ? 'Min Heap' : 'Max Heap'}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {isMinHeap ? 'Smallest element at root' : 'Largest element at root'}
                </p>
              </div>

              {/* Heap Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Heap Operations
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExtract}
                      disabled={heap.length === 0}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    >
                      <Minus size={16} />
                      Extract
                    </button>
                    <button
                      onClick={handlePeek}
                      disabled={heap.length === 0}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      <Eye size={16} />
                      Peek
                    </button>
                  </div>
                </div>
              </div>

              {/* Utilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Utilities
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={createSampleHeap}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Sample Heap
                  </button>
                  <button
                    onClick={clearHeap}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                    Clear Heap
                  </button>
                </div>
              </div>

              {/* Heap Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Heap Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Size: {heap.length}</p>
                  <p>Type: {isMinHeap ? 'Min Heap' : 'Max Heap'}</p>
                  <p>Root: {heap.length > 0 ? heap[0].value : 'Empty'}</p>
                  <p>Height: {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {isMinHeap ? 'Min' : 'Max'} Heap Visualization
              </h2>

              {/* Array Representation */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Array Representation
                </h3>
                
                {heap.length > 0 ? (
                  <div className="space-y-4">
                    {/* Array visualization */}
                    <div className="flex gap-1 flex-wrap">
                      <AnimatePresence>
                        {(currentStep?.currentHeapArray || heap).map((node, index) => {
                          const currentHeapArray = currentStep?.currentHeapArray || heap;
                          const isPropagating = currentStep?.propagatingNodeId === node.id;
                          const isCurrentPosition = currentStep?.currentPosition === index;
                          const isTargetPosition = currentStep?.targetPosition === index;
                          const isSwapping = swapNodes && (swapNodes[0] === node.id || swapNodes[1] === node.id);
                          
                          return (
                            <motion.div
                              key={`${node.id}-${index}`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ 
                                opacity: 1, 
                                scale: isPropagating || isCurrentPosition || isTargetPosition ? 1.1 : 1,
                                y: isPropagating && isCurrentPosition ? -10 : 0,
                              }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ duration: 0.5, type: "spring" }}
                              className={`relative flex flex-col items-center min-w-[60px] ${
                                isSwapping
                                  ? 'transform scale-110'
                                  : ''
                              }`}
                            >
                              {/* Array element */}
                              <div
                                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-white shadow-lg transition-all duration-300 ${
                                  isSwapping
                                    ? 'bg-orange-500 border-orange-600 animate-pulse'
                                    : isPropagating && isCurrentPosition
                                    ? 'bg-green-500 border-green-600 ring-2 ring-green-300'
                                    : isTargetPosition
                                    ? 'bg-purple-500 border-purple-600 ring-2 ring-purple-300'
                                    : highlightedNodes.includes(node.id)
                                    ? 'bg-yellow-500 border-yellow-600'
                                    : index === 0
                                    ? 'bg-red-500 border-red-600'
                                    : 'bg-blue-500 border-blue-600'
                                }`}
                              >
                                {node.value}
                              </div>
                              
                              {/* Index label */}
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                                [{index}]
                              </div>
                              
                              {/* Propagation indicator */}
                              {isPropagating && isCurrentPosition && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                                >
                                  <ArrowUp size={10} className="text-white" />
                                </motion.div>
                              )}
                              
                              {/* Target indicator */}
                              {isTargetPosition && currentStep?.propagatingNodeId && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center"
                                >
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                    
                    {/* Propagation legend */}
                    {currentStep?.propagatingNodeId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded border flex items-center justify-center">
                            <ArrowUp size={10} className="text-white" />
                          </div>
                          <span className="text-green-700 dark:text-green-300 font-semibold">Propagating Node</span>
                        </div>
                        {currentStep?.targetPosition !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded border flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-purple-700 dark:text-purple-300 font-semibold">Target Position</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Array properties */}
                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <p>• <strong>Root:</strong> Always at index [0]</p>
                      <p>• <strong>Parent of [i]:</strong> index [(i-1)/2]</p>
                      <p>• <strong>Left child of [i]:</strong> index [2i+1]</p>
                      <p>• <strong>Right child of [i]:</strong> index [2i+2]</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-blue-500 dark:text-blue-400 italic text-center py-8">
                    Empty heap array
                  </div>
                )}
              </div>
              
              <div className="overflow-auto">
                <svg 
                  width="800" 
                  height="500" 
                  className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
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
                  {heapWithPositions.map((node, index) => {
                    const leftChildIndex = getLeftChildIndex(index);
                    const rightChildIndex = getRightChildIndex(index);
                    
                    return (
                      <g key={`edges-${node.id}`}>
                        {/* Left child edge */}
                        {leftChildIndex < heapWithPositions.length && (
                          <line
                            x1={node.x}
                            y1={node.y! + 20}
                            x2={heapWithPositions[leftChildIndex].x}
                            y2={heapWithPositions[leftChildIndex].y! - 20}
                            className="stroke-2 stroke-gray-400 dark:stroke-gray-500"
                          />
                        )}
                        
                        {/* Right child edge */}
                        {rightChildIndex < heapWithPositions.length && (
                          <line
                            x1={node.x}
                            y1={node.y! + 20}
                            x2={heapWithPositions[rightChildIndex].x}
                            y2={heapWithPositions[rightChildIndex].y! - 20}
                            className="stroke-2 stroke-gray-400 dark:stroke-gray-500"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  <AnimatePresence>
                    {heapWithPositions.map((node, index) => {
                      const isHighlighted = highlightedNodes.includes(node.id);
                      const isSwapping = swapNodes && (swapNodes[0] === node.id || swapNodes[1] === node.id);
                      const isRoot = index === 0;
                      
                      return (
                        <motion.g
                          key={node.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: isHighlighted || isSwapping ? 1.1 : 1,
                            x: node.x,
                            y: node.y,
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <circle
                            cx={0}
                            cy={0}
                            r="20"
                            className={`stroke-2 ${
                              isSwapping
                                ? 'fill-orange-400 stroke-orange-600'
                                : isHighlighted
                                ? 'fill-yellow-400 stroke-yellow-600'
                                : isRoot
                                ? 'fill-red-400 stroke-red-600'
                                : 'fill-blue-400 stroke-blue-600'
                            }`}
                          />
                          <text
                            x={0}
                            y={4}
                            textAnchor="middle"
                            className="text-sm font-bold fill-white"
                          >
                            {node.value}
                          </text>
                          
                          {/* Index label */}
                          <text
                            x={0}
                            y={35}
                            textAnchor="middle"
                            className="text-xs fill-gray-500 dark:fill-gray-400"
                          >
                            [{index}]
                          </text>
                        </motion.g>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* Empty heap message */}
                  {heap.length === 0 && (
                    <text
                      x="400"
                      y="250"
                      textAnchor="middle"
                      className="text-lg fill-gray-500 dark:fill-gray-400"
                    >
                      Empty Heap
                    </text>
                  )}
                </svg>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                <p>• <span className="inline-block w-4 h-4 bg-red-400 rounded-full mr-2"></span>Root node (priority element)</p>
                <p>• <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mr-2"></span>Regular nodes</p>
                <p>• <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>Highlighted during operations</p>
                <p>• <span className="inline-block w-4 h-4 bg-orange-400 rounded-full mr-2"></span>Nodes being swapped</p>
                <p>• Array indices shown below each node</p>
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