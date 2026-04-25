import aj from "../config/arcjet";
import { Response, Request, NextFunction } from "express";
import { slidingWindow } from "@arcjet/node";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role: RateLimitRole = req.user?.role ?? "guest";

    let limit: number;
    let message: string;

    switch (role) {
      case "admin":
        limit = 20;
        message = "Admin request limit exceuded (20 per minute) . slow down";
        break;
      case "teacher":
      case "student":
        limit = 10;
        message = "User request limit exceeded (10 pre minute) . please wait.";
        break;
      default:
        limit = 5;
        message =
          "Guest request limit exceeded (5 per minute). please sign up for higher limits";
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: 60,
        max: limit,
      }),
    );

    const arcjetRequest = {
      header: req.headers,
      methods: req.method,
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
        .status(403)
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
