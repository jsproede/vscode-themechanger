const { commands } = require("vscode");

const Configurator = require("./src/configuration");
const Cron = require("./src/cronjob");

const runConfigurator = context => {
  Configurator.configurate(context)
    .then(config => {
      Cron.run(context, config);
    })
    .catch(() => {});
};

function activate(context) {
  runConfigurator(context);

  context.subscriptions.push(
    commands.registerCommand("extension.tcResetSettings", () => {
      Cron.dispose();
      runConfigurator(context);
    })
  );
}
exports.activate = activate;

function deactivate() {
  Cron.dispose();
}
exports.deactivate = deactivate;
