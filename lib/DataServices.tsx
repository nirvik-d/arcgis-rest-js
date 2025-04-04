import { ApiKeyManager, request } from "@esri/arcgis-rest-request";
import {
  IQueryFeaturesResponse,
  IQueryResponse,
  queryFeatures,
} from "@esri/arcgis-rest-feature-service";
import { useEffect, useState } from "react";

interface DataServicesProps {
  type:
    | "get-meta-data"
    | "query-feature-layer-sql"
    | "query-feature-layer-spatial"
    | "edit-feature-data";
}

function GetDataServices({ type }: DataServicesProps) {
  const [data, setData] = useState<
    IQueryFeaturesResponse | IQueryResponse | null
  >(null);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }
    const authentication = ApiKeyManager.fromKey(accessToken);
    const url =
      "https://services7.arcgis.com/rnSiSPeHU8eJQ8OI/arcgis/rest/services/Santa_Monica_Parcels/FeatureServer";
    const queryGeometry = {
      xmin: -13193261.0,
      ymin: 4028181.6,
      xmax: -13185072.9,
      ymax: 4035576.6,
      spatialReference: {
        wkid: 101200,
      },
    };

    let requestPromise: Promise<any>;

    switch (type) {
      case "get-meta-data":
        requestPromise = request(url, {
          authentication,
        });
        break;

      case "query-feature-layer-sql":
        requestPromise = queryFeatures({
          url: url,
          where: "usetype = 'Commercial'",
          resultRecordCount: 1,
          authentication,
        });
        break;

      case "query-feature-layer-spatial":
        requestPromise = queryFeatures({
          url: url,
          geometry: queryGeometry,
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects",
          authentication,
        });
        break;

      default:
        setError(new Error("Unsupported request type"));
        return;
    }

    requestPromise
      .then((response) => setData(response))
      .catch((err: unknown) =>
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        )
      );
  }, [type]);

  return (
    <>
      <h1>Data Services with ArcGIS REST JS</h1>
      <div className="result">
        <h2>Search Results:</h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default GetDataServices;
