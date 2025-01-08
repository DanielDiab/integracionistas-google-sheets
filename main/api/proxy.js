export default async function handler(req, res) {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
    const BASE_ID = process.env.BASE_ID
    const TABLE_NAME = process.env.TABLE_NAME

    // Configurar encabezados para CORS
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    // Manejar solicitudes OPTIONS
    if (req.method === "OPTIONS") {
        res.status(200).end()
        return
    }

    // Manejar solicitudes POST
    if (req.method === "POST") {
        try {
            const response = await fetch(
                `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(req.body),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                res.status(response.status).json({
                    error: data.error || "Error al interactuar con Airtable",
                })
                return
            }

            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.status(405).json({ error: "Método no permitido" })
    }
}
