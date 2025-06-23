import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Minus, Search, Trash2 } from 'lucide-react';

interface GraphNode {
  id: string;
  value: string; // Changed to string to allow words
  label?: string; // Optional custom label
  x: number;
  y: number;
  visited?: boolean;
  distance?: number;
  previous?: string | null;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  directed?: boolean;
}

interface AnimationStep {
  type: 'bfs' | 'dfs' | 'dijkstra' | 'prim' | 'boruvka' | 'floyd-warshall' | 'add-node' | 'add-edge' | 'remove-node' | 'remove-edge';
  description: string;
  highlightNodeId?: string;
  highlightEdgeId?: string;
  visitedNodes?: string[];
  currentQueue?: string[];
  currentStack?: string[];
  distances?: Record<string, number>;
  path?: string[];
  mstEdges?: string[];
  distanceMatrix?: number[][];
  output?: string;
}

const SPEEDS = {
  slow: 2000,
  normal: 1500,
  fast: 800,
};

export default function GraphVisualization() {
  const [nodes, setNodes] = useState<Record<string, GraphNode>>({});
  const [edges, setEdges] = useState<Record<string, GraphEdge>>({});
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isDirected, setIsDirected] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [nodeValue, setNodeValue] = useState('');
  const [nodeLabel, setNodeLabel] = useState('');
  const [startNodeId, setStartNodeId] = useState('');
  const [endNodeId, setEndNodeId] = useState('');
  const [fromNodeId, setFromNodeId] = useState('');
  const [toNodeId, setToNodeId] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [highlightedEdgeId, setHighlightedEdgeId] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Animation control functions
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setHighlightedNodeId(null);
    setHighlightedEdgeId(null);
    setVisitedNodes(new Set());
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
        if (step.highlightEdgeId) {
          setHighlightedEdgeId(step.highlightEdgeId);
        }
        if (step.visitedNodes) {
          setVisitedNodes(new Set(step.visitedNodes));
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
        setVisitedNodes(new Set());
      }
    }
  }, [currentStepIndex, animationSteps]);

  // Graph algorithms
  const breadthFirstSearch = useCallback((startId: string) => {
    const steps: AnimationStep[] = [];
    const visited = new Set<string>();
    const queue = [startId];
    
    steps.push({
      type: 'bfs',
      description: `Starting BFS from node ${nodes[startId]?.value}`,
      highlightNodeId: startId,
      currentQueue: [...queue],
    });
    
    while (queue.length > 0) {
      steps.push({
        type: 'bfs',
        description: `🔍 Dequeue from FRONT: ${nodes[queue[0]]?.value}`,
        currentQueue: [...queue],
        highlightNodeId: queue[0],
      });
      
      const currentId = queue.shift()!;
      
      if (visited.has(currentId)) {
        steps.push({
          type: 'bfs',
          description: `⚠️ Node ${nodes[currentId]?.value} already visited, skipping`,
          currentQueue: [...queue],
        });
        continue;
      }
      
      visited.add(currentId);
      steps.push({
        type: 'bfs',
        description: `✅ Mark ${nodes[currentId]?.value} as visited`,
        highlightNodeId: currentId,
        visitedNodes: Array.from(visited),
        currentQueue: [...queue],
      });
      
      // Find neighbors
      const neighbors = Object.values(edges)
        .filter(edge => edge.from === currentId || (!isDirected && edge.to === currentId))
        .map(edge => edge.from === currentId ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId));
      
      if (neighbors.length > 0) {
        const newNeighbors: string[] = [];
        neighbors.forEach(neighborId => {
          if (!queue.includes(neighborId)) {
            queue.push(neighborId);
            newNeighbors.push(neighborId);
          }
        });
        
        if (newNeighbors.length > 0) {
          steps.push({
            type: 'bfs',
            description: `➕ Enqueue to REAR: ${newNeighbors.map(id => nodes[id]?.value).join(', ')}`,
            currentQueue: [...queue],
          });
        }
      } else {
        steps.push({
          type: 'bfs',
          description: `🚫 No unvisited neighbors for ${nodes[currentId]?.value}`,
          currentQueue: [...queue],
        });
      }
    }
    
    steps.push({
      type: 'bfs',
      description: 'BFS traversal complete',
      visitedNodes: Array.from(visited),
      output: `BFS Complete: Visited ${visited.size} nodes`
    });
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    const visitedValues = Array.from(visited).map(id => nodes[id].value).join(' → ');
    setConsoleOutput(prev => [...prev, `BFS Traversal: ${visitedValues}`]);
  }, [nodes, edges, isDirected]);

  const depthFirstSearch = useCallback((startId: string) => {
    const steps: AnimationStep[] = [];
    const visited = new Set<string>();
    const stack = [startId];
    
    steps.push({
      type: 'dfs',
      description: `Starting DFS from node ${nodes[startId]?.value}`,
      highlightNodeId: startId,
      currentStack: [...stack],
    });
    
    while (stack.length > 0) {
      steps.push({
        type: 'dfs',
        description: `🔍 Pop from TOP: ${nodes[stack[stack.length - 1]]?.value}`,
        currentStack: [...stack],
        highlightNodeId: stack[stack.length - 1],
      });
      
      const currentId = stack.pop()!;
      
      if (visited.has(currentId)) {
        steps.push({
          type: 'dfs',
          description: `⚠️ Node ${nodes[currentId]?.value} already visited, skipping`,
          currentStack: [...stack],
        });
        continue;
      }
      
      visited.add(currentId);
      steps.push({
        type: 'dfs',
        description: `✅ Mark ${nodes[currentId]?.value} as visited`,
        highlightNodeId: currentId,
        visitedNodes: Array.from(visited),
        currentStack: [...stack],
      });
      
      // Find neighbors (add in reverse order for correct DFS traversal)
      const neighbors = Object.values(edges)
        .filter(edge => edge.from === currentId || (!isDirected && edge.to === currentId))
        .map(edge => edge.from === currentId ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId))
        .reverse();
      
      if (neighbors.length > 0) {
        const newNeighbors: string[] = [];
        neighbors.forEach(neighborId => {
          if (!stack.includes(neighborId)) {
            stack.push(neighborId);
            newNeighbors.push(neighborId);
          }
        });
        
        if (newNeighbors.length > 0) {
          steps.push({
            type: 'dfs',
            description: `📚 Push to TOP: ${newNeighbors.map(id => nodes[id]?.value).join(', ')}`,
            currentStack: [...stack],
          });
        }
      } else {
        steps.push({
          type: 'dfs',
          description: `🚫 No unvisited neighbors for ${nodes[currentId]?.value}`,
          currentStack: [...stack],
        });
      }
    }
    
    steps.push({
      type: 'dfs',
      description: 'DFS traversal complete',
      visitedNodes: Array.from(visited),
      output: `DFS Complete: Visited ${visited.size} nodes`
    });
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    const visitedValues = Array.from(visited).map(id => nodes[id].value).join(' → ');
    setConsoleOutput(prev => [...prev, `DFS Traversal: ${visitedValues}`]);
  }, [nodes, edges, isDirected]);

  const dijkstraAlgorithm = useCallback((startId: string) => {
    const steps: AnimationStep[] = [];
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set(Object.keys(nodes));
    
    // Initialize distances
    Object.keys(nodes).forEach(nodeId => {
      distances[nodeId] = nodeId === startId ? 0 : Infinity;
      previous[nodeId] = null;
    });
    
    steps.push({
      type: 'dijkstra',
      description: `Starting Dijkstra's algorithm from node ${nodes[startId]?.value}`,
      highlightNodeId: startId,
      distances: { ...distances },
    });
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentId = '';
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
        type: 'dijkstra',
        description: `Processing node ${nodes[currentId]?.value} with distance ${distances[currentId]}`,
        highlightNodeId: currentId,
        distances: { ...distances },
      });
      
      // Update distances to neighbors
      const neighborEdges = Object.values(edges).filter(edge => 
        edge.from === currentId || (!isDirected && edge.to === currentId)
      );
      
      neighborEdges.forEach(edge => {
        const neighborId = edge.from === currentId ? edge.to : edge.from;
        
        if (unvisited.has(neighborId)) {
          const newDistance = distances[currentId] + edge.weight;
          
          if (newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance;
            previous[neighborId] = currentId;
            
            steps.push({
              type: 'dijkstra',
              description: `Updated distance to node ${nodes[neighborId]?.value}: ${newDistance}`,
              highlightNodeId: neighborId,
              highlightEdgeId: edge.id,
              distances: { ...distances },
            });
          }
        }
      });
    }
    
    steps.push({
      type: 'dijkstra',
      description: "Dijkstra's algorithm complete",
      distances: { ...distances },
      output: "Dijkstra's algorithm complete - shortest paths computed"
    });
    
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    
    // Output results to console
    let output = `Dijkstra's Results from node ${nodes[startId].value}:\n`;
    Object.keys(distances).forEach(nodeId => {
      if (nodeId !== startId && distances[nodeId] !== Infinity) {
        output += `To node ${nodes[nodeId].value}: distance = ${distances[nodeId]}\n`;
      }
    });
    setConsoleOutput(prev => [...prev, output]);
  }, [nodes, edges, isDirected]);

  // Prim's Minimum Spanning Tree Algorithm
  const primMST = useCallback(() => {
    if (Object.keys(nodes).length === 0) return;
    
    const steps: AnimationStep[] = [];
    const nodeIds = Object.keys(nodes);
    const visited = new Set<string>();
    const mstEdges: string[] = [];
    let totalWeight = 0;
    
    // Start with first node
    const startId = nodeIds[0];
    visited.add(startId);
    
    steps.push({
      type: 'prim',
      description: `Starting Prim's MST from node ${nodes[startId].value}`,
      highlightNodeId: startId,
      visitedNodes: [startId],
      output: `Prim's MST Algorithm Started from node ${nodes[startId].value}`
    });
    
    while (visited.size < nodeIds.length) {
      let minWeight = Infinity;
      let selectedEdge: GraphEdge | null = null;
      
      // Find minimum weight edge connecting visited to unvisited nodes
      for (const edge of Object.values(edges)) {
        const fromVisited = visited.has(edge.from);
        const toVisited = visited.has(edge.to);
        
        if ((fromVisited && !toVisited) || (!fromVisited && toVisited)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            selectedEdge = edge;
          }
        }
      }
      
      if (!selectedEdge) break; // No more edges to add
      
      const newNodeId = visited.has(selectedEdge.from) ? selectedEdge.to : selectedEdge.from;
      visited.add(newNodeId);
      mstEdges.push(selectedEdge.id);
      totalWeight += selectedEdge.weight;
      
      steps.push({
        type: 'prim',
        description: `Added edge (${nodes[selectedEdge.from].value}, ${nodes[selectedEdge.to].value}) with weight ${selectedEdge.weight}`,
        highlightNodeId: newNodeId,
        highlightEdgeId: selectedEdge.id,
        visitedNodes: Array.from(visited),
        mstEdges: [...mstEdges],
        output: `Added edge: ${nodes[selectedEdge.from].value} - ${nodes[selectedEdge.to].value} (weight: ${selectedEdge.weight})`
      });
    }
    
    steps.push({
      type: 'prim',
      description: `Prim's MST complete. Total weight: ${totalWeight}`,
      visitedNodes: Array.from(visited),
      mstEdges: [...mstEdges],
      output: `MST Complete! Total weight: ${totalWeight}, Edges: ${mstEdges.length}`
    });
    
    setAnimationSteps(steps);
    setConsoleOutput(prev => [...prev, `Prim's MST: Total weight = ${totalWeight}`]);
  }, [nodes, edges]);

  // Borůvka's (Sollin's) Algorithm
  const boruvkaMST = useCallback(() => {
    if (Object.keys(nodes).length === 0) return;
    
    const steps: AnimationStep[] = [];
    const nodeIds = Object.keys(nodes);
    const mstEdges: string[] = [];
    let totalWeight = 0;
    
    // Initialize each node as its own component
    const components = new Map<string, Set<string>>();
    nodeIds.forEach(id => {
      components.set(id, new Set([id]));
    });
    
    steps.push({
      type: 'boruvka',
      description: `Starting Borůvka's MST algorithm with ${nodeIds.length} components`,
      output: `Borůvka's Algorithm: Each node starts as separate component`
    });
    
    while (components.size > 1) {
      const cheapestEdges = new Map<string, GraphEdge>();
      
      // Find cheapest edge for each component
      for (const [compId, compNodes] of components) {
        let cheapest: GraphEdge | null = null;
        
        for (const edge of Object.values(edges)) {
          const fromComp = [...components.entries()].find(([_, nodes]) => nodes.has(edge.from))?.[0];
          const toComp = [...components.entries()].find(([_, nodes]) => nodes.has(edge.to))?.[0];
          
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
      
      // Add unique cheapest edges to MST
      const addedEdges = new Set<string>();
      for (const edge of cheapestEdges.values()) {
        if (!addedEdges.has(edge.id) && !mstEdges.includes(edge.id)) {
          mstEdges.push(edge.id);
          addedEdges.add(edge.id);
          totalWeight += edge.weight;
          
          // Merge components
          const fromComp = [...components.entries()].find(([_, nodes]) => nodes.has(edge.from));
          const toComp = [...components.entries()].find(([_, nodes]) => nodes.has(edge.to));
          
          if (fromComp && toComp && fromComp[0] !== toComp[0]) {
            const mergedNodes = new Set([...fromComp[1], ...toComp[1]]);
            components.delete(fromComp[0]);
            components.delete(toComp[0]);
            components.set(edge.id, mergedNodes);
          }
          
          steps.push({
            type: 'boruvka',
            description: `Added edge (${nodes[edge.from].value}, ${nodes[edge.to].value}) with weight ${edge.weight}`,
            highlightEdgeId: edge.id,
            mstEdges: [...mstEdges],
            output: `Added edge: ${nodes[edge.from].value} - ${nodes[edge.to].value} (weight: ${edge.weight})`
          });
        }
      }
      
      if (addedEdges.size === 0) break; // No more edges to add
    }
    
    steps.push({
      type: 'boruvka',
      description: `Borůvka's MST complete. Total weight: ${totalWeight}`,
      mstEdges: [...mstEdges],
      output: `MST Complete! Total weight: ${totalWeight}, Edges: ${mstEdges.length}`
    });
    
    setAnimationSteps(steps);
    setConsoleOutput(prev => [...prev, `Borůvka's MST: Total weight = ${totalWeight}`]);
  }, [nodes, edges]);

  // Floyd-Warshall Algorithm
  const floydWarshall = useCallback(() => {
    const nodeIds = Object.keys(nodes);
    if (nodeIds.length === 0) return;
    
    const steps: AnimationStep[] = [];
    const n = nodeIds.length;
    const dist: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    // Initialize distance matrix
    nodeIds.forEach((id, i) => {
      dist[i][i] = 0;
    });
    
    // Set edge weights
    Object.values(edges).forEach(edge => {
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
      type: 'floyd-warshall',
      description: 'Floyd-Warshall: Initial distance matrix created',
      distanceMatrix: dist.map(row => [...row]),
      output: 'Floyd-Warshall Algorithm: Computing all-pairs shortest paths'
    });
    
    // Main algorithm
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            
            steps.push({
              type: 'floyd-warshall',
              description: `Updated distance from ${nodes[nodeIds[i]].value} to ${nodes[nodeIds[j]].value} via ${nodes[nodeIds[k]].value}: ${dist[i][j]}`,
              highlightNodeId: nodeIds[k],
              distanceMatrix: dist.map(row => [...row]),
              output: `Path ${nodes[nodeIds[i]].value} → ${nodes[nodeIds[j]].value} via ${nodes[nodeIds[k]].value}: distance = ${dist[i][j]}`
            });
          }
        }
      }
    }
    
    steps.push({
      type: 'floyd-warshall',
      description: 'Floyd-Warshall algorithm complete',
      distanceMatrix: dist.map(row => [...row]),
      output: 'All-pairs shortest paths computed successfully'
    });
    
    setAnimationSteps(steps);
    
    // Output results to console
    let output = 'Floyd-Warshall Results:\n';
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && dist[i][j] !== Infinity) {
          output += `${nodes[nodeIds[i]].value} → ${nodes[nodeIds[j]].value}: ${dist[i][j]}\n`;
        }
      }
    }
    setConsoleOutput(prev => [...prev, output]);
  }, [nodes, edges, isDirected]);

  // Graph manipulation functions
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const value = nodeValue.trim();
    if (!value) {
      alert('Please enter a node name/value');
      return;
    }
    
    const newNode: GraphNode = {
      id: generateId(),
      value,
      label: nodeLabel.trim() || undefined,
      x,
      y,
    };
    
    setNodes(prev => ({ ...prev, [newNode.id]: newNode }));
    setNodeValue('');
    setNodeLabel('');
  };

  const addNodeAtPosition = () => {
    const value = nodeValue.trim();
    if (!value) {
      alert('Please enter a node name/value');
      return;
    }
    
    const newNode: GraphNode = {
      id: generateId(),
      value,
      label: nodeLabel.trim() || undefined,
      x: Math.random() * 600 + 100,
      y: Math.random() * 300 + 100,
    };
    
    setNodes(prev => ({ ...prev, [newNode.id]: newNode }));
    setNodeValue('');
    setNodeLabel('');
  };

  const handleNodeClick = (nodeId: string) => {
    // Node clicking no longer used for selection
    // Could be used for other purposes like showing node info
  };

  const addEdge = () => {
    if (selectedNodes.length !== 2) {
      alert('Please select exactly 2 nodes to create an edge');
      return;
    }
    
    const weight = parseInt(edgeWeight);
    if (isNaN(weight)) {
      alert('Please enter a valid edge weight');
      return;
    }
    
    const newEdge: GraphEdge = {
      id: generateId(),
      from: selectedNodes[0],
      to: selectedNodes[1],
      weight,
      directed: isDirected,
    };
    
    setEdges(prev => ({ ...prev, [newEdge.id]: newEdge }));
    setSelectedNodes([]);
  };

  const addEdgeByNodeIds = () => {
    const weight = parseInt(edgeWeight);
    
    if (!fromNodeId || !toNodeId || isNaN(weight)) {
      alert('Please select both nodes and enter a valid edge weight');
      return;
    }
    
    if (fromNodeId === toNodeId) {
      alert('Cannot create edge from a node to itself');
      return;
    }
    
    // Check if edge already exists
    const existingEdge = Object.values(edges).find(edge => 
      (edge.from === fromNodeId && edge.to === toNodeId) ||
      (!isDirected && edge.from === toNodeId && edge.to === fromNodeId)
    );
    
    if (existingEdge) {
      alert('Edge already exists between these nodes');
      return;
    }
    
    const newEdge: GraphEdge = {
      id: generateId(),
      from: fromNodeId,
      to: toNodeId,
      weight,
      directed: isDirected,
    };
    
    setEdges(prev => ({ ...prev, [newEdge.id]: newEdge }));
    setFromNodeId('');
    setToNodeId('');
  };

  const removeNode = (nodeId: string) => {
    setNodes(prev => {
      const newNodes = { ...prev };
      delete newNodes[nodeId];
      return newNodes;
    });
    
    // Remove edges connected to this node
    setEdges(prev => {
      const newEdges = { ...prev };
      Object.keys(newEdges).forEach(edgeId => {
        if (newEdges[edgeId].from === nodeId || newEdges[edgeId].to === nodeId) {
          delete newEdges[edgeId];
        }
      });
      return newEdges;
    });
    
    // Clear edge form if this node was selected
    if (fromNodeId === nodeId) setFromNodeId('');
    if (toNodeId === nodeId) setToNodeId('');
  };

  const clearGraph = () => {
    resetAnimation();
    setNodes({});
    setEdges({});
    setFromNodeId('');
    setToNodeId('');
  };

  const createSampleGraph = () => {
    resetAnimation();
    
    const sampleNodes: Record<string, GraphNode> = {
      'n1': { id: 'n1', value: 'A', x: 150, y: 100 },
      'n2': { id: 'n2', value: 'B', x: 300, y: 100 },
      'n3': { id: 'n3', value: 'C', x: 450, y: 100 },
      'n4': { id: 'n4', value: 'D', x: 150, y: 250 },
      'n5': { id: 'n5', value: 'E', x: 300, y: 250 },
      'n6': { id: 'n6', value: 'F', x: 450, y: 250 },
    };
    
    const sampleEdges: Record<string, GraphEdge> = {
      'e1': { id: 'e1', from: 'n1', to: 'n2', weight: 4, directed: isDirected },
      'e2': { id: 'e2', from: 'n1', to: 'n4', weight: 2, directed: isDirected },
      'e3': { id: 'e3', from: 'n2', to: 'n3', weight: 3, directed: isDirected },
      'e4': { id: 'e4', from: 'n2', to: 'n5', weight: 1, directed: isDirected },
      'e5': { id: 'e5', from: 'n3', to: 'n6', weight: 5, directed: isDirected },
      'e6': { id: 'e6', from: 'n4', to: 'n5', weight: 7, directed: isDirected },
      'e7': { id: 'e7', from: 'n5', to: 'n6', weight: 2, directed: isDirected },
    };
    
    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setFromNodeId('');
    setToNodeId('');
  };

  // Event handlers
  const handleBFS = () => {
    if (!startNodeId) {
      alert('Please select a start node');
      return;
    }
    resetAnimation();
    breadthFirstSearch(startNodeId);
  };

  const handleDFS = () => {
    if (!startNodeId) {
      alert('Please select a start node');
      return;
    }
    resetAnimation();
    depthFirstSearch(startNodeId);
  };

  const handleDijkstra = () => {
    if (!startNodeId) {
      alert('Please select a start node');
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
  const nodeList = Object.values(nodes);
  const edgeList = Object.values(edges);

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
                Graph Visualization
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

              {/* Graph Construction */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Build Graph
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={isDirected}
                        onChange={(e) => setIsDirected(e.target.checked)}
                        className="rounded"
                      />
                      Directed Graph
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={nodeValue}
                      onChange={(e) => setNodeValue(e.target.value)}
                      placeholder="Node name/value (required)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                    <input
                      type="text"
                      value={nodeLabel}
                      onChange={(e) => setNodeLabel(e.target.value)}
                      placeholder="Node label (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addNodeAtPosition}
                        disabled={!nodeValue}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                      >
                        <Plus size={14} />
                        Add Node
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      • Click "Add Node" or click on canvas to add node
                      • Use words, letters, or numbers for node names
                      • Multiple nodes can have the same name
                      • Use labels to distinguish similar nodes
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={edgeWeight}
                      onChange={(e) => setEdgeWeight(e.target.value)}
                      placeholder="Edge weight"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Or add edge by selecting nodes:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={fromNodeId}
                          onChange={(e) => setFromNodeId(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        >
                          <option value="">From Node</option>
                          {nodeList.map(node => (
                            <option key={node.id} value={node.id}>
                              {node.value} {node.label ? `(${node.label})` : ''}
                            </option>
                          ))}
                        </select>
                        <select
                          value={toNodeId}
                          onChange={(e) => setToNodeId(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        >
                          <option value="">To Node</option>
                          {nodeList.map(node => (
                            <option key={node.id} value={node.id}>
                              {node.value} {node.label ? `(${node.label})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={addEdgeByNodeIds}
                        disabled={!fromNodeId || !toNodeId || !edgeWeight}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 text-sm mt-2"
                      >
                        <Plus size={14} />
                        Add Edge by Selection
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Algorithm Controls */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Graph Algorithms
                </h3>
                <div className="space-y-3">
                  <select
                    value={startNodeId}
                    onChange={(e) => setStartNodeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select start node</option>
                    {nodeList.map(node => (
                      <option key={node.id} value={node.id}>
                        {node.value}
                      </option>
                    ))}
                  </select>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleBFS}
                      disabled={!startNodeId || isPlaying}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 text-sm"
                    >
                      <Search size={14} />
                      BFS
                    </button>
                    
                    <button
                      onClick={handleDFS}
                      disabled={!startNodeId || isPlaying}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 text-sm"
                    >
                      <Search size={14} />
                      DFS
                    </button>
                    
                    <button
                      onClick={handleDijkstra}
                      disabled={!startNodeId || isPlaying}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 text-sm"
                    >
                      <Search size={14} />
                      Dijkstra's
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Minimum Spanning Tree:
                      </p>
                      <button
                        onClick={handlePrim}
                        disabled={isPlaying || Object.keys(nodes).length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 text-sm mb-2"
                      >
                        <Search size={14} />
                        Prim's MST
                      </button>
                      
                      <button
                        onClick={handleBoruvka}
                        disabled={isPlaying || Object.keys(nodes).length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 text-sm mb-2"
                      >
                        <Search size={14} />
                        Borůvka's MST
                      </button>
                      
                      <button
                        onClick={handleFloydWarshall}
                        disabled={isPlaying || Object.keys(nodes).length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-400 text-sm"
                      >
                        <Search size={14} />
                        Floyd-Warshall
                      </button>
                    </div>
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
                    onClick={createSampleGraph}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Create Sample Graph
                  </button>
                  <button
                    onClick={clearGraph}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                  >
                    <Trash2 size={14} />
                    Clear Graph
                  </button>
                </div>
              </div>

              {/* Graph Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Graph Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Nodes: {nodeList.length}</p>
                  <p>Edges: {edgeList.length}</p>
                  <p>Type: {isDirected ? 'Directed' : 'Undirected'}</p>
                  <p>Unique Names: {new Set(nodeList.map(n => n.value)).size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            {/* Stack/Queue Visualization - Show during algorithm execution */}
            {(currentStep?.currentStack || currentStep?.currentQueue) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentStep?.currentStack ? 'Stack (DFS)' : 'Queue (BFS)'} Operations
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Step {currentStepIndex + 1}/{animationSteps.length}
                  </div>
                </div>

                {/* Stack Visualization */}
                {currentStep?.currentStack && (
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Stack (LIFO - Last In, First Out)
                    </div>
                    <div className="border-2 border-indigo-300 dark:border-indigo-600 rounded-lg p-3 min-h-[100px] min-w-[200px] flex flex-col-reverse items-center justify-start gap-1">
                      {currentStep.currentStack.length === 0 ? (
                        <div className="text-gray-400 dark:text-gray-500 text-sm">Empty Stack</div>
                      ) : (
                        currentStep.currentStack.map((nodeId, index) => (
                          <motion.div
                            key={`${nodeId}-${index}`}
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`px-3 py-2 rounded-md font-semibold text-white min-w-[60px] text-center ${
                              index === (currentStep.currentStack?.length ?? 0) - 1
                                ? 'bg-indigo-600 border-2 border-indigo-400' // Top of stack
                                : 'bg-indigo-500'
                            }`}
                          >
                            {nodes[nodeId]?.value || nodeId}
                            {index === (currentStep.currentStack?.length ?? 0) - 1 && (
                              <div className="text-xs text-indigo-200">← TOP</div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Queue Visualization */}
                {currentStep?.currentQueue && (
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Queue (FIFO - First In, First Out)
                    </div>
                    <div className="border-2 border-purple-300 dark:border-purple-600 rounded-lg p-3 min-h-[80px] min-w-[200px] flex items-center justify-center gap-1">
                      {currentStep.currentQueue.length === 0 ? (
                        <div className="text-gray-400 dark:text-gray-500 text-sm">Empty Queue</div>
                      ) : (
                        <>
                          <div className="text-xs text-purple-600 dark:text-purple-400 mr-2">
                            FRONT →
                          </div>
                          {currentStep.currentQueue.map((nodeId, index) => (
                            <motion.div
                              key={`${nodeId}-${index}`}
                              initial={{ opacity: 0, x: -20, scale: 0.8 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 20, scale: 0.8 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className={`px-3 py-2 rounded-md font-semibold text-white min-w-[60px] text-center ${
                                index === 0
                                  ? 'bg-purple-600 border-2 border-purple-400' // Front of queue
                                  : 'bg-purple-500'
                              }`}
                            >
                              {nodes[nodeId]?.value || nodeId}
                            </motion.div>
                          ))}
                          <div className="text-xs text-purple-600 dark:text-purple-400 ml-2">
                            → REAR
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Graph Visualization
              </h2>
              
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <svg
                  ref={svgRef}
                  width="800"
                  height="500"
                  className="bg-gray-50 dark:bg-gray-900 cursor-crosshair"
                  onClick={handleSvgClick}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        className="fill-gray-600 dark:fill-gray-400"
                      />
                    </marker>
                  </defs>

                  {/* Edges */}
                  {edgeList.map(edge => {
                    const fromNode = nodes[edge.from];
                    const toNode = nodes[edge.to];
                    if (!fromNode || !toNode) return null;
                    
                    const isHighlighted = highlightedEdgeId === edge.id;
                    const isMSTEdge = currentStep?.mstEdges?.includes(edge.id);
                    
                    // Calculate edge midpoint
                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2;
                    
                    // Calculate perpendicular offset for weight label
                    const dx = toNode.x - fromNode.x;
                    const dy = toNode.y - fromNode.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    
                    // Normalize and rotate 90 degrees for perpendicular offset
                    const offsetDistance = 12; // Distance from edge line
                    const offsetX = length > 0 ? (-dy / length) * offsetDistance : 0;
                    const offsetY = length > 0 ? (dx / length) * offsetDistance : 0;
                    
                    // Position weight label with offset
                    const labelX = midX + offsetX;
                    const labelY = midY + offsetY;
                    
                    return (
                      <g key={edge.id}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          className={`stroke-2 ${
                            isHighlighted
                              ? 'stroke-yellow-500'
                              : isMSTEdge
                              ? 'stroke-green-500'
                              : 'stroke-gray-600 dark:stroke-gray-400'
                          }`}
                          markerEnd={isDirected ? "url(#arrowhead)" : undefined}
                        />
                        
                        {/* Edge weight label background */}
                        <rect
                          x={labelX - 8}
                          y={labelY - 8}
                          width="16"
                          height="16"
                          rx="2"
                          ry="2"
                          className={`${
                            isMSTEdge
                              ? 'fill-green-100 dark:fill-green-900 stroke-green-300 dark:stroke-green-600'
                              : 'fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'
                          } stroke-1`}
                        />
                        
                        {/* Edge weight label */}
                        <text
                          x={labelX}
                          y={labelY + 3}
                          textAnchor="middle"
                          className={`text-xs font-bold ${
                            isMSTEdge
                              ? 'fill-green-800 dark:fill-green-200'
                              : 'fill-gray-800 dark:fill-gray-200'
                          }`}
                        >
                          {edge.weight}
                        </text>
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  <AnimatePresence>
                    {nodeList.map(node => {
                      const isHighlighted = highlightedNodeId === node.id;
                      const isVisited = visitedNodes.has(node.id);
                      
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
                            className={`cursor-pointer stroke-2 ${
                              isHighlighted
                                ? 'fill-yellow-400 stroke-yellow-600'
                                : isVisited
                                ? 'fill-green-400 stroke-green-600'
                                : 'fill-blue-500 stroke-blue-700 hover:fill-blue-400'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNodeClick(node.id);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              removeNode(node.id);
                            }}
                          />
                          <text
                            x={node.x}
                            y={node.y + 4}
                            textAnchor="middle"
                            className="text-sm font-bold fill-white pointer-events-none"
                          >
                            {node.value}
                          </text>
                          {node.label && (
                            <text
                              x={node.x}
                              y={node.y + 35}
                              textAnchor="middle"
                              className="text-xs fill-gray-600 dark:fill-gray-400 pointer-events-none"
                            >
                              {node.label}
                            </text>
                          )}
                        </motion.g>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* Instructions */}
                  {nodeList.length === 0 && (
                    <text
                      x="400"
                      y="250"
                      textAnchor="middle"
                      className="text-lg fill-gray-500 dark:fill-gray-400"
                    >
                      Enter a node name and click to add nodes
                    </text>
                  )}
                </svg>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                <p>• Click canvas to add nodes • Double-click nodes to remove</p>
                <p>• Use dropdown menus to create edges between any nodes</p>
                <p>• Nodes can have duplicate names - use labels to distinguish them</p>
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
                    Console output will appear here when you run algorithms...
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