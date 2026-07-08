// bloom-profile-builder-mcp / resources.js
// MCP resources: read-only exposures of the SDK catalogues.

import {
  PROBES, RINGS, LIKERT, KAPPA_BANDS, BAND_MARKERS
} from '@ai-native-solutions/bloom-profile-builder-sdk';

export const RESOURCES = [
  {
    uri: 'bloom-profile-builder://probes',
    name: 'Probe library',
    description: 'All 21 probe questions with their ring assignments and notes.',
    mimeType: 'application/json',
    read: () => JSON.stringify(PROBES, null, 2)
  },
  {
    uri: 'bloom-profile-builder://rings',
    name: 'The 7 rings',
    description: 'The 7 rings with glyphs, primes, names, and descriptions.',
    mimeType: 'application/json',
    read: () => JSON.stringify(RINGS, null, 2)
  },
  {
    uri: 'bloom-profile-builder://likert',
    name: 'Likert scale',
    description: 'The 4-point likert scale used to answer each probe (Not me / Rarely / Often / Constant).',
    mimeType: 'application/json',
    read: () => JSON.stringify(LIKERT, null, 2)
  },
  {
    uri: 'bloom-profile-builder://kappa-bands',
    name: 'κ depth bands',
    description: 'The 7 κ depth bands (ground → collapse) with glyphs and ring assignments.',
    mimeType: 'application/json',
    read: () => JSON.stringify(KAPPA_BANDS, null, 2)
  },
  {
    uri: 'bloom-profile-builder://band-markers',
    name: 'κ band markers',
    description: 'Keyword catalogue used by the κ classifier to map free text to a depth band.',
    mimeType: 'application/json',
    read: () => JSON.stringify(BAND_MARKERS, null, 2)
  }
];
