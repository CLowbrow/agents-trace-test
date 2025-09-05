import { initLogger } from "braintrust";
import { OpenAIAgentsTraceProcessor } from "@braintrust/openai-agents";
import { Agent, run, addTraceProcessor } from "@openai/agents";

const logger = initLogger({
  projectName: "Alex-Test-Project",
});

const goodProcessor = new OpenAIAgentsTraceProcessor({ logger });

// Add the processor to OpenAI Agents
addTraceProcessor(goodProcessor);

async function main() {
  const agent = new Agent({
    name: "Assistant",
    model: "gpt-5",
    instructions: "You only respond with one haiku.",
  });

  const result = await run(agent, "Tell me about recursion in programming.");
  console.log(result.finalOutput);
}

main().catch(console.error);
