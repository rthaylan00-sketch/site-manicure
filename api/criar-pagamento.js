/* import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: "Sinal - Manicure",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 20
        }
      ],
      back_urls: {
        success: "https://site-manicure-dusky.vercel.app/sucesso.html",
        failure: "https://site-manicure-dusky.vercel.app/erro.html",
        pending: "https://site-manicure-dusky.vercel.app/pendente.html"
      },
      auto_return: "approved"
    });

    return res.status(200).json({
      link: preference.body.init_point
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
} */

