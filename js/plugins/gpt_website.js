/*:
 * @target MZ
 * @plugindesc Opens a specific website in the default web browser during gameplay.
 * @help
 * Use the Plugin Command "Open Website" to open a specific website URL in the default browser.
 *
 * @command openWebsite
 * @text Open Website
 * @desc Opens a specific URL in the default web browser.
 *
 * @arg url
 * @type string
 * @text Website URL
 * @desc The URL of the website to open.
 * @default https://www.example.com
 */

(() => {
    const pluginName = "OpenWebsitePlugin";

    PluginManager.registerCommand(pluginName, "openWebsite", args => {
        const url = String(args.url);

        // NW.js에서 실행되는 경우, 기본 웹 브라우저로 URL 열기
        if (typeof require === 'function' && typeof process === 'object') {
            const gui = require('nw.gui');
            gui.Shell.openExternal(url);
        } else {
            // 웹 환경에서는 새 탭으로 열기
            window.open(url, "_blank");
        }
    });
})();
