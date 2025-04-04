import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { geocode, IGeocodeResponse } from "@esri/arcgis-rest-geocoding";
import { useEffect, useState } from "react";

const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

interface GeocodingProps {
  type: "geocode" | "reverse-geocode";
}

function PerformGeocoding({ type }: GeocodingProps) {
  const [data, setData] = useState<IGeocodeResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }
    const authentication = ApiKeyManager.fromKey(accessToken);
    let requestPromise: Promise<any>;

    switch (type) {
      case "geocode":
        requestPromise = geocode({
          params: {
            address: "13406 Limestone Drive",
            postal: 92399,
            countryCode: "USA",
          },
          authentication,
        });
        break;

      case "reverse-geocode":
        requestPromise = geocode({
          params: {
            category: "Sandwich shop",
            location: "-117.053636880931,34.009386349024",
            maxLocations: 1,
          },
          outFields: "*",
          authentication,
        });
        break;

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
      <h1>Gecoding with ArcGIS REST JS</h1>
      <div className="result">
        <h2>Search Results:</h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default PerformGeocoding;
