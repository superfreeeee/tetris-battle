import { ClockAction, ClockActionConfig } from './interface';

class Clock {
  private raf: number = null;
  private actionsConfig: ClockActionConfig[] = [];

  private setRAF() {
    console.log('set RAF');
    const task = (currentTime: number) => {
      this.actionsConfig.forEach((config) => {
        if (currentTime - config.lastTime >= config.delay) {
          config.action(currentTime);
          config.lastTime = currentTime;
        }
      });
      this.raf = requestAnimationFrame(task);
    };
    this.raf = requestAnimationFrame(task);
  }

  private stopRAF() {
    console.log('stop RAF');
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  setAction(action: ClockAction, delay: number = 16) {
    const config = {
      action,
      delay,
      lastTime: -delay,
    };
    this.actionsConfig.push(config);
    if (!this.raf) {
      this.setRAF();
    }
  }

  removeAction(action: ClockAction) {
    const config = this.actionsConfig.filter((config) => config.action === action)[0];
    if (config) {
      this.actionsConfig.splice(this.actionsConfig.indexOf(config), 1);

      if (this.actionsConfig.length === 0) {
        this.stopRAF();
      }
    }
  }
}

export default Clock;
