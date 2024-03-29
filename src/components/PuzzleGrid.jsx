import { useRef } from "react";
import PropTypes from "prop-types";
import { CircularProgress, useTheme } from "@mui/material";

import { noop, range, sum, isSameCell } from "@app/utils";

import {
  StyledPuzzleGridWrapper,
  StyledPuzzleGrid,
  StyledSavingSpinner,
} from "./PuzzleGrid.styles";

export const PuzzleGrid = ({
  crossword,
  currentCell = null,
  selectedCells = [],
  answers = [],
  enteredLettersMap = new Map(),
  selectCell = noop,
  showSavingSpinner = false,
}) => {
  const clues = [...crossword.acrossClues, ...crossword.downClues];
  const theme = useTheme();

  const VIEWBOX_WIDTH = 100;
  const VIEWBOX_HEIGHT = 100;
  const GRID_LINE_FULL_THICKNESS = 1 / 4;
  const GRID_LINE_HALF_THICKNESS = GRID_LINE_FULL_THICKNESS / 2;

  const BACKGROUND_COLOUR = "white";
  const GRID_LINE_COLOUR = "black";
  const BLOCK_COLOUR = "black";
  const SELECTED_CELLS_OUTLINE_COLOUR = "black";
  const REGULAR_CELL_COLOUR = "white";
  const SELECTED_CELLS_COLOUR = "#ffe9e3";
  const CURRENT_CELL_COLOUR = "#ffb5a1";

  const puzzleSize = crossword.grid[0].length;

  const SQUARE_WIDTH = (VIEWBOX_WIDTH - GRID_LINE_FULL_THICKNESS) / puzzleSize;
  const SQUARE_HEIGHT =
    (VIEWBOX_HEIGHT - GRID_LINE_FULL_THICKNESS) / puzzleSize;

  const CLUE_NUMBER_COLOUR = "black";
  const CLUE_NUMBER_FONT_SIZE = SQUARE_WIDTH / 3.5;

  const REGULAR_LETTER_COLOUR = "black";
  const ENTERED_LETTER_COLOUR = theme.palette.primary.dark;
  const LETTER_FONT_SIZE = SQUARE_WIDTH / 1.5;

  const WORD_BREAK_COLOUR = theme.palette.primary.dark;

  const calculateX = (col) => col * SQUARE_WIDTH + GRID_LINE_HALF_THICKNESS;
  const calculateY = (row) => row * SQUARE_HEIGHT + GRID_LINE_HALF_THICKNESS;

  const svgRef = useRef();

  const drawBackground = () => {
    return (
      <rect
        x={0}
        y={0}
        width={VIEWBOX_WIDTH}
        height={VIEWBOX_HEIGHT}
        fill={BACKGROUND_COLOUR}
      />
    );
  };

  const drawHorizontalGridLines = () => {
    const rows = range(puzzleSize + 1);
    return rows.map((row) => {
      const y = calculateY(row);
      return (
        <line
          key={`horizontal-grid-line-${row}`}
          x1={0}
          y1={y}
          x2={VIEWBOX_WIDTH}
          y2={y}
          strokeWidth={GRID_LINE_FULL_THICKNESS}
          stroke={GRID_LINE_COLOUR}
        />
      );
    });
  };

  const drawVerticalGridLines = () => {
    const cols = range(puzzleSize + 1);
    return cols.map((col) => {
      const x = calculateX(col);
      return (
        <line
          key={`vertical-grid-line-${col}`}
          x1={x}
          y1={0}
          x2={x}
          y2={VIEWBOX_HEIGHT}
          strokeWidth={GRID_LINE_FULL_THICKNESS}
          stroke={GRID_LINE_COLOUR}
        />
      );
    });
  };

  const drawBlocks = () => {
    return crossword.grid.flatMap((line, row) => {
      const chs = Array.from(line);
      return chs.flatMap((ch, col) => {
        if (ch === "X") {
          const block = { row, col };
          return [drawBlock(block)];
        }
        return [];
      });
    });
  };

  const drawBlock = (block) => {
    const { row, col } = block;
    const x = calculateX(col);
    const y = calculateY(row);

    return (
      <rect
        key={`block-${row}-${col}`}
        x={x}
        y={y}
        width={SQUARE_WIDTH}
        height={SQUARE_HEIGHT}
        fill={BLOCK_COLOUR}
      />
    );
  };

  const drawCells = () => {
    return crossword.grid.flatMap((line, row) => {
      const chs = Array.from(line);
      return chs.flatMap((ch, col) => {
        if (ch === ".") {
          const cell = { row, col };
          return [drawCell(cell)];
        }
        return [];
      });
    });
  };

  const drawCell = (cell) => {
    const { row, col } = cell;
    const x = calculateX(col);
    const y = calculateY(row);

    const isSelectedCell = selectedCells.find((selectedCell) =>
      isSameCell(selectedCell, cell)
    );
    const isCurrentCell = isSameCell(currentCell, cell);

    const fill = isCurrentCell
      ? "url(#current-cell-pattern)"
      : isSelectedCell
        ? SELECTED_CELLS_COLOUR
        : REGULAR_CELL_COLOUR;

    return (
      <rect
        key={`cell-${row}-${col}`}
        x={x}
        y={y}
        width={SQUARE_WIDTH}
        height={SQUARE_HEIGHT}
        fill={fill}
      />
    );
  };

  const drawClueNumbers = () => {
    return [
      ...crossword.acrossClues.map((clue) => drawClueNumber(clue, "across")),
      ...crossword.downClues.map((clue) => drawClueNumber(clue, "down")),
    ];
  };

  const drawClueNumber = (clue, clueType) => {
    const { clueNumber } = clue;
    const row = clue.row ?? clue.rowIndex;
    const col = clue.col ?? clue.colIndex;
    const cx = calculateX(col) + (SQUARE_WIDTH / 16) * 1;
    const cy = calculateY(row) + (SQUARE_HEIGHT / 16) * 3;

    return (
      <text
        key={`clue-number-${clueNumber}-${clueType}`}
        x={cx}
        y={cy}
        fill={CLUE_NUMBER_COLOUR}
        fontSize={CLUE_NUMBER_FONT_SIZE}
        textAnchor="start"
        dominantBaseline="central"
      >
        {clueNumber}
      </text>
    );
  };

  const drawSelectedCellsOutline = () => {
    if (selectedCells.length === 0) return;
    const rows = selectedCells.map(({ row }) => row);
    const cols = selectedCells.map(({ col }) => col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    const x = calculateX(minCol);
    const y = calculateY(minRow);
    const width = minCol === maxCol ? SQUARE_WIDTH : calculateX(maxCol + 1) - x;
    const height =
      minRow === maxRow ? SQUARE_HEIGHT : calculateY(maxRow + 1) - y;

    return (
      <g>
        <clipPath id="selected-cells-outline-clip-path">
          <rect x={x} y={y} width={width} height={height} />
        </clipPath>
        <rect
          key="selected-cells-outline"
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={SELECTED_CELLS_OUTLINE_COLOUR}
          strokeWidth={0.75}
          fill="none"
          clipPath="url(#selected-cells-outline-clip-path)"
        />
      </g>
    );
  };

  const drawAnswers = () => {
    return answers.flatMap(({ clueNumber, clueType, answer }) => {
      const cluesMap =
        clueType === "across"
          ? crossword.acrossCluesMap
          : crossword.downCluesMap;
      const { cells } = cluesMap.get(clueNumber);
      const letters = Array.from(answer);
      const indexes = range(letters.length);
      return indexes.map((index) => {
        const cell = cells[index];
        const letter = letters[index];
        return drawLetter(cell, letter, clueType, REGULAR_LETTER_COLOUR);
      });
    });
  };

  const drawEnteredLetters = () => {
    const entries = Array.from(enteredLettersMap);
    return entries.map((entry) => {
      const [key, letter] = entry;
      const [row, col] = key.split(":");
      const cell = { row, col };
      return drawLetter(cell, letter, "entered-letter", ENTERED_LETTER_COLOUR);
    });
  };

  const drawLetter = (cell, letter, clueType, letterColour) => {
    const { row, col } = cell;
    const cx = calculateX(col) + SQUARE_WIDTH / 2;
    const cy = calculateY(row) + SQUARE_HEIGHT / 2;

    return (
      <text
        key={`letter-${clueType}-${row}-${col}`}
        x={cx}
        y={cy}
        fill={letterColour}
        fontSize={LETTER_FONT_SIZE}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {letter.toUpperCase()}
      </text>
    );
  };

  const drawWordBreaks = () => {
    // If not an enhanced crossword then bail
    if (!crossword.cellsToCluesMap) return [];

    return clues.flatMap((clue) => {
      const text = clue.clue;
      const m = text.replace(/\s/g, "").match(/\(([1-9,-]+)\)$/);
      if (!m) return [];
      const bits = m[1];
      const numbers = bits.split(/,|-/).map(Number);
      if (!sum(numbers) === clue.cells.length) return [];
      const seps = Array.from(bits.replace(/\d/g, ""));
      return seps.flatMap((sep, index) => {
        const cellIndex = sum(numbers.slice(0, index + 1)) - 1;
        const cell = clue.cells[cellIndex];
        if (sep === ",") {
          return [drawWordBreakBar(cell, clue.clueType)];
        }
        if (sep === "-") {
          return [drawWordBreakDash(cell, clue.clueType)];
        }
        return [];
      });
    });
  };

  const drawWordBreakBar = (cell, clueType) => {
    const { row, col } = cell;
    const [x1, y1] =
      clueType === "across"
        ? [calculateX(col + 1), calculateY(row)]
        : [calculateX(col), calculateY(row + 1)];
    const [x2, y2] = [calculateX(col + 1), calculateY(row + 1)];

    return (
      <line
        key={`word-break-bar-${row}-${col}-${clueType}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={GRID_LINE_FULL_THICKNESS * 4}
        stroke={WORD_BREAK_COLOUR}
      />
    );
  };

  const drawWordBreakDash = (cell, clueType) => {
    const { row, col } = cell;
    const [x1, y1] =
      clueType === "across"
        ? [calculateX(col + 0.85), calculateY(row + 0.5)]
        : [calculateX(col + 0.5), calculateY(row + 0.85)];
    const [x2, y2] =
      clueType === "across"
        ? [calculateX(col + 1.15), calculateY(row + 0.5)]
        : [calculateX(col + 0.5), calculateY(row + 1.15)];

    return (
      <line
        key={`word-break-bar-${row}-${col}-${clueType}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={GRID_LINE_FULL_THICKNESS * 4}
        stroke={WORD_BREAK_COLOUR}
      />
    );
  };

  const handleGridClick = (e) => {
    const boundingClientRect = svgRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - boundingClientRect.x;
    const y = clientY - boundingClientRect.y;
    const cellWidth = boundingClientRect.width / puzzleSize;
    const cellHeight = boundingClientRect.height / puzzleSize;
    const row = Math.floor(y / cellHeight);
    const col = Math.floor(x / cellWidth);
    selectCell({ row, col });
  };

  return (
    <StyledPuzzleGridWrapper>
      <StyledPuzzleGrid
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        onClick={handleGridClick}
        ref={svgRef}
      >
        <defs>
          <pattern
            id="current-cell-pattern"
            patternUnits="userSpaceOnUse"
            width="1"
            height="1"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="1" stroke={SELECTED_CELLS_COLOUR} />
            <line x1="1" y1="0" x2="1" y2="1" stroke={CURRENT_CELL_COLOUR} />
          </pattern>
        </defs>
        {drawBackground()}
        {drawBlocks()}
        {drawCells()}
        {drawSelectedCellsOutline()}
        {drawClueNumbers()}
        {drawAnswers()}
        {drawEnteredLetters()}
        {drawHorizontalGridLines()}
        {drawVerticalGridLines()}
        {drawWordBreaks()}
      </StyledPuzzleGrid>
      {showSavingSpinner && (
        <StyledSavingSpinner>
          <CircularProgress size={"25%"} />
        </StyledSavingSpinner>
      )}
    </StyledPuzzleGridWrapper>
  );
};

PuzzleGrid.propTypes = {
  crossword: PropTypes.object.isRequired,
  currentCell: PropTypes.shape({
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }),
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
    })
  ),
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      clueNumber: PropTypes.number.isRequired,
      clueType: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
  enteredLettersMap: PropTypes.object,
  selectCell: PropTypes.func,
  showSavingSpinner: PropTypes.bool,
};
