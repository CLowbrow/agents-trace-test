import express from "express";
import { initLogger } from "braintrust";
import { OpenAIAgentsTraceProcessor } from "@braintrust/openai-agents";
import { Agent, run, addTraceProcessor } from "@openai/agents";

const logger = initLogger({
  projectName: "OAI-Agents-Test-Project",
});

const goodProcessor = new OpenAIAgentsTraceProcessor({ logger });

// Add the processor to OpenAI Agents
addTraceProcessor(goodProcessor);

const agent = new Agent({
  name: "Assistant",
  model: "gpt-5",
  instructions: "You respond like a pirate",
});

const app = express();
app.use(express.json());

app.post("/run", async (req, res) => {
  const { prompt } = req.body ?? {};

  if (typeof prompt !== "string" || !prompt.trim()) {
    res.status(400).json({ error: "Request body must include a non-empty string prompt." });
    return;
  }

  try {
    const result = await run(agent, prompt);
    res.json({ output: result.finalOutput });
  } catch (err) {
    console.error("Agent run failed", err);
    res.status(500).json({ error: "Agent run failed." });
  }
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const port = Number.parseInt(process.env.PORT ?? "", 10) || 3055;

app.listen(port, () => {
  console.log(`Agent service listening on http://localhost:${port}`);
});
