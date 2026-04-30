# HashMap Implementation - Data Structures & Algorithms

A comprehensive implementation of a Hash Map (Dictionary) in JavaScript, demonstrating fundamental computer science concepts including hash functions, collision resolution, dynamic resizing, and complexity analysis.

## Learning Objectives

This project was specifically designed to demonstrate and practice:

- **Hash Table Data Structure** - Understanding key-value pair storage
- **Hash Functions** - Converting keys to array indices
- **Collision Resolution** - Handling hash collisions with separate chaining
- **Dynamic Resizing** - Growing capacity based on load factor
- **Time Complexity Analysis** - Average vs worst-case scenarios
- **Space Complexity Analysis** - Memory usage evaluation

## Project Architecture

```
hashmap/
├── LinkedListNode.js        # Building block for chains
├── HashMapNode.js           # Key-value pair node
├── HashMapLinkedList.js     # Separate chaining implementation
├── HashMap.js               # Main HashMap implementation
└── README.md                # Documentation
```

## Core Components

### 1. HashMapNode (Key-Value Storage)

```javascript
// HashMapNode.js
export default class HashMapNode {
  constructor(key = null, value = null) {
    this.key = key; // Unique identifier
    this.value = value; // Associated data
  }
}
```

### 2. LinkedListNode (Chain Building Block)

```javascript
// LinkedListNode.js
export default class LinkedListNode {
  constructor(value = null, next = null) {
    this.value = value; // Holds HashMapNode
    this.next = next; // Next in chain
  }
}
```

### 3. HashMapLinkedList (Collision Chain)

```javascript
// HashMapLinkedList.js
export default class HashMapLinkedList {
  constructor() {
    this._head = new LinkedListNode(); // Dummy head
    this._tail = this._head;
    this._size = 0;
  }

  findKey(key)  // Search for key in chain
  removeKey(key) // Remove key from chain
  append(value)  // Add to end of chain
  // ...
}
```

### 4. HashMap (Main Implementation)

```javascript
// HashMap.js
export default class HashMap {
  constructor(capacity = 16, loadfactor = 0.75) {
    this.capacity = capacity; // Number of buckets
    this.loadfactor = loadfactor; // Resize threshold
    this.buckets = new Array(capacity); // Storage buckets
    this.totalEntries = 0; // Total key-value pairs
  }
  // ...
}
```

## Hash Function Implementation

```javascript
hash(key) {
  let hashCode = 0;
  const primeNumber = 31;

  for (let i = 0; i < key.length; i++) {
    hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
  }

  return hashCode;
}
```

**Hash Function Properties:**

- **Deterministic** - Same key always produces same hash
- **Uniform Distribution** - Spreads keys evenly across buckets
- **Efficient** - O(k) where k is key length
- **Prime Number Multiplier** - Reduces collisions (31 is commonly used)

**Why Modulo?**

- `% this.capacity` ensures hash fits in bucket array
- Creates index between 0 and capacity-1

## Collision Resolution: Separate Chaining

When two keys hash to the same index, they're stored in a linked list:

```
Bucket Array:     Chain (Linked List)
┌─────────┐
│ 0       │ → null
├─────────┤
│ 1       │ → [key:"cat", value:"meow"] → [key:"car", value:"vroom"] → null
├─────────┤
│ 2       │ → null
├─────────┤
│ 3       │ → [key:"dog", value:"bark"] → null
├─────────┤
│ ...     │
└─────────┘
```

**Collision Resolution Visualization:**

```
hash("cat") = 1 ──┐
hash("car") = 1 ──┼── Same bucket! Store in linked list
hash("dog") = 3 ──┘
```

## Time Complexity Analysis

### Operation Complexities Table

| Operation         | Average Case | Worst Case | Explanation            |
| ----------------- | ------------ | ---------- | ---------------------- |
| `set(key, value)` | **O(1)**     | O(n)       | Hash + chain insertion |
| `get(key)`        | **O(1)**     | O(n)       | Hash + chain search    |
| `has(key)`        | **O(1)**     | O(n)       | Hash + chain search    |
| `remove(key)`     | **O(1)**     | O(n)       | Hash + chain deletion  |
| `entries()`       | **O(n)**     | O(n)       | Iterate all buckets    |
| `keys()`          | **O(n)**     | O(n)       | Iterate all entries    |
| `values()`        | **O(n)**     | O(n)       | Iterate all entries    |
| `clear()`         | **O(1)**     | O(1)       | Reset array            |
| `length()`        | **O(1)**     | O(1)       | Return cached count    |
| `grow()`          | **O(n)**     | O(n)       | Rehash all entries     |

### Visual Complexity Analysis

