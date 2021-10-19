import { O_BLOCK_COLOR } from '../constant/color';
import { BOARD_WIDTH } from '../constant/size';
import { Block, Position } from '../interface';

class OBlock implements Block {
  pos: Position;
  isLand: boolean = false;
  color: string = O_BLOCK_COLOR;

  constructor() {
    const m = BOARD_WIDTH / 2;
    this.pos = [
      [m, 0],
      [m, 1],
      [m - 1, 0],
      [m - 1, 1],
    ];
  }

  nextShape(): Position {
    return this.pos;
  }
}

export default OBlock;
