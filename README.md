# SyneHQ Mixpanel MCP

Simple MCP server that interfaces with the Mixpanel API, allowing you to talk to your Mixpanel events data from any MCP client like Cursor or Claude Desktop. Query events data, retention, and funnels. Great for on-demand look ups like: "What's the weekly retention for users in the Feb 1 cohort?"

I am adding more coverage of the Mixpanel API over time, let me know which tools you need or just open a PR.

## Installation
Make sure to go to your Mixpanel Organization Settings to set up a [Mixpanel Service Account](https://developer.mixpanel.com/reference/service-accounts), get the username, password, and your project ID (in Mixpanel Project Settings).

### Running via npx

```bash
npx -y @synehq/mixpanel-mcp --transport sse --username <USERNAME> --password <PASSWORD> --projectId <PROJECT_ID>
```

### Running via Docker

```bash
docker run -d -e MIXPANEL_USERNAME=<USERNAME> -e MIXPANEL_PASSWORD=<PASSWORD> -e MIXPANEL_PROJECT_ID=<PROJECT_ID> -p 3000:3000 ghcr.io/synehq/mixpanel-mcp:latest
```

To install mixpanel-mcp for Cursor, go to Settings -> Cursor Settings -> Features -> MCP Servers -> + Add

Select Type: command and paste the below, using the arguments `<USERNAME> <PW> <PROJECT_ID>` from Mixpanel
```
npx -y @synehq/mixpanel-mcp --username <USERNAME> --password <PASSWORD> --projectId <PROJECT_ID> --transport sse/stdio
```

### Clone and run locally
Clone this repo
Run `bun install`
Run `bun run build`
Run `bun run build/index.js --transport sse --username <USERNAME> --password <PASSWORD> --projectId <PROJECT_ID>`

## Examples
- Ask about retention numbers

<img width="500" alt="IMG_3675" src="https://github.com/user-attachments/assets/5999958e-d4f6-4824-b226-50ad416ab064" />


- Ask for an overview of events

<img width="500" alt="IMG_9968" src="https://github.com/user-attachments/assets/c05cd932-5ca8-4a5b-a31c-7da2c4f2fa77" />