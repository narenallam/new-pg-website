import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Minus, Search, Trash2 } from 'lucide-react';

interface HashSetItem {
  id: string;
  value: number;
  hash: number;
}

interface HashBucket {
  index: number;
  items: HashSetItem[];
}

interface AnimationStep {
  type: 'add' | 'remove' | 'contains' | 'hash' | 'collision';
  description: string;
  value?: number;
  hash?: number;
  bucketIndex?: number;
  found?: boolean;
  highlightBucket?: number;
  highlightItem?: string;
}

const SPEEDS = {
  slow: 1500,
  normal: 1000,
  fast: 500,
};

const BUCKET_SIZE = 10; // Using hash function n % 10

export default function HashSetVisualization() {
  const [buckets, setBuckets] = useState<HashBucket[]>(() => 
    Array.from({ length: BUCKET_SIZE }, (_, index) => ({
      index,
      items: [],
    }))
  );
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Hash function: n % 10
  const hashFunction = (value: number): number => {
    return Math.abs(value) % BUCKET_SIZE;
  };

  // Animation control functions
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
      setCurrentStepIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        
        const step = animationSteps[nextIndex];
        if (step.highlightBucket !== undefined) {
          setHighlightedBucket(step.highlightBucket);
        }
        if (step.highlightItem) {
          setHighlightedItem(step.highlightItem);
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
      if (step.highlightBucket !== undefined) {
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
        if (step.highlightBucket !== undefined) {
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

  // HashSet operations
  const addToHashSet = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    const hash = hashFunction(value);
    
    steps.push({
      type: 'hash',
      description: `Computing hash for ${value}: ${value} % ${BUCKET_SIZE} = ${hash}`,
      value,
      hash,
    });
    
    steps.push({
      type: 'add',
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash,
    });
    
    // Check if value already exists
    const bucket = buckets[hash];
    const existingItem = bucket.items.find(item => item.value === value);
    
    if (existingItem) {
      steps.push({
        type: 'add',
        description: `Value ${value} already exists in HashSet`,
        highlightBucket: hash,
        highlightItem: existingItem.id,
      });
      
      setConsoleOutput(prev => [...prev, `Add: ${value} → already exists`]);
    } else {
      const newItem: HashSetItem = {
        id: generateId(),
        value,
        hash,
      };
      
      if (bucket.items.length > 0) {
        steps.push({
          type: 'collision',
          description: `Collision detected! Bucket ${hash} already has items`,
          highlightBucket: hash,
        });
        
        steps.push({
          type: 'add',
          description: `Adding ${value} to chain in bucket ${hash}`,
          highlightBucket: hash,
        });
      } else {
        steps.push({
          type: 'add',
          description: `Bucket ${hash} is empty, adding ${value}`,
          highlightBucket: hash,
        });
      }
      
      // Update buckets
      setBuckets(prev => prev.map(b => 
        b.index === hash 
          ? { ...b, items: [...b.items, newItem] }
          : b
      ));
      
      steps.push({
        type: 'add',
        description: `Successfully added ${value} to HashSet`,
        highlightBucket: hash,
        highlightItem: newItem.id,
      });
      
      setConsoleOutput(prev => [...prev, `Add: ${value} → added to bucket ${hash}`]);
    }
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);

  const removeFromHashSet = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    const hash = hashFunction(value);
    
    steps.push({
      type: 'hash',
      description: `Computing hash for ${value}: ${value} % ${BUCKET_SIZE} = ${hash}`,
      value,
      hash,
    });
    
    steps.push({
      type: 'remove',
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash,
    });
    
    const bucket = buckets[hash];
    const existingItem = bucket.items.find(item => item.value === value);
    
    if (existingItem) {
      steps.push({
        type: 'remove',
        description: `Found ${value} in bucket ${hash}`,
        highlightBucket: hash,
        highlightItem: existingItem.id,
      });
      
      // Update buckets
      setBuckets(prev => prev.map(b => 
        b.index === hash 
          ? { ...b, items: b.items.filter(item => item.value !== value) }
          : b
      ));
      
      steps.push({
        type: 'remove',
        description: `Successfully removed ${value} from HashSet`,
        highlightBucket: hash,
      });
      
      setConsoleOutput(prev => [...prev, `Remove: ${value} → removed from bucket ${hash}`]);
    } else {
      steps.push({
        type: 'remove',
        description: `Value ${value} not found in HashSet`,
        highlightBucket: hash,
        found: false,
      });
      
      setConsoleOutput(prev => [...prev, `Remove: ${value} → not found`]);
    }
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);

  const containsInHashSet = useCallback((value: number) => {
    const steps: AnimationStep[] = [];
    const hash = hashFunction(value);
    
    steps.push({
      type: 'hash',
      description: `Computing hash for ${value}: ${value} % ${BUCKET_SIZE} = ${hash}`,
      value,
      hash,
    });
    
    steps.push({
      type: 'contains',
      description: `Looking at bucket ${hash}`,
      bucketIndex: hash,
      highlightBucket: hash,
    });
    
    const bucket = buckets[hash];
    const existingItem = bucket.items.find(item => item.value === value);
    
    if (existingItem) {
      steps.push({
        type: 'contains',
        description: `Found ${value} in bucket ${hash}`,
        highlightBucket: hash,
        highlightItem: existingItem.id,
        found: true,
      });
      
      setConsoleOutput(prev => [...prev, `Contains: ${value} → found in bucket ${hash}`]);
    } else {
      if (bucket.items.length > 0) {
        steps.push({
          type: 'contains',
          description: `Searching through chain in bucket ${hash}`,
          highlightBucket: hash,
        });
      }
      
      steps.push({
        type: 'contains',
        description: `Value ${value} not found in HashSet`,
        highlightBucket: hash,
        found: false,
      });
      
      setConsoleOutput(prev => [...prev, `Contains: ${value} → not found`]);
    }
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
  }, [buckets]);

  // Event handlers
  const handleAdd = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    addToHashSet(value);
    setInputValue('');
  };

  const handleRemove = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    removeFromHashSet(value);
    setInputValue('');
  };

  const handleContains = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    
    resetAnimation();
    containsInHashSet(value);
  };

  const clearHashSet = () => {
    resetAnimation();
    setBuckets(Array.from({ length: BUCKET_SIZE }, (_, index) => ({
      index,
      items: [],
    })));
    setConsoleOutput(prev => [...prev, 'HashSet cleared']);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const createSampleHashSet = () => {
    resetAnimation();
    const sampleValues = [15, 25, 35, 12, 22, 32, 18, 28];
    const newBuckets = Array.from({ length: BUCKET_SIZE }, (_, index) => ({
      index,
      items: [] as HashSetItem[],
    }));
    
    sampleValues.forEach(value => {
      const hash = hashFunction(value);
      const item: HashSetItem = {
        id: generateId(),
        value,
        hash,
      };
      newBuckets[hash].items.push(item);
    });
    
    setBuckets(newBuckets);
    setConsoleOutput(prev => [...prev, `Sample HashSet created with values: ${sampleValues.join(', ')}`]);
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
  const totalItems = buckets.reduce((sum, bucket) => sum + bucket.items.length, 0);
  const loadFactor = totalItems / BUCKET_SIZE;
  const collisions = buckets.filter(bucket => bucket.items.length > 1).length;

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
                HashSet Visualization (Hash: n % 10)
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

              {/* HashSet Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  HashSet Operations
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAdd}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                    <button
                      onClick={handleRemove}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <Minus size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Operations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search Operations
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
                    onClick={handleContains}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <Search size={16} />
                    Contains
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
                    onClick={createSampleHashSet}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Sample HashSet
                  </button>
                  <button
                    onClick={clearHashSet}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <Trash2 size={16} />
                    Clear HashSet
                  </button>
                </div>
              </div>

              {/* HashSet Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  HashSet Stats
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Total Items: {totalItems}</p>
                  <p>Buckets: {BUCKET_SIZE}</p>
                  <p>Load Factor: {loadFactor.toFixed(2)}</p>
                  <p>Collisions: {collisions}</p>
                  <p>Hash Function: n % {BUCKET_SIZE}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                HashSet Visualization
              </h2>
              
              <div className="space-y-3">
                {buckets.map(bucket => {
                  const isHighlighted = highlightedBucket === bucket.index;
                  
                  return (
                    <div key={bucket.index} className="flex items-start gap-4">
                      {/* Bucket Header */}
                      <div className={`min-w-[100px] text-center p-3 rounded-md font-semibold ${
                        isHighlighted
                          ? 'bg-yellow-400 text-yellow-900'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        Bucket {bucket.index}
                      </div>
                      
                      {/* Bucket Items - Horizontal chain */}
                      <div className="flex-1 min-h-[60px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-3 flex items-center gap-2">
                        <AnimatePresence>
                          {bucket.items.map((item, itemIndex) => {
                            const isItemHighlighted = highlightedItem === item.id;
                            
                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  scale: isItemHighlighted ? 1.05 : 1,
                                }}
                                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-white text-sm ${
                                  isItemHighlighted
                                    ? 'bg-yellow-500 shadow-lg'
                                    : 'bg-blue-500'
                                }`}
                              >
                                {item.value}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        
                        {bucket.items.length === 0 && (
                          <div className="text-gray-400 dark:text-gray-500 text-sm italic">
                            Empty
                          </div>
                        )}
                        
                        {/* Chain indicator for items > 1 */}
                        {bucket.items.length > 1 && (
                          <div className="ml-2 text-xs text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                            Chain ({bucket.items.length})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                <p>• Hash Function: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">hash(n) = n % 10</code></p>
                <p>• Collisions are resolved using chaining (linked lists)</p>
                <p>• Yellow highlighting shows current operation focus</p>
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