import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const app = express();

// ✅ Trust proxy for Replit environment (configure securely)
app.set('trust proxy', 1);

// ✅ Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: process.env.NODE_ENV === 'production' 
          ? ["'self'"] 
          : ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow dev tools in development
        styleSrc: ["'self'", "'unsafe-inline'"], // Keep for styled-components compatibility
        imgSrc: ["'self'", "data:", "blob:", "https:"], // Allow external images
        connectSrc: ["'self'", "ws:", "wss:", "https:"], // Allow WebSocket and HTTPS connections
        fontSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.ALLOWED_ORIGINS?.split(',') || true // Allow specific origins in production
      : true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting - configured for proxy environment
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many API requests, please try again later." },
});

app.use(limiter);
app.use("/api", apiLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  const pathUrl = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathUrl.startsWith("/api")) {
      // Only log method, path, status, and timing - NEVER log response bodies containing tokens
      log(`${req.method} ${pathUrl} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);

    // ✅ Catch-all fallback for React Router (prevents blue screen on refresh / deep links)
    const clientDist = path.resolve(__dirname);
    app.get("*", (req, res) => {
      const indexPath = path.join(clientDist, "index.html");
      if (existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("index.html not found");
      }
    });
  }

  const port = 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
