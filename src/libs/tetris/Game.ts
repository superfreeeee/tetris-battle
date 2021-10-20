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
  private actionClockActions: Set<ClockAction>;

  private timeClock: Clock;
  private timeClockAction: Set<ClockAction>;

  private currentBlock: Block = null;
  private currentBlockLand: boolean = false;

  constructor(props: GameProps) {
    this.state = GameState.EMPTY;
    this.board = new Board(props.board);
    this.actionClock = new Clock();
    this.actionClockActions = new Set();
    this.keyboardRegister = new KeyboardRegister(Reflect.ownKeys(ACTION_CONFIGS) as string[]);
    this.timeClock = new Clock();
    this.timeClockAction = new Set();

    this.board.check();

    console.log(this.board);
    console.log(this.keyboardRegister);
  }

  private setActionClock() {
    const { actionClock, keyboardRegister, actionClockActions } = this;

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
      actionClock.setAction(onKeyActive);
      actionClockActions.add(onKeyActive);
    });
  }

  private setTimeClock() {
    const { actionClock, keyboardRegister, actionClockActions, state } = this;

    const onNextTick = (currentTime: number) => {};
    this.timeClock.setAction(onNextTick, 1000);
    this.timeClockAction.add(onNextTick);

    const autoFall = (currentTime: number) => {
      this.doAction(ActionType.MOVE_DOWN);
    };
    this.timeClock.setAction(autoFall, 900);
    this.timeClockAction.add(autoFall);
  }

  start() {
    const { actionClock, keyboardRegister, actionClockActions, state } = this;
    if (state !== GameState.EMPTY) {
      console.log('Game already start');
      return;
    }
    this.state = GameState.PLAYING;

    this.nextBlock();

    this.setActionClock();
    this.setTimeClock();
  }

  over() {
    console.log('game over');
    const { actionClock, actionClockActions: clockActions } = this;
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
    // 操作后位置
    if (newPos) {
      if (board.isBlockFit(newPos)) {
        // 0.0
        console.log('new Pos fit');
        currentBlock.pos = newPos;
      } else {
        // ambiguous
        newPos = board.tryBlockFit(newPos);
        if (newPos) {
          currentBlock.pos = newPos;
        }
      }
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
