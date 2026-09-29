const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

async function connectToDB() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/iticket_db";
    await connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("DB connection error:", error.message);
  }
}

connectToDB();

// Routes
const adminRoutes = require("./routes/adminRoute");
const countryRoutes = require("./routes/countryRoute");
const regionRoutes = require("./routes/regionRoute");
const districtRoutes = require("./routes/districtRoute");
const flatRoutes = require("./routes/flatRoute");
const genderRoutes = require("./routes/genderRoute");
const langRoutes = require("./routes/langRoute");
const customerRoutes = require("./routes/customerRoute");
const customeraddressRoutes = require("./routes/customeraddressRoute");
const customercardRoutes = require("./routes/customercardRoute");
const typesRoutes = require("./routes/typesRoute");
const venueRoutes = require("./routes/venueRoute");
const venuetypesRoutes = require("./routes/venuetypesRoute");
const venuephotoRoutes = require("./routes/venuephotoRoute");
const sectorRoutes = require("./routes/sectorRoute");
const seattypeRoutes = require("./routes/seattypeRoute");
const seatRoutes = require("./routes/seatRoute");
const humancategoryRoutes = require("./routes/humancategoryRoute");
const eventtypeRoutes = require("./routes/eventtypeRoute");
const eventRoutes = require("./routes/eventRoute");
const discountRoutes = require("./routes/discountRoute");
const ticketstatusRoutes = require("./routes/ticketstatusRoute");
const tickettypeRoutes = require("./routes/tickettypeRoute");
const ticketRoutes = require("./routes/ticketRoute");
const cartRoutes = require("./routes/cartRoute");
const cartitemRoutes = require("./routes/cartitemRoute");
const paymentmethodRoutes = require("./routes/paymentmethodRoute");
const deliverymethodRoutes = require("./routes/deliverymethodRoute");
const bookingRoutes = require("./routes/bookingRoute");

app.use("/admin", adminRoutes);
app.use("/country", countryRoutes);
app.use("/region", regionRoutes);
app.use("/district", districtRoutes);
app.use("/flat", flatRoutes);
app.use("/gender", genderRoutes);
app.use("/lang", langRoutes);
app.use("/customer", customerRoutes);
app.use("/customer-address", customeraddressRoutes);
app.use("/customer-card", customercardRoutes);
app.use("/types", typesRoutes);
app.use("/venue", venueRoutes);
app.use("/venue-types", venuetypesRoutes);
app.use("/venue-photo", venuephotoRoutes);
app.use("/sector", sectorRoutes);
app.use("/seat-type", seattypeRoutes);
app.use("/seat", seatRoutes);
app.use("/human-category", humancategoryRoutes);
app.use("/event-type", eventtypeRoutes);
app.use("/event", eventRoutes);
app.use("/discount", discountRoutes);
app.use("/ticket-status", ticketstatusRoutes);
app.use("/ticket-type", tickettypeRoutes);
app.use("/ticket", ticketRoutes);
app.use("/cart", cartRoutes);
app.use("/cart-item", cartitemRoutes);
app.use("/payment-method", paymentmethodRoutes);
app.use("/delivery-method", deliverymethodRoutes);
app.use("/booking", bookingRoutes);

// Swagger Docs Setup
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "iTicket REST API",
      version: "1.0.0",
      description: "iTicket chipta sotish platformasi uchun xavfsiz va to'liq REST API hamda Swagger hujjatlari",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Marshrut topilmadi: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
