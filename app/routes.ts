import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("linked-list", "routes/linked-list.tsx"),
  route("binary-search-tree", "routes/binary-search-tree.tsx"),
  route("stack", "routes/stack.tsx"),
  route("queue", "routes/queue.tsx"),
  route("graph", "routes/graph.tsx"),
  route("trie", "routes/trie.tsx"),
  route("hashset", "routes/hashset.tsx"),
  route("hashtable", "routes/hashtable.tsx"),
  route("heapq", "routes/heapq.tsx"),
] satisfies RouteConfig;
