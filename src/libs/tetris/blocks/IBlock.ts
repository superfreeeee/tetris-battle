import { I_BLOCK_COLOR } from '../constant/color';
import { BOARD_WIDTH } from '../constant/size';
import { Block, Position } from '../interface';

class IBlock implements Block {
  pos: Position;
  color: string = I_BLOCK_COLOR;

  constructor() {
    const m = BOARD_WIDTH / 2 - 1;
    this.pos = [
      [m, 0],
      [m, 1],
      [m, 2],
      [m, 3],
    ];
    this.isVertical = true;
  }

  private isVertical: boolean = true;

  nextShape(): Position {
    const [, [x, y]] = this.pos;
    const isVertical = (this.isVertical = !this.isVertical);
    return isVertical
      ? [
          [x, y - 1],
          [x, y],
          [x, y + 1],
          [x, y + 2],
        ]
      : [
          [x - 1, y],
          [x, y],
          [x + 1, y],
          [x + 2, y],
        ];
  }
}

export default IBlock;
