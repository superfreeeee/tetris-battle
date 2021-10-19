import { ACTION_CONFIGS } from './constant/action';
import { Block, ClockAction, GameProps, Position } from './interface';
import { ActionType, GameState } from './enum';
import Board from './Board';
import KeyboardRegister from './KeyboardRegister';
import Clock from './Clock';
import BlockFactory from './BlockFactory';

class Game {
  private state: GameState;

  private board: Board;
  private keyboardRegister: KeyboardRegister;
  private actionClock: Clock;
  private clockActions: Set<ClockAction>;

  private currentBlock: Block = null;
  private currentBlockLand: boolean = false;

  constructor(props: GameProps) {
    this.state = GameState.EMPTY;
    this.board = new Board(props.board);
    this.actionClock = new Clock();
    this.clockActions = new Set();
    this.keyboardRegister = new KeyboardRegister(Reflect.ownKeys(ACTION_CONFIGS) as string[]);

    this.board.check();

    console.log(this.board);
    console.log(this.keyboardRegister);
  }

  start() {
    const { actionClock, keyboardRegister, clockActions, state } = this;
    if (state !== GameState.EMPTY) {
      console.log('Game already start');
      return;
    }
    this.state = GameState.PLAYING;

    const actionKeys = Reflect.ownKeys(ACTION_CONFIGS) as string[];
    actionKeys.forEach((key) => {
      const action = ACTION_CONFIGS[key];
      let activated = false;
      let lastTime = 0;

      const onKeyActive = (currentTime: number) => {
        if (keyboardRegister.activeKeys.has(key)) {
          if (action.oncePerDown && activated) {
            return;
          }

          if (action.firstDelay && currentTime - lastTime < action.firstDelay) {
            return;
          }

          console.log(`action time: ${currentTime}, type: ${action.type}`);

          this.doAction(action.type);
          if (!activated) {
            activated = true;
            lastTime = currentTime;
          }
        } else if (activated) {
          activated = false;
        }
      };
      actionClock.setAction(onKeyActive, 20);
      clockActions.add(onKeyActive);
    });

    this.nextBlock();
  }

  over() {
    console.log('game over');
    const { actionClock, clockActions } = this;
    this.state = GameState.END;

    clockActions.forEach((action) => {
      actionClock.removeAction(action);
    });
    clockActions.clear();
  }

  private nextBlock() {
    const { board, currentBlock } = this;
    currentBlock && board.placeBlock(currentBlock);
    const newBlock = (this.currentBlock = BlockFactory.createRandomBlock());
    if (!board.isBlockFit(newBlock.pos)) {
      this.over();
      return;
    }
    board.renderBlock(newBlock, true);
  }

  private doAction(type: ActionType) {
    const { board, currentBlock, moveLeft, moveRight, moveDown } = this;
    board.clearBlock(currentBlock);

    let newPos: Position;
    switch (type) {
      case ActionType.MOVE_LEFT:
        newPos = moveLeft(currentBlock);
        break;
      case ActionType.MOVE_RIGHT:
        newPos = moveRight(currentBlock);
        break;
      case ActionType.MOVE_DOWN:
        newPos = moveDown(currentBlock);
        break;
      case ActionType.ROTATE:
        newPos = currentBlock.nextShape();
        break;
      case ActionType.FALL:
        this.nextBlock();
        return;
    }
    if (newPos && board.isBlockFit(newPos)) {
      console.log('new Pos fit');
      currentBlock.pos = newPos;
    }
    this.currentBlockLand = board.renderBlock(currentBlock, true);
    if (this.currentBlockLand) {
      this.nextBlock();
    }
  }

  private moveLeft(block: Block): Position {
    return block.pos.map(([x, y]) => [x - 1, y]) as Position;
  }

  private moveRight(block: Block): Position {
    return block.pos.map(([x, y]) => [x + 1, y]) as Position;
  }

  private moveDown(block: Block): Position {
    return block.pos.map(([x, y]) => [x, y + 1]) as Position;
  }
}

export default Game;
