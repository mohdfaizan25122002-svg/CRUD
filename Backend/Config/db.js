const mongoose = require("mongoose");
const dns = require("node:dns");

const configureAtlasDns = () => {
  const dnsServers = (process.env.MONGODB_DNS_SERVERS || "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length) dns.setServers(dnsServers);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;

  if (!mongoUri) {
    throw new Error("MONGO_URI (or MONGODB_URL) must be set before starting the backend.");
  }

  if (mongoUri.startsWith("mongodb+srv://")) configureAtlasDns();

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
