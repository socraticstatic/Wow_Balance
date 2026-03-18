import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

export default function Faith() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="The Light Within"
          sub="A Night Elf Balance Druid walks between worlds. So does a Christian in Azeroth."
          accent="solar"
        />
      </div>

      {/* Opening meditation */}
      <div ref={r2} className="reveal max-w-2xl mb-16">
        <div className="pl-6 py-1" style={{ borderLeft: '2px solid oklch(78% 0.16 60)' }}>
          <p className="drop-cap" style={{
            fontFamily: '"Cormorant", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'oklch(68% 0.015 55)',
            lineHeight: 1.85,
          }}>
            Elune is not God. But the impulse to look up at the night sky and feel watched over, known, held in place
            by something older than starlight? That impulse is real. Spiracle was born under that impulse. She stands
            in moonfire and calls it worship. She channels the balance of solar and lunar, light and shadow, and
            recognizes in it the same tension every believer carries: the glory and the ache, the certainty and the doubt,
            the conviction that the ordinary is also holy.
          </p>
        </div>
      </div>

      {/* Thematic parallels */}
      <div ref={r3} className="reveal grid md:grid-cols-2 gap-6 mb-16">
        <Parallel
          wow="Eclipse: Solar and Lunar"
          faith="Grace and Law"
          text="Balance Druids live in the tension between two states. Neither is complete without the other. Solar burns bright and fast. Lunar is deep and sustained. The Christian life oscillates the same way: seasons of fiery certainty and seasons of quiet endurance. The mastery is not choosing one. It's learning to inhabit both."
          accent="oklch(78% 0.16 60)"
        />
        <Parallel
          wow="Astral Power: Generated, then Spent"
          faith="Spiritual Disciplines"
          text="You don't burst without building. Every Starsurge requires Astral Power earned through faithful casting - Wrath after Wrath, Starfire after Starfire. Prayer, scripture, silence, service: these are the builders. The moments of breakthrough come from the stored-up faithfulness that preceded them."
          accent="oklch(68% 0.16 285)"
        />
        <Parallel
          wow="Incarnation: Chosen of Elune"
          faith="Calling and Vocation"
          text="For 30 seconds you become something more than yourself. Your Haste increases. Your damage amplifies. Every ability hits harder. Then it fades, and you return to the patient work of building again. Vocation works the same way: rare, luminous moments of clarity about what you were made for, sustained by long seasons of showing up."
          accent="oklch(78% 0.16 60)"
        />
        <Parallel
          wow="Barkskin: The Defensive"
          faith="Suffering and Endurance"
          text="20% damage reduction for 8 seconds. Not immunity. Not escape. Just the capacity to absorb what's coming without breaking. James 1:2-4 doesn't promise removal of trials. It promises the completion of something through them. Barkskin is the prayer: 'I can take this.'"
          accent="oklch(52% 0.14 155)"
        />
        <Parallel
          wow="Stampeding Roar: The Utility"
          faith="Bearing One Another's Burdens"
          text="Your strongest utility isn't damage. It's giving everyone in your raid 60% movement speed when they need to get out of fire. The druid who Roars at the right moment saves lives. Ministry isn't spectacle. It's noticing who's standing in danger and moving them."
          accent="oklch(52% 0.14 155)"
        />
        <Parallel
          wow="Night Elf: Children of the Stars"
          faith="Imago Dei"
          text="Night Elves were the first to hear the call of the wild, the first to answer with reverence instead of domination. They didn't conquer nature. They joined it. Made in the image of something greater, tasked not with ruling creation but tending it. Shadowmeld isn't hiding. It's listening."
          accent="oklch(68% 0.16 285)"
        />
      </div>

      {/* Closing */}
      <div className="max-w-xl">
        <p style={{
          fontFamily: '"Cormorant", Georgia, serif',
          fontWeight: 500,
          fontSize: '1rem',
          color: 'oklch(84% 0.008 55)',
          lineHeight: 1.8,
        }}>
          The dossier tracks gear and parses and tier sets. But the player behind the character carries
          something no API can sync: a soul that recognizes beauty in a made-up moon, and wonders if
          the real one is watching back.
        </p>
      </div>
    </section>
  );
}

function Parallel({ wow, faith, text, accent }: { wow: string; faith: string; text: string; accent: string }) {
  return (
    <div className="p-6 rounded-lg glass card-hover">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[13px] font-bold" style={{ color: accent }}>{wow}</span>
      </div>
      <div className="text-[10px] uppercase font-bold mb-3" style={{ color: 'oklch(84% 0.008 55)', letterSpacing: '0.1em' }}>
        {faith}
      </div>
      <p className="text-[13px]" style={{ color: 'oklch(82% 0.008 55)', lineHeight: 1.75 }}>
        {text}
      </p>
    </div>
  );
}
