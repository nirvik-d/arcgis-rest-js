import { ApiKeyManager } from "@esri/arcgis-rest-request";
import {
  ISolveRouteResponse,
  IServiceAreaResponse,
  solveRoute,
  serviceArea,
} from "@esri/arcgis-rest-routing";
import { useEffect, useState } from "react";

interface RoutingProps {
  type: "route" | "service-area";
}

const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

function PerformRouting({ type }: RoutingProps) {
  const [data, setData] = useState<
    ISolveRouteResponse | IServiceAreaResponse | null
  >(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }
    const authentication = ApiKeyManager.fromKey(accessToken);
    let requestPromise: Promise<any>;

    switch (type) {
      case "route":
        requestPromise = solveRoute({
          stops: [
            [-117.195677, 34.056383],
            [-117.918976, 33.812092],
          ],
          authentication,
        });
        break;

      case "service-area":
        requestPromise = serviceArea({
          facilities: [
            [-123.1171, 49.2818], // Vancouver
          ],
          authentication,
        });
        break;

      default:
        setError(new Error("An unknown error occurred."));
        return;
    }

    requestPromise
      .then((response) => setData(response))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      });
  }, [type]);

  return (
    <>
      <h1>Routing with ArcGIS REST JS</h1>
      <div className="result">
        <h2>Search Results:</h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default PerformRouting;