```
Best Case (No Collisions):
┌─────────────────────────────────────┐
│ set("cat", "meow")                  │
│ 1. Hash → O(k) where k = key length │
│ 2. Access bucket → O(1)             │
│ 3. Insert (empty bucket) → O(1)     │
│ Total: O(1) constant time!          │
└─────────────────────────────────────┘

Average Case (Few Collisions):
┌─────────────────────────────────────┐
│ set("car", "vroom")                 │
│ 1. Hash → O(k)                      │
│ 2. Access bucket → O(1)             │
│ 3. Traverse short chain → O(λ)      │
│    λ = load factor (avg chain length)│
│ Total: O(1 + λ) ≈ O(1)              │
└─────────────────────────────────────┘

Worst Case (All Keys Collide):
┌─────────────────────────────────────┐
│ All keys → same bucket!             │
│ Chain length = n (all entries)      │
│ Get/Set becomes O(n) → like array   │
│ Good hash function prevents this!   │
└─────────────────────────────────────┘
```

## Space Complexity Analysis

### Memory Breakdown

```javascript
// Space per entry
HashMapNode: {
  key: string,     // Reference (~8 bytes)
  value: any,      // Reference (~8 bytes)
  // Object overhead: ~40-60 bytes
}

LinkedListNode: {
  value: reference, // (~8 bytes)
  next: reference,  // (~8 bytes)
  // Object overhead: ~40-60 bytes
}

// Total per entry: ~120-150 bytes (approx)
// Space Complexity: O(n)
```

### Load Factor and Memory

```
Load Factor = totalEntries / capacity

Example with capacity = 16:
- loadfactor = 0.75 means resize when totalEntries > 12
- Trade-off: Memory vs Performance

Low Load Factor (0.25):
✓ Fewer collisions (faster)
✗ More empty buckets (more memory)

High Load Factor (0.9):
✓ Less memory waste
✗ More collisions (slower)
```

## Method Implementation Deep Dive

### 1. Set (Insert/Update) - Average O(1)

```javascript
set(key, value) {
  // 1. Calculate hash index
  const keyHash = this.hash(key);

  // 2. Get or create bucket
  const bucket = this.ensureBucket(keyHash);

  // 3. Search for existing key in chain
  let node = bucket.findKey(key);

  // 4. Update if exists, insert if new
  if (node) {
    node.value.value = value;  // Update
    return;
  }

  node = new HashMapNode(key, value);
  bucket.append(node);          // Insert
  this.totalEntries++;

  // 5. Check if resize needed
  if (this.totalEntries > this.capacity * this.loadfactor) {
    this.grow();
  }
}
```

**Step-by-Step Example:**

```
set("cat", "meow")

1. hash("cat") → 7
2. buckets[7] → chain exists or create new
3. Search chain for "cat" → not found
4. Append {key:"cat", value:"meow"} to chain
5. totalEntries++

Result:
buckets[7] = [key:"cat", value:"meow"] → null
```

### 2. Get (Retrieve) - Average O(1)

```javascript
get(key) {
  // 1. Calculate hash
  const keyHash = this.hash(key);

  // 2. Get bucket
  const bucket = this.buckets[keyHash];

  // 3. Search chain for key
  const node = bucket && bucket.findKey(key);

  // 4. Return value or null
  return node ? node.value.value : null;
}
```

### 3. Remove (Delete) - Average O(1)

```javascript
remove(key) {
  const keyHash = this.hash(key);
  const bucket = this.buckets[keyHash];

  if (bucket && bucket.removeKey(key)) {
    this.totalEntries--;
    return true;
  }

  return false;
}
```

### 4. Dynamic Resizing (Grow)

```javascript
grow() {
  // 1. Save all current entries
  const entries = this.entries();

  // 2. Reset state
  this.totalEntries = 0;
  this.capacity *= 2;        // Double capacity
  this.buckets = new Array(this.capacity);

  // 3. Rehash all entries into new buckets
  entries.forEach((entry) => this.set(entry.key, entry.value));
}
```

**Resizing Visualization:**

```
Before (capacity = 4, entries = 3):
┌───┬─────────────────────┐
│ 0 │ → null               │
│ 1 │ → [cat] → null       │
│ 2 │ → null               │
│ 3 │ → [dog] → [bird]→null│
└───┴─────────────────────┘
Load = 3/4 = 0.75 (trigger resize!)

After (capacity = 8, entries = 3):
┌───┬─────────────────────┐
│ 0 │ → null               │
│ 1 │ → [cat] → null       │
│ 2 │ → null               │
│ 3 │ → null               │
│ 4 │ → [bird] → null      │  ← Rehashed!
│ 5 │ → [dog] → null       │  ← Rehashed!
│ 6 │ → null               │
│ 7 │ → null               │
└───┴─────────────────────┘
Load = 3/8 = 0.375 (much lower!)
```

