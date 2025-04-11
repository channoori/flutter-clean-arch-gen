// extension.js
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "extension.generateCleanFeature",
    async () => {
      const featureName = await vscode.window.showInputBox({
        prompt: "Enter the feature name (e.g. auth, todo):"
      });
      if (!featureName) return;

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return;
      const rootPath = workspaceFolders[0].uri.fsPath;
      const targetPath = path.join(rootPath, "lib", "features", featureName);
      const templatePath = path.join(__dirname, "templates", "sample");

      copyTemplate(templatePath, targetPath, featureName);
      vscode.window.showInformationMessage(`Created feature: ${featureName}`);
    }
  );
  context.subscriptions.push(disposable);
}

function copyTemplate(srcDir, destDir, featureName) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, file);
    const stat = fs.statSync(srcPath);
    const destPath = path.join(destDir, file.replace(/sample/g, featureName));

    if (stat.isDirectory()) {
      copyTemplate(srcPath, destPath, featureName);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      content = content.replace(/Sample/g, capitalize(featureName));
      content = content.replace(/sample/g, featureName);
      fs.writeFileSync(destPath, content);
    }
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

exports.activate = activate;
exports.deactivate = function () {};