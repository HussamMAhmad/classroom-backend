import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
  key : ARCJET_KEY!,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:PREVIEW",
        //"CATEGORY:MONITOR",
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
     slidingWindow({
      mode: "LIVE",
      interval: "2s", 
      max: 5, 
    }),
  ],
});

export default aj; 