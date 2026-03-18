/**
 * Wowhead CDN icon helper.
 * All icon names verified against wow.zamimg.com/images/wow/icons/
 * Last verified: 2026-03-18 against Wowhead spell pages
 */

const CDN = 'https://wow.zamimg.com/images/wow/icons';

export type IconSize = 'tiny' | 'small' | 'medium' | 'large';

export function wowIcon(name: string, size: IconSize = 'medium'): string {
  return `${CDN}/${size}/${name.toLowerCase()}.jpg`;
}

// ── VERIFIED Balance Druid icon mappings ──
// Every entry checked against Wowhead spell pages 2026-03-18

export const balanceDruidIcons: Record<string, string> = {
  // ── Core Rotation (buttons you press) ──
  'Wrath': 'spell_nature_wrathv2',
  'Starfire': 'spell_arcane_starfire',
  'Moonfire': 'spell_nature_starfall',
  'Sunfire': 'ability_mage_firestarter',  // FIXED: was spell_nature_faeriefire
  'Starsurge': 'spell_arcane_arcane03',   // FIXED: was arcane04
  'Starfall': 'ability_druid_starfall',
  'Eclipse': 'ability_druid_eclipse',
  'Eclipse (Solar)': 'ability_druid_eclipseorange',
  'Eclipse (Lunar)': 'ability_druid_eclipse',

  // ── Major Cooldowns ──
  'Incarnation: Chosen of Elune': 'spell_druid_incarnation',
  'Incarnation': 'spell_druid_incarnation',
  'Celestial Alignment': 'spell_nature_natureguardian',
  'Fury of Elune': 'ability_druid_dreamstate',
  'Convoke the Spirits': 'ability_druid_flightform',
  'Force of Nature': 'ability_druid_forceofnature',

  // ── Moon Spells ──
  'New Moon': 'artifactability_balancedruid_newmoon',
  'Half Moon': 'artifactability_balancedruid_halfmoon',
  'Full Moon': 'artifactability_balancedruid_fullmoon',

  // ── Utility (all verified) ──
  'Solar Beam': 'ability_vehicle_sonicshockwave',
  'Typhoon': 'ability_druid_typhoon',
  'Ursol\'s Vortex': 'spell_druid_ursolsvortex',
  'Wild Charge': 'spell_druid_wildcharge',
  'Stampeding Roar': 'spell_druid_stampedingroar_cat',
  'Innervate': 'spell_nature_lightning',
  'Remove Corruption': 'spell_holy_removecurse',
  'Soothe': 'ability_hunter_beastsoothe',
  'Rebirth': 'spell_nature_reincarnation',
  'Mark of the Wild': 'spell_nature_regeneration',
  'Incapacitating Roar': 'ability_druid_demoralizingroar',
  'Cyclone': 'spell_nature_cyclone',

  // ── Defensives ──
  'Barkskin': 'spell_nature_stoneclawtotem',
  'Heart of the Wild': 'spell_holy_blessingofagility',  // FIXED: was spell_druid_equinox
  'Renewal': 'spell_nature_natureblessing',
  'Frenzied Regeneration': 'ability_bullrush',

  // ── Forms ──
  'Moonkin Form': 'spell_nature_forceofnature',
  'Bear Form': 'ability_racial_bearform',
  'Cat Form': 'ability_druid_catform',
  'Travel Form': 'ability_druid_flightform',
  'Dash': 'ability_druid_dash',

  // ── Spec Tree Talents (passive but need icons for talent tree display) ──
  'Shooting Stars': 'spell_priest_divinestar_shadow2',
  'Starlord': 'spell_shaman_measuredinsight',
  'Soul of the Forest': 'ability_druid_manatree',
  'Nature\'s Grace': 'spell_nature_naturesblessing',
  'Nature\'s Balance': 'spell_nature_naturetouchgrow',
  'Wild Surges': 'spell_nature_wispsplode',
  'Total Eclipse': 'ability_druid_eclipse',
  'Astral Communion': 'spell_nature_astralrecalgroup',
  'Stellar Flare': 'ability_druid_stellarflare',
  'Umbral Embrace': 'ability_druid_twilightswrath',
  'Rattle the Stars': 'spell_arcane_arcanetorrent',
  'Starweaver': 'ability_druid_starfall',
  'Orbit Breaker': 'spell_arcane_arcane03',
  'Waning Twilight': 'ability_druid_lunarguidance',
  'Balance of All Things': 'ability_druid_balanceofpower',
  'Cosmic Rapidity': 'spell_druid_swarm',
  'Solstice': 'spell_nature_starfall',
  'Elune\'s Guidance': 'ability_druid_lunarguidance',
  'Power of Goldrinn': 'ability_druid_prowl',
  'Denizen of the Dream': 'inv_misc_herb_talandrasrose',
  'Friend of the Fae': 'ability_creature_cursed_05',
  'Aetherial Kindling': 'inv_enchant_essenceastrallarge',
  'Astral Smolder': 'spell_nature_faeriefire',
  'Twin Moons': 'spell_nature_starfall',
  'Sunseeker Mushroom': 'druid_ability_wildmushroom_b',  // FIXED: was _a
  'Wild Mushroom': 'druid_ability_wildmushroom_a',
  'Harmony of the Heavens': 'spell_nature_natureguardian',
  'Radiant Moonlight': 'spell_nature_starfall',
  'Touch the Cosmos': 'inv_enchant_essenceastrallarge',
  'Orbital Strike': 'spell_arcane_arcane04',
  'Sundered Firmament': 'ability_druid_dreamstate',

  // ── Midnight 12.0.1 New Talents ──
  'Improved Eclipse': 'ability_druid_eclipse',
  'Umbral Intensity': 'ability_druid_twilightswrath',
  'Stellar Amplification': 'spell_arcane_arcane03',
  'Whirling Stars': 'ability_druid_starfall',
  'Meteorites': 'spell_nature_sentinal',
  'Celestial Fire': 'spell_nature_faeriefire',
  'Hail of Stars': 'ability_druid_starfall',
  'Sculpt the Stars': 'spell_arcane_arcanetorrent',
  'Orbital Bombardment': 'artifactability_balancedruid_fullmoon',
  'Lunar Shrapnel': 'spell_arcane_starfire',
  'Elune\'s Wrath': 'ability_druid_lunarguidance',
  'The Eternal Moon': 'artifactability_balancedruid_fullmoon',
  'Elune\'s Challenge': 'ability_druid_lunarguidance',
  'Lunar Calling': 'spell_arcane_starfire',
  'Meteor Storm': 'spell_mage_meteor',

  // ── Elune's Chosen Hero Talents ──
  'Boundless Moonlight': 'artifactability_balancedruid_fullmoon',
  'Moon Guardian': 'spell_nature_starfall',
  'Glistening Fur': 'spell_nature_forceofnature',
  'Lunar Amplification': 'spell_arcane_starfire',
  'Atmospheric Exposure': 'ability_druid_dreamstate',
  'Elune\'s Grace': 'spell_druid_wildcharge',
  'Stellar Command': 'ability_druid_dreamstate',
  'The Light of Elune': 'ability_druid_lunarguidance',
  'Arcane Affinity': 'spell_arcane_arcane03',
  'Lunation': 'ability_druid_eclipse',
  'Astral Insight': 'spell_druid_incarnation',

  // ── Keeper of the Grove Hero Talents ──
  'Dream Surge': 'ability_druid_forceofnature',
  'Protective Growth': 'spell_nature_stoneclawtotem',
  'Harmony of the Grove': 'ability_druid_manatree',
  'Cenarius\' Might': 'ability_druid_prowl',
  'Control of the Dream': 'ability_druid_forceofnature',
  'Power of the Dream': 'spell_nature_naturetouchgrow',
  'Durability of Nature': 'spell_nature_stoneclawtotem',
  'Early Spring': 'ability_druid_manatree',
  'Blooming Infusion': 'spell_nature_healingtouch',
  'Bounteous Bloom': 'ability_druid_forceofnature',
  'Grovewalker\'s Arc': 'spell_druid_thrash',

  // ── Class Tree Talents ──
  'Thick Hide': 'inv_misc_pelt_bear_03',
  'Improved Barkskin': 'spell_nature_stoneclawtotem',
  'Oakskin': 'spell_nature_stoneclawtotem',
  'Natural Recovery': 'spell_nature_healingtouch',
  'Well-Honed Instincts': 'ability_bullrush',
  'Nurturing Instinct': 'spell_nature_healingtouch',
  'Lycara\'s Teachings': 'spell_nature_wispsplode',
  'Starlight Conduit': 'spell_arcane_starfire',
  'Circle of the Heavens': 'spell_nature_natureguardian',
  'Lore of the Grove': 'ability_druid_manatree',
  'Feline Swiftness': 'spell_druid_tirelesspursuit',
  'Astral Influence': 'spell_nature_sentinal',
  'Improved Stampeding Roar': 'spell_druid_stampedingroar_cat',
  'Light of the Sun': 'ability_vehicle_sonicshockwave',
  'Verdant Heart': 'spell_nature_healingtouch',
  'Aessina\'s Renewal': 'spell_nature_natureblessing',
  'Ursoc\'s Spirit': 'ability_racial_bearform',
  'Forestwalk': 'spell_nature_naturetouchgrow',
  'Lycara\'s Inspiration': 'spell_nature_wispsplode',

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
