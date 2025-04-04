import { ApiKeyManager } from "@esri/arcgis-rest-request";
import {
  IFindElevationAtPointResponse,
  findElevationAtPoint,
  IFindElevationAtManyPointsResponse,
  findElevationAtManyPoints,
} from "@esri/arcgis-rest-elevation";
import { useEffect, useState } from "react";

const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

interface DataProps {
  type: "point" | "multiple-points";
}

function GetElevation({ type }: DataProps) {
  const [data, setData] = useState<
    IFindElevationAtPointResponse | IFindElevationAtManyPointsResponse | null
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
      case "point":
        requestPromise = findElevationAtPoint({
          lon: -11.7,
          lat: 12.3,
          relativeTo: "ellipsoid",
          authentication: authentication,
        });
        break;

      //   case "multiple-points":
      //     requestPromise = findElevationAtManyPoints({
      //       coordinates: points,
      //       authentication: authentication,
      //     });
      //     break;

      default:
        setError(new Error("Unsupported request type"));
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
      <h1>"Elevation with ArcGIS REST JS"</h1>
      <div className="result">
        <h2>Search Results:</h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default GetElevation;
