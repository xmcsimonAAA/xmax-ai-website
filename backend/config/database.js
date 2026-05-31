module.exports = ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: env("DATABASE_FILENAME", "/tmp/xmax_data.db"),
    },
    useNullAsDefault: true,
  },
});
