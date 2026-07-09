#!/usr/bin/env node
// bloom-profile-builder-mcp · MCP stdio server wrapping bloom-profile-builder-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'bloom-profile-builder-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'bloom-profile-builder_blank_session',
    description: 'blankSession · from bloom-profile-builder-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { blankSession } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
      return typeof blankSession === 'function' ? await blankSession(args) : { error: 'blankSession not callable' };
    }
  },
  {
    name: 'bloom-profile-builder_accumulate',
    description: 'accumulate · from bloom-profile-builder-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { accumulate } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
      return typeof accumulate === 'function' ? await accumulate(args) : { error: 'accumulate not callable' };
    }
  },
  {
    name: 'bloom-profile-builder_current_bloom_vec',
    description: 'currentBloomVec · from bloom-profile-builder-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { currentBloomVec } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
      return typeof currentBloomVec === 'function' ? await currentBloomVec(args) : { error: 'currentBloomVec not callable' };
    }
  },
  {
    name: 'bloom-profile-builder_current_text',
    description: 'currentText · from bloom-profile-builder-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { currentText } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
      return typeof currentText === 'function' ? await currentText(args) : { error: 'currentText not callable' };
    }
  },
  {
    name: 'bloom-profile-builder_show_tab',
    description: 'showTab · from bloom-profile-builder-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { showTab } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
      return typeof showTab === 'function' ? await showTab(args) : { error: 'showTab not callable' };
    }
  },
  {
    name: 'bloom-profile-builder_render_legend',
    description: 'renderLegend · from bloom-profile-builder-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderLegend } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
      return typeof renderLegend === 'function' ? await renderLegend(args) : { error: 'renderLegend not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('bloom-profile-builder-mcp v1.0.0 · stdio ready');
