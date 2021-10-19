import IBlock from './blocks/IBlock';
import JBlock from './blocks/JBlock';
import LBlock from './blocks/LBlock';
import OBlock from './blocks/OBlock';
import SBlock from './blocks/SBlock';
import ZBlock from './blocks/ZBlock';
import TBlock from './blocks/TBlock';
import { BlockType } from './enum';
import { Block, BlockCtor } from './interface';

type BlockDice = {
  [type in BlockType]: {
    ctor: BlockCtor;
    ratio: number;
    times: number;
  };
};

const blockCtorMap: BlockDice = {
  [BlockType.I]: {
    ctor: IBlock,
    ratio: 49,
    times: 0,
  },
  [BlockType.J]: {
    ctor: JBlock,
    ratio: 49,
    times: 0,
  },
  [BlockType.L]: {
    ctor: LBlock,
    ratio: 49,
    times: 0,
  },
  [BlockType.O]: {
    ctor: OBlock,
    ratio: 49,
    times: 0,
  },
  [BlockType.S]: {
    ctor: SBlock,
    ratio: 49,
    times: 0,
  },
  [BlockType.Z]: {
    ctor: ZBlock,
    ratio: 49,
    times: 0,
  },
  [BlockType.T]: {
    ctor: TBlock,
    ratio: 49,
    times: 0,
  },
};

class BlockFactory {
  static createBlock(type: BlockType): Block {
    return new blockCtorMap[type].ctor();
  }

  static createRandomBlock(): Block {
    // 随机选择类型
    console.group('[BlockFactory] createRandomBlock:before');
    const types = Reflect.ownKeys(blockCtorMap) as BlockType[];
    const selectedType = types
      .map((type) => {
        const { ratio, times } = blockCtorMap[type];
        console.log(`type: ${type}, times: ${times}, ratio: ${ratio}`);
        return { type, ratio: Math.random() * ratio };
      })
      .reduce((res, next) => (res.ratio >= next.ratio ? res : next)).type;
    console.groupEnd();

    const block = this.createBlock(selectedType);

    // 旋转任意角度
    const turns = Math.floor(Math.random() * 4);
    Array.from({ length: turns }, () => {
      block.pos = block.nextShape();
    });

    // 更新比率
    console.group('[BlockFactory] createRandomBlock:before');
    let total = 0;
    types.forEach((type) => {
      if (type === selectedType) {
        total += blockCtorMap[type].ratio -= 6;
        blockCtorMap[type].times += 1;
      } else {
        total += blockCtorMap[type].ratio += 1;
      }
    });
    console.log(`total: ${total}`);
    console.groupEnd();

    return block;
  }
}

export default BlockFactory;
