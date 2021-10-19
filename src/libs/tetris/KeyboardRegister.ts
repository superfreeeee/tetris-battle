class KeyboardRegister {
  private listeningKeys: Set<string>;
  activeKeys: Set<string>;

  constructor(keys: string[] = []) {
    this.listeningKeys = new Set(keys);
    this.activeKeys = new Set();

    if (keys.length) {
      document.addEventListener('keydown', this.onKeydown);
      document.addEventListener('keyup', this.onKeyup);
    }
  }

  onKeydown = (e: KeyboardEvent) => {
    if (this.listeningKeys.has(e.key)) {
      this.activeKeys.add(e.key);
    } else {
      console.log(`unregister key: ${e.key}`);
    }
  };

  onKeyup = (e: KeyboardEvent) => {
    if (this.listeningKeys.has(e.key)) {
      this.activeKeys.delete(e.key);
    }
  };

  tearDown() {
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
  }
}

export default KeyboardRegister;
