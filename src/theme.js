const vscode = require('vscode');

let wbconfig = null;
const reloadConfig = () => {
  wbconfig = vscode.workspace.getConfiguration('workbench');
};
reloadConfig();

const TYPE = {
  DARK: 'DARK',
  LIGHT: 'LIGHT'
};

const shouldChangeIfNotEqual = themeName => {
  reloadConfig();
  if (wbconfig.get('colorTheme') !== themeName) {
    console.log(`Switching to: ${themeName}`);
    wbconfig.update('colorTheme', themeName, true);
  } else {
    console.log('Not updating theme because it is already set');
  }
};

module.exports.TYPE = TYPE;

module.exports.change = (type, context) => {
  const { dark_theme, light_theme } = context.globalState.get('CONFIG');

  switch (type) {
    case TYPE.DARK:
      shouldChangeIfNotEqual(dark_theme);
      break;
    case TYPE.LIGHT:
      shouldChangeIfNotEqual(light_theme);
      break;
  }

  reloadConfig();
};
