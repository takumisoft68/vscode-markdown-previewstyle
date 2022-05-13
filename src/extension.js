// @ts-check

const vscode = require('vscode');

const themeConfigSection = 'markdown-previewstyle';
const themeConfigKey = 'colorTheme';

const defaultThemeConfiguration = 'dark';
const themeConfigValues = {
    'auto': true,
    'light': true,
    'dark': true
}

function getColorTheme() {
    const themeConfig = vscode.workspace.getConfiguration(themeConfigSection, null).get(themeConfigKey);

    if(themeConfig == 'auto') {
        const themeWorkbench = vscode.workspace.getConfiguration('workbench', null).get('colorTheme');
        if (themeWorkbench.toLowerCase().indexOf('dark') != -1) {
            return 'dark';
        }
        else if (themeWorkbench.toLowerCase().indexOf('light') != -1) {
            return 'light';
        }
        return defaultThemeConfiguration;
    }

    return validThemeConfigurationValue(themeConfig)
}

function validThemeConfigurationValue(theme) {
    return !themeConfigValues[theme]
        ? defaultThemeConfiguration
        : theme;
}

exports.activate = function(ctx) {
    ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e  => {
        if (e.affectsConfiguration(themeConfigSection)) {
            vscode.commands.executeCommand('markdown.preview.refresh');
        }
    }));

    return {
        extendMarkdownIt(md) {
            return md.use(plugin);
        }
    };
}

function plugin(md) {
    const render = md.renderer.render;
    md.renderer.render = function() {
        return `<div class="markdown-previewstyle-body markdown-previewstyle-${getColorTheme()}">
            <div class="markdown-previewstyle-content">${render.apply(md.renderer, arguments)}</div>
        </div>`;
    };
    return md;
}