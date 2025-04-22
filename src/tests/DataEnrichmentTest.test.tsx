import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import GetData from "../../lib/DataEnrichment";

vi.mock("@esri/arcgis-rest-request", () => ({
  ApiKeyManager: {
    fromKey: vi.fn(() => "mock-auth"),
  },
}));

vi.mock("@esri/arcgis-rest-demographics", () => ({
  queryDemographicData: vi.fn(() => Promise.resolve({ data: "mock-data" })),
}));

beforeEach(() => {
  import.meta.env.VITE_ARCGIS_API_KEY = "test-api-key";
  vi.clearAllMocks();
});

describe("DataEnrichment Component", async () => {
  it("renders loading initially for local demographics", async () => {
    vi.fn().mockResolvedValueOnce({});
    render(<GetData type="local" />);

    await waitFor(() =>
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    );
  });

  it("renders loading initially for global demographics", async () => {
    vi.fn().mockResolvedValueOnce({});
    render(<GetData type="global" />);

    await waitFor(() =>
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    );
  });

  it("renders local data", async () => {
    vi.fn().mockResolvedValueOnce({ data: "local data enrichment" });
    render(<GetData type="local" />);

    await waitFor(() => {
      expect(
        screen.getByText(/Local Data Search Results/i)
      ).toBeInTheDocument();
    });
  });

  it("renders global data", async () => {
    render(<GetData type="global" />);

    await waitFor(() => {
      expect(
        screen.getByText(/Global Data Search Results/i)
      ).toBeInTheDocument();
    });
  });

  it("API key is missing", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";
    render(<GetData type="local" />);

    await waitFor(() =>
      expect(screen.getByText(/API Key is missing/i)).toBeInTheDocument()
    );
  });
});
