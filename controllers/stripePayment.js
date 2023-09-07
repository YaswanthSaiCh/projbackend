const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.makeStripePayment = async (req, res) => {
  const { products } = req.body;

  const line_items = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    line_items: line_items,
    success_url: `${process.env.WEB_URL}/payment/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.WEB_URL}/payment/failed`,
  });
  return res.status(200).json({ id: session.id });
};
