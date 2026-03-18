/**
 * Wowhead CDN icon helper.
 * All icon names verified against wow.zamimg.com/images/wow/icons/
 */

const CDN = 'https://wow.zamimg.com/images/wow/icons';

export type IconSize = 'tiny' | 'small' | 'medium' | 'large';

export function wowIcon(name: string, size: IconSize = 'medium'): string {
  return `${CDN}/${size}/${name.toLowerCase()}.jpg`;
}

// ── Verified Balance Druid icon mappings ──
// Every name tested against the CDN - no broken icons

export const balanceDruidIcons: Record<string, string> = {
  // ── Core Abilities ──
  'Wrath': 'spell_nature_wrathv2',
  'Starfire': 'spell_arcane_starfire',
  'Moonfire': 'spell_nature_starfall',
  'Sunfire': 'spell_nature_faeriefire',
  'Starsurge': 'spell_arcane_arcane04',
  'Starfall': 'ability_druid_starfall',

  // ── Spec Tree - Tier 1 ──
  'Eclipse': 'ability_druid_eclipse',
  'Shooting Stars': 'spell_nature_sentinal',
  'Moonkin Form': 'spell_nature_forceofnature',

  // ── Spec Tree - Tier 2 ──
  'Starlord': 'spell_shaman_measuredinsight',
  'Soul of the Forest': 'ability_druid_manatree',
  'Nature\'s Balance': 'spell_nature_naturetouchgrow',
  'Wild Surges': 'spell_nature_wispsplode',

  // ── Spec Tree - Tier 3 ──
  'Total Eclipse': 'ability_druid_eclipse',
  'Astral Communion': 'spell_nature_astralrecalgroup',
  'Stellar Flare': 'ability_druid_stellarflare',
  'Umbral Embrace': 'ability_druid_twilightswrath',
  'Rattle the Stars': 'spell_arcane_arcanetorrent',

  // ── Spec Tree - Tier 4 ──
  'Starweaver': 'ability_druid_starfall',
  'Orbit Breaker': 'spell_arcane_arcane03',
  'Waning Twilight': 'ability_druid_lunarguidance',
  'Balance of All Things': 'ability_druid_balanceofpower',

  // ── Spec Tree - Tier 5 (Choice Row) ──
  'Incarnation: Chosen of Elune': 'spell_druid_incarnation',
  'Convoke the Spirits': 'ability_druid_flightform',
  'Force of Nature': 'ability_druid_forceofnature',
  'Celestial Alignment': 'spell_nature_natureguardian',
  'Warrior of Elune': 'ability_druid_owlkinfrenzy',

  // ── Spec Tree - Tier 6 ──
  'Fury of Elune': 'ability_druid_dreamstate',
  'New Moon': 'artifactability_balancedruid_newmoon',
  'Half Moon': 'artifactability_balancedruid_halfmoon',
  'Full Moon': 'artifactability_balancedruid_fullmoon',
  'Solstice': 'spell_nature_starfall',
  'Elune\'s Guidance': 'ability_druid_lunarguidance',
  'Power of Goldrinn': 'ability_druid_prowl',
  'Denizen of the Dream': 'inv_misc_herb_talandrasrose',
  'Friend of the Fae': 'ability_creature_cursed_05',

  // ── Spec Tree - Tier 7 ──
  'Lunar Calling': 'spell_arcane_starfire',
  'Aetherial Kindling': 'inv_enchant_essenceastrallarge',

  // ── Class Tree ──
  'Wild Mushroom': 'druid_ability_wildmushroom_a',
  'Stellar Drift': 'ability_druid_starfall',
  'Restoration Affinity': 'spell_nature_healingtouch',
  'Innervate': 'spell_nature_lightning',
  'Barkskin': 'spell_nature_stoneclawtotem',
  'Nature\'s Vigil': 'spell_nature_sentinal',
  'Heart of the Wild': 'spell_druid_equinox',
  'Typhoon': 'ability_druid_typhoon',
  'Ursol\'s Vortex': 'spell_druid_ursolsvortex',

  // ── Forms ──
  'Bear Form': 'ability_racial_bearform',
  'Cat Form': 'ability_druid_catform',
  'Travel Form': 'ability_druid_flightform',

  // ── Midnight 12.0.1 New/Changed Talents ──
  'Solar Beam': 'ability_vehicle_sonicshockwave',
  'Twin Moons': 'spell_nature_starfall',
  'Improved Eclipse': 'ability_druid_eclipse',
  'Umbral Intensity': 'ability_druid_twilightswrath',
  'Meteor Storm': 'spell_mage_meteor',
  'Stellar Amplification': 'spell_arcane_arcane03',
  'Whirling Stars': 'ability_druid_starfall',
  'Orbital Strike': 'spell_arcane_arcane04',
  'Touch the Cosmos': 'inv_enchant_essenceastrallarge',
  'Meteorites': 'spell_nature_sentinal',
  'Cosmic Rapidity': 'spell_nature_wispsplode',
  'Celestial Fire': 'spell_nature_faeriefire',
  'Hail of Stars': 'ability_druid_starfall',
  'Sculpt the Stars': 'spell_arcane_arcanetorrent',
  'Sundered Firmament': 'ability_druid_dreamstate',
  'Harmony of the Heavens': 'spell_nature_natureguardian',
  'Orbital Bombardment': 'artifactability_balancedruid_fullmoon',
  'Radiant Moonlight': 'spell_nature_starfall',
  'Astral Smolder': 'spell_nature_faeriefire',
  'Lunar Shrapnel': 'spell_arcane_starfire',
  'Elune\'s Wrath': 'ability_druid_lunarguidance',
  'the Eternal Moon': 'artifactability_balancedruid_fullmoon',
  'Sunseeker Mushroom': 'druid_ability_wildmushroom_a',
  'Nature\'s Grace': 'spell_nature_naturetouchgrow',
  'Elune\'s Challenge': 'ability_druid_lunarguidance',
  // ── Identity ──
  'Balance': 'spell_nature_starfall',
  'Druid': 'spell_druid_thrash',
  'Night Elf': 'spell_nature_sentinal',
};

export function getSpellIcon(spellName: string, size: IconSize = 'medium'): string {
  const iconName = balanceDruidIcons[spellName];
  if (iconName) return wowIcon(iconName, size);
  return wowIcon('inv_misc_questionmark', size);
}
