const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const showDisposeMessage = () => {
  vscode.window.showInformationMessage(
    `Start the ThemeChanger configuration at any time by calling
        the 'ThemeChanger: Reset settings' command`,
    { title: 'OK' }
  );
};

module.exports = {
  configurate(context, override) {
    return new Promise((resolve, reject) => {
      const res = context.globalState.get('SET_UP');
      if (res && !override) {
        return resolve(context.globalState.get('CONFIG'));
      } else {
        context.globalState.update('SET_UP', false);
      }

      vscode.window
        .showInformationMessage(
          `The ThemeChanger extension has started the first time.
            To function properly, you need to set up the extension. Do you want to do this now?`,
          { title: 'Yes', key: true },
          { title: 'No, later', key: false }
        )
        .then(({ key }) => {
          if (key) {
            const panel = vscode.window.createWebviewPanel(
              'themechangerConf',
              'ThemeChanger Configuration',
              vscode.ViewColumn.One,
              {
                enableScripts: true,
                retainContextWhenHidden: true
              }
            );
            panel.onDidDispose(() => {
              if (!context.globalState.get('SET_UP')) {
                showDisposeMessage();
                reject();
              }
            });
            panel.webview.onDidReceiveMessage(message => {
              context.globalState.update('SET_UP', key);
              context.globalState.update('CONFIG', message);
              vscode.window.showInformationMessage(
                `ThemeChanger has been set up and is running now. If you want
                            to reset the settings, call the 'ThemeChanger: Reset settings' command at any time.`,
                { title: 'OK' }
              );
              panel.dispose();
              resolve(message);
            });
            const filePath = vscode.Uri.file(path.join(context.extensionPath, 'configuration.html'));
            panel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');
          } else {
            showDisposeMessage();
            reject();
          }
        });
    });
  }
};
