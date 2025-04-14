import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.generateCleanFeature', async (uri: vscode.Uri) => {
    const featureName = await vscode.window.showInputBox({
      placeHolder: 'Enter feature name (e.g. auth, home, profile)',
      prompt: 'This will generate a new clean architecture feature folder',
    });

    if (!featureName) {
      vscode.window.showWarningMessage('Feature name is required.');
      return;
    }

    const basePath = uri?.fsPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!basePath) {
      vscode.window.showErrorMessage('No valid folder selected.');
      return;
    }

    const featurePath = path.join(basePath, featureName);

    const foldersToCreate = [
      'application',
      'data/datasources',
      'data/models',
      'data/repositories',
      'domain/entities',
      'domain/repositories',
      'domain/usecases',
      'presentation/providers',
      'presentation/composition',
      'presentation/component'
    ];

    foldersToCreate.forEach((folder) => {
      const fullPath = path.join(featurePath, folder);
      fs.mkdirSync(fullPath, { recursive: true });
    });

    const pascal = capitalize(featureName);
    const snake = featureName.toLowerCase();

    const sampleEntity = `
class ${pascal} {
  final String id;
  final String name;

  const ${pascal}({required this.id, required this.name});
}
`;
    fs.writeFileSync(
      path.join(featurePath, 'domain/entities', `${snake}.dart`),
      sampleEntity
    );

    const sampleRepository = `
abstract class ${pascal}Repository {
  Future<void> fetch();
}
`;
    fs.writeFileSync(
      path.join(featurePath, 'domain/repositories', `${snake}_repository.dart`),
      sampleRepository
    );

    const sampleUsecase = `
import '../repositories/${snake}_repository.dart';

class Fetch${pascal}UseCase {
  final ${pascal}Repository repository;

  Fetch${pascal}UseCase(this.repository);

  Future<void> call() async {
    return repository.fetch();
  }
}
`;
    fs.writeFileSync(
      path.join(featurePath, 'domain/usecases', `fetch_${snake}_usecase.dart`),
      sampleUsecase
    );

    const sampleProvider = `
import 'package:flutter_riverpod/flutter_riverpod.dart';

final ${snake}Provider = Provider((ref) {
  // TODO: provide ${pascal}Repository
  throw UnimplementedError();
});
`;
    fs.writeFileSync(
      path.join(featurePath, 'presentation/providers', `${snake}_provider.dart`),
      sampleProvider
    );

    const samplePage = `
import 'package:flutter/material.dart';

class ${pascal}Page extends StatelessWidget {
  const ${pascal}Page({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${pascal} Page')),
      body: const Center(child: Text('This is the ${pascal} screen.')),
    );
  }
}
`;
    fs.writeFileSync(
      path.join(featurePath, 'presentation', `${snake}_page.dart`),
      samplePage
    );

    const sampleView = `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ${pascal}View extends ConsumerWidget {
  const ${pascal}View({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Center(child: Text('${pascal} View'));
  }
}
`;
    fs.writeFileSync(
      path.join(featurePath, 'presentation/composition', `${snake}_view.dart`),
      sampleView
    );

    vscode.window.showInformationMessage(`Clean architecture folders and templates for "${featureName}" created!`);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
