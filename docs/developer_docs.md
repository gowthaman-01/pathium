# Pathium Code Documentation

Welcome to the **Pathium** code documentation! This comprehensive guide covers all the source files within the project, providing detailed explanations, code snippets, and insights into the architecture and functionality. Whether you're a developer looking to contribute or someone interested in understanding how Pathium works under the hood, this documentation is for you.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Algorithms](#core-algorithms)
    - [Bellman-Ford Algorithm (`bellman.ts`)](#bellman-ford-algorithm-bellmants)
    - [A\* Search Algorithm (`aStarSearch.ts`)](#a-search-algorithm-astarsearchts)
    - [Depth-First Search (DFS) (`dfs.ts`)](#depth-first-search-dfs-dfsts)
    - [Breadth-First Search (BFS) (`bfs.ts`)](#breadth-first-search-bfs-bfsts)
    - [Dijkstra's Algorithm (`dijkstra.ts`)](#dijkstras-algorithm-dijkstrats)
    - [Greedy Best-First Search (`greedy.ts`)](#greedy-best-first-search-greedysts)
3. [Data Structures](#data-structures)
    - [Queue (`Queue.ts`)](#queue-queuets)
    - [Min Heap (`MinHeap.ts`)](#min-heap-minheapts)
4. [Common Types and Constants](#common-types-and-constants)
    - [Types (`types.ts`)](#types-typests)
    - [Constants (`constants.ts`)](#constants-constantsts)
5. [Utility Functions](#utility-functions)
    - [Color Utilities (`color.ts`)](#color-utilities-colorts)
    - [Display Functions (`display.ts`)](#display-functions-displayts)
    - [Element Manipulation (`element.ts`)](#element-manipulation-elementts)
    - [General Utilities (`general.ts`)](#general-utilities-generalts)
    - [Graph Utilities (`graph.ts`)](#graph-utilities-graphts)
    - [Marking Cells (`mark.ts`)](#marking-cells-markts)
    - [Running Algorithms (`run.ts`)](#running-algorithms-runts)
6. [Classes and Components](#classes-and-components)
    - [Global Variables Manager (`GlobalVariablesManager.ts`)](#global-variables-manager-globalvariablesmanagerts)
    - [Run Results (`RunResults.ts`)](#run-results-runresultsts)
    - [Custom Dropdown (`CustomDropdown.ts`)](#custom-dropdown-customdropdownts)
7. [Tutorial and Data](#tutorial-and-data)
    - [Tutorial Rendering (`tutorial.ts`)](#tutorial-rendering-tutorialts)
    - [Tutorial Data (`data.ts`)](#tutorial-data-datats)
8. [Frontend Components](#frontend-components)
    - [Main Entry Point (`main.ts`)](#main-entry-point-maints)
    - [Editor Functionality (`editor.ts`)](#editor-functionality-editorts)
    - [Visualgo Integration (`visualgo.ts`)](#visualgo-integration-visualgots)
    - [Stylesheets](#stylesheets)
        - [Editor Styles (`editor.css`)](#editor-styles-editorcss)
        - [Main Styles (`main.css`)](#main-styles-maincss)
9. [Conclusion](#conclusion)

---

## Introduction

**Pathium** is an interactive application designed for visualizing various shortest path algorithms like A\*, Dijkstra's, BFS, DFS, Bellman-Ford, and more. This documentation covers the implementation details of the algorithms, data structures, utility functions, and frontend components used within the project.

---

## Core Algorithms

### Bellman-Ford Algorithm (`bellman.ts`)

**Purpose**: Implements the Bellman-Ford algorithm to find the shortest path in a graph that may have negative weight edges.

#### Overview

The Bellman-Ford algorithm computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It can handle graphs with negative weight edges.

#### Key Functions and Variables

-   **`bellmanFord()`**: Main function to execute the algorithm.
-   **Variables**:
    -   `steps`: Counts the number of operations for performance estimation.
    -   `weights[]`: Stores the tentative shortest distances from the start node.
    -   `predecessors[]`: Stores the predecessor of each node in the path.

#### Implementation Details

```typescript
export const bellmanFord = (): RunResults => {
    // Initialization
    const weights: number[] = [];
    const predecessors: Node[] = [];
    // Set all weights to Infinity, except the start node
    // ...

    // Relax edges V - 1 times
    for (let i = 0; i < gridSize - 1; i++) {
        // ...
    }

    // Check for negative-weight cycles
    // ...

    // Construct the shortest path
    // ...

    return runResults;
};
```

#### Features

-   Handles graphs with negative weights.
-   Detects negative weight cycles.
-   Records steps for performance analysis.

---

### A\* Search Algorithm (`aStarSearch.ts`)

**Purpose**: Implements the A\* Search algorithm combining heuristics for efficient pathfinding.

#### Overview

A\* Search is an informed search algorithm, widely used for pathfinding and graph traversal. It uses heuristics to guide the search.

#### Key Functions and Variables

-   **`aStarSearch()`**: Main function to execute A\* Search.
-   **Variables**:
    -   `heuristicAlgorithm`: Chooses between Manhattan and Euclidean distance.
    -   `heap`: Min heap priority queue based on the estimated cost.

#### Implementation Details

```typescript
export const aStarSearch = (): RunResults => {
    // Initialization
    const heuristicAlgorithm =
        globalVariablesManager.getHeuristicType() === HeuristicType.Manhattan
            ? calculateManhattanDistance
            : calculateEuclideanDistance;

    const heap = new MinHeap<HeapNode>(heapNodeComparator);

    // Main loop
    while (!heap.isEmpty()) {
        // ...
    }

    return runResults;
};
```

#### Features

-   Supports different heuristic functions.
-   Uses a min-heap for efficient node selection.
-   Records steps and path information.

---

### Depth-First Search (DFS) (`dfs.ts`)

**Purpose**: Implements DFS for pathfinding in a graph.

#### Overview

DFS explores as far as possible along each branch before backtracking. It is used here to find a path from the start to the end node.

#### Key Functions and Variables

-   **`dfs()`**: Main function that initiates DFS traversal.
-   **`dfsHelper(node: Node)`**: Recursive helper function for DFS traversal.

#### Implementation Details

```typescript
export const dfs = (): RunResults => {
    const dfsHelper = (node: Node) => {
        if (node === endNode) {
            return true;
        }
        // Mark node as exploring
        // Recurse on shuffled neighbors
        // Backtracking and marking visited
    };

    dfsHelper(startNode);

    // Construct shortest path if end node is reached
    // ...

    return runResults;
};
```

#### Features

-   Randomizes neighbor visitation order for maze generation.
-   Backtracking mechanism to explore all paths.
-   Efficient for exploring large graphs where a solution is deep in the tree.

---

### Breadth-First Search (BFS) (`bfs.ts`)

**Purpose**: Implements BFS to find the shortest path in an unweighted graph.

#### Overview

BFS explores the neighbor nodes first, before moving to the next level neighbors. It guarantees the shortest path in terms of the number of edges in unweighted graphs.

#### Key Functions and Variables

-   **`bfs()`**: Main function that performs BFS traversal.
-   **Variables**:
    -   `queue`: Queue to manage the frontier nodes.
    -   `predecessors[]`: To reconstruct the shortest path.

#### Implementation Details

```typescript
export const bfs = (): RunResults => {
    // Initialization
    const queue = new Queue<Node>();
    // Enqueue the start node
    // ...

    // Main loop
    while (queue.getSize() > 0) {
        const currentNode = queue.dequeue();
        // Process neighbors
        // ...
    }

    return runResults;
};
```

#### Features

-   Suitable for unweighted graphs.
-   Uses a queue for level-order traversal.
-   Records traversal steps and shortest path.

---

### Dijkstra's Algorithm (`dijkstra.ts`)

**Purpose**: Implements Dijkstra's algorithm for finding the shortest path in graphs without negative weights.

#### Overview

Dijkstra's algorithm computes the shortest paths from a single source node to all other nodes in a graph with non-negative weights.

#### Key Functions and Variables

-   **`dijkstra()`**: Main function to execute the algorithm.
-   **Variables**:
    -   `heap`: Min-heap priority queue based on the current shortest distance.
    -   `weights[]`: Stores the shortest known distances.

#### Implementation Details

```typescript
export const dijkstra = (): RunResults => {
    // Initialization
    const heap = new MinHeap<HeapNode>(heapNodeComparator);

    // Main loop
    while (!heap.isEmpty()) {
        // Extract node with minimal distance
        // Update distances of neighbors
        // ...
    }

    return runResults;
};
```

#### Features

-   Efficient for graphs with non-negative weights.
-   Uses a min-heap for selecting the next node with the smallest tentative distance.
-   Cannot handle negative weight edges.

---

### Greedy Best-First Search (`greedy.ts`)

**Purpose**: Implements Greedy Best-First Search, prioritizing nodes closest to the goal.

#### Overview

Greedy Best-First Search uses heuristics to select the next node that appears to lead most quickly to the goal. It does not guarantee the shortest path.

#### Key Functions and Variables

-   **`greedy()`**: Main function that performs the greedy search.
-   **Variables**:
    -   `heuristicAlgorithm`: Heuristic function used to estimate the distance to the goal.

#### Implementation Details

```typescript
export const greedy = (): RunResults => {
    const heuristicAlgorithm =
        globalVariablesManager.getHeuristicType() === HeuristicType.Manhattan
            ? calculateManhattanDistance
            : calculateEuclideanDistance;

    const heap = new MinHeap<HeapNode>(heapNodeComparator);

    while (!heap.isEmpty()) {
        // Select node with smallest heuristic value
        // ...
    }

    return runResults;
};
```

#### Features

-   Uses heuristics to guide the search.
-   Faster but may not find the shortest path.
-   Suitable when speed is more critical than path optimality.

---

## Data Structures

### Queue (`Queue.ts`)

**Purpose**: Provides a queue implementation used in BFS and other algorithms.

#### Overview

A generic queue data structure supporting basic operations like enqueue, dequeue, peek, and isEmpty.

#### Class Definition

```typescript
export class Queue<T> {
    private head: QueueNode<T> | null;
    private tail: QueueNode<T> | null;
    private size: number;

    enqueue(data: T): void;
    dequeue(): T | null;
    peek(): T | null;
    getSize(): number;
    isEmpty(): boolean;
    clear(): void;
}
```

#### Features

-   **`enqueue(data: T)`**: Adds an element to the end.
-   **`dequeue()`**: Removes and returns the front element.
-   **`peek()`**: Returns the front element without removing it.
-   **`isEmpty()`**: Checks if the queue is empty.

---

### Min Heap (`MinHeap.ts`)

**Purpose**: Implements a min-heap data structure for priority queue operations.

#### Overview

A generic min-heap supporting efficient insertion and removal of the smallest element, essential for algorithms like Dijkstra's and A\*.

#### Class Definition

```typescript
export class MinHeap<T> {
    private heap: T[];
    private comparator: (a: T, b: T) => boolean;

    isEmpty(): boolean;
    peek(): T | null;
    pop(): [T, number] | null;
    push(item: T): number;
}
```

#### Features

-   **`push(item: T)`**: Inserts an item into the heap.
-   **`pop()`**: Removes and returns the smallest item.
-   **`isEmpty()`**: Checks if the heap is empty.

---

## Common Types and Constants

### Types (`types.ts`)

**Purpose**: Defines common types, enums, interfaces used throughout the project.

#### Key Type Definitions

-   **`Node`**: Alias for `number`; represents a node ID.
-   **`NodeState`**: Enum representing the state of a node (e.g., `Visiting`, `Visited`).
-   **`Graph`**: Record mapping a node to its neighbors.
-   **`HeapNode`**: Interface for nodes stored in the heap with an `id` and `priority`.

#### Example

```typescript
export enum NodeState {
    Unvisited = 'unvisited',
    Visiting = 'visiting',
    // ...
}

export interface HeapNode {
    id: Node;
    priority: number;
}
```

---

### Constants (`constants.ts`)

**Purpose**: Defines global constants used across the application.

#### Key Constants

| Constant            | Value                        | Description                                |
| ------------------- | ---------------------------- | ------------------------------------------ |
| `MAX_WEIGHT`        | 125                          | Maximum weight for a node or edge.         |
| `DEFAULT_DELAY`     | 1                            | Default delay used in animations (ms).     |
| `AVERAGE_SPEED`     | 100                          | Average speed setting for simulation.      |
| `GRID_WIDTH`        | 580                          | Width of the grid in pixels.               |
| `DEFAULT_GRID_SIZE` | 400                          | Default number of nodes in the grid graph. |
| `LOCAL_STORAGE_KEY` | `'pathium-global-variables'` | Key for localStorage.                      |

#### Example

```typescript
export const MAX_WEIGHT: number = 125;
export const DEFAULT_GRID_SIZE: number = 400;
export const VERSION = '1.0.0';
```

---

## Utility Functions

### Color Utilities (`color.ts`)

**Purpose**: Functions related to color calculations and manipulations.

#### Key Functions

-   **`getColorByWeight(weight: number, reversed?: boolean): string`**: Returns an RGB color based on a given weight.

#### Implementation Details

```typescript
export const getColorByWeight = (weight: number, reversed?: boolean): string => {
    // Normalize weight between 0.01 and 1
    // Interpolate between startColor and endColor
    // Return the RGB string
};
```

---

### Display Functions (`display.ts`)

**Purpose**: Manages the visualization of the grid and algorithm steps.

#### Key Functions

-   **`resetGrid(algorithmToClear?: AlgorithmType): void`**: Resets the grid display.
-   **`displayGrid(graphDiv: GraphDiv, isVisualgoEditor?: boolean): void`**: Renders the grid.
-   **`displayAllRunResults(stepsSlider: HTMLInputElement): Promise<void>`**: Animates the algorithm steps.
-   **`displayStep(step: number, runResult: RunResults): void`**: Displays a specific step.

#### Implementation Details

```typescript
export const displayStep = (step: number, runResult: RunResults): void => {
    const currentStep = findNearestStep(runResult.getStepList(), step);
    // Update grid cells based on node states
};
```

---

### Element Manipulation (`element.ts`)

**Purpose**: Handles DOM element interactions, enabling/disabling elements, and updating styles.

#### Key Functions

-   **`toggleElement(elements, enable)`**: Enables or disables HTML elements.
-   **`setNewStartEndNode(nodeState, isEditor, toggleButtons, mouseDownCallback)`**: Allows user to set a new start or end node.

#### Implementation Details

```typescript
export const toggleElement = (elements, enable) => {
    elements.forEach((element) => {
        element.disabled = enable === STATUS.DISABLE;
        // Update cursor and opacity
    });
};
```

---

### General Utilities (`general.ts`)

**Purpose**: Provides miscellaneous utility functions used throughout the project.

#### Key Functions

-   **`delay(ms?: number): Promise<void>`**: Creates a delay for animations.
-   **`randomWeight(maxWeight: number): number`**: Generates a random weight.
-   **`calculateEuclideanDistance(startNode: Node, endNode: Node): number`**: Calculates Euclidean distance.
-   **`getRowAndColumnFromCellId(cellId: Node): { row: number; col: number }`**: Converts cell ID to row and column.

#### Implementation Details

```typescript
export const randomWeight = (maxWeight: number): number => {
    return Math.floor(Math.exp(Math.random() * Math.log(maxWeight)));
};
```

---

### Graph Utilities (`graph.ts`)

**Purpose**: Functions related to graph generation and manipulation.

#### Key Functions

-   **`generateNewGraphWithReachableEndNode(callback)`**: Generates a new graph ensuring the end node is reachable.
-   **`createBasicGridGraph(isWeighted: boolean, gridSize: number): GraphStorage`**: Creates a basic grid graph.
-   **`getNeighborWeight(currentNodeWeight, neighborNodeWeight, calculatingTotalWeight?)`**: Calculates edge weight.

#### Implementation Details

```typescript
export const getNeighborWeight = (
    currentNodeWeight: number,
    neighborNodeWeight: number,
): number => {
    switch (globalVariablesManager.getEnvironmentType()) {
        case EnvironmentType.FlatTerrain:
            return 1;
        // Handle other environment types
    }
};
```

#### Features

-   Supports different environment types (Flat Terrain, Road Network, Elevated Terrain).
-   Generates maze graphs using various algorithms (DFS, Random Walls, Recursive Division).

---

### Marking Cells (`mark.ts`)

**Purpose**: Handles marking and unmarking of grid cells for visualization.

#### Key Functions

-   **`markCell(node: Node, nodeState: NodeState, graphPosition: GRAPH_POSITION): void`**: Updates cell appearance.
-   **`createMark(node: Node, nodeState: NodeState, graphPosition: GRAPH_POSITION): HTMLElement`**: Creates visual markers.

#### Implementation Details

```typescript
export const markCell = (node: Node, nodeState: NodeState, graphPosition: GRAPH_POSITION): void => {
    const cell = document.getElementById(`${graphPosition}-cell-${node}`);
    if (!cell) return;
    // Update cell content based on node state
};
```

---

### Running Algorithms (`run.ts`)

**Purpose**: Orchestrates the execution of various algorithms.

#### Key Functions

-   **`runAlgorithm(graphDiv, algorithmType): RunResults`**: Runs the specified algorithm.
-   **`getBestAlgorithm(): AlgorithmType`**: Determines the most efficient algorithm based on steps and path cost.

#### Implementation Details

```typescript
export const runAlgorithm = (graphDiv, algorithmType): RunResults => {
    let algorithm = bfs;
    // Select algorithm based on type
    const runResults = algorithm();
    // Associate run results with graphDiv
    return runResults;
};
```

---

## Classes and Components

### Global Variables Manager (`GlobalVariablesManager.ts`)

**Purpose**: Singleton class managing application-wide variables and state.

#### Responsibilities

-   Stores and retrieves global variables like graph data, start/end nodes, settings.
-   Manages saving and loading of state to `localStorage`.
-   Provides getter and setter methods for various properties.

#### Implementation Details

```typescript
class GlobalVariablesManager {
    private static instance: GlobalVariablesManager;
    private graph: GraphStructure;
    private gridSize: number;
    // Other variables...

    public static getInstance(): GlobalVariablesManager;
    // Getter and setter methods...
}
```

#### Features

-   Ensures consistent state across the application.
-   Prevents the need for passing variables between functions.
-   Handles persistence through `localStorage`.

---

### Run Results (`RunResults.ts`)

**Purpose**: Stores the results and steps of an algorithm run.

#### Responsibilities

-   Keeps track of node states at each step.
-   Stores the calculated shortest path.
-   Provides methods to retrieve steps and node states.

#### Implementation Details

```typescript
export default class RunResults {
    private algorithmType: AlgorithmType;
    private stepList: number[];
    private nodeStateList: NodeState[][];

    public addStep(steps: number, node: Node, nodeState: NodeState): void;
    public setShortestPath(shortestPath: Node[]): void;
    // Other methods...
}
```

---

### Custom Dropdown (`CustomDropdown.ts`)

**Purpose**: Provides a custom dropdown component for the UI.

#### Features

-   Customizable options and callbacks.
-   Handles opening and closing of the dropdown menu.
-   Updates displayed text and manages arrow icons.

#### Implementation Details

```typescript
export class CustomDropdown {
    constructor(
        dropdownButton: HTMLButtonElement,
        dropdownMenu: HTMLElement,
        defaultText: string,
        onSelect: (dataValue: string) => void,
    );
    // Initialization and event handling...
}
```

---

## Tutorial and Data

### Tutorial Rendering (`tutorial.ts`)

**Purpose**: Renders the tutorial content in the modal.

#### Key Functions

-   **`renderTutorialContent(pageNumber, tutorialContentDiv)`**: Updates the tutorial modal content.

#### Implementation Details

```typescript
export const renderTutorialContent = (pageNumber: number, tutorialContentDiv: HTMLDivElement) => {
    const tutorialData = tutorialDataList[pageNumber - 1];
    // Create and append elements for title, body, and images
};
```

---

### Tutorial Data (`data.ts`)

**Purpose**: Contains the content for each tutorial page.

#### Data Structure

An array of `TutorialData` objects, each containing:

-   `pageNumber`
-   `title`
-   `body`
-   Optional `img`

#### Example

```typescript
export const tutorialDataList: TutorialData[] = [
    {
        pageNumber: 1,
        title: 'Welcome to Pathium!',
        body: 'This tutorial will walk you through every single feature...',
        img: { src: 'logo', width: 60, marginTop: 0 },
    },
    // Other pages...
];
```

---

## Frontend Components

### Main Entry Point (`main.ts`)

**Purpose**: Acts as the main script, initializing the application and handling user interactions.

#### Responsibilities

-   Sets up event listeners for UI components.
-   Manages the display of tutorial and settings modals.
-   Initializes graphs and runs algorithms.

#### Implementation Details

```typescript
document.addEventListener('DOMContentLoaded', async () => {
    // Load HTML elements
    // Initialize global variables
    // Set up event listeners
    // Load images and update progress bar
});
```

---

### Editor Functionality (`editor.ts`)

**Purpose**: Provides functionality for the custom graph editor.

#### Features

-   Allows users to add walls, set weights, change start/end nodes.
-   Provides UI controls like sliders and buttons.
-   Handles interactions like dragging to set weights.

#### Implementation Details

```typescript
document.addEventListener('DOMContentLoaded', async () => {
    // Set up editor components
    // Define event handlers for buttons and sliders
    // Manage grid interactions
});
```

---

### Visualgo Integration (`visualgo.ts`)

**Purpose**: Integrates with VisuAlgo.net for visualizing custom graphs.

#### Features

-   Converts the internal graph representation to a format compatible with VisuAlgo.
-   Provides buttons to visualize on VisuAlgo or Pathium.

#### Implementation Details

```typescript
const convertGraphToVisualgoFormat = (): string => {
    // Convert nodes and edges to VisuAlgo's expected JSON format
};

const handleVisualizeButton = () => {
    const visualgoFormat = convertGraphToVisualgoFormat();
    window.open(`https://visualgo.net/en/sssp?create=${visualgoFormat}`, '_blank');
};
```

---

### Stylesheets

#### Editor Styles (`editor.css`)

**Purpose**: Contains CSS styles specific to the graph editor page.

#### Key Styles

-   `.weight-slider-container`: Styles for the weight slider.
-   `.button-container`: Layout for editor buttons.
-   Media queries for responsiveness.

---

#### Main Styles (`main.css`)

**Purpose**: Contains global CSS styles used throughout the application.

#### Key Styles

-   **Variables**: Defines font sizes, grid cell sizes, padding.
-   **Layouts**: Styles for grids, buttons, dropdowns.
-   **Responsive Design**: Media queries to adjust styles on different screen sizes.
