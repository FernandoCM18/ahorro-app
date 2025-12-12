import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the app title", () => {
    render(<App />);
    expect(screen.getByText("ahorro-app")).toBeInTheDocument();
  });

  it("renders the app description", () => {
    render(<App />);
    expect(
      screen.getByText("App para llevar el conteo de tu ahorro")
    ).toBeInTheDocument();
  });
});
