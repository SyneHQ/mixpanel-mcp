// Parse command line arguments
export function parseCommandLineArgs() {
  // Check if any args start with '--' (the way tsx passes them)
  const args = process.argv.slice(2);
  const parsedManually: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [key, value] = arg.substring(2).split("=");
      if (value) {
        // Handle --key=value format
        parsedManually[key] = value;
      } else if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        // Handle --key value format
        parsedManually[key] = args[i + 1];
        i++; // Skip the next argument as it's the value
      } else {
        // Handle --key format (boolean flag)
        parsedManually[key] = "true";
      }
    }
  }

  // Just use the manually parsed args - removed parseArgs dependency for Node.js <18.3.0 compatibility
  return parsedManually;
}

/**
 * Resolve port from command line args or environment variables
 * Returns port number with 8080 as the default
 *
 * Note: The port option is only applicable when using --transport=sse
 * as it controls the HTTP server port for SSE connections.
 */
export function resolvePort(): { port: number; source: string } {
  // Get command line arguments
  const args = parseCommandLineArgs();

  // 1. Check command line arguments first (highest priority)
  if (args.port) {
    const port = parseInt(args.port, 10);
    return { port, source: "command line argument" };
  }

  // 2. Check environment variables
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    return { port, source: "environment variable" };
  }

  // 3. Default to 8080
  return { port: 8080, source: "default" };
}

/**
 * Resolve transport type from command line args or environment variables
 * Returns 'stdio' or 'sse', with 'stdio' as the default
 */
export function resolveTransport(): { type: "stdio" | "sse"; source: string } {
  // Get command line arguments
  const args = parseCommandLineArgs();

  // 1. Check command line arguments first (highest priority)
  if (args.transport) {
    const type = args.transport === "sse" ? "sse" : "stdio";
    return { type, source: "command line argument" };
  }

  // 2. Check environment variables
  if (process.env.TRANSPORT) {
    const type = process.env.TRANSPORT === "sse" ? "sse" : "stdio";
    return { type, source: "environment variable" };
  }

  // 3. Default to stdio
  return { type: "stdio", source: "default" };
}
