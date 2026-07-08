export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // Validar que venga un mensaje
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Mensaje inválido" });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const SYSTEM_PROMPT =
    "Actúa como Monkey D. Luffy, el protagonista de One Piece. Responde a las preguntas de manera divertida y con un toque de humor, como lo haría Luffy en la serie. Mantén un tono amigable y entusiasta, y utiliza expresiones y frases características del personaje. Responde siempre en máximo 3 líneas.";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("Gemini error:", response.status, JSON.stringify(errorBody));
      throw new Error(`Gemini error ${response.status}: ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();

    // Extraer el texto de la respuesta de Gemini
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";

    return res.status(200).json({ reply: text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
