import { CELL_BG_DARK, CELL_BG_LIGHT } from './constant/color';
import { BOARD_HEIGHT, BOARD_WIDTH, CELL_PADDING, CELL_SIZE, CELL_WIDTH, SHADOW_WIDTH } from './constant/size';
import { Block, BoardProps, Point, Position } from './interface';

class Board {
  private readonly fgCtx: CanvasRenderingContext2D;
  private readonly bgCtx: CanvasRenderingContext2D;

  m: boolean[][];

  constructor({ canvasFg, canvasBg }: BoardProps) {
    this.fgCtx = canvasFg.getContext('2d');
    this.bgCtx = canvasBg.getContext('2d');
    this.m = Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => false));

    this.initBackground();
    this.initStyle();
  }

  private initBackground() {
    const { bgCtx } = this;
    bgCtx.fillStyle = '#000';
    bgCtx.fillRect(0, 0, CELL_SIZE * BOARD_WIDTH, CELL_SIZE * BOARD_HEIGHT);

    bgCtx.translate(CELL_PADDING, CELL_PADDING);

    for (let i = 0; i < BOARD_WIDTH; i++) {
      for (let j = 0; j < BOARD_HEIGHT; j++) {
        bgCtx.fillStyle = (i + j) % 2 === 0 ? CELL_BG_DARK : CELL_BG_LIGHT;
        bgCtx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_WIDTH, CELL_WIDTH);
      }
    }
  }

  private initStyle() {
    const { fgCtx } = this;
    fgCtx.translate(CELL_PADDING, CELL_PADDING);
    fgCtx.lineWidth = SHADOW_WIDTH;
  }

  check(): void {
    console.group('[Board] check');
    const { m } = this;
    let s = '';
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        s += m[i][j] ? 'X' : '.';
      }
      s += '\n';
    }
    console.log(s);
    console.groupEnd();
  }

  renderBlock(block: Block, renderShadow: boolean = false): boolean {
    const { fgCtx, m } = this;
    fgCtx.fillStyle = block.color;
    let isLand = false;
    block.pos.forEach(([x, y]) => {
      fgCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_WIDTH, CELL_WIDTH);
      if (y >= BOARD_HEIGHT - 1 || m[y + 1][x]) {
        isLand = true;
      }
    });
    if (renderShadow) {
      const shadowPos = this.calcFallPos(block);
      fgCtx.strokeStyle = block.color;
      const shadowOffset = SHADOW_WIDTH / 2;
      const shadowWidth = CELL_WIDTH - SHADOW_WIDTH;
      shadowPos.forEach(([x, y]) => {
        fgCtx.strokeRect(x * CELL_SIZE + shadowOffset, y * CELL_SIZE + shadowOffset, shadowWidth, shadowWidth);
      });
    }
    return isLand;
  }

  clearBlock(block: Block): void {
    const { fgCtx } = this;
    block.pos.forEach(([x, y]) => {
      fgCtx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_WIDTH, CELL_WIDTH);
    });

    const shadowPos = this.calcFallPos(block);
    shadowPos.forEach(([x, y]) => {
      fgCtx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_WIDTH, CELL_WIDTH);
    });
  }

  private calcFallPos(block: Block): Position {
    const { m } = this;
    const ground = Array.from({ length: BOARD_WIDTH }, () => BOARD_HEIGHT);
    for (let i = 0; i < BOARD_WIDTH; i++) {
      let h = BOARD_HEIGHT - 1;
      while (h >= 0) {
        if (m[h][i]) {
          ground[i] = h;
        }
        h--;
      }
    }

    let minOffsetY = BOARD_HEIGHT - 1;
    block.pos.forEach(([x, y]) => {
      let minH = BOARD_HEIGHT;
      let h = BOARD_HEIGHT - 1;
      while (h > y) {
        if (m[h][x]) {
          minH = h;
        }
        h--;
      }
      minOffsetY = Math.min(minOffsetY, minH - y - 1);
    });

    return block.pos.map(([x, y]) => [x, y + minOffsetY]) as Position;
  }

  private cleanFilled(block: Block) {
    const { m, fgCtx } = this;
    const rows = [...new Set(block.pos.map(([_, y]) => y))];
    rows.sort((x, y) => x - y);

    rows.forEach((row) => {
      if (m[row].every((b) => b)) {
        // 画板向下一行
        const data = fgCtx.getImageData(0, 0, CELL_SIZE * BOARD_WIDTH, CELL_SIZE * row);
        fgCtx.clearRect(0, 0, CELL_SIZE * BOARD_WIDTH, CELL_SIZE * (row + 1));
        fgCtx.putImageData(data, 0, CELL_SIZE);

        this.m = [
          Array.from({ length: BOARD_WIDTH }, () => false),
          ...this.m.slice(0, row),
          ...this.m.slice(row + 1, BOARD_HEIGHT),
        ];
      }
    });
  }

  placeBlock(block: Block): void {
    this.clearBlock(block);
    block.pos = this.calcFallPos(block);
    block.pos.forEach(([x, y]) => (this.m[y][x] = true));
    this.renderBlock(block);
    this.cleanFilled(block);

    this.check();
  }

  isBlockFit(pos: Position): boolean {
    const { m } = this;
    return pos.every(([x, y]) => x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && !m[y][x]);
  }
}

export default Board;
