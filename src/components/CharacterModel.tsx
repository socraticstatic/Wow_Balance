import { useEffect, useRef, useState } from 'react';

interface Props {
  height?: number;
  className?: string;
}

// Night Elf Female Balance Druid
// Race 4 = Night Elf, Gender 0 = Female
const CHARACTER = {
  race: 4,
  gender: 0,
  skin: 7,
  face: 0,
  hairStyle: 6,
  hairColor: 3,
  facialStyle: 0,
  items: [] as Array<[number, number]>, // Will be populated from gear data if available
};

export default function CharacterModel({ height = 500, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if dependencies are loaded
    if (typeof (window as any).jQuery === 'undefined' || typeof (window as any).ZamModelViewer === 'undefined') {
      console.log('WoW Model Viewer dependencies not loaded, falling back to PNG');
      setError(true);
      return;
    }

    let destroyed = false;

    async function init() {
      try {
        const { generateModels } = await import('wow-model-viewer');

        // Set content path for Wowhead assets
        (window as any).CONTENT_PATH = 'https://wow.zamimg.com/modelviewer/live/';
        (window as any).WOTLK_TO_RETAIL_DISPLAY_ID_API = undefined; // Retail mode

        const model = await generateModels(1, `#${container!.id}`, CHARACTER);

        if (destroyed) {
          (model as any)?.destroy?.();
          return;
        }

        modelRef.current = model;
        setLoaded(true);

        // Set camera and play idle animation
        try {
          (model as any).setDistance?.(3);
          (model as any).setAnimation?.('Stand');
        } catch {
          // Some methods may not be available
        }
      } catch (err) {
        console.error('Model viewer failed:', err);
        if (!destroyed) setError(true);
      }
    }

    init();

    return () => {
      destroyed = true;
      try {
        (modelRef.current as any)?.destroy?.();
      } catch { /* ignore cleanup errors */ }
    };
  }, []);

  // Fallback to PNG if model viewer fails
  if (error) {
    return (
      <div className={className}>
        <img
          src={`${import.meta.env.BASE_URL}spiracle-cropped.png`}
          alt="Spiracle - Night Elf Balance Druid"
          className="h-full w-auto object-contain"
          style={{
            filter: 'drop-shadow(0 4px 40px oklch(25% 0.15 270 / 0.3))',
            animation: 'characterIdle 6s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        id="spiracle-model-3d"
        ref={containerRef}
        style={{
          width: '100%',
          height,
          position: 'relative',
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[11px] font-medium" style={{ color: 'oklch(50% 0.012 50)' }}>
            Loading 3D model...
          </div>
        </div>
      )}
    </div>
  );
}
