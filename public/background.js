let GOBAL_LIST = [];
let EXTENSION = undefined;

if (window.chrome.storage && window.chrome.storage.sync) {
  EXTENSION = window.chrome;
}
if (window.browser && window.browser.storage && window.browser.webRequest) {
  EXTENSION = window.browser;
}

if (window.chrome.storage && window.chrome.storage.sync) {
  function requestHandler(details) {
    const obj = GOBAL_LIST.find(obj => {
      return details.url.indexOf(obj.from.replace("*", "")) !== -1;
    });

    if (obj) {
      details.requestHeaders.push({
        name: "Referer",
        value: obj.to
      });
    }

    return { requestHeaders: details.requestHeaders };
  }

  function getStorage() {
    return new Promise((reslove, reject) => {
      EXTENSION.storage.sync.get(["list"], result => {
        if (!result || !result.list) {
          GOBAL_LIST = [];
          reslove("empty");
        }

        GOBAL_LIST = [].concat(result.list || []);
        reslove("success");
      });
    });
  }

  function removeListener(fn) {
    const event = EXTENSION.webRequest.onBeforeSendHeaders;

    event.hasListener(fn) && event.removeListener(fn);
  }

  function setListener() {
    return new Promise((reslove, reject) => {
      EXTENSION.webRequest.onBeforeSendHeaders.addListener(
        requestHandler,
        {
          urls: GOBAL_LIST.map(obj => {
            return obj.from;
          })
        },
        ["blocking", "requestHeaders"]
      );

      reslove("success");
    });
  }

  function handleChange() {
    EXTENSION.webRequest.handlerBehaviorChanged();
  }

  function handleStorageChange() {
    return new Promise((reslove, reject) => {
      EXTENSION.storage.onChanged.addListener(function(changes, namespace) {
        const storageChange = changes["list"];

        if (!storageChange || namespace !== "sync") {
          return;
        }

        GOBAL_LIST = storageChange.newValue;

        removeListener(requestHandler);
        setListener(storageChange.newValue);
        handleChange();
      });

      reslove("success");
    });
  }

  getStorage()
    .then(() => {
      return setListener();
    })
    .then(() => {
      return handleStorageChange();
    })
    .catch(e => {
      console.log(e);
    });
}
