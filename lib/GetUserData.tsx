import { request, ApiKeyManager } from "@esri/arcgis-rest-request";
import { useEffect, useState } from "react";

interface UserDataProps {
  nameQuery?: any;
  format?: any;
  url?: any;
}

function GetUserData({ nameQuery, format, url }: UserDataProps) {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }
    const authentication = ApiKeyManager.fromKey(accessToken);

    request(url, {
      authentication,
      params: {
        q: nameQuery, // Query string to search users
        f: format,
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

export default GetUserData;
