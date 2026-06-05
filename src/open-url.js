const { spawn } = require('child_process');

function spawnDetached(command, args) {
    const child = spawn(command, args, {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
    });

    child.unref();
}

async function openUrl(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('URL is required');
    }

    if (process.platform === 'win32') {
        spawnDetached('rundll32.exe', ['url.dll,FileProtocolHandler', url]);
        return;
    }

    if (process.platform === 'darwin') {
        spawnDetached('open', [url]);
        return;
    }

    spawnDetached('xdg-open', [url]);
}

module.exports = { openUrl };
