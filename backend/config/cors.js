module.exports = ({ env }) => ({
  enabled: true,
  settings: {
    origin: [
      "http://localhost:1337",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "http://127.0.0.1:1337",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:4173",
      "http://192.168.1.215:1337",
      "http://192.168.1.215:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    headers: ["Content-Type", "Authorization"],
  },
});
