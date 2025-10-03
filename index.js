import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { initLogger } from "braintrust";
import { OpenAIAgentsTraceProcessor } from "@braintrust/openai-agents";
import { Agent, run, addTraceProcessor, user } from "@openai/agents";

const logger = initLogger({
  projectName: "OAI-Agents-Test-Project",
});

addTraceProcessor(new OpenAIAgentsTraceProcessor({ logger }));

const agent = new Agent({
  name: "Assistant",
  model: "gpt-5",
  instructions: "You respond like a pirate",
});

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const port = Number.parseInt(process.env.PORT ?? "", 10) || 3055;
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  let history = [];

  console.log("New WebSocket connection established");

  ws.on("message", async (data) => {
    try {
      const { prompt, reset } = JSON.parse(data.toString());

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        ws.send(JSON.stringify({ error: "Message must include a non-empty string prompt." }));
        return;
      }

      if (reset) {
        history = [];
        ws.send(JSON.stringify({ status: "conversation_reset" }));
        return;
      }

      history.push(user(prompt));
      const result = await run(agent, history);
      history = result.history;

      ws.send(JSON.stringify({
        output: result.finalOutput,
        turnCount: Math.floor(history.length / 2),
      }));
    } catch (err) {
      console.error("Agent run failed:", err);
      ws.send(JSON.stringify({ error: "Agent run failed: " + err.message }));
    }
  });

  ws.on("close", () => console.log("WebSocket connection closed"));
  ws.on("error", (err) => console.error("WebSocket error:", err));

  ws.send(JSON.stringify({ status: "connected" }));
});

server.listen(port, () => {
  console.log(`Agent service listening on http://localhost:${port}`);
  console.log(`WebSocket server ready at ws://localhost:${port}`);
});
