import { request, ApiKeyManager } from "@esri/arcgis-rest-request";
import { useEffect, useState } from "react";

function Authentication() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }
    const authentication = ApiKeyManager.fromKey(accessToken);

    const url = "https://www.arcgis.com/sharing/rest/community/users";

    request(url, {
      authentication,
      params: {
        q: "john", // Query string to search users
        f: "json",
      },
    })
      .then((response) => setData(response))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      });
  }, []);

  return (
    <>
      <h1>Authentication with ArcGIS REST JS</h1>
      <div className="result">
        <h2>Search Results:</h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default Authentication;
