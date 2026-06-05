const { spawn } = require('child_process');

function openUrlOnWindows(url) {
    const child = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
    });

    child.unref();
}

async function openUrlWithOpenPackage(url) {
    const { default: open } = await import('open');
    await open(url);
}

async function openUrl(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('URL is required');
    }

    if (process.platform === 'win32') {
        openUrlOnWindows(url);
        return;
    }

    await openUrlWithOpenPackage(url);
}

module.exports = { openUrl };
