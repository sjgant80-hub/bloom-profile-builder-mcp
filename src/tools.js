// bloom-profile-builder-mcp / tools.js
// MCP tool definitions wrapping the SDK primitives.

import {
  PROBES, PROBE_COUNT, LIKERT, RINGS, probeAt, nextProbe as sdkNextProbe,
  accumulate, currentBloom, liveReadings, classifyKappaBand, foldNumber,
  bloomToStateVector, stateSum, stateSignature, KAPPA_BANDS, depthBand,
  computeProfile, classifyShape, growthEdge, radialSVG, exportProfileJSON
} from '@ai-native-solutions/bloom-profile-builder-sdk';

function sessionShape() {
  return {
    type: 'object',
    description: 'Session state: { idx, answers: [{score,text}|null]*21, textAll?: string[], startedAt?: string }',
    properties: {
      idx:     { type: 'number', description: 'Current probe index (0..20)' },
      answers: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'null' },
            {
              type: 'object',
              required: ['score'],
              properties: {
                score: { type: 'number', minimum: 0, maximum: 3 },
                text:  { type: 'string' }
              }
            }
          ]
        }
      },
      textAll:   { type: 'array', items: { type: 'string' } },
      startedAt: { type: 'string' }
    }
  };
}

export const TOOLS = [
  {
    name: 'bloom_next_probe',
    description: 'Return the next probe to show in a calibration session. Given session_state with an answers array, returns the first unanswered probe (or null if session is complete).',
    inputSchema: {
      type: 'object',
      properties: {
        session_state: sessionShape()
      }
    },
    run: ({ session_state }) => {
      const probe = sdkNextProbe(session_state || { answers: [] });
      if (!probe) return { probe: null, done: true };
      return { probe, ring: RINGS[probe.ring], total: PROBE_COUNT, done: false };
    }
  },
  {
    name: 'bloom_score_answer',
    description: 'Given raw likert score (0..3) for a probe, plus optional free text, return the incremental impact on the bloom vector (which ring gets it) and the κ band the text classifies to.',
    inputSchema: {
      type: 'object',
      required: ['score', 'ring'],
      properties: {
        score: { type: 'number', minimum: 0, maximum: 3 },
        ring:  { type: 'number', minimum: 0, maximum: 6 },
        text:  { type: 'string', description: 'Optional free-text answer' }
      }
    },
    run: ({ score, ring, text }) => {
      const ringSums = new Array(7).fill(0);
      ringSums[ring] = score;
      const bloomDelta = currentBloom([{ score }].concat(new Array(20).fill(null)));
      const band = text ? classifyKappaBand(text) : null;
      return {
        ring:    RINGS[ring],
        score,
        ring_delta: score,
        text_band:  band,
        note: `Ring ${ring} (${RINGS[ring].glyph} ${RINGS[ring].name}) gained ${score} · text classifies to κ band ${band ? band.name : 'none'}.`
      };
    }
  },
  {
    name: 'bloom_compute_profile',
    description: 'Given a full completed session state (21 answers), compute the full profile: bloom vector, F(S⃗) fold-number, dominant κ band, shape, growth-edge, signature. Returns the same object as the source app produces.',
    inputSchema: {
      type: 'object',
      required: ['session_state'],
      properties: {
        session_state: sessionShape()
      }
    },
    run: ({ session_state }) => {
      const s = session_state || { answers: [], textAll: [] };
      const profile = computeProfile(s);
      return {
        profile,
        card: {
          fold_number: profile.foldNumber,
          omega:       profile.omega,
          signature:   profile.signature,
          dominant:    profile.dominantBand,
          shape:       profile.shape,
          growth_edge: profile.growthEdge,
          bloom:       profile.bloom,
          state_sum:   profile.stateSum
        }
      };
    }
  },
  {
    name: 'bloom_export_json',
    description: 'Serialize a profile object to a JSON blob (pretty-printed, indent 2). Use to hand off to disk / clipboard / download.',
    inputSchema: {
      type: 'object',
      required: ['profile'],
      properties: {
        profile: { type: 'object', description: 'Profile object from bloom_compute_profile' },
        indent:  { type: 'number', description: 'JSON indent (default 2)' }
      }
    },
    run: ({ profile, indent }) => ({
      blob:     exportProfileJSON(profile, indent || 2),
      mimeType: 'application/json',
      filename: `${profile.id || 'bloom-profile'}.json`
    })
  },
  {
    name: 'bloom_live_readings',
    description: 'Compute live dashboard readings (bloom, F, Σ, signature, κ band) from an in-progress session state. Handy for streaming updates during calibration.',
    inputSchema: {
      type: 'object',
      required: ['session_state'],
      properties: { session_state: sessionShape() }
    },
    run: ({ session_state }) => liveReadings(session_state || { answers: [], textAll: [] })
  },
  {
    name: 'bloom_render_radial_svg',
    description: 'Render a bloom vector as inline SVG (heptagonal radial chart, same math as the source app). Returns SVG markup string.',
    inputSchema: {
      type: 'object',
      required: ['bloom'],
      properties: {
        bloom: { type: 'array', items: { type: 'number' }, minItems: 7, maxItems: 7 },
        size:  { type: 'number', description: 'SVG width/height in px (default 300)' }
      }
    },
    run: ({ bloom, size }) => ({ svg: radialSVG(bloom, size || 300), size: size || 300 })
  },
  {
    name: 'bloom_classify_kappa',
    description: 'Classify free text into a κ depth band by keyword match. Returns the band { name, glyph, ring, min, max }.',
    inputSchema: {
      type: 'object',
      required: ['text'],
      properties: { text: { type: 'string' } }
    },
    run: ({ text }) => classifyKappaBand(text || '')
  }
];
