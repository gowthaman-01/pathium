import { getGlobalVariablesManagerInstance } from '../src/classes/GlobalVariablesManager';
import { displayGrid } from '../src/utils/display';
import {
    highlightButtonColor,
    setNewStartEndNode,
    toggleElementVisibility,
} from '../src/utils/element';
import {
    getNodeIdFromCellElementId,
    setWeightColor,
    updateProgressBar,
} from '../src/utils/general';
import { markCell } from '../src/utils/mark';
import { toggleElement } from '../src/utils/element';
import { CustomDropdown } from '../src/classes/CustomDropdown';
import { generateNewGraphWithReachableEndNode } from '../src/utils/graph';
import {
    AlgorithmType,
    DISPLAY_STYLE,
    EDITOR_MODE,
    GRAPH_POSITION,
    GraphDiv,
    GraphType,
    NodeState,
    STATUS,
    EnvironmentType,
} from '../src/common/types';
import { DEFAULT_WEIGHT } from '../src/common/constants';
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
    const changeStartNodeButton = document.getElementById('changeStartButton') as HTMLButtonElement;
    const changeEndNodeButton = document.getElementById('changeEndButton') as HTMLButtonElement;
    const setWeightButton = document.getElementById('setWeightButton') as HTMLButtonElement;
    const resetGraphButton = document.getElementById('resetGraphButton') as HTMLButtonElement;
    const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
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
        !changeStartNodeButton ||
        !changeEndNodeButton ||
        !setWeightButton ||
        !resetGraphButton ||
        !saveButton ||
        !gridSizeDropdownButton ||
        !gridSizeDropdownMenu ||
        !editorButtonsContainer
    ) {
        return;
    }

    const buttons = [
        addWallsButton,
        changeStartNodeButton,
        changeEndNodeButton,
        setWeightButton,
        resetGraphButton,
        doneButton,
        saveButton,
        gridSizeDropdownButton,
    ];

    const globalVariablesManager = getGlobalVariablesManagerInstance();

    const getGridSizeDisplayName = (gridSize: number): string => {
        return `${Math.sqrt(gridSize)} x ${Math.sqrt(gridSize)}`;
    };

    new CustomDropdown(
        gridSizeDropdownButton,
        gridSizeDropdownMenu,
        getGridSizeDisplayName(globalVariablesManager.getGridSize()),
        (dataValue) => {
            globalVariablesManager.setGridSize(parseInt(dataValue));
            generateNewGraphWithReachableEndNode(resetGrid);
        },
    );

    const graphEditorDiv: GraphDiv = {
        graphDivElement: graphEditorElement,
        position: GRAPH_POSITION.EDITOR,
        algorithmType: AlgorithmType.Editor,
    };

    globalVariablesManager.setEditorGraphDiv(graphEditorDiv);

    const isEditor = true;
    let selectedNodeId: number | null = null;
    let editorMode = EDITOR_MODE.NONE;

    const resetGrid = () => {
        if (editorMode === EDITOR_MODE.SET_WEIGHT) {
            globalVariablesManager.setShowWeights(true);
        } else {
            globalVariablesManager.setShowWeights(false);
        }
        displayGrid(graphEditorDiv);
    };

    if (globalVariablesManager.getEnvironmentType() === EnvironmentType.FlatTerrain) {
        const newNodes = Array(globalVariablesManager.getGridSize()).fill(1);
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
            case EDITOR_MODE.CHANGE_START_NODE:
                graphEditorDescription.innerHTML =
                    'Click on any cell to set it as the new starting point';
                break;
            case EDITOR_MODE.CHANGE_END_NODE:
                graphEditorDescription.innerHTML =
                    'Click on any cell to set it as the new destination';
                break;
            case EDITOR_MODE.CHANGE_GRID_SIZE:
                graphEditorDescription.innerHTML =
                    'Click on the dropdown menu and select a new grid size';
                break;
            case EDITOR_MODE.RESET:
                graphEditorDescription.innerHTML = 'Clear the entire grid and start over';
                break;
            case EDITOR_MODE.BACK:
                graphEditorDescription.innerHTML =
                    'Save your changes and return to the simulation view';
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

    const toggleButtons = (toggle: STATUS.DISABLE | STATUS.ENABLE) => {
        buttons.forEach((button) => {
            toggleElement([button], toggle);
        });
    };

    const toggleButtonsDuringStartEndNodeChange = (
        nodeState: NodeState,
        toggle: STATUS.DISABLE | STATUS.ENABLE,
    ) => {
        toggleButtons(toggle);

        if (toggle === STATUS.DISABLE) {
            toggleElement(
                [nodeState === NodeState.StartNode ? changeStartNodeButton : changeEndNodeButton],
                STATUS.ENABLE,
            );
        } else {
            editorMode = EDITOR_MODE.NONE;
            updateGraphEditorDescription();
        }
    };

    const getNodeState = (nodeId: number): NodeState => {
        if (nodeId === globalVariablesManager.getStartNode()) {
            return NodeState.StartNode;
        } else if (nodeId === globalVariablesManager.getEndNode()) {
            return NodeState.EndNode;
        } else {
            return NodeState.Unvisited;
        }
    };

    const checkValidNode = (nodeState: NodeState) => {
        return (
            editorMode !== EDITOR_MODE.ADD_WALLS ||
            (nodeState !== NodeState.StartNode && nodeState !== NodeState.EndNode)
        );
    };

    const setWeight = (weight: number) => {
        if (selectedNodeId === null) return;

        const nodeState = getNodeState(selectedNodeId);
        if (!checkValidNode(nodeState)) {
            return;
        }

        const nodes = globalVariablesManager.getGraph().nodes;
        nodes[selectedNodeId] = weight;
        markCell(selectedNodeId, nodeState, GRAPH_POSITION.EDITOR);
        globalVariablesManager.setNodes(nodes);
    };

    const displayWeight = (weight: number) => {
        if (selectedNodeId === null) return;

        const nodeState = getNodeState(selectedNodeId);
        if (!checkValidNode(nodeState)) {
            return;
        }

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
            if (selectedNodeId) {
                cell.style.backgroundColor = getColorByWeight(originalWeight);
            }
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
        const newNodes = Array(globalVariablesManager.getGridSize()).fill(1);
        globalVariablesManager.setNodes(newNodes);
        handleButtonClick(EDITOR_MODE.RESET);
    };

    const handleChangeStartEndNodeButton = (nodeState: NodeState) => {
        editorMode =
            nodeState === NodeState.StartNode
                ? EDITOR_MODE.CHANGE_START_NODE
                : EDITOR_MODE.CHANGE_END_NODE;
        setNewStartEndNode(nodeState, isEditor, toggleButtonsDuringStartEndNodeChange, resetGrid);
        updateButtons();
        updateGraphEditorDescription();
    };

    const handleDoneButton = () => {
        handleButtonClick(EDITOR_MODE.NONE);
        hideWeightSlider();
    };

    const handleBackButton = () => {
        globalVariablesManager.setCustomGraph({
            graph: globalVariablesManager.getGraph().graph,
            nodes: globalVariablesManager.getGraph().nodes,
            startNode: globalVariablesManager.getStartNode(),
            endNode: globalVariablesManager.getEndNode(),
        });
        globalVariablesManager.setGraphType(GraphType.Custom);
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
        {
            button: changeStartNodeButton,
            mode: EDITOR_MODE.CHANGE_START_NODE,
            clickHandler: () => handleChangeStartEndNodeButton(NodeState.StartNode),
        },
        {
            button: changeEndNodeButton,
            mode: EDITOR_MODE.CHANGE_END_NODE,
            clickHandler: () => handleChangeStartEndNodeButton(NodeState.EndNode),
        },
        { button: gridSizeDropdownButton, mode: EDITOR_MODE.CHANGE_GRID_SIZE },
        { button: gridSizeDropdownMenu, mode: EDITOR_MODE.CHANGE_GRID_SIZE },
        { button: doneButton, mode: EDITOR_MODE.NONE, clickHandler: handleDoneButton },
        { button: saveButton, mode: EDITOR_MODE.BACK, clickHandler: handleBackButton },
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
