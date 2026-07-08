# @ai-native-solutions/bloom-profile-builder-mcp

MCP server for the **Bloom Profile Builder** — exposes the sovereign 21-probe calibration engine, F(S⃗) fold-number fingerprint, κ classifier, radial SVG renderer, and profile compute as MCP tools and resources.

Wraps [`@ai-native-solutions/bloom-profile-builder-sdk`](https://github.com/sjgant80-hub/bloom-profile-builder-sdk).

## Install

```bash
npm install -g @ai-native-solutions/bloom-profile-builder-mcp
```

Or run directly with `npx`:

```bash
npx @ai-native-solutions/bloom-profile-builder-mcp
```

## Wire it up

### Claude Code

```bash
claude mcp add bloom-profile-builder npx @ai-native-solutions/bloom-profile-builder-mcp
```

### Claude Desktop

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bloom-profile-builder": {
      "command": "npx",
      "args": ["-y", "@ai-native-solutions/bloom-profile-builder-mcp"]
    }
  }
}
```

### Cursor / Cline / Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "bloom-profile-builder": {
      "command": "npx",
      "args": ["-y", "@ai-native-solutions/bloom-profile-builder-mcp"]
    }
  }
}
```

## Tools

| Tool | Purpose |
|---|---|
| `bloom_next_probe` | Next unanswered probe from a session state (or `null` if complete) |
| `bloom_score_answer` | Impact of a single answer on the bloom vector + κ band from the text |
| `bloom_compute_profile` | Full profile compute (F, sig, band, shape, growth-edge) |
| `bloom_export_json` | Serialize a profile to a JSON blob (pretty-printed) |
| `bloom_live_readings` | Live dashboard readings for an in-progress session |
| `bloom_render_radial_svg` | Render a bloom vector as inline heptagonal radial SVG |
| `bloom_classify_kappa` | Classify free text into a κ depth band |

## Resources

| URI | Description |
|---|---|
| `bloom-profile-builder://probes` | All 21 probe questions with ring assignments |
| `bloom-profile-builder://rings` | The 7 rings with glyphs, primes, names |
| `bloom-profile-builder://likert` | The 4-point likert scale |
| `bloom-profile-builder://kappa-bands` | The 7 κ depth bands |
| `bloom-profile-builder://band-markers` | Keywords used by the κ classifier |

## Example flow

```
Assistant: (calls bloom_next_probe with session_state={ answers: [] })
           → { probe: { idx: 0, ring: 0, glyph: '●', q: '...' } }
Assistant: (asks user, records score/text, appends to answers)
           → repeat 21 times
Assistant: (calls bloom_compute_profile with the full session_state)
           → { profile: { foldNumber, signature, dominantBand, shape, growthEdge, ... } }
Assistant: (calls bloom_render_radial_svg with profile.bloom)
           → returns SVG markup for display
```

## License

MIT — © 2026 AI-Native Solutions
