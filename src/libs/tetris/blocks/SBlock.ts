import { S_BLOCK_COLOR } from '../constant/color';
import { BOARD_WIDTH } from '../constant/size';
import { Block, Position } from '../interface';

class SBlock implements Block {
  pos: Position;
  isLand: boolean = false;
  color: string = S_BLOCK_COLOR;

  constructor() {
    const m = BOARD_WIDTH / 2;
    this.pos = [
      [m - 1, 0],
      [m - 1, 1],
      [m, 1],
      [m, 2],
    ];
    this.direction = 0;
  }

  private direction: 0 | 1 | 2 | 3;

  private nextDirection() {
    return (this.direction = ((this.direction + 1) % 4) as 0 | 1 | 2 | 3);
  }

  nextShape(): Position {
    const d = this.nextDirection();
    const [, [x, y]] = this.pos;
    return [
      [
        [x, y - 1],
        [x, y],
        [x + 1, y],
        [x + 1, y + 1],
      ] as Position,
      [
        [x + 1, y],
        [x, y],
        [x, y + 1],
        [x - 1, y + 1],
      ] as Position,
      [
        [x, y + 1],
        [x, y],
        [x - 1, y],
        [x - 1, y - 1],
      ] as Position,
      [
        [x - 1, y],
        [x, y],
        [x, y - 1],
        [x + 1, y - 1],
      ] as Position,
    ][d];
  }
}

export default SBlock;
