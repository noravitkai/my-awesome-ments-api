import { type Request, type Response } from "express";
import cron, { ScheduledTask } from "node-cron";
import https from "https";

// Settings
const MINUTES_DELTA = 1;
const URL = "https://my-awesome-ments-api.onrender.com/api/";
let counter = 0;
let task: ScheduledTask;

// Ping the server and provide feedback
function pingServer() {
  https
    .get(URL, () => {
      counter -= MINUTES_DELTA;
      console.log("Server pinged successfully.");
      console.log(`Remaining time: ${counter} minutes.`);
    })
    .on("error", (err) => {
      console.error(`Failed to ping server: ${err.message}.`);
    });
}

// Stop the task if it's still running
function stopPingingServer() {
  if (task) {
    task.stop();
    console.log("Cron job terminated successfully.");
  } else {
    console.log("No cron job to terminate.");
  }
}

// Clear any ongoing tasks before starting a new one
function cleanUpTasks() {
  for (const task of cron.getTasks().values()) {
    task.stop();
  }
  cron.getTasks().clear();
  console.log("Previous cron tasks cleared successfully.");
}

// Initialize the cron job and handle potential errors
export async function startCron(req: Request, res: Response) {
  try {
    cleanUpTasks();

    const cronPattern = `*/${MINUTES_DELTA} * * * *`;
    const totalDuration = parseInt(req.params.duration as string) || 60;

    counter = totalDuration; // Set counter to track remaining duration
    task = cron.schedule(cronPattern, pingServer, { scheduled: false });
    task.start();

    console.log(
      `Cron job started: pinging every ${MINUTES_DELTA} minutes for ${totalDuration} minutes.`
    );

    setTimeout(() => {
      stopPingingServer();
    }, totalDuration * 60 * 1000);

    res
      .status(200)
      .send(`Cron job started successfully for ${totalDuration} minutes.`);
  } catch (error: any) {
    console.error(`Unable to initiate cron job: ${error.message}.`);
    res
      .status(500)
      .send({ message: `Failed to start cron job: ${error.message}` });
  }
}
