import { initLogger } from "braintrust";
import { OpenAIAgentsTraceProcessor } from "@braintrust/openai-agents";
import { Agent, run, addTraceProcessor } from "@openai/agents";

const logger = initLogger({
  projectName: "Alex-Test-Project",
});

class DummyProcessor {
  onTraceStart(trace) {
    console.log("Trace started:", trace);
    return Promise.resolve();
  }
  shutdown(timeout) {
    console.log("Processor shutting down with timeout:", timeout);
    return Promise.resolve();
  }
  onTraceEnd(trace) {
    console.log("Trace ended:", trace);
    return Promise.resolve();
  }
  onSpanStart(span) {
    console.log("Span started:", span);
    return Promise.resolve();
  }
  onSpanEnd(span) {
    console.log("Span ended:", span);
    return Promise.resolve();
  }
  forceFlush() {
    console.log("Force flush called");
    return Promise.resolve();
  }
}

const dummyProcessor = new DummyProcessor();
const goodProcessor = new OpenAIAgentsTraceProcessor({ logger });

// Add the processor to OpenAI Agents
// addTraceProcessor(dummyProcessor);
addTraceProcessor(goodProcessor);

async function main() {
  const agent = new Agent({
    name: "Assistant",
    model: "gpt-5",
    instructions: "You only respond in haikus.",
  });

  const result = await run(agent, "Tell me about recursion in programming.");
  console.log(result.finalOutput);
}

main().catch(console.error);
