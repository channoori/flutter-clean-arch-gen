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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.generateCleanFeature', (uri) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const featureName = yield vscode.window.showInputBox({
            placeHolder: 'Enter feature name (e.g. auth, home, profile)',
            prompt: 'This will generate a new clean architecture feature folder',
        });
        if (!featureName) {
            vscode.window.showWarningMessage('Feature name is required.');
            return;
        }
        // 📌 우클릭한 폴더 경로 기준으로 생성
        const basePath = (uri === null || uri === void 0 ? void 0 : uri.fsPath) || ((_b = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.uri.fsPath);
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
            'presentation/view',
        ];
        foldersToCreate.forEach((folder) => {
            const fullPath = path.join(featurePath, folder);
            fs.mkdirSync(fullPath, { recursive: true });
        });
        vscode.window.showInformationMessage(`Clean architecture folders for "${featureName}" created at ${featurePath}`);
    }));
    context.subscriptions.push(disposable);
}
function deactivate() { }
