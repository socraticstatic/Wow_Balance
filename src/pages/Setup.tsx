import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';

interface FormData {
  characterName: string;
  realm: string;
  region: string;
  primaryContent: string;
  heroTalent: string;
  playstyle: string;
  priorities: string[];
  faithOrigin: string;
  faithStruggle: string;
  faithVirtue: string;
  faithCalling: string;
  blizzardClientId: string;
  blizzardClientSecret: string;
  wclClientId: string;
  wclClientSecret: string;
  wclV1Key: string;
  wclCharacterId: string;
  githubUsername: string;
  repoName: string;
}

const defaultForm: FormData = {
  characterName: '',
  realm: '',
  region: 'us',
  primaryContent: '',
  heroTalent: '',
  playstyle: '',
  priorities: [],
  faithOrigin: '',
  faithStruggle: '',
  faithVirtue: '',
  faithCalling: '',
  blizzardClientId: '',
  blizzardClientSecret: '',
  wclClientId: '',
  wclClientSecret: '',
  wclV1Key: '',
  wclCharacterId: '',
  githubUsername: '',
  repoName: 'my-druid-dossier',
};

export default function Setup() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [step, setStep] = useState(0);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const steps = [
    { title: 'Character', icon: '1' },
    { title: 'Playstyle', icon: '2' },
    { title: 'Faith Story', icon: '3' },
    { title: 'Blizzard', icon: '4' },
    { title: 'WCL', icon: '5' },
    { title: 'Deploy', icon: '6' },
  ];

  const togglePriority = (p: string) => {
    setForm(prev => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter(x => x !== p)
        : [...prev.priorities, p],
    }));
  };

  return (
    <section className="px-6 sm:px-10 py-28 max-w-3xl mx-auto">
      <SectionHeading
        title="Create Your Dossier"
        sub="Build a personalized Balance Druid Dossier for your character. Takes about 10 minutes."
        accent="solar"
      />

      {/* Step indicators */}
      <div className="flex gap-2 mb-12">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
            style={{
              color: step === i ? 'oklch(90% 0.01 60)' : 'oklch(45% 0.012 50)',
              background: step === i ? 'oklch(14% 0.015 45)' : 'transparent',
              border: `1px solid ${step === i ? 'oklch(22% 0.02 45)' : 'oklch(14% 0.01 45)'}`,
            }}
          >
            <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{
                color: step >= i ? 'oklch(78% 0.16 60)' : 'oklch(38% 0.012 50)',
                background: step >= i ? 'oklch(78% 0.16 60 / 0.1)' : 'oklch(14% 0.01 45)',
              }}>
              {s.icon}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step 0: Character Info */}
      {step === 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
            Who is your character?
          </h3>

          <Field label="Character Name" value={form.characterName} onChange={set('characterName')} placeholder="Spiracle" />
          <Field label="Realm" value={form.realm} onChange={set('realm')} placeholder="zuljin" help="Lowercase, hyphenated. e.g. area-52, zuljin, stormrage" />

          <div>
            <label className="block text-[10px] uppercase font-bold mb-2" style={{ color: 'oklch(50% 0.012 50)', letterSpacing: '0.1em' }}>Region</label>
            <select
              value={form.region}
              onChange={set('region')}
              className="w-full px-4 py-2.5 rounded-lg text-sm"
              style={{ background: 'oklch(11% 0.012 45)', border: '1px solid oklch(18% 0.012 45)', color: 'oklch(85% 0.01 60)', outline: 'none' }}
            >
              <option value="us">US</option>
              <option value="eu">EU</option>
              <option value="kr">KR</option>
              <option value="tw">TW</option>
            </select>
          </div>

          <Field label="WarcraftLogs Character ID (optional)" value={form.wclCharacterId} onChange={set('wclCharacterId')}
            placeholder="71437454" help="Find this in your WarcraftLogs profile URL: warcraftlogs.com/character/id/XXXXXXXX" />

          <NavButtons onNext={() => setStep(1)} />
        </div>
      )}

      {/* Step 1: Playstyle Questionnaire */}
      {step === 1 && (
        <div className="space-y-8">
          <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
            How do you play?
          </h3>

          <p className="text-[13px]" style={{ color: 'oklch(52% 0.012 50)', lineHeight: 1.7 }}>
            This shapes your optimization page - gear, enchants, talents, and rotation will be tailored to your focus.
          </p>

          {/* Primary content */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(50% 0.012 50)', letterSpacing: '0.1em' }}>
              What content do you focus on?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mythic-plus', label: 'Mythic+', desc: 'Dungeons, keystones, AoE' },
                { id: 'raid', label: 'Raiding', desc: 'Boss fights, single target + cleave' },
                { id: 'pvp', label: 'PvP', desc: 'Arena, battlegrounds, burst' },
                { id: 'all-rounder', label: 'All-Rounder', desc: 'A bit of everything' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, primaryContent: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.primaryContent === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.primaryContent === opt.id ? 'oklch(78% 0.16 60 / 0.4)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-sm font-bold block mb-0.5" style={{
                    color: form.primaryContent === opt.id ? 'oklch(78% 0.16 60)' : 'oklch(78% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(45% 0.012 50)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero talent preference */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(50% 0.012 50)', letterSpacing: '0.1em' }}>
              Preferred Hero Talent Tree
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'keeper', label: 'Keeper of the Grove', desc: 'Burst windows, Force of Nature, short CD planning', color: 'oklch(78% 0.16 60)' },
                { id: 'elune', label: "Elune's Chosen", desc: 'Sustained throughput, Starfire spam, Fury of Elune', color: 'oklch(68% 0.16 285)' },
                { id: 'flexible', label: 'Flexible', desc: 'Show me both, I swap', color: 'oklch(58% 0.14 155)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, heroTalent: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.heroTalent === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.heroTalent === opt.id ? `${opt.color}60` : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-[13px] font-bold block mb-0.5" style={{
                    color: form.heroTalent === opt.id ? opt.color : 'oklch(72% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[10px]" style={{ color: 'oklch(42% 0.012 50)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AoE vs ST preference */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(50% 0.012 50)', letterSpacing: '0.1em' }}>
              Damage Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'aoe', label: 'AoE / Cleave', desc: 'Starfall, Starfire, big pulls' },
                { id: 'st', label: 'Single Target', desc: 'Starsurge, boss damage, parsing' },
                { id: 'hybrid', label: 'Hybrid', desc: 'Adaptive to the situation' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, playstyle: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.playstyle === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.playstyle === opt.id ? 'oklch(68% 0.16 285 / 0.4)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-sm font-bold block mb-0.5" style={{
                    color: form.playstyle === opt.id ? 'oklch(68% 0.16 285)' : 'oklch(72% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(42% 0.012 50)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* What matters most */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(50% 0.012 50)', letterSpacing: '0.1em' }}>
              What matters most to you? (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Best DPS output',
                'Survivability',
                'Rotation simplicity',
                'Parsing high',
                'Utility for the group',
                'M+ score pushing',
                'PvP rating',
                'Transmog / fashion',
              ].map(p => (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className="px-3.5 py-2 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                  style={{
                    color: form.priorities.includes(p) ? 'oklch(90% 0.01 60)' : 'oklch(52% 0.012 50)',
                    background: form.priorities.includes(p) ? 'oklch(78% 0.16 60 / 0.12)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.priorities.includes(p) ? 'oklch(78% 0.16 60 / 0.3)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Summary of their profile */}
          {(form.primaryContent || form.heroTalent || form.playstyle) && (
            <div className="p-5 rounded-lg" style={{ background: 'oklch(10% 0.015 45)', border: '1px solid oklch(16% 0.015 45)' }}>
              <div className="text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.1em' }}>
                Your Optimization Profile
              </div>
              <p className="text-[13px]" style={{ color: 'oklch(62% 0.012 50)', lineHeight: 1.7 }}>
                {form.primaryContent === 'mythic-plus' && 'Your dossier will prioritize M+ builds, AoE rotation, dungeon tips, and Haste-focused gearing.'}
                {form.primaryContent === 'raid' && 'Your dossier will prioritize raid builds, boss-specific tips, ST rotation, and Mastery-focused gearing.'}
                {form.primaryContent === 'pvp' && 'Your dossier will prioritize PvP builds, arena strategy, burst windows, and Versatility-focused gearing.'}
                {form.primaryContent === 'all-rounder' && 'Your dossier will show all builds with balanced recommendations across content types.'}
                {form.heroTalent === 'keeper' && ' Keeper of the Grove builds featured prominently.'}
                {form.heroTalent === 'elune' && " Elune's Chosen builds featured prominently."}
                {form.heroTalent === 'flexible' && ' Both hero talent trees shown with comparison.'}
                {form.playstyle === 'aoe' && ' AoE optimization page will be your main reference.'}
                {form.playstyle === 'st' && ' Single target optimization page will be your main reference.'}
                {form.playstyle === 'hybrid' && ' Both AoE and ST optimization pages included.'}
              </p>
            </div>
          )}

          <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </div>
      )}

      {/* Step 2: Faith Story Creator */}
      {step === 2 && (
        <div className="space-y-8">
          <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
            Your Character's Faith Story
          </h3>

          <p className="text-[13px]" style={{ color: 'oklch(52% 0.012 50)', lineHeight: 1.7 }}>
            Every character carries the soul of their player. This section creates a personal "Light Within" meditation
            that maps your faith journey onto your character's story in Azeroth. Optional but meaningful.
          </p>

          {/* Origin */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.1em' }}>
              Where did your faith begin?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cradle', label: 'Cradle Faith', desc: 'Raised in the church. Faith was the water you swam in before you knew it was water.' },
                { id: 'prodigal', label: 'The Prodigal Road', desc: 'Left, wandered, burned bridges. Came back changed. The return was harder than the leaving.' },
                { id: 'seeker', label: 'The Seeker', desc: 'Found faith later. You went looking for something and it found you first.' },
                { id: 'wrestling', label: 'Still Wrestling', desc: 'Not sure. Drawn to something. The questions are honest and the doubt is not the enemy.' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, faithOrigin: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.faithOrigin === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.faithOrigin === opt.id ? 'oklch(78% 0.16 60 / 0.4)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-[13px] font-bold block mb-1" style={{
                    color: form.faithOrigin === opt.id ? 'oklch(78% 0.16 60)' : 'oklch(72% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(45% 0.012 50)', lineHeight: 1.5 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Struggle */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(68% 0.16 285)', letterSpacing: '0.1em' }}>
              What's the tension you carry?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'doubt', label: 'Doubt vs. Devotion', desc: 'The mind questions what the heart knows. You live in the gap between evidence and faith.' },
                { id: 'mask', label: 'The Mask', desc: 'The public face and the private self don\'t match. Authenticity is the unfinished work.' },
                { id: 'control', label: 'Surrender vs. Control', desc: 'You know you should let go. You can\'t stop holding on. Every boss fight is this.' },
                { id: 'anger', label: 'Righteous Anger', desc: 'The world is broken and you feel it in your teeth. Justice and mercy fight inside you.' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, faithStruggle: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.faithStruggle === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.faithStruggle === opt.id ? 'oklch(68% 0.16 285 / 0.4)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-[13px] font-bold block mb-1" style={{
                    color: form.faithStruggle === opt.id ? 'oklch(68% 0.16 285)' : 'oklch(72% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(45% 0.012 50)', lineHeight: 1.5 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Virtue */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(52% 0.14 155)', letterSpacing: '0.1em' }}>
              What virtue defines your play?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'patience', label: 'Patience', desc: 'You build before you burst. The rotation is a discipline. You trust the process.' },
                { id: 'sacrifice', label: 'Sacrifice', desc: 'You Innervate the healer. You Stampeding Roar for the group. Your DPS is not the point.' },
                { id: 'stewardship', label: 'Stewardship', desc: 'Every cooldown used wisely. No wasted GCD. The talent tree is a garden you tend.' },
                { id: 'hope', label: 'Hope', desc: 'You wipe and go again. The boss will die. The key will time. Tomorrow\'s parse will be better.' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, faithVirtue: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.faithVirtue === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.faithVirtue === opt.id ? 'oklch(52% 0.14 155 / 0.4)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-[13px] font-bold block mb-1" style={{
                    color: form.faithVirtue === opt.id ? 'oklch(52% 0.14 155)' : 'oklch(72% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(45% 0.012 50)', lineHeight: 1.5 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calling */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.1em' }}>
              What does your character serve?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'protector', label: 'The Protector', desc: 'You stand between the darkness and the people you love. Barkskin is a prayer.' },
                { id: 'witness', label: 'The Witness', desc: 'You see the beauty in the made-up world and recognize something real underneath it.' },
                { id: 'healer', label: 'The Mender', desc: 'Even as Balance, you off-heal. You notice who\'s hurting. The moonkin has a pastoral heart.' },
                { id: 'pilgrim', label: 'The Pilgrim', desc: 'Every zone is a new chapter. Every expansion is a book in the canon. You walk and you learn.' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setForm(prev => ({ ...prev, faithCalling: opt.id }))}
                  className="text-left p-4 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: form.faithCalling === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
                    border: `1px solid ${form.faithCalling === opt.id ? 'oklch(78% 0.16 60 / 0.4)' : 'oklch(16% 0.012 45)'}`,
                  }}
                >
                  <span className="text-[13px] font-bold block mb-1" style={{
                    color: form.faithCalling === opt.id ? 'oklch(78% 0.16 60)' : 'oklch(72% 0.01 50)',
                  }}>{opt.label}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(45% 0.012 50)', lineHeight: 1.5 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generated story preview */}
          {(form.faithOrigin || form.faithStruggle || form.faithVirtue || form.faithCalling) && (
            <div className="p-6 rounded-lg" style={{ background: 'oklch(10% 0.015 45)', border: '1px solid oklch(16% 0.015 45)' }}>
              <div className="text-[10px] uppercase font-bold mb-4" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.1em' }}>
                Your Story Preview
              </div>
              <p style={{
                fontFamily: '"Cormorant", Georgia, serif',
                fontStyle: 'italic',
                fontSize: '1rem',
                color: 'oklch(65% 0.015 55)',
                lineHeight: 1.85,
              }}>
                {form.characterName || 'Your character'} {form.faithOrigin === 'cradle' ? 'was born under the light of Elune, raised in a grove where worship was as natural as breathing. The old prayers came before language.'
                  : form.faithOrigin === 'prodigal' ? 'walked away from the grove once. The Emerald Dream held no comfort, and the moon looked like a dead eye. But the road out led back, and the return was the real journey.'
                  : form.faithOrigin === 'seeker' ? 'did not grow up in the moonlight. The call came later, unexpected, in a dungeon or a battlefield or a quiet moment between pulls. Something whispered, and the druid listened.'
                  : 'carries questions like others carry totems. The light of Elune is visible but not yet understood. The doubt is not weakness. It is the gravity that keeps faith from floating away.'}
                {' '}
                {form.faithStruggle === 'doubt' ? 'The tension between what the mind demands and what the heart already knows is the real Eclipse cycle, longer and less predictable than any in-game mechanic.'
                  : form.faithStruggle === 'mask' ? 'In Moonkin Form, the true self is hidden inside feathers and starfire. The real transformation is not the shapeshift but the decision to stop performing.'
                  : form.faithStruggle === 'control' ? 'Every Eclipse is a small surrender. You cannot force Solar. You cannot rush Lunar. The balance comes from letting go of the outcome and trusting the rhythm.'
                  : form.faithStruggle === 'anger' ? 'Solar Beam is not just an interrupt. It is the righteous refusal to let the darkness cast freely. The anger is not sin. Misdirected anger is. Channel it.'
                  : ''}
                {' '}
                {form.faithVirtue === 'patience' ? 'Astral Power builds one cast at a time. No shortcuts. The virtue is in the casting, not the critting.'
                  : form.faithVirtue === 'sacrifice' ? 'Stampeding Roar saves lives that will never know they were saved. The best ministry is invisible.'
                  : form.faithVirtue === 'stewardship' ? 'Every talent point placed with intention. Every cooldown a resource to be honored. The tree is a garden, and the druid is its keeper.'
                  : form.faithVirtue === 'hope' ? 'The wipe is not the end. The depleted key is not the verdict. Tomorrow, the rotation will be cleaner. Hope is a 3-minute cooldown that never stops recharging.'
                  : ''}
                {' '}
                {form.faithCalling === 'protector' ? 'Barkskin is the prayer of a body willing to absorb what others cannot. The druid stands in fire so the healer can breathe.'
                  : form.faithCalling === 'witness' ? 'The made-up moon over a made-up world still stirs something real. To notice beauty in the imagined is to practice noticing it in the actual.'
                  : form.faithCalling === 'healer' ? 'Even specced for damage, the druid notices who is hurting. An off-heal at the right moment is worth more than a parse. The moonkin has a pastor\'s instinct.'
                  : form.faithCalling === 'pilgrim' ? 'Quel\'Thalas is new ground, but the walking is ancient. Every zone is a chapter. Every expansion is a book. The pilgrimage has no final destination this side of the veil.'
                  : ''}
              </p>
            </div>
          )}

          <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} />
        </div>
      )}

      {/* Step 3: Blizzard API */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
            Blizzard API Credentials
          </h3>

          <InfoBox>
            <p className="text-sm mb-3" style={{ color: 'oklch(62% 0.012 50)', lineHeight: 1.7 }}>
              <strong style={{ color: 'oklch(78% 0.16 60)' }}>How to get these:</strong>
            </p>
            <ol className="space-y-2 text-[13px]" style={{ color: 'oklch(58% 0.012 50)', lineHeight: 1.6 }}>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>1.</span> Go to <a href="https://develop.battle.net" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'oklch(68% 0.16 285)' }}>develop.battle.net</a></li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>2.</span> Log in with your Battle.net account</li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>3.</span> Click "API Access" in the top nav</li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>4.</span> Create a new client. Set redirect URI to <code style={{ color: 'oklch(68% 0.16 285)', background: 'oklch(12% 0.012 45)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>http://localhost</code></li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>5.</span> Copy the Client ID and Client Secret below</li>
            </ol>
          </InfoBox>

          <Field label="Blizzard Client ID" value={form.blizzardClientId} onChange={set('blizzardClientId')} placeholder="0b9acdab664f4ebabdc537af3d884e24" />
          <Field label="Blizzard Client Secret" value={form.blizzardClientSecret} onChange={set('blizzardClientSecret')} placeholder="OKPUQL9zqwp6cXdwPDOWAAqS8N2kKE3k" type="password" />

          <NavButtons onBack={() => setStep(2)} onNext={() => setStep(4)} />
        </div>
      )}

      {/* Step 4: WarcraftLogs API */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
            WarcraftLogs API Credentials
          </h3>

          <InfoBox>
            <p className="text-sm mb-3" style={{ color: 'oklch(62% 0.012 50)', lineHeight: 1.7 }}>
              <strong style={{ color: 'oklch(78% 0.16 60)' }}>How to get these:</strong>
            </p>
            <ol className="space-y-2 text-[13px]" style={{ color: 'oklch(58% 0.012 50)', lineHeight: 1.6 }}>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>1.</span> Go to <a href="https://www.warcraftlogs.com/api/clients/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'oklch(68% 0.16 285)' }}>warcraftlogs.com/api/clients</a></li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>2.</span> Click "Create Client"</li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>3.</span> Name it anything, set redirect URI to <code style={{ color: 'oklch(68% 0.16 285)', background: 'oklch(12% 0.012 45)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>http://localhost</code></li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>4.</span> Copy the Client ID and Client Secret below</li>
              <li className="flex gap-2"><span style={{ color: 'oklch(78% 0.16 60)' }}>5.</span> Also copy your v1 API key from the same page (optional)</li>
            </ol>
          </InfoBox>

          <Field label="WarcraftLogs Client ID" value={form.wclClientId} onChange={set('wclClientId')} placeholder="a1530410-5de3-40c2-afd8-777b9a52d533" />
          <Field label="WarcraftLogs Client Secret" value={form.wclClientSecret} onChange={set('wclClientSecret')} placeholder="0qc14wJRiLEoqZDHuKt4..." type="password" />
          <Field label="WarcraftLogs v1 API Key (optional)" value={form.wclV1Key} onChange={set('wclV1Key')} placeholder="431ed1018fe97bb2..." type="password" />

          <NavButtons onBack={() => setStep(3)} onNext={() => setStep(5)} />
        </div>
      )}

      {/* Step 5: Deploy */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
            Deploy Your Dossier
          </h3>

          <Field label="GitHub Username" value={form.githubUsername} onChange={set('githubUsername')} placeholder="your-username" />
          <Field label="Repository Name" value={form.repoName} onChange={set('repoName')} placeholder="my-druid-dossier" />

          <InfoBox>
            <p className="text-sm mb-4" style={{ color: 'oklch(62% 0.012 50)', lineHeight: 1.7 }}>
              <strong style={{ color: 'oklch(78% 0.16 60)' }}>Run these commands in your terminal:</strong>
            </p>

            <CodeBlock label="1. Clone the template" code={`git clone https://github.com/socraticstatic/Wow_Balance.git ${form.repoName || 'my-druid-dossier'}\ncd ${form.repoName || 'my-druid-dossier'}`} />

            <CodeBlock label="2. Install dependencies" code="npm install --legacy-peer-deps" />

            <CodeBlock label="3. Create your .env file" code={`cat > scripts/.env << 'EOF'
BLIZZARD_CLIENT_ID=${form.blizzardClientId || 'YOUR_BLIZZARD_CLIENT_ID'}
BLIZZARD_CLIENT_SECRET=${form.blizzardClientSecret || 'YOUR_BLIZZARD_CLIENT_SECRET'}
WARCRAFTLOGS_CLIENT_ID=${form.wclClientId || 'YOUR_WCL_CLIENT_ID'}
WARCRAFTLOGS_CLIENT_SECRET=${form.wclClientSecret || 'YOUR_WCL_CLIENT_SECRET'}
WARCRAFTLOGS_V1_KEY=${form.wclV1Key || 'YOUR_WCL_V1_KEY'}
EOF`} />

            <CodeBlock label="4. Fetch your character data" code={`cd scripts && npm install && npx tsx fetch-character.ts ${form.characterName || 'YourCharacter'} ${form.realm || 'your-realm'} ${form.region || 'us'}\ncd ..`} />

            <CodeBlock label="5. Update the app for your character" code={`# Edit src/pages/MyCharacter.tsx - change "Spiracle" to "${form.characterName || 'YourCharacter'}"\n# Edit src/pages/Hero.tsx - update any hardcoded references\n# Edit vite.config.ts - change base to '/${form.repoName || 'my-druid-dossier'}/'`} />

            <CodeBlock label="6. Create your GitHub repo and push" code={`gh repo create ${form.githubUsername || 'your-username'}/${form.repoName || 'my-druid-dossier'} --public\ngit remote set-url origin https://github.com/${form.githubUsername || 'your-username'}/${form.repoName || 'my-druid-dossier'}.git\ngit add -A && git commit -m "My ${form.characterName || 'Character'} Dossier"\ngit push -u origin main`} />

            <CodeBlock label="7. Enable GitHub Pages" code={`gh api repos/${form.githubUsername || 'your-username'}/${form.repoName || 'my-druid-dossier'}/pages -X POST -f build_type=workflow`} />

            <p className="text-sm mt-4" style={{ color: 'oklch(52% 0.012 50)' }}>
              Your dossier will be live at: <strong style={{ color: 'oklch(78% 0.16 60)' }}>
                https://{form.githubUsername || 'your-username'}.github.io/{form.repoName || 'my-druid-dossier'}/
              </strong>
            </p>
          </InfoBox>

          <NavButtons onBack={() => setStep(4)} />
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onChange, placeholder, help, type = 'text' }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; help?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold mb-2" style={{ color: 'oklch(50% 0.012 50)', letterSpacing: '0.1em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg text-sm"
        style={{
          background: 'oklch(11% 0.012 45)',
          border: '1px solid oklch(18% 0.012 45)',
          color: 'oklch(88% 0.01 60)',
          outline: 'none',
        }}
      />
      {help && <p className="text-[11px] mt-1.5" style={{ color: 'oklch(42% 0.012 50)' }}>{help}</p>}
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-lg" style={{ background: 'oklch(10% 0.015 45)', border: '1px solid oklch(16% 0.015 45)' }}>
      {children}
    </div>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold" style={{ color: 'oklch(58% 0.012 50)' }}>{label}</span>
        <button onClick={copy} className="text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer"
          style={{ color: copied ? 'oklch(68% 0.18 155)' : 'oklch(50% 0.012 50)', background: 'oklch(14% 0.012 45)' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 rounded text-[12px] overflow-x-auto" style={{
        fontFamily: '"JetBrains Mono", monospace',
        background: 'oklch(8% 0.008 45)',
        border: '1px solid oklch(14% 0.01 45)',
        color: 'oklch(68% 0.015 55)',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}>
        {code}
      </pre>
    </div>
  );
}

function NavButtons({ onBack, onNext }: { onBack?: () => void; onNext?: () => void }) {
  return (
    <div className="flex gap-3 pt-4">
      {onBack && (
        <button onClick={onBack} className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
          style={{ color: 'oklch(58% 0.012 50)', background: 'oklch(12% 0.012 45)', border: '1px solid oklch(18% 0.012 45)' }}>
          Back
        </button>
      )}
      {onNext && (
        <button onClick={onNext} className="px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer"
          style={{ color: 'oklch(12% 0.01 45)', background: 'oklch(78% 0.16 60)' }}>
          Next
        </button>
      )}
    </div>
  );
}
