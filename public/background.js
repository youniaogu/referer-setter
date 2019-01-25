// const url = chrome.runtime.getURL("data/config.json");

// fetch(url)
//   .then(response => response.json())
//   .then(json => {
//     chrome.webRequest.onBeforeSendHeaders.addListener(
//       function(details) {
//         const obj = json.list.find(obj => {
//           return details.url.indexOf(obj.from.replace("*", "")) !== -1;
//         });

//         if (obj) {
//           details.requestHeaders.push({
//             name: "Referer",
//             value: obj.to
//           });
//         }

//         return { requestHeaders: details.requestHeaders };
//       },
//       {
//         urls: json.list.map(obj => {
//           return obj.from;
//         })
//       },
//       // { urls: ["<all_urls>"] },
//       ["blocking", "requestHeaders"]
//     );
//   });

let list = [];

chrome.storage.sync.get(["list"], function(result) {
  if (!result || !result.list) {
    return;
  }
  const list = [].concat(result.list || []);

  chrome.webRequest.onBeforeSendHeaders.addListener(
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
    // { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
  );
});
