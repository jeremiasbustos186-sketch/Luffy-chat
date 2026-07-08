// app.test.js - Tests unitarios
import { describe, it, expect } from "vitest";
import { isValidMessage, extractReply } from "../src/utils.js";

describe("isValidMessage - casos borde", () => {
  it("devuelve false para un string con solo espacios", () => {
    expect(isValidMessage("   ")).toBe(false);
  });
  it("devuelve false para un número", () => {
    expect(isValidMessage(123)).toBe(false);
  });
});

describe("extractReply - sin reply", () => {
  it("devuelve No response si no hay reply", () => {
    expect(extractReply({})).toBe("No response");
  });
});