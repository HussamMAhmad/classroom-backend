import aj from "../config/arcjet.js";
import { Response, Request, NextFunction } from "express";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";
import { auth } from "../lib/auth.js";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const role: RateLimitRole = (session?.user?.role ?? "guest") as RateLimitRole;

    let limit: number;
    let message: string;

    switch (role) {
      case "admin":
        limit = 200;
        message = "Admin request limit exceuded (200 per minute) . slow down";
        break;
      case "teacher":
      case "student":
        limit = 100;
        message = "User request limit exceeded (100 per minute) . please wait.";
        break;
      default:
        limit = 30;
        message =
          "Guest request limit exceeded (30 per minute). please sign up for higher limits";
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: 60,
        max: limit,
      }),
    );

    const arcjetRequest : ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
      },
    };
    const decision = await client.protect(arcjetRequest);

    if (decision.isDenied() && decision.reason.isBot()) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Automated requests are not allowed",
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Request blocked by security policy",
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      return res
        .status(429)
        .json({ error: "too many requests", message: message });
    }

    next(); 
  } catch (e) {
    console.log("Arcjet middleware error", e);
    res.status(500).json({
      error: "Internal error",
      message: "Somthing went wrong with security middleware",
    });
  }
};

export default securityMiddleware;
