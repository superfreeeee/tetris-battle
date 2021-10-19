import { ActionType } from '../enum';
import { ActionConfigs } from '../interface';

export const ACTION_CONFIGS: ActionConfigs = {
  ArrowLeft: {
    type: ActionType.MOVE_LEFT,
    oncePerDown: false,
    firstDelay: 150,
  },
  ArrowRight: {
    type: ActionType.MOVE_RIGHT,
    oncePerDown: false,
    firstDelay: 150,
  },
  ArrowDown: {
    type: ActionType.MOVE_DOWN,
    oncePerDown: false,
  },
  ArrowUp: {
    type: ActionType.ROTATE,
    oncePerDown: true,
  },
  [' ']: {
    type: ActionType.FALL,
    oncePerDown: true,
  },
  Escape: {
    type: ActionType.PAUSE,
    oncePerDown: true,
  },
};
