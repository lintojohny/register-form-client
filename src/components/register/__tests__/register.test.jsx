import { describe, test, expect, beforeAll, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import Register from "../Register";
import userEvent from "@testing-library/user-event";

describe("render register", () => {
  
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  test("loads and displays regiser component", async () => {
    // ARRANGE
    render(<Register />);

    expect(screen.getByText("Create User Account")).toBeInTheDocument();
  });

  test("submit button without entering any value", async () => {
    // ARRANGE
    render(<Register />);

    const button = screen.getAllByRole("button")[1];
    act(() => {
      userEvent.click(button);
    });

    await waitFor(() => screen.findByText("Missing full name"));

    expect(screen.getByText("Missing full name")).toBeInTheDocument();
    expect(screen.getByText("Missing contact number")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid date")).toBeInTheDocument();
    expect(screen.getByText("Missing email")).toBeInTheDocument();
    expect(screen.getByText("Missing password")).toBeInTheDocument();
  });

  test("enter name and submit", async () => {
    // ARRANGE
    render(<Register />);

    const fistNameInput = screen.getByTestId("fullName");

    act(() => {
      userEvent.type(fistNameInput, "abc");
    });

    const button = screen.getAllByRole("button")[1];
    act(() => {
      userEvent.click(button);
    });

    await waitFor(() => screen.findByText("Missing contact number"));

    expect(screen.queryByText("Missing full name")).not.toBeInTheDocument();
  });

  test("enter all values expect date and submit", async () => {
    // ARRANGE
    render(<Register />);

    const fistNameInput = screen.getByTestId("fullName");
    const contactNumberInput = screen.getByTestId("contactNumber");
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirmPassword");
    screen.debug(fistNameInput);
    act(() => {
      userEvent.type(fistNameInput, "abc");
      userEvent.type(contactNumberInput, "1234567890");
      userEvent.type(emailInput, "abc@test.com");
      userEvent.type(passwordInput, "A123^d876");
      userEvent.type(confirmPasswordInput, "A123^d876");
    });

    const button = screen.getAllByRole("button")[1];
    act(() => {
      userEvent.click(button);
    });

    await waitFor(() => screen.findByText("Please enter a valid date"));

    expect(screen.queryByText("Please enter a valid date")).toBeInTheDocument();
  });
});
