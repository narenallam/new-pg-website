import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Minus, Eye, Trash2 } from 'lucide-react';

interface QueueItem {
  id: string;
  value: number;
  index: number;
}

interface AnimationStep {
  type: 'enqueue' | 'dequeue' | 'front' | 'rear' | 'clear';
  description: string;
  highlightIndex?: number;
  newItem?: QueueItem;
  removedItem?: QueueItem;
}

const SPEEDS = {
  slow: 1500,
  normal: 1000,
  fast: 500,
};

export default function QueueVisualization() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
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

  // Queue operations
  const enqueueToQueue = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    const newItem: QueueItem = {
      id: generateId(),
      value,
      index: queue.length,
    };
    
    steps.push({
      type: 'enqueue',
      description: `Enqueuing ${value} to the rear of queue`,
      newItem,
    });
    
    steps.push({
      type: 'enqueue',
      description: `${value} added to rear of queue (index ${queue.length})`,
      highlightIndex: queue.length,
    });
    
    steps.push({
      type: 'enqueue',
      description: `Queue size is now ${queue.length + 1}`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setQueue(prev => [...prev, newItem]);
    
    setConsoleOutput(prev => [...prev, `Enqueue: ${value} → added to rear of queue`]);
  }, [queue]);

  const dequeueFromQueue = useCallback(() => {
    if (queue.length === 0) {
      alert('Queue is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const frontItem = queue[0];
    
    steps.push({
      type: 'dequeue',
      description: `Dequeuing from front of queue`,
      highlightIndex: 0,
    });
    
    steps.push({
      type: 'dequeue',
      description: `Removed ${frontItem.value} from queue`,
      removedItem: frontItem,
    });
    
    steps.push({
      type: 'dequeue',
      description: `Queue size is now ${queue.length - 1}`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setQueue(prev => prev.slice(1).map((item, index) => ({
      ...item,
      index,
    })));
    
    setConsoleOutput(prev => [...prev, `Dequeue: ${frontItem.value} → removed from front of queue`]);
  }, [queue]);

  const frontQueue = useCallback(() => {
    if (queue.length === 0) {
      alert('Queue is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const frontItem = queue[0];
    
    steps.push({
      type: 'front',
      description: `Getting front element of queue`,
      highlightIndex: 0,
    });
    
    steps.push({
      type: 'front',
      description: `Front element is ${frontItem.value}`,
      highlightIndex: 0,
    });
    
    steps.push({
      type: 'front',
      description: `Queue remains unchanged`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    setConsoleOutput(prev => [...prev, `Front: ${frontItem.value} → front element of queue`]);
  }, [queue]);

  const rearQueue = useCallback(() => {
    if (queue.length === 0) {
      alert('Queue is empty!');
      return;
    }
    
    const steps: AnimationStep[] = [];
    const rearItem = queue[queue.length - 1];
    
    steps.push({
      type: 'rear',
      description: `Getting rear element of queue`,
      highlightIndex: queue.length - 1,
    });
    
    steps.push({
      type: 'rear',
      description: `Rear element is ${rearItem.value}`,
      highlightIndex: queue.length - 1,
    });
    
    steps.push({
      type: 'rear',
      description: `Queue remains unchanged`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    setConsoleOutput(prev => [...prev, `Rear: ${rearItem.value} → rear element of queue`]);
  }, [queue]);

  const clearQueue = useCallback(() => {
    const steps: AnimationStep[] = [];
    
    steps.push({
      type: 'clear',
      description: `Clearing all elements from queue`,
    });
    
    steps.push({
      type: 'clear',
      description: `Queue is now empty`,
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setQueue([]);
    
    setConsoleOutput(prev => [...prev, 'Queue cleared']);
  }, []);

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  // Event handlers
  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    enqueueToQueue(value);
    setInputValue('');
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
      index,
    }));
    setQueue(sampleQueue);
    setConsoleOutput(prev => [...prev, `Sample queue created with values: ${sampleValues.join(', ')}`]);
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
                Queue Visualization
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

              {/* Queue Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Queue Operations
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
                      onClick={handleEnqueue}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Plus size={16} />
                      Enqueue
                    </button>
                  </div>
                  
                  <button
                    onClick={handleDequeue}
                    disabled={queue.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                  >
                    <Minus size={16} />
                    Dequeue
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleFront}
                      disabled={queue.length === 0}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 text-sm"
                    >
                      <Eye size={14} />
                      Front
                    </button>
                    <button
                      onClick={handleRear}
                      disabled={queue.length === 0}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 text-sm"
                    >
                      <Eye size={14} />
                      Rear
                    </button>
                  </div>
                </div>
              </div>

              {/* Utility Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Utilities
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={createSampleQueue}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Sample Queue
                  </button>
                  <button
                    onClick={handleClear}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                    Clear Queue
                  </button>
                </div>
              </div>

              {/* Queue Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Queue Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Size: {queue.length}</p>
                  <p>Front: {queue.length > 0 ? queue[0].value : 'Empty'}</p>
                  <p>Rear: {queue.length > 0 ? queue[queue.length - 1].value : 'Empty'}</p>
                  <p>Is Empty: {queue.length === 0 ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Queue Visualization
              </h2>
              
              <div className="flex justify-center items-center">
                <div className="relative">
                  {/* Front Label */}
                  <div className="text-center mb-2 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    FRONT
                  </div>
                  
                  {/* Queue Container */}
                  <div className="flex items-center gap-2 min-w-[600px] p-4 border-2 border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700">
                    {/* Queue Items */}
                    <AnimatePresence>
                      {queue.map((item, index) => {
                        const isHighlighted = highlightedIndex === index;
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              scale: isHighlighted ? 1.05 : 1,
                            }}
                            exit={{ opacity: 0, x: 50, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className={`w-16 h-16 rounded-md flex items-center justify-center font-bold text-white ${
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
                    
                    {/* Empty Queue Message */}
                    {queue.length === 0 && (
                      <div className="flex-1 text-center text-gray-500 dark:text-gray-400 py-8">
                        Empty Queue
                      </div>
                    )}
                  </div>
                  
                  {/* Rear Label */}
                  <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    REAR
                  </div>
                  
                  {/* Index Labels */}
                  {queue.length > 0 && (
                    <div className="flex gap-2 mt-4 pl-4">
                      {queue.map((_, index) => (
                        <div
                          key={index}
                          className="w-16 text-center text-xs text-gray-500 dark:text-gray-400"
                        >
                          [{index}]
                        </div>
                      ))}
                    </div>
                  )}
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
    </div>
  );
} 