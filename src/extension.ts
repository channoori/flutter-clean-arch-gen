import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.generateCleanFeature', async () => {
    const featureName = await vscode.window.showInputBox({
      placeHolder: 'Enter feature name (e.g. auth, home, profile)',
      prompt: 'This will generate a new clean architecture feature folder',
    });

    if (!featureName) {
      vscode.window.showWarningMessage('Feature name is required.');
      return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace is open.');
      return;
    }

    const basePath = workspaceFolders[0].uri.fsPath;
    const featurePath = path.join(basePath, 'lib', 'features', featureName);

    const foldersToCreate = [
      'application',
      'data/datasources',
      'data/models',
      'data/repositories',
      'domain/entities',
      'domain/repositories',
      'domain/usecases',
      'presentation/providers',
      'presentation/view',
    ];

    foldersToCreate.forEach((folder) => {
      const fullPath = path.join(featurePath, folder);
      fs.mkdirSync(fullPath, { recursive: true });
    });

    vscode.window.showInformationMessage(`Clean architecture folders for "${featureName}" created!`);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
