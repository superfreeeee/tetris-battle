import styles from './index.module.scss';

import React, { MouseEvent, useEffect, useRef } from 'react';

import Game from '@libs/tetris/Game';
import { CELL_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from '@libs/tetris/constant/size';

const canvasWidth = CELL_SIZE * BOARD_WIDTH;
const canvasHeight = CELL_SIZE * BOARD_HEIGHT;

const Playground = () => {
  const fgRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(null);

  useEffect(() => {
    gameRef.current = new Game({
      board: {
        canvasFg: fgRef.current,
        canvasBg: bgRef.current,
      },
    });
  }, []);

  const startGame = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // @ts-ignore
    e.target.blur();
    gameRef.current.start();
  };

  return (
    <div className={styles.playground}>
      <div className={styles.boardWrapper}>
        <canvas className={styles.canvasBg} width={canvasWidth} height={canvasHeight} ref={bgRef}></canvas>
        <canvas className={styles.canvasFg} width={canvasWidth} height={canvasHeight} ref={fgRef}></canvas>
      </div>
      <button onClick={startGame}>Start</button>
    </div>
  );
};

export default Playground;
