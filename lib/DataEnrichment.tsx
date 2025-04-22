import { ApiKeyManager } from "@esri/arcgis-rest-request";
import {
  IQueryDemographicDataResponse,
  queryDemographicData,
} from "@esri/arcgis-rest-demographics";
import { useEffect, useState } from "react";

const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

interface DataProps {
  type: "local" | "global";
}

function GetData({ type }: DataProps) {
  const [data, setData] = useState<IQueryDemographicDataResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }

    const authentication = ApiKeyManager.fromKey(accessToken);
    let requestPromise: Promise<any>;

    switch (type) {
      case "local":
        requestPromise = queryDemographicData({
          studyAreas: [{ geometry: { x: -74.006, y: 40.7128 } }],
          authentication: authentication,
          analysisVariables: [
            "PsychographicsShopping.MP28067A_B",
            "transportation.X7027_I",
            "entertainment.X9005_I",
            "lifemodegroupsNEW.TLIFENAME",
          ],
        });
        break;

      case "global":
        requestPromise = queryDemographicData({
          studyAreas: [{ geometry: { x: 0.1278, y: 51.5074 } }], // London
          dataCollections: ["KeyGlobalFacts"],
          authentication: authentication,
        });
        break;

      default:
        setError(new Error("Unsupported request type"));
        return;
    }

    if (!requestPromise) return;
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
      <h1>
        {type === "local"
          ? "Get local data with ArcGIS REST JS"
          : "Get global data with ArcGIS REST JS"}
      </h1>
      <div className="result">
        <h2>
          {type === "local"
            ? "Local Data Search Results: "
            : "Global Data Search Results: "}
        </h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default GetData;
