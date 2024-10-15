import { getGlobalVariablesManagerInstance } from '../src/classes/GlobalVariablesManager';
import { displayGrid } from '../src/utils/display';
import { highlightButtonColor, toggleElementVisibility } from '../src/utils/element';
import {
    getNodeIdFromCellElementId,
    getRowAndColumnFromCellId,
    setWeightColor,
    updateProgressBar,
} from '../src/utils/general';
import { markCell } from '../src/utils/mark';
import { CustomDropdown } from '../src/classes/CustomDropdown';
import { generateAndStoreNewGraph } from '../src/utils/graph';
import {
    AlgorithmType,
    DISPLAY_STYLE,
    EDITOR_MODE,
    GRAPH_POSITION,
    GraphDiv,
    NodeState,
    STATUS,
    EnvironmentType,
    GraphType,
} from '../src/common/types';
import { DEFAULT_WEIGHT, VISUALGO_EDITOR_GRID_SIZE } from '../src/common/constants';
import { getColorByWeight } from '../src/utils/color';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById('loadingScreen') as HTMLDivElement;
    const progressBar = document.getElementById('progressBar') as HTMLDivElement;
    const graphEditorElement = document.getElementById('graphEditor') as HTMLDivElement;
    const buttonContainer = document.getElementById('buttonContainer') as HTMLDivElement;
    const addWallsButton = document.getElementById('addWallsButton') as HTMLButtonElement;
    const weightSlider = document.getElementById('weightSlider') as HTMLInputElement;
    const weightSliderContainer = document.getElementById(
        'weightSliderContainer',
    ) as HTMLDivElement;
    const weightSliderValue = document.getElementById('weightSliderValue') as HTMLParagraphElement;
    const doneButton = document.getElementById('doneButton') as HTMLButtonElement;
    const setWeightButton = document.getElementById('setWeightButton') as HTMLButtonElement;
    const resetGraphButton = document.getElementById('resetGraphButton') as HTMLButtonElement;
    const visualgoButton = document.getElementById('visualgoButton') as HTMLButtonElement;
    const pathiumButton = document.getElementById('pathiumButton') as HTMLButtonElement;
    const gridSizeDropdownButton = document.getElementById(
        'gridSizeDropdownButton',
    ) as HTMLButtonElement;
    const gridSizeDropdownMenu = document.getElementById('gridSizeDropdownMenu') as HTMLDivElement;
    const editorButtonsContainer = document.getElementById(
        'editorButtonsContainer',
    ) as HTMLDivElement;
    const graphEditorDescription = document.getElementById(
        'graphEditorDescription',
    ) as HTMLParagraphElement;

    if (
        !loadingScreen ||
        !progressBar ||
        !graphEditorDescription ||
        !graphEditorElement ||
        !buttonContainer ||
        !addWallsButton ||
        !weightSlider ||
        !weightSliderContainer ||
        !weightSliderValue ||
        !doneButton ||
        !setWeightButton ||
        !resetGraphButton ||
        !visualgoButton ||
        !pathiumButton ||
        !gridSizeDropdownButton ||
        !gridSizeDropdownMenu ||
        !editorButtonsContainer
    ) {
        return;
    }

    const buttons = [
        addWallsButton,
        setWeightButton,
        resetGraphButton,
        doneButton,
        visualgoButton,
        pathiumButton,
        gridSizeDropdownButton,
    ];

    const isVisualgoEditor = true;
    const globalVariablesManager = getGlobalVariablesManagerInstance();
    globalVariablesManager.setGridSize(VISUALGO_EDITOR_GRID_SIZE);
    globalVariablesManager.setIsVisualgoGraph(true);
    generateAndStoreNewGraph();

    const getGridSizeDisplayName = (gridSize: number): string => {
        return `${Math.sqrt(gridSize)} x ${Math.sqrt(gridSize)}`;
    };

    new CustomDropdown(
        gridSizeDropdownButton,
        gridSizeDropdownMenu,
        getGridSizeDisplayName(globalVariablesManager.getGridSize()),
        (dataValue) => {
            globalVariablesManager.setGridSize(parseInt(dataValue));
            generateAndStoreNewGraph();
            resetGrid();
        },
    );

    const graphEditorDiv: GraphDiv = {
        graphDivElement: graphEditorElement,
        position: GRAPH_POSITION.EDITOR,
        algorithmType: AlgorithmType.Editor,
    };

    globalVariablesManager.setEditorGraphDiv(graphEditorDiv);

    let selectedNodeId: number | null = null;
    let editorMode = EDITOR_MODE.NONE;

    const resetGrid = () => {
        if (editorMode === EDITOR_MODE.SET_WEIGHT) {
            globalVariablesManager.setShowWeights(true);
        } else {
            globalVariablesManager.setShowWeights(false);
        }
        displayGrid(graphEditorDiv, isVisualgoEditor);
    };

    if (globalVariablesManager.getEnvironmentType() === EnvironmentType.FlatTerrain) {
        const newNodes = Array(globalVariablesManager.getGridSize()).fill(0);
        globalVariablesManager.setNodes(newNodes);
    }

    resetGrid();
    setWeightColor();
    await updateProgressBar(progressBar, loadingScreen);

    // Helper functions.
    const updateGraphEditorDescription = (mode: EDITOR_MODE = editorMode) => {
        switch (mode) {
            case EDITOR_MODE.ADD_WALLS:
                graphEditorDescription.innerHTML = 'Click or drag on the grid to place walls';
                break;
            case EDITOR_MODE.SET_WEIGHT:
                graphEditorDescription.innerHTML =
                    'Adjust the weight slider, then drag on the grid to apply it';
                break;
            case EDITOR_MODE.CHANGE_GRID_SIZE:
                graphEditorDescription.innerHTML =
                    'Click on the dropdown menu and select a new grid size';
                break;
            case EDITOR_MODE.RESET:
                graphEditorDescription.innerHTML = 'Clear the entire grid and start over';
                break;
            case EDITOR_MODE.VISUALIZE:
                graphEditorDescription.innerHTML = 'Visualise the graph on VisuAlgo.net';
                break;
            case EDITOR_MODE.PATHIUM:
                graphEditorDescription.innerHTML = 'Visualise the graph on Pathium';
                break;
            case EDITOR_MODE.NONE:
                graphEditorDescription.innerHTML =
                    'Hover over any button for a description of its functionality';
                break;
        }
    };

    const updateButtons = () => {
        buttons.forEach((button) => {
            highlightButtonColor(button, STATUS.INACTIVE);
        });

        switch (editorMode) {
            case EDITOR_MODE.ADD_WALLS:
                highlightButtonColor(addWallsButton, STATUS.ACTIVE);
                break;
            case EDITOR_MODE.SET_WEIGHT:
                highlightButtonColor(setWeightButton, STATUS.ACTIVE);
                break;
            default:
                break;
        }
    };

    const setWeight = (weight: number) => {
        if (selectedNodeId === null) return;
        const nodes = globalVariablesManager.getGraph().nodes;
        nodes[selectedNodeId] = weight;
        markCell(selectedNodeId, NodeState.Unvisited, GRAPH_POSITION.EDITOR);
        globalVariablesManager.setNodes(nodes);
    };

    const displayWeight = (weight: number) => {
        if (selectedNodeId === null) return;

        const cell = document.getElementById(`${GRAPH_POSITION.EDITOR}-cell-${selectedNodeId}`);
        if (!cell) {
            return;
        }
        cell.style.backgroundColor = getColorByWeight(weight);

        if (editorMode === EDITOR_MODE.SET_WEIGHT) {
            const weightDisplay = document.getElementById(
                `${GRAPH_POSITION.EDITOR}-cell-${selectedNodeId}-weight-display`,
            );
            if (weightDisplay) {
                weightDisplay.innerHTML = weight === Infinity ? '∞' : weight.toString();
                weightDisplay.style.color = getColorByWeight(weight, true);
            }
        }

        cell.addEventListener('mouseleave', () => {
            if (selectedNodeId === null) return;

            const nodes = globalVariablesManager.getGraph().nodes;
            const originalWeight = nodes[selectedNodeId];
            cell.style.backgroundColor = getColorByWeight(originalWeight);

            if (editorMode === EDITOR_MODE.SET_WEIGHT) {
                const weightDisplay = document.getElementById(
                    `${GRAPH_POSITION.EDITOR}-cell-${selectedNodeId}-weight-display`,
                );
                if (!weightDisplay) {
                    return;
                }
                weightDisplay.innerHTML =
                    originalWeight === Infinity ? '∞' : originalWeight.toString();
                weightDisplay.style.color = getColorByWeight(originalWeight, true);
            }
        });
    };

    const showWeightSlider = (nodeId: number | null = null) => {
        if (nodeId) {
            weightSlider.value = globalVariablesManager.getGraph().nodes[nodeId].toString();
        } else {
            weightSlider.value = (DEFAULT_WEIGHT / 2).toString();
        }
        weightSliderValue.innerHTML = `Weight: ${weightSlider.value}`;
        toggleElementVisibility([weightSliderContainer], DISPLAY_STYLE.FLEX);
        toggleElementVisibility([buttonContainer], DISPLAY_STYLE.NONE);
    };

    const hideWeightSlider = () => {
        toggleElementVisibility([weightSliderContainer], DISPLAY_STYLE.NONE);
        toggleElementVisibility([buttonContainer], DISPLAY_STYLE.FLEX);
    };

    // Event handlers
    const handleButtonClick = (mode: EDITOR_MODE) => {
        editorMode = mode;
        updateButtons();
        updateGraphEditorDescription();
        resetGrid();
    };

    const handleAddWallsButton = () => handleButtonClick(EDITOR_MODE.ADD_WALLS);

    const handleSetWeightButton = () => {
        selectedNodeId = null;
        showWeightSlider();
        handleButtonClick(EDITOR_MODE.SET_WEIGHT);
    };

    const handleResetGraphButton = () => {
        const newNodes = Array(globalVariablesManager.getGridSize()).fill(0);
        globalVariablesManager.setNodes(newNodes);
        handleButtonClick(EDITOR_MODE.RESET);
    };

    const handleDoneButton = () => {
        handleButtonClick(EDITOR_MODE.NONE);
        hideWeightSlider();
    };

    const convertGraphToVisualgoFormat = (): string => {
        const nodes = globalVariablesManager.getGraph().nodes;
        const graph = globalVariablesManager.getGraph().graph;
        const gridSize = globalVariablesManager.getGridSize();

        const edgeSet = new Set();
        const vl: { [key: number]: { x: number; y: number } } = {};
        const el: { [key: number]: { u: number; v: number; w: number } } = {};
        let cellSize: number;
        let xOffset: number;
        switch (gridSize) {
            case 4:
                cellSize = 380;
                xOffset = 120;
                break;
            case 9:
                cellSize = 230;
                xOffset = 150;
                break;
            case 16:
                cellSize = 165;
                xOffset = 160;
                break;
            case 25:
                cellSize = 125;
                xOffset = 180;
                break;
            case 36:
                cellSize = 105;
                xOffset = 190;
                break;
            default:
                cellSize = 125;
                xOffset = 125;
                break;
        }

        let edgeIndex = 0;

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] === Infinity) {
                continue;
            }

            const { row, col } = getRowAndColumnFromCellId(i);

            vl[i] = {
                x: col * cellSize + cellSize / 2 + xOffset,
                y: row * cellSize + cellSize / 2,
            };

            for (const neighbor of graph[i]) {
                if (nodes[neighbor] === Infinity) {
                    continue;
                }

                const edge = {
                    u: i,
                    v: neighbor,
                    w: nodes[neighbor],
                };

                if (!edgeSet.has(edge)) {
                    el[edgeIndex] = edge;
                    edgeIndex++;
                    edgeSet.add(edge);
                }
            }
        }

        return JSON.stringify({ vl, el });
    };

    const handleVisualizeButton = () => {
        const visualgoFormat = convertGraphToVisualgoFormat();
        window.open(`https://visualgo.net/en/sssp?create=${visualgoFormat}`, '_blank');
    };

    const handlePathiumButton = () => {
        globalVariablesManager.setCustomGraph({
            graph: globalVariablesManager.getGraph().graph,
            nodes: globalVariablesManager.getGraph().nodes,
            startNode: globalVariablesManager.getStartNode(),
            endNode: globalVariablesManager.getEndNode(),
        });
        globalVariablesManager.setGraphType(GraphType.Custom);
        if (globalVariablesManager.getEnvironmentType() === EnvironmentType.FlatTerrain) {
            globalVariablesManager.setEnvironmentType(EnvironmentType.RoadNetwork);
        }
        globalVariablesManager.setIsVisualgoGraph(false);
        globalVariablesManager.saveToLocalStorage();
        window.location.href = 'index.html';
    };

    // Event listeners
    const buttonEventHandlers = [
        { button: addWallsButton, mode: EDITOR_MODE.ADD_WALLS, clickHandler: handleAddWallsButton },
        {
            button: setWeightButton,
            mode: EDITOR_MODE.SET_WEIGHT,
            clickHandler: handleSetWeightButton,
        },
        { button: resetGraphButton, mode: EDITOR_MODE.RESET, clickHandler: handleResetGraphButton },
        { button: gridSizeDropdownButton, mode: EDITOR_MODE.CHANGE_GRID_SIZE },
        { button: gridSizeDropdownMenu, mode: EDITOR_MODE.CHANGE_GRID_SIZE },
        { button: doneButton, mode: EDITOR_MODE.NONE, clickHandler: handleDoneButton },
        {
            button: visualgoButton,
            mode: EDITOR_MODE.VISUALIZE,
            clickHandler: handleVisualizeButton,
        },
        {
            button: pathiumButton,
            mode: EDITOR_MODE.PATHIUM,
            clickHandler: handlePathiumButton,
        },
    ];

    buttonEventHandlers.forEach(({ button, mode, clickHandler }) => {
        if (clickHandler) {
            button.addEventListener('click', clickHandler);
        }
        button.addEventListener('mouseover', () => updateGraphEditorDescription(mode));
        button.addEventListener('mouseleave', () => updateGraphEditorDescription());
    });

    weightSlider.addEventListener('input', () => {
        weightSliderValue.innerHTML = `Weight: ${weightSlider.value}`;
    });

    const handleNodeInteraction = (nodeId: number) => {
        selectedNodeId = nodeId;
        switch (editorMode) {
            case EDITOR_MODE.ADD_WALLS:
                setWeight(Infinity);
                break;
            case EDITOR_MODE.SET_WEIGHT:
                setWeight(parseInt(weightSlider.value));
                break;
        }
    };

    const handleNodeHover = (nodeId: number) => {
        selectedNodeId = nodeId;
        switch (editorMode) {
            case EDITOR_MODE.ADD_WALLS:
                displayWeight(Infinity);
                break;
            case EDITOR_MODE.SET_WEIGHT:
                displayWeight(parseInt(weightSlider.value));
                break;
        }
    };

    const handleEvent = (target: HTMLElement, hover: boolean = false) => {
        if (
            target.classList.contains('grid-cell') ||
            target.classList.contains('weight-display') ||
            target.classList.contains('mark')
        ) {
            const nodeId = getNodeIdFromCellElementId(target.id);
            if (hover) {
                handleNodeHover(nodeId);
            } else {
                handleNodeInteraction(nodeId);
            }
        }
    };

    const handleTouchEvent = (event: TouchEvent) => {
        event.preventDefault();
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
        handleEvent(target);
    };

    graphEditorElement.addEventListener('mousedown', (event) =>
        handleEvent(event.target as HTMLElement),
    );
    graphEditorElement.addEventListener('touchstart', handleTouchEvent);

    graphEditorElement.addEventListener('mouseover', (event) => {
        if ((event as MouseEvent).buttons === 1) {
            handleEvent(event.target as HTMLElement);
        } else {
            handleEvent(event.target as HTMLElement, true);
        }
    });

    graphEditorElement.addEventListener('touchmove', handleTouchEvent);
});
