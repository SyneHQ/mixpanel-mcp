#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  parseCommandLineArgs,
  resolvePort,
  resolveTransport,
} from "./utils/index.js";
import express from "express";
import { registerTools } from "./tools/index.js";
import { generateBanner } from "./utils/banner.js";

async function main() {
  // Resolve transport type
  const transportData = resolveTransport();
  console.error(`Using transport: ${transportData.type}`);
  console.error(`Transport source: ${transportData.source}`);

  console.error(generateBanner());
  

  const server = new McpServer({
    name: "mixpanel",
    version: "1.0.0",
  });

  const args = parseCommandLineArgs();

  if (!args.username || !args.password || !args.projectId) {
    console.error(
      "Please provide a Mixpanel service account username and password and a project ID"
    );
    process.exit(1);
  }

  registerTools(server, [
    args.username,
    args.password,
    args.projectId,
  ]);

  if (transportData.type === "sse") {
    // Set up Express server for SSE transport
    const app = express();
    let transport: SSEServerTransport;

    app.get("/sse", async (req, res) => {
      transport = new SSEServerTransport("/message", res);
      console.error("Client connected", transport?.["_sessionId"]);
      await server.connect(transport);

      // Listen for connection close
      res.on("close", () => {
        console.error("Client Disconnected", transport?.["_sessionId"]);
      });
    });

    app.post("/message", async (req, res) => {
      console.error("Client Message", transport?.["_sessionId"]);
      await transport.handlePostMessage(req, res, req.body);
    });

    // Start the HTTP server (port is only relevant for SSE transport)
    const portData = resolvePort();
    const port = portData.port;
    console.error(`Port source: ${portData.source}`);
    app.listen(port, () => {
      console.error(
        `Mixpanel MCP server listening at http://localhost:${port}`
      );
      console.error(`Connect to MCP server at http://localhost:${port}/sse`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MIXPANEL MCP SERVER RUNNING ON STDIO");
  }
}

main().catch((error) => {
  console.error("Fatal error in main(): ", error);
  process.exit(1);
});
