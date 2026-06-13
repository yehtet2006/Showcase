import app from "./app";
import { ENV } from "./config/env";
import  jobs from "./lib/cron";

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);

  if(ENV.NODE_ENV === "development") {
    jobs.start();
  }
});