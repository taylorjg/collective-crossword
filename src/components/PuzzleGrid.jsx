import PropTypes from "prop-types";

import { range } from "@app/utils";

export const PuzzleGrid = ({ crossword }) => {
  const VIEWBOX_WIDTH = 100;
  const VIEWBOX_HEIGHT = 100;
  const GRID_LINE_FULL_THICKNESS = 1 / 4;
  const GRID_LINE_HALF_THICKNESS = GRID_LINE_FULL_THICKNESS / 2;

  const BACKGROUND_COLOUR = "white";
  const GRID_LINE_COLOUR = "black";
  const BLOCK_COLOUR = "black";
  const puzzleSize = crossword.grid[0].length;

  const SQUARE_WIDTH = (VIEWBOX_WIDTH - GRID_LINE_FULL_THICKNESS) / puzzleSize;
  const SQUARE_HEIGHT =
    (VIEWBOX_HEIGHT - GRID_LINE_FULL_THICKNESS) / puzzleSize;

  const CLUE_NUMBER_COLOUR = "black";
  const CLUE_NUMBER_FONT_SIZE = SQUARE_WIDTH / 3.5;
  // const LETTER_COLOUR = "black";
  // const LETTER_FONT_SIZE = SQUARE_WIDTH / 1.5;

  const calculateX = (col) => col * SQUARE_WIDTH + GRID_LINE_HALF_THICKNESS;
  const calculateY = (row) => row * SQUARE_HEIGHT + GRID_LINE_HALF_THICKNESS;

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

  const drawClueNumbers = () => {
    return [
      ...crossword.acrossClues.map((clue) => drawClueNumber(clue, "across")),
      ...crossword.downClues.map((clue) => drawClueNumber(clue, "down")),
    ];
  };

  const drawClueNumber = (clue, clueType) => {
    const { clueNumber, rowIndex: row, colIndex: col } = clue;
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

  return (
    <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
      {drawBackground()}
      {drawHorizontalGridLines()}
      {drawVerticalGridLines()}
      {drawBlocks()}
      {drawClueNumbers()}
    </svg>
  );
};

PuzzleGrid.propTypes = {
  crossword: PropTypes.object.isRequired,
};