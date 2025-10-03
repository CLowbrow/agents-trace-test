# Agents Trace Test

WebSocket-based agent service with multi-turn conversation support.

## Setup

```bash
npm install
```

## Running

Start the server:

```bash
node index.js
```

The server will start on port 3055 (or the PORT environment variable if set).

## Testing with the Web Client

1. Make sure the server is running
2. Open `client.html` in your browser
3. Type messages and press Enter or click Send
4. Check the browser console to see responses
5. Use the Reset button to clear conversation history

## WebSocket API

Connect to `ws://localhost:3055`

Send messages:
```json
{ "prompt": "your message here" }
```

Reset conversation:
```json
{ "prompt": "reset", "reset": true }
```

Responses:
```json
{
  "output": "agent response",
  "threadId": "uuid",
  "turnCount": 1
}
```
