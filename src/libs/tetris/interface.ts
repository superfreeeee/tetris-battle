import { ActionType } from './enum';

/**
 * 面板
 */
export interface BoardProps {
  cellSize?: number;
  cellPadding?: number;
  width?: number;
  height?: number;
  canvasFg: HTMLCanvasElement;
  canvasBg: HTMLCanvasElement;
}

/**
 * 游戏
 */
export interface GameProps {
  board: BoardProps;
}

/**
 * 方块
 */
export type Point = [number, number];

export type Position = [Point, Point, Point, Point];

export interface Block {
  pos: Position;
  color: string;
  nextShape(): Position;
}

export interface BlockCtor {
  new (): Block;
}

/**
 * 时钟操作
 */
export interface ClockAction {
  (activeTime: number): void;
}

export interface ClockActionConfig {
  readonly delay: number;
  action: ClockAction;
  lastTime: number;
}

/**
 *
 */
export interface ActionConfigs {
  [key: string]: {
    type: ActionType;
    oncePerDown: boolean;
    firstDelay?: number;
  };
}
