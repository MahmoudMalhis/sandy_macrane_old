// server/src/utils/logger.js - مُصحح
import { existsSync, mkdirSync, appendFile } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// إصلاح __dirname في ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logsDir = join(__dirname, "../../logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

class Logger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);

    if (process.env.NODE_ENV === "production") {
      this.writeToFile(level, logEntry);
    }
  }

  static writeToFile(level, logEntry) {
    const date = new Date().toISOString().split("T")[0];
    const filename = `${date}-${level}.log`;
    const filepath = join(logsDir, filename);

    const logLine = JSON.stringify(logEntry) + "\n";

    appendFile(filepath, logLine, (err) => {
      if (err) {
        console.error("Failed to write to log file:", err);
      }
    });
  }

  static info(message, meta = {}) {
    this.log("info", message, meta);
  }

  static warn(message, meta = {}) {
    this.log("warn", message, meta);
  }

  static error(message, meta = {}) {
    this.log("error", message, meta);
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, meta);
    }
  }
}

// Named exports
export const info = Logger.info.bind(Logger);
export const warn = Logger.warn.bind(Logger);
export const error = Logger.error.bind(Logger);
export const debug = Logger.debug.bind(Logger);
export default Logger;
