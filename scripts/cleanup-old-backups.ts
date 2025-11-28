import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

const RETENTION_DAYS = 30;
const BACKUP_PATH = 's3://edhtop16/backups/';

async function cleanupOldBackups() {
  console.log(`Cleaning up backups older than ${RETENTION_DAYS} days...`);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
  const cutoffTimestamp = cutoffDate.getTime();

  // List all backups
  const {stdout} = await execAsync(`s3cmd ls ${BACKUP_PATH}`);
  const lines = stdout.trim().split('\n');

  for (const line of lines) {
    // s3cmd ls output format: "DATE TIME SIZE s3://path/to/file"
    const parts = line.trim().split(/\s+/);
    const filePath = parts[3];

    if (!filePath) continue;

    const filename = filePath.split('/').pop();
    if (!filename) continue;

    // Extract timestamp from filename (format: edhtop16_v2_YYYYMMDD_HHMMSS.db)
    const match = filename.match(/edhtop16_v2_(\d{8})_(\d{6})\.db/);
    if (!match) continue;

    const [, datePart, timePart] = match;

    // Parse timestamp
    const year = parseInt(datePart.substring(0, 4));
    const month = parseInt(datePart.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(datePart.substring(6, 8));
    const hour = parseInt(timePart.substring(0, 2));
    const minute = parseInt(timePart.substring(2, 4));
    const second = parseInt(timePart.substring(4, 6));

    const fileDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    const fileTimestamp = fileDate.getTime();

    if (fileTimestamp < cutoffTimestamp) {
      console.log(
        `Deleting old backup: ${filename} (${fileDate.toISOString()})`,
      );
      await execAsync(`s3cmd del "${filePath}"`);
    } else {
      console.log(
        `Keeping recent backup: ${filename} (${fileDate.toISOString()})`,
      );
    }
  }

  console.log('Cleanup complete!');
}

cleanupOldBackups().catch((error) => {
  console.error('Error during cleanup:', error);
  process.exit(1);
});
