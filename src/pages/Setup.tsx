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
              color: step === i ? 'oklch(90% 0.01 60)' : 'oklch(56% 0.012 50)',
              background: step === i ? 'oklch(14% 0.015 45)' : 'transparent',
              border: `1px solid ${step === i ? 'oklch(22% 0.02 45)' : 'oklch(14% 0.01 45)'}`,
            }}
          >
            <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{
                color: step >= i ? 'oklch(78% 0.16 60)' : 'oklch(50% 0.012 50)',
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
            <label className="block text-[10px] uppercase font-bold mb-2" style={{ color: 'oklch(72% 0.01 50)', letterSpacing: '0.1em' }}>Region</label>
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

          <p className="text-[13px]" style={{ color: 'oklch(72% 0.01 50)', lineHeight: 1.7 }}>
            This shapes your optimization page - gear, enchants, talents, and rotation will be tailored to your focus.
          </p>

          {/* Primary content */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.01 50)', letterSpacing: '0.1em' }}>
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
                  <span className="text-[11px]" style={{ color: 'oklch(56% 0.012 50)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero talent preference */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.01 50)', letterSpacing: '0.1em' }}>
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
                  <span className="text-[10px]" style={{ color: 'oklch(68% 0.01 50)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AoE vs ST preference */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.01 50)', letterSpacing: '0.1em' }}>
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
                  <span className="text-[11px]" style={{ color: 'oklch(68% 0.01 50)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* What matters most */}
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.01 50)', letterSpacing: '0.1em' }}>
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
                    color: form.priorities.includes(p) ? 'oklch(90% 0.01 60)' : 'oklch(72% 0.01 50)',
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
      {step === 2 && <FaithStoryStep form={form} setForm={setForm} onBack={() => setStep(1)} onNext={() => setStep(3)} />}

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
            <ol className="space-y-2 text-[13px]" style={{ color: 'oklch(70% 0.01 50)', lineHeight: 1.6 }}>
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
            <ol className="space-y-2 text-[13px]" style={{ color: 'oklch(70% 0.01 50)', lineHeight: 1.6 }}>
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

            <p className="text-sm mt-4" style={{ color: 'oklch(72% 0.01 50)' }}>
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

// ── Faith Story Step (deep branching) ──

const faithQuestions = {
  origin: [
    { id: 'cradle', label: 'Cradle Faith', desc: 'Raised in the church. Faith was the water you swam in before you knew it was water.' },
    { id: 'prodigal', label: 'The Prodigal Road', desc: 'Left, wandered, burned bridges. Came back changed. The return was harder than the leaving.' },
    { id: 'seeker', label: 'The Seeker', desc: 'Found faith later. You went looking for something and it found you first.' },
    { id: 'wrestling', label: 'Still Wrestling', desc: 'Not sure. Drawn to something. The questions are honest and the doubt is not the enemy.' },
    { id: 'inherited', label: 'Inherited but Untested', desc: 'Your parents believed. You said the words. But you have never had to fight for the belief yourself. That reckoning is coming.' },
    { id: 'broken', label: 'Broken and Rebuilt', desc: 'Something shattered you. Loss, betrayal, the silence of a God who did not answer. What grew back was different. Harder. More honest.' },
  ],
  struggle: [
    { id: 'doubt', label: 'Doubt vs. Devotion', desc: 'The mind questions what the heart knows. You live in the gap between evidence and faith.' },
    { id: 'mask', label: 'The Mask', desc: 'The public face and the private self don\'t match. Authenticity is the unfinished work.' },
    { id: 'control', label: 'Surrender vs. Control', desc: 'You know you should let go. You can\'t stop holding on. Every boss fight is this.' },
    { id: 'anger', label: 'Righteous Anger', desc: 'The world is broken and you feel it in your teeth. Justice and mercy fight inside you.' },
    { id: 'loneliness', label: 'The Alone Place', desc: 'You believe in a crowd but feel it alone. The guild is full. The soul is quiet. Connection is the prayer you cannot seem to finish.' },
    { id: 'pride', label: 'The Parse Trap', desc: 'You know your worth should not be measured in percentiles. But you check. Every time. The idol is performance, and you have built it an altar.' },
  ],
  virtue: [
    { id: 'patience', label: 'Patience', desc: 'You build before you burst. The rotation is a discipline. You trust the process.' },
    { id: 'sacrifice', label: 'Sacrifice', desc: 'You Innervate the healer. You Stampeding Roar for the group. Your DPS is not the point.' },
    { id: 'stewardship', label: 'Stewardship', desc: 'Every cooldown used wisely. No wasted GCD. The talent tree is a garden you tend.' },
    { id: 'hope', label: 'Hope', desc: 'You wipe and go again. The boss will die. The key will time. Tomorrow\'s parse will be better.' },
    { id: 'faithfulness', label: 'Faithfulness', desc: 'You show up. Every raid night. Every key. Not because you feel it, but because you said you would. The feeling follows the obedience.' },
    { id: 'joy', label: 'Joy', desc: 'You actually enjoy this. The moonkin dance is not ironic. The stars are beautiful even in pixels. You refuse to be too sophisticated for delight.' },
  ],
  calling: [
    { id: 'protector', label: 'The Protector', desc: 'You stand between the darkness and the people you love. Barkskin is a prayer.' },
    { id: 'witness', label: 'The Witness', desc: 'You see the beauty in the made-up world and recognize something real underneath it.' },
    { id: 'healer', label: 'The Mender', desc: 'Even as Balance, you off-heal. You notice who\'s hurting. The moonkin has a pastoral heart.' },
    { id: 'pilgrim', label: 'The Pilgrim', desc: 'Every zone is a new chapter. Every expansion is a book in the canon. You walk and you learn.' },
    { id: 'teacher', label: 'The Guide', desc: 'You explain the fight. You link the WeakAura. You whisper the nervous DPS that they are doing fine. You disciple without calling it that.' },
    { id: 'builder', label: 'The Builder', desc: 'You founded the guild. You organized the roster. You built the Discord. The body of Christ needs people who set up chairs.' },
  ],
};

// Cross-referenced prose: origin x struggle combinations produce unique bridging sentences
const crossBridge: Record<string, Record<string, string>> = {
  cradle: {
    doubt: 'The prayers you memorized as a child now feel like someone else\'s language. But the muscle memory of worship is still there, buried under the questions, waiting.',
    mask: 'Everyone at church knew your name. Nobody knew your mind. The grove raised you, but the grove also taught you to perform.',
    control: 'You learned early that God has a plan. You learned late that you cannot manage the plan for Him.',
    anger: 'The church taught you gentleness. The world taught you rage. You are learning they are not opposites.',
    loneliness: 'Surrounded by a congregation since birth, you never learned how to be known. Community and intimacy are not the same spell.',
    pride: 'You were the good kid. The one who knew the verses. The performance started before you had a parse to check.',
  },
  prodigal: {
    doubt: 'You left because the answers stopped working. You came back because the questions led somewhere familiar.',
    mask: 'On the road, you were yourself for the first time. In the return, you learned the harder art: being yourself at home.',
    control: 'The leaving was control. The return was surrender. Both cost everything.',
    anger: 'You are angry at what the church did. You are angrier that you still need what the church carries.',
    loneliness: 'The road was lonely. The return was lonelier. You are in the building but not yet in the room.',
    pride: 'You came back humbled. But humility has its own vanity, and you know it.',
  },
  seeker: {
    doubt: 'You chose this. That makes the doubt more personal. You cannot blame inheritance for a decision you made with open eyes.',
    mask: 'You found faith in private. The public profession is still catching up. You are learning to be the same person in both rooms.',
    control: 'You searched methodically. You found something that cannot be methodized. The transition is ongoing.',
    anger: 'You found God in the wreckage. That does not make you grateful for the wreckage.',
    loneliness: 'You came to faith alone. The community part is the harder conversion.',
    pride: 'You researched your way in. You know more theology than some lifelong believers. That knowledge is a gift and a trap.',
  },
  wrestling: {
    doubt: 'The doubt is not the obstacle. It is the terrain. You walk it honestly, and that honesty is its own kind of worship.',
    mask: 'You are not pretending to believe. You are not pretending to doubt. You are the rarest thing in the pew: authentic.',
    control: 'You cannot surrender to something you have not yet fully grasped. But you keep showing up. That is its own surrender.',
    anger: 'You are angry that you care. If it were nothing, you could walk away. The anger is evidence of investment.',
    loneliness: 'You are between worlds. The believers think you lack faith. The skeptics think you lack nerve. The truth is you lack neither.',
    pride: 'You are proud of your honesty. That is the most forgivable pride there is.',
  },
  inherited: {
    doubt: 'The faith you received was never tested because it was never yours. The first real doubt is not loss. It is birth.',
    mask: 'You wear your parents\' religion like a hand-me-down coat. It fits in some places. In others, you can feel the seams of someone else\' body.',
    control: 'They handed you a map. You are learning that the map is not the territory, and the territory is where God actually lives.',
    anger: 'You are angry at the ease of it. Faith should cost something. Yours was free, and that cheapness haunts you.',
    loneliness: 'You are surrounded by people who believe for reasons you have never been asked to articulate. The belonging is real. The understanding is not.',
    pride: 'You can recite the catechism. You cannot yet feel it in your bones. The distance between head and heart is the longest journey.',
  },
  broken: {
    doubt: 'After the breaking, doubt was not a question. It was a landscape. You live there now. Slowly, things are growing.',
    mask: 'The scar is real. The smile is sometimes real. You are learning that strength is not the absence of the wound but the willingness to show it.',
    control: 'You controlled nothing when it mattered most. That helplessness was the beginning of something you did not ask for and cannot name.',
    anger: 'The anger is sacred. It is the proof that you expected goodness. That expectation is the ember of faith the breaking could not reach.',
    loneliness: 'Suffering isolates. Even in a room of sympathetic faces, the grief is yours alone. But alone with God is still with God.',
    pride: 'You survived. The temptation is to make survival the whole identity. It is not. It is the prologue.',
  },
};

function generateStory(form: FormData): string {
  const name = form.characterName || 'Your character';
  const parts: string[] = [];

  // Opening (origin)
  const originText: Record<string, string> = {
    cradle: `${name} was born under the light of Elune, raised in a grove where worship was as natural as breathing. The old prayers came before language. Moonfire was the first word, and it meant both illumination and obedience.`,
    prodigal: `${name} walked away from the grove once. The Emerald Dream held no comfort, and the moon looked like a dead eye in a sky that did not care. But the road out led back, as prodigal roads always do, and the return was the real journey. The grove had not changed. The druid had.`,
    seeker: `${name} did not grow up in the moonlight. The call came later, unexpected, in a dungeon or a battlefield or a quiet moment between pulls when the stars aligned and something whispered. Not Elune. Something behind Elune. The druid listened, and listening was the first act of faith.`,
    wrestling: `${name} carries questions like others carry totems. The light of Elune is visible but not yet understood, and the honesty of that uncertainty is its own form of reverence. The doubt is not weakness. It is the gravity that keeps faith from floating away into abstraction.`,
    inherited: `${name} received the old ways without asking for them. The grove was home before it was chosen. The rituals were muscle memory before they were meaning. Now, standing in the midnight of a new expansion, the druid wonders: is this mine, or am I still borrowing?`,
    broken: `${name} was broken before becoming balanced. Something shattered. The details do not matter here. What matters is that the pieces reassembled into something the original blueprint did not anticipate. The cracks let in moonlight. The scars conduct starfire.`,
  };
  if (form.faithOrigin) parts.push(originText[form.faithOrigin] || '');

  // Bridge (origin x struggle cross-reference)
  if (form.faithOrigin && form.faithStruggle) {
    const bridge = crossBridge[form.faithOrigin]?.[form.faithStruggle];
    if (bridge) parts.push(bridge);
  }

  // Struggle expanded
  const struggleText: Record<string, string> = {
    doubt: 'The Eclipse cycle is the metaphor that fits: Solar certainty burns bright and brief, Lunar questioning runs deep and long. The rotation between them is not failure. It is the mechanic. To master it is to stop fearing the transition and start trusting it.',
    mask: 'Moonkin Form hides the body in feathers and fury. It is the original mask. But the real shapeshift is not the one on the action bar. It is the moment you decide to cast without the costume. To pray without the performance. To show up as yourself.',
    control: 'Eclipse has 2 charges and a 30-second cooldown. You will spend time outside Eclipse. This is not a bug. It is the design. The druid who accepts the downtime, who trusts the recharge, who does not panic in the absence of the buff, has learned something the game cannot teach.',
    anger: 'Solar Beam silences the darkness for 8 seconds. It does not destroy it. The anger that interrupts injustice is holy. The anger that believes it can eliminate injustice alone is hubris. Know the difference. Cast the beam. Then keep casting.',
    loneliness: 'The druid is the only moonkin in the raid. Balance is a spec most people do not understand. The metaphor writes itself. Faith in a secular world is a solo spec. The connection is not in being understood. It is in showing up anyway.',
    pride: 'The parse is not the point. The parse is never the point. But the number glows gold, and the ranking feels like anointing, and the temptation to make the meter the measure of the soul is the oldest idol dressed in the newest clothes. Log out. The character sheet is not your identity.',
  };
  if (form.faithStruggle) parts.push(struggleText[form.faithStruggle] || '');

  // Virtue as practice
  const virtueText: Record<string, string> = {
    patience: 'Astral Power builds one cast at a time. Wrath after Wrath. Starfire after Starfire. No shortcuts. The Starsurge comes when the work has been done. The virtue is in the casting, not the critting. Patience is not waiting. It is building.',
    sacrifice: 'Stampeding Roar saves lives that will never know they were saved. Innervate empties you to fill someone else. The best ministry is invisible, and the druid who measures worth by the help they gave instead of the damage they dealt has found the narrow path.',
    stewardship: 'Every talent point placed with intention. Every cooldown a resource to be honored, not squandered. The tree is a garden, and the druid is its keeper. Stewardship is not control. It is care. The garden grows on its own. You just remove the weeds.',
    hope: 'The wipe is not the end. The depleted key is not the verdict. Tomorrow, the rotation will be cleaner, the gear will be higher, the healer will be awake. Hope is a 3-minute cooldown that never stops recharging. It is the only ability in the game that cannot be nerfed.',
    faithfulness: 'You show up. Every Tuesday. Every reset. Not because the loot is guaranteed or the group is perfect. Because you said you would. The feeling follows the obedience. The obedience follows the decision. The decision was made long ago, in a quieter moment than this.',
    joy: 'The moonkin dances. Not ironically. The stars are beautiful even rendered in polygons. The made-up world produces real delight, and the refusal to be too sophisticated for that delight is itself a form of worship. Joy is not naive. Joy is defiant.',
  };
  if (form.faithVirtue) parts.push(virtueText[form.faithVirtue] || '');

  // Calling as commission
  const callingText: Record<string, string> = {
    protector: 'Barkskin is the prayer of a body willing to absorb what others cannot. Bear Form is not retreat. It is intercession. The druid stands in fire so the healer can breathe, takes the hit so the DPS can finish the cast. Ministry has always looked like this: the one who steps forward when stepping back is rational.',
    witness: 'The made-up moon over a made-up world still stirs something real. To notice beauty in the imagined is to practice noticing it in the actual. The witness does not create the light. The witness points at it and says: there. See that? That is not nothing.',
    healer: 'Even specced for damage, the druid notices who is hurting. An off-heal at the right moment is worth more than a parse. A whispered encouragement in party chat costs zero mana. The moonkin has a pastor\'s instinct: scan the room, find the wounded, move toward them.',
    pilgrim: 'Quel\'Thalas is new ground, but the walking is ancient. Kalimdor, Northrend, Pandaria, the Shadowlands, the Dragon Isles, Khaz Algar, and now Silvermoon. Every zone is a chapter. Every expansion is a book. The pilgrimage has no final destination this side of the veil, and that is the point.',
    teacher: 'You link the WeakAura string. You explain the Eclipse rework for the third time without sighing. You whisper the undergeared DPS that they are doing fine and that gear comes with time. You disciple without calling it that. The Great Commission does not require a pulpit. It requires patience and a willingness to type.',
    builder: 'You founded the guild or you maintain it. You organized the roster. You built the Discord. You resolve the loot drama. The body of Christ needs people who set up chairs, and in Azeroth the chairs are raid invites and the sanctuary is a voice channel. The work is unglamorous and essential.',
  };
  if (form.faithCalling) parts.push(callingText[form.faithCalling] || '');

  return parts.join('\n\n');
}

function FaithStoryStep({ form, setForm, onBack, onNext }: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const setField = (key: keyof FormData) => (id: string) =>
    setForm(prev => ({ ...prev, [key]: id }));

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-bold" style={{ fontFamily: '"Cormorant", Georgia, serif', fontStyle: 'italic', color: 'oklch(78% 0.16 60)' }}>
        Your Character's Faith Story
      </h3>
      <p className="text-[13px]" style={{ color: 'oklch(72% 0.01 50)', lineHeight: 1.7 }}>
        Every character carries the soul of their player. Answer these questions and a personal "Light Within"
        meditation will be generated, mapping your faith journey onto your character's story in Azeroth.
        Each combination produces unique prose. 6 x 6 x 6 x 6 = 1,296 possible stories.
      </p>

      <FaithQuestion label="Where did your faith begin?" color="oklch(78% 0.16 60)" options={faithQuestions.origin} selected={form.faithOrigin} onSelect={setField('faithOrigin')} />
      <FaithQuestion label="What tension do you carry?" color="oklch(68% 0.16 285)" options={faithQuestions.struggle} selected={form.faithStruggle} onSelect={setField('faithStruggle')} />
      <FaithQuestion label="What virtue defines your play?" color="oklch(52% 0.14 155)" options={faithQuestions.virtue} selected={form.faithVirtue} onSelect={setField('faithVirtue')} />
      <FaithQuestion label="What does your character serve?" color="oklch(78% 0.16 60)" options={faithQuestions.calling} selected={form.faithCalling} onSelect={setField('faithCalling')} />

      {/* Generated story preview */}
      {(form.faithOrigin || form.faithStruggle || form.faithVirtue || form.faithCalling) && (
        <div className="p-6 rounded-lg" style={{ background: 'oklch(10% 0.015 45)', border: '1px solid oklch(78% 0.16 60 / 0.15)' }}>
          <div className="text-[10px] uppercase font-bold mb-4" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.1em' }}>
            {form.characterName ? `${form.characterName}'s Story` : 'Your Story Preview'}
          </div>
          {generateStory(form).split('\n\n').map((para, i) => (
            <p key={i} className={i === 0 ? 'drop-cap mb-4' : 'mb-4'} style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: 'oklch(65% 0.015 55)',
              lineHeight: 1.85,
            }}>
              {para}
            </p>
          ))}
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

function FaithQuestion({ label, color, options, selected, onSelect }: {
  label: string; color: string;
  options: Array<{ id: string; label: string; desc: string }>;
  selected: string; onSelect: (id: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold mb-3" style={{ color, letterSpacing: '0.1em' }}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="text-left p-4 rounded-lg cursor-pointer transition-all"
            style={{
              background: selected === opt.id ? 'oklch(14% 0.02 45)' : 'oklch(10.5% 0.012 45)',
              border: `1px solid ${selected === opt.id ? `${color}60` : 'oklch(16% 0.012 45)'}`,
            }}
          >
            <span className="text-[13px] font-bold block mb-1" style={{ color: selected === opt.id ? color : 'oklch(72% 0.01 50)' }}>
              {opt.label}
            </span>
            <span className="text-[11px]" style={{ color: 'oklch(56% 0.012 50)', lineHeight: 1.5 }}>{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, help, type = 'text' }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; help?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold mb-2" style={{ color: 'oklch(72% 0.01 50)', letterSpacing: '0.1em' }}>
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
      {help && <p className="text-[11px] mt-1.5" style={{ color: 'oklch(68% 0.01 50)' }}>{help}</p>}
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
        <span className="text-[11px] font-semibold" style={{ color: 'oklch(70% 0.01 50)' }}>{label}</span>
        <button onClick={copy} className="text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer"
          style={{ color: copied ? 'oklch(68% 0.18 155)' : 'oklch(72% 0.01 50)', background: 'oklch(14% 0.012 45)' }}>
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
          style={{ color: 'oklch(70% 0.01 50)', background: 'oklch(12% 0.012 45)', border: '1px solid oklch(18% 0.012 45)' }}>
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
