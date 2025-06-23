import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Minus, Eye, Trash2 } from 'lucide-react';

interface StackItem {
  id: string;
  value: number;
  index: number;
}

interface AnimationStep {
  type: 'push' | 'pop' | 'peek' | 'clear';
  description: string;
  highlightIndex?: number;
  newItem?: StackItem;
  removedItem?: StackItem;
}

const SPEEDS = {
  slow: 1500,
  normal: 1000,
  fast: 500,
};

export default function StackVisualization() {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Animation control functions
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
      setCurrentStepIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        
        const step = animationSteps[nextIndex];
        if (step.highlightIndex !== undefined) {
          setHighlightedIndex(step.highlightIndex);
        } else {
          setHighlightedIndex(null);
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
      if (step.highlightIndex !== undefined) {
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
        if (step.highlightIndex !== undefined) {
          setHighlightedIndex(step.highlightIndex);
        } else {
          setHighlightedIndex(null);
        }
      } else {
        setHighlightedIndex(null);
      }
    }
  }, [currentStepIndex, animationSteps]);

  // Stack operations
  const pushToStack = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    const newItem: StackItem = {
      id: generateId(),
      value,
      index: stack.length,
    };
    
    steps.push({
      type: 'push',
      description: `Pushing ${value} onto the stack`,
      newItem,
    });
    
    steps.push({
      type: 'push',
      description: `${value} added to top of stack (index ${stack.length})`,
      highlightIndex: stack.length,
    });
    
    steps.push({
      type: 'push',
      description: `Stack size is now ${stack.length + 1}`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setStack(prev => [...prev, newItem]);
  }, [stack]);

  const popFromStack = useCallback(() => {
    if (stack.length === 0) {
      alert('Stack is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const topItem = stack[stack.length - 1];
    
    steps.push({
      type: 'pop',
      description: `Popping from top of stack`,
      highlightIndex: stack.length - 1,
    });
    
    steps.push({
      type: 'pop',
      description: `Removed ${topItem.value} from stack`,
      removedItem: topItem,
    });
    
    steps.push({
      type: 'pop',
      description: `Stack size is now ${stack.length - 1}`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setStack(prev => prev.slice(0, -1));
  }, [stack]);

  const peekStack = useCallback(() => {
    if (stack.length === 0) {
      alert('Stack is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const topItem = stack[stack.length - 1];
    
    steps.push({
      type: 'peek',
      description: `Peeking at top of stack`,
      highlightIndex: stack.length - 1,
    });
    
    steps.push({
      type: 'peek',
      description: `Top element is ${topItem.value}`,
      highlightIndex: stack.length - 1,
    });
    
    steps.push({
      type: 'peek',
      description: `Stack remains unchanged`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [stack]);

  const clearStack = useCallback(() => {
    const steps: AnimationStep[] = [];
    
    steps.push({
      type: 'clear',
      description: `Clearing all elements from stack`,
    });
    
    steps.push({
      type: 'clear',
      description: `Stack is now empty`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setStack([]);
  }, []);

  // Event handlers
  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    pushToStack(value);
    setInputValue('');
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
      index,
    }));
    setStack(sampleStack);
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
                Stack Visualization
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

              {/* Stack Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Stack Operations
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      onClick={handlePush}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Plus size={16} />
                      Push
                    </button>
                  </div>
                  
                  <button
                    onClick={handlePop}
                    disabled={stack.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                  >
                    <Minus size={16} />
                    Pop
                  </button>
                  
                  <button
                    onClick={handlePeek}
                    disabled={stack.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    <Eye size={16} />
                    Peek
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
                    onClick={createSampleStack}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Sample Stack
                  </button>
                  <button
                    onClick={handleClear}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                    Clear Stack
                  </button>
                </div>
              </div>

              {/* Stack Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Stack Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Size: {stack.length}</p>
                  <p>Top: {stack.length > 0 ? stack[stack.length - 1].value : 'Empty'}</p>
                  <p>Is Empty: {stack.length === 0 ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Stack Visualization
              </h2>
              
              <div className="flex justify-center">
                <div className="relative">
                  {/* Stack Container */}
                  <div className="w-32 border-l-4 border-r-4 border-b-4 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 min-h-[400px] relative">
                    {/* Stack Items */}
                    <AnimatePresence>
                      {stack.map((item, index) => {
                        const isHighlighted = highlightedIndex === index;
                        const yPosition = 400 - (index + 1) * 60 - 10; // Stack grows upward
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ 
                              opacity: 1, 
                              y: yPosition,
                              scale: isHighlighted ? 1.05 : 1,
                            }}
                            exit={{ opacity: 0, y: -50, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute left-2 right-2 h-12 rounded-md flex items-center justify-center font-bold text-white ${
                              isHighlighted
                                ? 'bg-yellow-500 shadow-lg'
                                : 'bg-blue-500'
                            }`}
                          >
                            {item.value}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {/* Top Indicator */}
                    {stack.length > 0 && (
                      <div className="absolute -right-16 text-sm text-gray-600 dark:text-gray-300 font-semibold"
                           style={{ top: 400 - stack.length * 60 + 10 }}>
                        ← TOP
                      </div>
                    )}
                    
                    {/* Empty Stack Message */}
                    {stack.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Empty Stack
                      </div>
                    )}
                  </div>
                  
                  {/* Stack Base Label */}
                  <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    STACK BASE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 