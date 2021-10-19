export enum ActionType {
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_DOWN = 'MOVE_DOWN',
  ROTATE = 'ROTATE',
  FALL = 'FALL',
  PAUSE = 'PAUSE',
}

export enum BlockType {
  I = 'BlockType.I',
  J = 'BlockType.J',
  L = 'BlockType.L',
  O = 'BlockType.O',
  S = 'BlockType.S',
  Z = 'BlockType.Z',
  T = 'BlockType.T',
}

export enum GameState {
  EMPTY,
  PLAYING,
  END,
}