## Load Factor Deep Dive

### What is Load Factor?

```
Load Factor = Number of Entries / Number of Buckets

Example:
- 16 buckets, 12 entries → Load Factor = 0.75
- 16 buckets, 16 entries → Load Factor = 1.0
- 16 buckets, 24 entries → Load Factor = 1.5 (over capacity!)
```

### Choosing the Right Load Factor

| Load Factor | Memory   | Speed     | Use Case               |
| ----------- | -------- | --------- | ---------------------- |
| 0.5         | High     | Very Fast | Performance critical   |
| 0.75        | Medium   | Fast      | **Default (balanced)** |
| 1.0         | Low      | Medium    | Memory constrained     |
| 1.5         | Very Low | Slow      | Rare lookups           |

### Why 0.75 is the Default?

```
Mathematical sweet spot:
- Collision probability remains low
- Memory usage is reasonable
- Resize doesn't happen too often
- Empirically proven optimal
```

## HashMap vs Other Structures

| Operation         | HashMap | Array   | Linked List | Object/Map |
| ----------------- | ------- | ------- | ----------- | ---------- |
| Set by key        | O(1)    | O(1)\*  | O(n)        | O(1)       |
| Get by key        | O(1)    | O(1)\*  | O(n)        | O(1)       |
| Delete by key     | O(1)    | O(1)\*  | O(n)        | O(1)       |
| Iteration         | O(n)    | O(n)    | O(n)        | O(n)       |
| Memory (overhead) | Medium  | Low     | High        | Medium     |
| Key types         | Any     | Integer | Any         | Any (Map)  |

\*Arrays use integer indices, not arbitrary keys

## Usage Example

```javascript
import HashMap from "./HashMap.js";

// Create hash map with default capacity (16) and load factor (0.75)
const map = new HashMap();

// Set key-value pairs
map.set("apple", "red");
map.set("banana", "yellow");
map.set("grape", "purple");
map.set("apple", "green"); // Updates existing key

// Get values
console.log(map.get("apple")); // "green"
console.log(map.get("banana")); // "yellow"
console.log(map.get("orange")); // null

// Check existence
console.log(map.has("grape")); // true
console.log(map.has("orange")); // false

// Get all keys, values, entries
console.log(map.keys()); // ["apple", "banana", "grape"]
console.log(map.values()); // ["green", "yellow", "purple"]
console.log(map.entries()); // [{key:"apple", value:"green"}, ...]

// Remove entry
map.remove("banana");
console.log(map.has("banana")); // false

// Get length
console.log(map.length()); // 2

// Clear all entries
map.clear();
console.log(map.length()); // 0
```

## Collision Resolution Comparison

| Method                                      | Description            | Pros                            | Cons                      |
| ------------------------------------------- | ---------------------- | ------------------------------- | ------------------------- |
| **Separate Chaining** (This implementation) | Linked list per bucket | Simple, handles many collisions | Extra memory for pointers |
| Linear Probing                              | Find next empty slot   | Cache friendly                  | Clustering issues         |
| Quadratic Probing                           | Jump by squares        | Reduces clustering              | May skip empty slots      |
| Double Hashing                              | Second hash function   | Uniform distribution            | More complex computation  |

## Key Takeaways

### HashMap Advantages

- **Fast lookups** - Average O(1) get/set
- **Flexible keys** - Any value can be key (after hashing)
- **Dynamic sizing** - Grows automatically
- **Efficient updates** - No need to shift elements

### HashMap Disadvantages

- **Hash collisions** - Can degrade to O(n)
- **Memory overhead** - Bucket array + chains
- **Unordered** - No insertion order guarantee
- **Hash function dependency** - Performance relies on quality

### Design Decisions Explained

1. **Why separate chaining?**
   - Simple implementation
   - Handles collisions gracefully
   - No clustering issues

2. **Why load factor 0.75?**
   - Balanced performance/memory trade-off
   - Prevents excessive collisions
   - Industry standard

3. **Why double capacity on resize?**
   - Amortizes resize cost
   - Reduces future resizes
   - Common exponential growth strategy

## Complexity Cheat Sheet

```
Average Case:
─────────────────────────────────
set(key,val)    █ O(1)
get(key)        █ O(1)
has(key)        █ O(1)
remove(key)     █ O(1)
length()        █ O(1)
─────────────────────────────────

Worst Case (Poor Hash):
─────────────────────────────────
set(key,val)    ████████ O(n)
get(key)        ████████ O(n)
has(key)        ████████ O(n)
remove(key)     ████████ O(n)
─────────────────────────────────

Space Complexity:   ████████ O(n)
```
