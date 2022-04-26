let directory = "src";
if (process.env.NODE_ENV !== "local") {
  directory = "dist";
}
const ext = directory === "dist" ? "js" : "ts";
const env = process.env.NODE_ENV;
require("dotenv-flow").config({ node_env: env });

console.log(directory);
console.log(ext);
console.log(env);
console.log(process.env.DB_HOST);

module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: "5432",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/${directory}/models/*.${ext}`],
  migrations: [`${__dirname}/${directory}/database/migrations/*.${ext}`],
  cli: {
    migrationsDir: `./${directory}/database/migrations`,
  },
};
