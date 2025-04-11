"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
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
function deactivate() { }
