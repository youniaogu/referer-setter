if (window.chrome.storage && window.chrome.storage.sync) {
  window.chrome.storage.sync.get(["list"], function(result) {
    if (!result || !result.list) {
      return;
    }
    const list = [].concat(result.list || []);

    window.chrome.webRequest.onBeforeSendHeaders.addListener(
      function(details) {
        const obj = list.find(obj => {
          return details.url.indexOf(obj.from.replace("*", "")) !== -1;
        });

        if (obj) {
          details.requestHeaders.push({
            name: "Referer",
            value: obj.to
          });
        }

        return { requestHeaders: details.requestHeaders };
      },
      {
        urls: list.map(obj => {
          return obj.from;
        })
      },
      ["blocking", "requestHeaders"]
    );
  });
}

if (window.browser && window.browser.storage && window.browser.webRequest) {
  window.browser.storage.sync.get(["list"]).then(
    result => {
      if (!result || !result.list) {
        return;
      }
      const list = [].concat(result.list || []);

      window.browser.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
          const obj = list.find(obj => {
            return details.url.indexOf(obj.from.replace("*", "")) !== -1;
          });

          if (obj) {
            details.requestHeaders.push({
              name: "Referer",
              value: obj.to
            });
          }

          return { requestHeaders: details.requestHeaders };
        },
        {
          urls: list.map(obj => {
            return obj.from;
          })
        },
        ["blocking", "requestHeaders"]
      );
    },
    err => {
      console.log(err);
    }
  );
}
