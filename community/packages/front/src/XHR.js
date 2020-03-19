export default async function sendReq(method, url, payload, header, async) {

  return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
          if (request.readyState === 4) {
              try {
                  resolve(JSON.parse(request.response));
              } catch (e) {
                  resolve(request.response);
              }
          }
      };

      request.onerror = function(ev) {
          reject(ev);
      };

      request.open(method, url, true);

      for (let key in header) {
          request.setRequestHeader(key, header[key]);
      }

      request.send(JSON.stringify(payload));
  });
}