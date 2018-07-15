function hasPhantomStacktrace() {
    try {
        null[0]();
    } catch (e) {
        if (e.stack.indexOf('phantomjs') > -1) {
            return true;
        }
    }
}

function isHeadless(inconsistentPermissionsState) {
    const userAgent = window && window.navigator && window.navigator.userAgent || '';
    const noUserAgent = !userAgent;
    const isHeadlessChrome = /HeadlessChrome/i.test(userAgent);
    const isChrome = /(chrome|chromium)/i.test(userAgent);
    const isOpera = /opera/i.test(userAgent);
    const isWebdriver = !!navigator.webdriver;
    const isPhantom = window.callPhantom || window._phantom || hasPhantomStacktrace();
    const noChromeProperty = !window.chrome;
    const noPlugins = !navigator.plugins.length;
    const noLanguages = !navigator.languages;

    return (
        noUserAgent ||
        noLanguages ||
        isHeadlessChrome ||
        isWebdriver ||
        isPhantom ||
        ((isChrome || isOpera) && noChromeProperty) ||
        (isChrome && noPlugins) ||
        inconsistentPermissionsState
    );
}

function hasInconsistentPermissionsState() {
    return new Promise (function (resolve, reject) {
        try {
            navigator.permissions.query({ name:'notifications' })
            .then(function(permissionStatus) {
                try {
                    if(Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
                        resolve(true);
                    } else {
                        resolve();
                    }
                } catch (e) {
                    resolve();
                }
            });
        } catch (e) {
            resolve();
        }
    });
}

module.exports = function () {
    return hasInconsistentPermissionsState().then(isHeadless);
};
