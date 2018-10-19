const { window, StatusBarAlignment, commands } = require('vscode');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const Theme = require('./theme');

let instance = null;
let paused = false;
let status;

const changeStatusText = () => {
  if (status) {
    status.text = `ThemeChanger: ${paused ? '✕' : '✓'}`;
  }
};

const initialize = () => {
  status = window.createStatusBarItem(StatusBarAlignment.Right, 1);
  status.command = 'extension.tcPause';
  status.show();

  changeStatusText();
};

module.exports = {
  run(context, configuration) {
    console.log('cron - run');
    initialize();

    context.subscriptions.push(status);
    context.subscriptions.push(
      commands.registerCommand('extension.tcPause', () => {
        paused = !paused;
        changeStatusText();
      })
    );

    console.log(configuration);

    if (!instance) {
      instance = setInterval(() => {
        if (paused) return;

        const { start, end } = context.globalState.get('CONFIG');
        const now = dayjs();

        const [start_hour, start_minute] = start.split(':');
        const [end_hour, end_minute] = end.split(':');
        const dStart = dayjs()
          .set('hour', start_hour)
          .set('minute', start_minute);
        const dEnd = dayjs()
          .set('hour', end_hour)
          .set('minute', end_minute);

        if (now.isBetween(dStart, dEnd)) {
          Theme.change(Theme.TYPE.DARK, context);
        } else {
          Theme.change(Theme.TYPE.LIGHT, context);
        }
      }, 10 * 1000); // * 60); // Check each 5 minutes if theme has to be changed
    }
  },
  dispose() {
    if (status) {
      status.hide();
      status.dispose();
      status = null;
    }
    if (instance) {
      clearInterval(instance);
    }
  }
};
