import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { messages = [] } = req.body || {};
    const SYSTEM_PROMPT = `Du bist der FAQ-Assistent der Selrent GmbH (selrent.at).
Selrent vermietet Lagerplätze für Autos, Campingwagen, Boote und Lagercontainer.
Antworten: kurz, konkret, in DU-Form, DE-AT. Keine Rechts-/Versicherungsberatung.
Wenn Daten fehlen (Preise, Adresse, Maße), biete an, eine Anfrage an office@selrent.at zu senden.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ]
    });

    const reply = completion.choices?.[0]?.message?.content ?? "Leider keine Antwort erhalten.";
    return res.status(200).json({ reply });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Chat error" });
  }
}
