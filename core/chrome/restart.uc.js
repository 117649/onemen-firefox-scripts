// ==UserScript==
// @name            restart button
// @include         main
// @author          xiaoxiaoflood
// @onlyonce
// ==/UserScript==

// original: https://github.com/alice0775/userChrome.js/blob/master/rebuild_userChrome.uc.xul

UC.restart_button = {
  elBuilder: function (doc, tag, props) {
    const el = doc.createXULElement(tag);
    for (const p in props) {
      el.setAttribute(p, props[p]);
    }
    return el;
  },

  init: function () {
    const lazy = {};
    ChromeUtils.defineESModuleGetters(lazy, {
      TabStateFlusher: 'resource:///modules/sessionstore/TabStateFlusher.sys.mjs',
    });

    const resourceURI =
      Services.vc.compare(Services.appinfo.platformVersion, '143.a1') >= 0 ?
        'moz-src:///browser/components/customizableui/CustomizableUI.sys.mjs'
      : 'resource:///modules/CustomizableUI.sys.mjs';
    const {CustomizableUI} = ChromeUtils.importESModule(resourceURI);

    CustomizableUI.createWidget({
      id: 'userChromejs_restartApp_onemen',
      type: 'custom',
      defaultArea: CustomizableUI.AREA_NAVBAR,
      onBuild: function (aDocument) {
        const markup = `
        <toolbaritem id="${this.id}"
          class="toolbaritem-combined-buttons chromeclass-toolbar-additional"
          style="margin-inline: 0;"
          badged="true"
          removable="true"
          widget-id="${this.id}"
          widget-type="button">
          <toolbarbutton id="${this.id}-button"
            class="toolbarbutton-1 chromeclass-toolbar-additional"
            tooltiptext="Restart Firefox"
            label="Restart Firefox"
            style="list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVQ4jY2Tv2sUURDHZ/bX7eW0ChJBRFKIRRCRIEHuzVvfrYmkSiFXSSoLERERy5B/wcIuqG9mN5VecUWwCqkOEQsLKysLsQgSxEJEgsVYeJfsHXuY4tvN9zMzzHxBVXFS8Gy1kRaZi8U+iCV7HIq73Xqez9XWThoDsRvg6QDY6Ji8+RMK9dLSztcCoMhnkc27YxPth0I7oVAPhT5WYD9ScfkYALYWYxQa/OvU/h5ztg5bi3G1U2vbXUFPb4fT/EzELRwBYraPRvSE7eW6XVUV4en1JjLtARtFoYGqInRfd0Nk8wXYaCzZ/WnmkZrengc2v4GNNr1bglPiFoaj/5orV1r/A6gqhkI9YKMB0yY0OF9GsV/jIts9iVlVMeJscwhgOKmpqoDpGNDg5YuB0HYg9lUotINCuxFn/bN+9czUFZj6wEYDsRsQle7W+NPQ/uhEdUpLOw/cPgQ2OlPcvAoJZ90qICnc2tQzlist9GYAbDRk2lNVhFDs3YmXPUjkxp3JR2qWbgk9fRj9S+Olu6SqCJHYJ+DN5xnOryHT+wrsG7J9g0x9ZPup2iAS1z6aKi076+mLzoVRmKJpYeL2YSC2aBadc1PTOB7n3AXe3guYHiberZ0u8tm62r99Gyd0lo7sIAAAAABJRU5ErkJggg==)">
          </toolbarbutton>
        </toolbaritem>`;

        const node = (
          aDocument.ownerGlobal ?? aDocument.documentGlobal
        ).MozXULElement.parseXULToFragment(markup);
        node.firstChild.addEventListener('command', () => {
          UC.restart_button.restartApplication();
        });
        return node.firstChild;
      },
    });

    // testing closed groups
    function onNewWindow(window) {
      let parent = window.Tabmix;
      if (!parent) {
        window._Tabmix = {};
        parent = window._Tabmix;
      }
      parent.testClosedGroup = function () {
        const urls = ['about:config', 'about:addons'];
        const tabs = urls.map(url =>
          window.gBrowser.addTab(url, {
            triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
          })
        );
        const group = window.gBrowser.addTabGroup(tabs, {
          label: 'test group',
        });
        const promises = group.tabs.map(tab => lazy.TabStateFlusher.flush(tab.linkedBrowser));
        Promise.all(promises).then(() => {
          window.gBrowser.removeTabGroup(group);
        });
      };
    }

    const observer = {
      observe: function (document) {
        if (document.documentElement.getAttribute('windowtype') === 'navigator:browser') {
          const win = document.ownerGlobal ?? document.documentGlobal;
          win.delayedStartupPromise.then(() => {
            onNewWindow(win);
          });
        }
      },
    };

    Services.obs.addObserver(observer, 'chrome-document-loaded', false);
  },

  /**
   * restartApplication: Restarts the application, keeping it in safe mode if it
   * is already in safe mode.
   */
  async restartApplication() {
    const cancelQuit = Cc['@mozilla.org/supports-PRBool;1'].createInstance(Ci.nsISupportsPRBool);
    Services.obs.notifyObservers(cancelQuit, 'quit-application-requested', 'restart');
    if (cancelQuit.data) {
      // The quit request has been canceled.
      return false;
    }

    Services.appinfo.invalidateCachesOnRestart();

    // if already in safe mode restart in safe mode
    if (Services.appinfo.inSafeMode) {
      Services.startup.restartInSafeMode(Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);
      return undefined;
    }
    Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
    return undefined;
  },
};

UC.restart_button.init();
