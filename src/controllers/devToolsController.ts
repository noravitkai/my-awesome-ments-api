import { type Request, type Response } from "express";
import cron, { ScheduledTask } from "node-cron";
import https from "https";

// Settings
const TOTAL_DURATION_MINUTES = 120; // Total runtime for the cron job
const MINUTES_DELTA = 5; // Interval between pings in minutes
const cronPattern = `*/${MINUTES_DELTA} * * * *`; // Every 5 minutes → https://crontab.guru/#*/5_*_*_*_*
const URL = "https://my-awesome-ments-api.onrender.com/api/"; // Endpoint to keep alive

let counter = 0;
let task: ScheduledTask;

// Ping the server to prevent it from sleeping
function pingServer() {
  https.get(URL, () => {
    counter -= MINUTES_DELTA;
    console.log("Pinged the server");
    console.log("Minutes left:", counter);
  });
}

// Stop the cron job after total duration
function stopPingingServer() {
  task.stop();
  console.log("Stopped the cron job due to inactivity.");
}

// Start the cron job (triggered via GET route)
export async function startCron(req: Request, res: Response) {
  try {
    counter = TOTAL_DURATION_MINUTES;

    // Schedule the ping task but don't start it immediately
    task = cron.schedule(cronPattern, pingServer, { scheduled: false });

    console.log(
      `Cron job initiated: pinging every ${MINUTES_DELTA} min for ${TOTAL_DURATION_MINUTES} min total.`
    );

    // Start the scheduled task
    task.start();

    // Automatically stop after total duration
    setTimeout(stopPingingServer, TOTAL_DURATION_MINUTES * 60 * 1000);

    res.status(200).send("Cron job started to keep the server alive.");
  } catch (error) {
    res.status(500).send({ message: error });
  }
}
