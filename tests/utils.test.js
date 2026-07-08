// utils.test.js - Tests unitarios
import { describe, it, expect } from "vitest";
import { formatMessage, isValidMessage, extractReply, createUserMessage } from "../src/utils.js";

describe("formatMessage", () => {
  it("crea un mensaje con role y text correctos", () => {
    const result = formatMessage("user", "hola");
    expect(result).toEqual({ role: "user", parts: [{ text: "hola" }] });
  });
});

describe("isValidMessage", () => {
  it("devuelve true para un mensaje válido", () => {
    expect(isValidMessage("hola luffy")).toBe(true);
  });
  it("devuelve false para un mensaje vacío", () => {
    expect(isValidMessage("")).toBe(false);
  });
});

describe("extractReply", () => {
  it("extrae el reply de la respuesta", () => {
    expect(extractReply({ reply: "¡Hola!" })).toBe("¡Hola!");
  });
});

describe("createUserMessage", () => {
  it("crea un mensaje con role user", () => {
    const result = createUserMessage("hola");
    expect(result.role).toBe("user");
  });
});