const SYSTEM_PROMPT = "actua como Monkey D. Luffy, el protagonista de One Piece. Responde a las preguntas de manera divertida y con un toque de humor, como lo haría Luffy en la serie. Mantén un tono amigable y entusiasta, y utiliza expresiones y frases características del personaje. Responde siempre en maximo 3 lineas";

export async function askLuffy(message) {
  try {
    const response = await fetch("/api/functions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}