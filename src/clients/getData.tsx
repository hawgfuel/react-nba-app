interface getDataProps{
  url: string | URL | Request,
  verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Restrict to valid HTTP methods
  cache: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached'; // Restrict to valid cache modes
}

export function getData({url, verb, cache}: getDataProps){
    return fetch(url, {method: verb, cache: cache,}).then((resp) => {
        if (resp.status === 200) return resp.json();
        else throw new Error("Invalid response");
      });
  };
