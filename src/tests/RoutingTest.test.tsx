import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PerformRouting from "../../lib/Routing";

vi.mock("@esri/arcgis-rest-request", () => ({
  request: vi.fn(),
  ApiKeyManager: { fromKey: vi.fn(() => "mock-key") },
  spy: true,
}));

vi.mock("@esri/arcgis-rest-feature-service", () => ({
  solveRoute: vi.fn().mockResolvedValueOnce({ data: "mock-data" }),
  serviceArea: vi.fn().mockResolvedValueOnce({ data: "mock-data" }),
  spy: true,
}));

describe("Routing component", () => {
  it("should render Routing with ArcGIS REST JS and display routes between two points", async () => {
    render(<PerformRouting type="route" />);
    await waitFor(() => {
      expect(
        screen.getByText(/Routing with ArcGIS REST JS/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render Routing with ArcGIS REST JS and display the service area around a point", async () => {
    render(<PerformRouting type="service-area" />);
    await waitFor(() => {
      expect(
        screen.getByText(/Routing with ArcGIS REST JS/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render API Key is missing", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";
    render(<PerformRouting type="route" />);
    await waitFor(() => {
      expect(screen.getByText(/API Key is missing/i)).toBeInTheDocument();
    });
  });
});
