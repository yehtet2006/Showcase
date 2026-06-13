// cron.ts
import { CronJob } from "cron";
import http from "http";
import https from "https";

const job = new CronJob("*/14 * * * *", async () => {
  const base = process.env.FRONTEND_URL;

  if (!base) {
    console.warn("FRONTEND_URL is not defined");
    return;
  }

  const url = new URL("/api/health", base).href;
  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res: http.IncomingMessage) => {
      if (res.statusCode === 200) {
        console.log("Health check successful");
      } else {
        console.log(    
          `Health check failed with status code: ${res.statusCode}`
        );
      }
    })
    .on("error", (err: Error) => {
      console.error(`Health check failed with error: ${err.message}`);
    });
});

export default job;