import { COLS, DEFAULT_DELAY, GRID_SIZE, ROWS } from '../common/constants';
import { AlgorithmType, Nodes, StepMetadata } from '../common/types';
import { getColorByDistance } from './color';
import { delay } from './general';
import { markCell } from './mark';
import { RunResults } from '../results/RunResults';

export const displayInitialNodeState = (
    gridContainers: HTMLCollectionOf<HTMLDivElement>,
    nodes: Nodes,
    startNode: number,
    endNode: number,
    algorithms: AlgorithmType[],
) => {
    for (const gridContainer of Array.from(gridContainers)) {
        const algorithmType: AlgorithmType = gridContainer.id as AlgorithmType;
        if (!algorithms.includes(algorithmType)) {
            continue;
        }

        const distanceParagraphElement = document.getElementById(
            `${algorithmType}-distance`,
        ) as HTMLParagraphElement;
        distanceParagraphElement.innerHTML = '&nbsp';

        gridContainer.innerHTML = '';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

        // Create grid cells .
        for (let i = 0; i < GRID_SIZE; i++) {
            const cell = document.createElement('div');
            const distance = nodes[i.toString()].distance;
            const color = getColorByDistance(distance);
            cell.id = `${gridContainer.id}-cell-${i}`;
            cell.className = 'grid-cell';
            cell.style.border = `solid 1px #59595d`;
            cell.style.backgroundColor = color;

            const mark = document.createElement('img');
            mark.style.width = '90%';
            mark.classList.add('mark');
            // mark.style.filter = getMarkFilters(markType);

            if (i == startNode) {
                mark.id = `${algorithmType}-cell-${i}-mark`;
                mark.src = `./assets/start.png`;
            } else if (i == endNode) {
                mark.id = `${algorithmType}-cell-${i}-mark`;
                mark.src = `./assets/end.png`;
            }

            if (i == startNode || i == endNode) {
                cell.appendChild(mark);
            }

            gridContainer.appendChild(cell);
        }
    }
};

export const displayAllRunResults = async (
    runResultList: RunResults[],
    stepsSlider: HTMLInputElement,
    stepsCount: HTMLParagraphElement,
    stepDifference: number,
) => {
    const maxSteps = Math.max(...runResultList.map((result) => result.getTotalSteps()));
    let step = 0;
    stepsSlider.max = maxSteps.toString();

    while (step <= maxSteps) {
        for (const runResult of runResultList) {
            if (runResult.isDisplayComplete()) continue;
            if (step >= runResult.getTotalSteps()) {
                displayTotalWeight(runResult.getTotalWeights(), runResult.getAlgorithmType());
                continue;
            }

            displayStep(step, runResult);
        }

        step += stepDifference;
        stepsCount.innerHTML = `Steps: ${Math.min(
            parseInt(stepsSlider.value),
            Math.max(...runResultList.map((result) => result.getAlgorithmSteps())),
        ).toString()}`;
        stepsSlider.value = step.toString();
        await delay(DEFAULT_DELAY);
    }

    runResultList
        .filter((runResult) => !runResult.isDisplayComplete())
        .forEach((runResult) =>
            displayTotalWeight(runResult.getTotalWeights(), runResult.getAlgorithmType()),
        );
};

export const displayStep = (step: number, runResult: RunResults) => {
    const currentStep = findNearestStep(runResult.getStepMetadataList(), step);
    Object.values(currentStep.nodeMetaDataMap).forEach((nodeMetaData) => {
        markCell(nodeMetaData.id, nodeMetaData.state, runResult.getAlgorithmType());
    });
};

export const displayTotalWeight = (totalDistance: number, algorithmType: AlgorithmType) => {
    const distanceParagraphElement = document.getElementById(
        `${algorithmType}-distance`,
    ) as HTMLParagraphElement;
    distanceParagraphElement.innerHTML = `<b>Total Distance: ${totalDistance}</b>`;
};

const findNearestStep = (stepMetadataList: StepMetadata[], currentStep: number) => {
    let start = 0;
    let end = stepMetadataList.length - 1;
    let nearestStep = stepMetadataList[0];

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (stepMetadataList[mid].steps === currentStep) {
            return stepMetadataList[mid];
        } else if (stepMetadataList[mid].steps < currentStep) {
            nearestStep = stepMetadataList[mid];
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return nearestStep;
};
