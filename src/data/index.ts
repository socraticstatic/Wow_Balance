// Import data directly from the skill's data directory via Vite alias
import buildsJson from '@data/builds.json';
import bisGearJson from '@data/bis-gear.json';
import topPlayersJson from '@data/top-players.json';
import changelogJson from '@data/changelog.json';
import enchantsGemsJson from '@data/enchants-gems.json';
import metaJson from '@data/meta.json';
import consumablesJson from '@data/consumables.json';
import parseAnalysisJson from './parse-analysis.json';
import specComparisonJson from './spec-comparison.json';

import type { Build, BisGear, TopPlayersData, ChangelogEntry, EnchantsGems, MetaData, ConsumablesData } from '../types';

export const builds = buildsJson as Build[];
export const bisGear = bisGearJson as BisGear;
export const topPlayers = topPlayersJson as TopPlayersData;
export const changelog = changelogJson as ChangelogEntry[];
export const enchantsGems = enchantsGemsJson as EnchantsGems;
export const meta = metaJson as MetaData;
export const consumables = consumablesJson as ConsumablesData;
export const parseAnalysis = parseAnalysisJson as Record<string, any>;
export const specComparison = specComparisonJson as Record<string, any>;
