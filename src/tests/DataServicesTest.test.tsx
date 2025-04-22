import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GetDataServices from "../../lib/DataServices";

vi.mock("@esri/arcgis-rest-request", () => ({
  request: vi.fn(),
  ApiKeyManager: { fromKey: vi.fn(() => "mock-key") },
  spy: true,
}));

vi.mock("@esri/arcgis-rest-feature-service", () => ({
  queryFeatures: vi.fn().mockResolvedValueOnce({ data: "mock-data" }),
  spy: true,
}));

describe("DataServices component", () => {
  it("should render Data Services with ArcGIS REST JS and 'meta data'", async () => {
    render(<GetDataServices type="get-meta-data" />);
    await waitFor(() => {
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render Data Services with ArcGIS REST JS and 'query-feature-layer-sql'", async () => {
    render(<GetDataServices type="query-feature-layer-sql" />);
    await waitFor(() => {
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render Data Services with ArcGIS REST JS and 'query-feature-layer-spatial", async () => {
    render(<GetDataServices type="query-feature-layer-spatial" />);
    await waitFor(() => {
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render API Key is missing", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";
    render(<GetDataServices type="get-meta-data" />);
    await waitFor(() => {
      expect(screen.getByText(/API Key is missing/i)).toBeInTheDocument();
    });
  });
});
