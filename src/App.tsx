import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  ShoppingBag,
  Trophy,
  Volume2,
  VolumeX,
  Shield,
  Magnet,
  Zap,
  Sparkles,
  Star,
  Check,
  Lock,
  RotateCcw,
  Home,
  Compass,
  Award,
  Flame,
  Sun,
  Moon,
  CloudLightning,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Keyboard
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type GameScreen = 'menu' | 'playing' | 'hangar' | 'missions' | 'gameover';
type ThemeId = 'sunset' | 'cyber' | 'space' | 'daylight';
type PowerUpType = 'magnet' | 'shield' | 'multiplier' | 'boost';

interface PlaneModel {
  id: string;
  name: string;
  tagline: string;
  price: number;
  speedStat: number;   // 1 - 5
  handlingStat: number; // 1 - 5
  magnetStat: number;  // 1 - 5
  shape: 'dart' | 'viper' | 'interceptor' | 'phoenix' | 'stealth';
}

interface PlaneSkin {
  id: string;
  name: string;
  price: number;
  primary: string;
  secondary: string;
  accent: string;
  trail: string;
  glow: string;
}

interface SkyTheme {
  id: ThemeId;
  name: string;
  price: number;
  bgTop: string;
  bgBottom: string;
  starColor: string;
  accentColor: string;
  particleColor: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  claimed: boolean;
  type: 'stars' | 'score' | 'powerups' | 'dodges';
}

interface PlayerSaveData {
  stars: number;
  highScore: number;
  xp: number;
  level: number;
  unlockedPlanes: string[];
  selectedPlane: string;
  unlockedSkins: string[];
  selectedSkin: string;
  unlockedThemes: ThemeId[];
  selectedTheme: ThemeId;
  missions: Mission[];
  soundEnabled: boolean;
}

// ============================================================================
// GAME CATALOG & CONSTANTS
// ============================================================================

const PLANES: PlaneModel[] = [
  {
    id: 'sparrow',
    name: 'Aero Sparrow',
    tagline: 'Balanced rookie trainer jet',
    price: 0,
    speedStat: 3,
    handlingStat: 3,
    magnetStat: 2,
    shape: 'dart',
  },
  {
    id: 'viper',
    name: 'Strato Viper',
    tagline: 'Twin-wing agility specialist',
    price: 150,
    speedStat: 4,
    handlingStat: 5,
    magnetStat: 3,
    shape: 'viper',
  },
  {
    id: 'interceptor',
    name: 'Nova Interceptor',
    tagline: 'High-velocity star harvester',
    price: 400,
    speedStat: 5,
    handlingStat: 4,
    magnetStat: 4,
    shape: 'interceptor',
  },
  {
    id: 'stealth',
    name: 'Obsidian Wraith',
    tagline: 'Experimental delta-wing phantom',
    price: 850,
    speedStat: 5,
    handlingStat: 5,
    magnetStat: 4,
    shape: 'stealth',
  },
  {
    id: 'phoenix',
    name: 'Solar Phoenix',
    tagline: 'Supreme cosmic flagship',
    price: 1500,
    speedStat: 5,
    handlingStat: 5,
    magnetStat: 5,
    shape: 'phoenix',
  },
];

const SKINS: PlaneSkin[] = [
  {
    id: 'arctic',
    name: 'Arctic Titanium',
    price: 0,
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    accent: '#38BDF8',
    trail: 'rgba(56, 189, 248, 0.5)',
    glow: '#38BDF8',
  },
  {
    id: 'crimson',
    name: 'Crimson Ace',
    price: 80,
    primary: '#EF4444',
    secondary: '#991B1B',
    accent: '#FDE047',
    trail: 'rgba(239, 68, 68, 0.55)',
    glow: '#F87171',
  },
  {
    id: 'cyberpunk',
    name: 'Neon Overdrive',
    price: 200,
    primary: '#1E1B4B',
    secondary: '#EC4899',
    accent: '#22D3EE',
    trail: 'rgba(236, 72, 153, 0.6)',
    glow: '#22D3EE',
  },
  {
    id: 'emerald',
    name: 'Emerald Valkyrie',
    price: 350,
    primary: '#10B981',
    secondary: '#065F46',
    accent: '#A7F3D0',
    trail: 'rgba(16, 185, 129, 0.55)',
    glow: '#34D399',
  },
  {
    id: 'midas',
    name: 'Aurum Royal',
    price: 700,
    primary: '#F59E0B',
    secondary: '#78350F',
    accent: '#FEF08A',
    trail: 'rgba(245, 158, 11, 0.65)',
    glow: '#FBBF24',
  },
];

const THEMES: SkyTheme[] = [
  {
    id: 'sunset',
    name: 'Amber Horizon',
    price: 0,
    bgTop: '#0F172A',
    bgBottom: '#7C2D12',
    starColor: '#FDE047',
    accentColor: '#FB923C',
    particleColor: 'rgba(251, 146, 60, 0.35)',
  },
  {
    id: 'daylight',
    name: 'Stratosphere Blue',
    price: 120,
    bgTop: '#0369A1',
    bgBottom: '#38BDF8',
    starColor: '#FEF08A',
    accentColor: '#FFFFFF',
    particleColor: 'rgba(255, 255, 255, 0.45)',
  },
  {
    id: 'cyber',
    name: 'Cyber Metropolis',
    price: 300,
    bgTop: '#090D16',
    bgBottom: '#3B0764',
    starColor: '#22D3EE',
    accentColor: '#E879F9',
    particleColor: 'rgba(232, 121, 249, 0.35)',
  },
  {
    id: 'space',
    name: 'Deep Nebula',
    price: 550,
    bgTop: '#020617',
    bgBottom: '#1E1B4B',
    starColor: '#FACC15',
    accentColor: '#818CF8',
    particleColor: 'rgba(129, 140, 248, 0.4)',
  },
];

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Star Collector',
    description: 'Collect 35 stars across flights',
    target: 35,
    progress: 0,
    reward: 100,
    claimed: false,
    type: 'stars',
  },
  {
    id: 'm2',
    title: 'Sky Ace',
    description: 'Reach a score of 1,500 in a single run',
    target: 1500,
    progress: 0,
    reward: 180,
    claimed: false,
    type: 'score',
  },
  {
    id: 'm3',
    title: 'Tech Savvy',
    description: 'Activate 8 power-ups in flight',
    target: 8,
    progress: 0,
    reward: 150,
    claimed: false,
    type: 'powerups',
  },
  {
    id: 'm4',
    title: 'Evasive Maneuvers',
    description: 'Survive past 40 hazards',
    target: 40,
    progress: 0,
    reward: 220,
    claimed: false,
    type: 'dodges',
  },
];

const STORAGE_KEY = 'skyroll_save_v1';

// ============================================================================
// PROCEDURAL WEB AUDIO ENGINE
// ============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
  }

  public playStar(combo: number = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 580 + Math.min(combo, 12) * 45;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, this.ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playPowerUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const start = this.ctx.currentTime + idx * 0.055;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.13, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.16);
    });
  }

  public playCrash(shieldSaved: boolean = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = shieldSaved ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(shieldSaved ? 320 : 160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(shieldSaved ? 110 : 38, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.36);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  public playPurchase() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const t = this.ctx.currentTime + i * 0.06;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }
}

const sound = new SoundEngine();

// ============================================================================
// PLANE VECTOR RENDERER (USED IN BOTH CANVAS AND HANGAR PREVIEW)
// ============================================================================

function drawPlaneVector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  tilt: number,
  model: PlaneModel,
  skin: PlaneSkin,
  hasShield: boolean,
  isBoosting: boolean,
  time: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt * 0.38);
  ctx.scale(scale, scale);

  // Engine Thruster Flame
  const flameLength = (isBoosting ? 46 : 24) + Math.sin(time * 0.04) * 7;
  const grad = ctx.createLinearGradient(0, 18, 0, 18 + flameLength);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.35, isBoosting ? '#22D3EE' : skin.accent);
  grad.addColorStop(1, 'rgba(255, 100, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-7, 18);
  ctx.lineTo(0, 18 + flameLength);
  ctx.lineTo(7, 18);
  ctx.closePath();
  ctx.fill();

  // Outer Glow
  ctx.shadowColor = skin.glow;
  ctx.shadowBlur = isBoosting ? 24 : 12;

  // Wings & Fuselage based on plane shape
  ctx.fillStyle = skin.secondary;
  ctx.beginPath();
  if (model.shape === 'dart') {
    ctx.moveTo(0, -32);
    ctx.lineTo(30, 18);
    ctx.lineTo(10, 14);
    ctx.lineTo(0, 22);
    ctx.lineTo(-10, 14);
    ctx.lineTo(-30, 18);
  } else if (model.shape === 'viper') {
    // Forward-swept twin wings
    ctx.moveTo(0, -34);
    ctx.lineTo(12, -6);
    ctx.lineTo(36, 4);
    ctx.lineTo(32, 16);
    ctx.lineTo(12, 14);
    ctx.lineTo(0, 24);
    ctx.lineTo(-12, 14);
    ctx.lineTo(-32, 16);
    ctx.lineTo(-36, 4);
    ctx.lineTo(-12, -6);
  } else if (model.shape === 'interceptor') {
    // Sleek supersonic needle
    ctx.moveTo(0, -40);
    ctx.lineTo(10, -10);
    ctx.lineTo(34, 20);
    ctx.lineTo(14, 22);
    ctx.lineTo(8, 28);
    ctx.lineTo(-8, 28);
    ctx.lineTo(-14, 22);
    ctx.lineTo(-34, 20);
    ctx.lineTo(-10, -10);
  } else if (model.shape === 'stealth') {
    // Diamond stealth bomber
    ctx.moveTo(0, -34);
    ctx.lineTo(38, 12);
    ctx.lineTo(20, 24);
    ctx.lineTo(0, 16);
    ctx.lineTo(-20, 24);
    ctx.lineTo(-38, 12);
  } else {
    // Phoenix multi-wing flagship
    ctx.moveTo(0, -38);
    ctx.lineTo(14, -14);
    ctx.lineTo(40, -2);
    ctx.lineTo(26, 10);
    ctx.lineTo(34, 22);
    ctx.lineTo(12, 18);
    ctx.lineTo(0, 26);
    ctx.lineTo(-12, 18);
    ctx.lineTo(-34, 22);
    ctx.lineTo(-26, 10);
    ctx.lineTo(-40, -2);
    ctx.lineTo(-14, -14);
  }
  ctx.closePath();
  ctx.fill();

  // Main Fuselage Core
  ctx.fillStyle = skin.primary;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(11, 16);
  ctx.lineTo(0, 22);
  ctx.lineTo(-11, 16);
  ctx.closePath();
  ctx.fill();

  // Accent Stripes
  ctx.strokeStyle = skin.accent;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-18, 10);
  ctx.lineTo(-8, -4);
  ctx.moveTo(18, 10);
  ctx.lineTo(8, -4);
  ctx.stroke();

  // Glass Cockpit Canopy
  ctx.shadowBlur = 0;
  const canopyGrad = ctx.createLinearGradient(-4, -14, 4, 4);
  canopyGrad.addColorStop(0, '#E0F2FE');
  canopyGrad.addColorStop(0.5, skin.accent);
  canopyGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = canopyGrad;
  ctx.beginPath();
  ctx.ellipse(0, -6, 4.5, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Active Energy Shield Bubble
  if (hasShield) {
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.beginPath();
    ctx.arc(0, -2, 44 + Math.sin(time * 0.01) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================================
// HANGAR 3D-LIKE INTERACTIVE PLANE PREVIEW COMPONENT
// ============================================================================

const PlanePreviewCanvas: React.FC<{
  plane: PlaneModel;
  skin: PlaneSkin;
  theme: SkyTheme;
}> = ({ plane, skin, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle holographic radar rings
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      [42, 68, 94].forEach((r) => {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      const hoverY = Math.sin(time * 0.004) * 6;
      const gentleTilt = Math.sin(time * 0.0025) * 0.25;

      drawPlaneVector(
        ctx,
        w / 2,
        h / 2 + hoverY,
        1.55,
        gentleTilt,
        plane,
        skin,
        false,
        true,
        time
      );

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [plane, skin, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-44 sm:h-52 rounded-2xl bg-slate-950/50 border border-white/10"
    />
  );
};

// ============================================================================
// MAIN SKYROLL APPLICATION
// ============================================================================

export default function App() {
  // Load Persistent Save Data
  const [saveData, setSaveData] = useState<PlayerSaveData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          stars: parsed.stars ?? 120,
          highScore: parsed.highScore ?? 0,
          xp: parsed.xp ?? 0,
          level: parsed.level ?? 1,
          unlockedPlanes: parsed.unlockedPlanes ?? ['sparrow'],
          selectedPlane: parsed.selectedPlane ?? 'sparrow',
          unlockedSkins: parsed.unlockedSkins ?? ['arctic'],
          selectedSkin: parsed.selectedSkin ?? 'arctic',
          unlockedThemes: parsed.unlockedThemes ?? ['sunset'],
          selectedTheme: parsed.selectedTheme ?? 'sunset',
          missions: parsed.missions ?? INITIAL_MISSIONS,
          soundEnabled: parsed.soundEnabled ?? true,
        };
      }
    } catch {
      // Fallback if storage blocked
    }
    return {
      stars: 120,
      highScore: 0,
      xp: 0,
      level: 1,
      unlockedPlanes: ['sparrow'],
      selectedPlane: 'sparrow',
      unlockedSkins: ['arctic'],
      selectedSkin: 'arctic',
      unlockedThemes: ['sunset'],
      selectedTheme: 'sunset',
      missions: INITIAL_MISSIONS,
      soundEnabled: true,
    };
  });

  // Save on state change
  useEffect(() => {
    sound.enabled = saveData.soundEnabled;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch {
      // Ignore quota errors
    }
  }, [saveData]);

  // UI Navigation & Store Tabs
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [hangarTab, setHangarTab] = useState<'planes' | 'skins' | 'skies'>('planes');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live HUD Telemetry State (synced periodically from canvas loop)
  const [hudState, setHudState] = useState({
    score: 0,
    runStars: 0,
    combo: 1,
    activePowerUps: {
      magnet: 0,
      shield: false,
      multiplier: 0,
      boost: 0,
    },
    isNightPhase: false,
  });

  // Last Run Summary
  const [lastRun, setLastRun] = useState({
    score: 0,
    starsEarned: 0,
    dodges: 0,
    isNewHigh: false,
    xpEarned: 0,
  });

  // Show temporary notification banner
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  }, []);

  // Derived active equipment
  const currentPlane = PLANES.find((p) => p.id === saveData.selectedPlane) || PLANES[0];
  const currentSkin = SKINS.find((s) => s.id === saveData.selectedSkin) || SKINS[0];
  const currentTheme = THEMES.find((t) => t.id === saveData.selectedTheme) || THEMES[0];

  // ==========================================================================
  // GAMEPLAY ENGINE REFS (60FPS CANVAS LOOP)
  // ==========================================================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef({
    left: false,
    right: false,
    pointerActive: false,
    pointerTargetX: null as number | null,
    tiltGamma: 0,
  });

  // Device Orientation (Tilt support for mobile/tablet)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        inputRef.current.tiltGamma = Math.max(-30, Math.min(30, e.gamma));
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Keyboard Listeners (A/D and Left/Right Arrows)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = true;
        inputRef.current.pointerTargetX = null;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = true;
        inputRef.current.pointerTargetX = null;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // ==========================================================================
  // CORE GAMEPLAY LOOP
  // ==========================================================================
  useEffect(() => {
    if (screen !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isGameOver = false;

    // Initial dimensions
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const getDims = () => {
      const rect = canvas.getBoundingClientRect();
      return { w: rect.width, h: rect.height };
    };

    const { w: initW, h: initH } = getDims();

    // Game State Variables
    let playerX = initW / 2;
    const playerY = initH * 0.78;
    let playerVx = 0;
    let score = 0;
    let runStars = 0;
    let dodgesCount = 0;
    let powerUpsCollected = 0;
    let combo = 1;
    let comboTimer = 0;
    let frameCount = 0;

    // Power-up timers (in frames at ~60fps)
    let magnetFrames = 0;
    let shieldActive = false;
    let multiplierFrames = 0;
    let boostFrames = 0;
    let invulnFrames = 0;

    // Plane Stats Modifiers
    const baseSpeed = 6.2 + currentPlane.speedStat * 0.75;
    const handlingResponsiveness = 0.14 + currentPlane.handlingStat * 0.025;
    const baseMagnetRadius = 55 + currentPlane.magnetStat * 22;

    // Entities
    interface StarEntity {
      x: number;
      y: number;
      r: number;
      value: number;
      superStar: boolean;
      angle: number;
    }

    interface HazardEntity {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      type: 'meteor' | 'storm' | 'drone';
      rot: number;
      rotSpeed: number;
    }

    interface PowerUpEntity {
      x: number;
      y: number;
      r: number;
      type: PowerUpType;
      pulse: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }

    interface BgStar {
      x: number;
      y: number;
      size: number;
      speed: number;
      alpha: number;
    }

    const stars: StarEntity[] = [];
    const hazards: HazardEntity[] = [];
    const powerUps: PowerUpEntity[] = [];
    const particles: Particle[] = [];
    const trailPoints: { x: number; y: number; alpha: number }[] = [];

    // Background parallax stars/clouds
    const bgStars: BgStar[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * initW,
      y: Math.random() * initH,
      size: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.7 + 0.2,
    }));

    const spawnParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 28 + Math.random() * 14,
          maxLife: 42,
          color,
          size: Math.random() * 3.5 + 1.5,
        });
      }
    };

    const handleCrash = () => {
      if (invulnFrames > 0) return;

      if (shieldActive) {
        shieldActive = false;
        invulnFrames = 65;
        sound.playCrash(true);
        spawnParticles(playerX, playerY, '#38BDF8', 24);
        return;
      }

      isGameOver = true;
      sound.playCrash(false);
      spawnParticles(playerX, playerY, '#F97316', 35);

      const finalScore = Math.floor(score);
      const isNewHigh = finalScore > saveData.highScore;
      const xpEarned = Math.floor(finalScore / 10) + runStars * 4;

      setLastRun({
        score: finalScore,
        starsEarned: runStars,
        dodges: dodgesCount,
        isNewHigh,
        xpEarned,
      });

      // Update Save Data & Mission Progress
      setSaveData((prev) => {
        const nextXp = prev.xp + xpEarned;
        const nextLevel = Math.floor(nextXp / 500) + 1;

        const updatedMissions = prev.missions.map((m) => {
          if (m.claimed) return m;
          let newProg = m.progress;
          if (m.type === 'stars') newProg += runStars;
          if (m.type === 'score') newProg = Math.max(newProg, finalScore);
          if (m.type === 'powerups') newProg += powerUpsCollected;
          if (m.type === 'dodges') newProg += dodgesCount;
          return { ...m, progress: Math.min(m.target, newProg) };
        });

        return {
          ...prev,
          stars: prev.stars + runStars,
          highScore: Math.max(prev.highScore, finalScore),
          xp: nextXp,
          level: nextLevel,
          missions: updatedMissions,
        };
      });

      setTimeout(() => {
        setScreen('gameover');
      }, 450);
    };

    // Main Animation Loop
    const loop = (time: number) => {
      if (isGameOver) return;
      frameCount++;

      const { w, h } = getDims();
      const dynamicPlayerY = h * 0.78;
      const dpr = window.devicePixelRatio || 1;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Difficulty scaling over time
      const difficulty = 1 + Math.min(score / 3200, 2.2);
      const speedMult = boostFrames > 0 ? 1.65 : 1;
      const worldSpeed = (4.2 + difficulty * 1.4) * speedMult;

      // Dynamic Day/Night Cycle shift based on score
      const cycleFactor = (Math.sin(score * 0.0012) + 1) / 2; // 0 to 1
      const isNightPhase = cycleFactor > 0.55;

      // 1. Render Sky Background Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, currentTheme.bgTop);
      skyGrad.addColorStop(1, currentTheme.bgBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Night overlay tint for dynamic atmosphere
      if (cycleFactor > 0.15) {
        ctx.fillStyle = `rgba(2, 6, 23, ${cycleFactor * 0.42})`;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Render Parallax Stars / Wind Streaks
      bgStars.forEach((s) => {
        s.y += s.speed * worldSpeed * 0.45;
        if (s.y > h) {
          s.y = -10;
          s.x = Math.random() * w;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        if (boostFrames > 0) {
          ctx.rect(s.x, s.y, s.size * 0.8, s.size * 6);
        } else {
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // 3. Player Horizontal Movement (Keyboard + Touch Drag + Tilt)
      let targetVx = 0;
      if (inputRef.current.left) targetVx -= baseSpeed;
      if (inputRef.current.right) targetVx += baseSpeed;

      // Mobile Tilt Support
      if (Math.abs(inputRef.current.tiltGamma) > 3 && !inputRef.current.pointerActive) {
        targetVx += (inputRef.current.tiltGamma / 22) * baseSpeed;
      }

      // Direct Touch / Mouse Drag Tracking
      if (inputRef.current.pointerActive && inputRef.current.pointerTargetX !== null) {
        const diff = inputRef.current.pointerTargetX - playerX;
        targetVx = Math.max(-baseSpeed * 1.45, Math.min(baseSpeed * 1.45, diff * 0.22));
      }

      playerVx += (targetVx - playerVx) * handlingResponsiveness;
      playerX += playerVx;

      // Clamp to screen bounds
      const margin = 32;
      if (playerX < margin) {
        playerX = margin;
        playerVx = 0;
      } else if (playerX > w - margin) {
        playerX = w - margin;
        playerVx = 0;
      }

      // 4. Spawn Stars, Hazards, and Power-Ups
      if (frameCount % Math.max(16, Math.floor(30 / difficulty)) === 0) {
        const isSuper = Math.random() < 0.14;
        stars.push({
          x: margin + Math.random() * (w - margin * 2),
          y: -25,
          r: isSuper ? 14 : 10,
          value: isSuper ? 5 : 1,
          superStar: isSuper,
          angle: 0,
        });
      }

      if (frameCount % Math.max(22, Math.floor(46 / difficulty)) === 0) {
        const roll = Math.random();
        const type: HazardEntity['type'] =
          roll < 0.55 ? 'meteor' : roll < 0.82 ? 'storm' : 'drone';
        hazards.push({
          x: margin + Math.random() * (w - margin * 2),
          y: -35,
          r: type === 'storm' ? 24 : 18,
          vx: type === 'drone' ? (Math.random() > 0.5 ? 2.1 : -2.1) : (Math.random() - 0.5) * 1.2,
          vy: worldSpeed * (type === 'meteor' ? 1.15 : 0.95),
          type,
          rot: 0,
          rotSpeed: (Math.random() - 0.5) * 0.08,
        });
      }

      if (frameCount % 340 === 0) {
        const pTypes: PowerUpType[] = ['magnet', 'shield', 'multiplier', 'boost'];
        const chosen = pTypes[Math.floor(Math.random() * pTypes.length)];
        powerUps.push({
          x: margin + Math.random() * (w - margin * 2),
          y: -30,
          r: 16,
          type: chosen,
          pulse: 0,
        });
      }

      // 5. Update & Draw Stars
      const activeMagnetRadius = magnetFrames > 0 ? baseMagnetRadius * 2.4 : baseMagnetRadius;

      for (let i = stars.length - 1; i >= 0; i--) {
        const st = stars[i];
        st.y += worldSpeed * 0.92;
        st.angle += 0.06;

        // Magnet pull
        const dx = playerX - st.x;
        const dy = dynamicPlayerY - st.y;
        const dist = Math.hypot(dx, dy);

        if (dist < activeMagnetRadius) {
          st.x += (dx / dist) * 8.5;
          st.y += (dy / dist) * 8.5;
        }

        // Collection check
        if (dist < st.r + 24) {
          const mult = (multiplierFrames > 0 ? 2 : 1) * (boostFrames > 0 ? 2 : 1);
          const gained = st.value * mult;
          runStars += gained;
          score += gained * 15 * combo;
          combo = Math.min(10, combo + 1);
          comboTimer = 140;

          sound.playStar(combo);
          spawnParticles(st.x, st.y, st.superStar ? '#38BDF8' : '#FDE047', 10);
          stars.splice(i, 1);
          continue;
        }

        if (st.y > h + 30) {
          stars.splice(i, 1);
          continue;
        }

        // Draw Star
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.rotate(st.angle);
        ctx.fillStyle = st.superStar ? '#38BDF8' : currentTheme.starColor;
        ctx.shadowColor = st.superStar ? '#38BDF8' : '#FACC15';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let p = 0; p < 5; p++) {
          const outerAngle = (p * 2 * Math.PI) / 5 - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          ctx.lineTo(Math.cos(outerAngle) * st.r, Math.sin(outerAngle) * st.r);
          ctx.lineTo(Math.cos(innerAngle) * (st.r * 0.45), Math.sin(innerAngle) * (st.r * 0.45));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 6. Update & Draw Power-Ups
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];
        pu.y += worldSpeed * 0.85;
        pu.pulse += 0.08;

        const dist = Math.hypot(playerX - pu.x, dynamicPlayerY - pu.y);
        if (dist < pu.r + 26) {
          powerUpsCollected++;
          sound.playPowerUp();
          if (pu.type === 'magnet') magnetFrames = 480;
          if (pu.type === 'shield') shieldActive = true;
          if (pu.type === 'multiplier') multiplierFrames = 480;
          if (pu.type === 'boost') {
            boostFrames = 260;
            invulnFrames = 280;
          }
          spawnParticles(pu.x, pu.y, '#A855F7', 16);
          powerUps.splice(i, 1);
          continue;
        }

        if (pu.y > h + 30) {
          powerUps.splice(i, 1);
          continue;
        }

        // Draw Power-Up Orb
        const colorMap: Record<PowerUpType, string> = {
          magnet: '#EC4899',
          shield: '#38BDF8',
          multiplier: '#F59E0B',
          boost: '#10B981',
        };
        const labelMap: Record<PowerUpType, string> = {
          magnet: 'M',
          shield: 'S',
          multiplier: '2X',
          boost: '⚡',
        };

        ctx.save();
        ctx.translate(pu.x, pu.y);
        const scalePulse = 1 + Math.sin(pu.pulse) * 0.1;
        ctx.scale(scalePulse, scalePulse);
        ctx.fillStyle = colorMap[pu.type];
        ctx.shadowColor = colorMap[pu.type];
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, pu.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelMap[pu.type], 0, 1);
        ctx.restore();
      }

      // 7. Update & Draw Hazards (Meteors, Storm Clouds, Drones)
      for (let i = hazards.length - 1; i >= 0; i--) {
        const hz = hazards[i];
        hz.y += hz.vy * speedMult;
        hz.x += hz.vx;
        hz.rot += hz.rotSpeed;

        if (hz.x < margin || hz.x > w - margin) {
          hz.vx *= -1;
        }

        const dist = Math.hypot(playerX - hz.x, dynamicPlayerY - hz.y);
        if (dist < hz.r + 17) {
          if (boostFrames > 0) {
            // Smash through obstacles during Hyper Boost
            spawnParticles(hz.x, hz.y, '#F97316', 18);
            score += 75;
            hazards.splice(i, 1);
            continue;
          } else {
            hazards.splice(i, 1);
            handleCrash();
            continue;
          }
        }

        if (hz.y > h + 40) {
          dodgesCount++;
          hazards.splice(i, 1);
          continue;
        }

        // Render Hazard
        ctx.save();
        ctx.translate(hz.x, hz.y);
        if (hz.type === 'meteor') {
          ctx.rotate(hz.rot);
          ctx.fillStyle = '#78350F';
          ctx.strokeStyle = '#F97316';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let k = 0; k < 7; k++) {
            const ang = (k * Math.PI * 2) / 7;
            const rad = hz.r * (k % 2 === 0 ? 1 : 0.78);
            ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (hz.type === 'storm') {
          ctx.fillStyle = 'rgba(51, 65, 85, 0.92)';
          ctx.beginPath();
          ctx.arc(-8, 2, 13, 0, Math.PI * 2);
          ctx.arc(8, 2, 13, 0, Math.PI * 2);
          ctx.arc(0, -6, 15, 0, Math.PI * 2);
          ctx.fill();
          // Lightning bolt
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 2);
          ctx.lineTo(-4, 10);
          ctx.lineTo(2, 10);
          ctx.lineTo(-2, 18);
          ctx.stroke();
        } else {
          // Enemy Drone
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 16);
          ctx.lineTo(18, -10);
          ctx.lineTo(0, -4);
          ctx.lineTo(-18, -10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Red scanner eye
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(0, 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 8. Wingtip Ribbon Trail
      trailPoints.push({ x: playerX, y: dynamicPlayerY + 14, alpha: 0.65 });
      if (trailPoints.length > 18) trailPoints.shift();

      trailPoints.forEach((pt, idx) => {
        pt.y += worldSpeed * 0.6;
        const ratio = idx / trailPoints.length;
        ctx.fillStyle = currentSkin.trail;
        ctx.beginPath();
        ctx.arc(pt.x - 16, pt.y, ratio * 3.5, 0, Math.PI * 2);
        ctx.arc(pt.x + 16, pt.y, ratio * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 9. Draw Player Aircraft
      const blinkSkip = invulnFrames > 0 && boostFrames <= 0 && Math.floor(frameCount / 4) % 2 === 0;
      if (!blinkSkip) {
        drawPlaneVector(
          ctx,
          playerX,
          dynamicPlayerY,
          1.0,
          playerVx / baseSpeed,
          currentPlane,
          currentSkin,
          shieldActive,
          boostFrames > 0,
          time
        );
      }

      // 10. Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 11. Tick Timers & Score
      score += 0.28 * difficulty * speedMult * (multiplierFrames > 0 ? 2 : 1);
      if (magnetFrames > 0) magnetFrames--;
      if (multiplierFrames > 0) multiplierFrames--;
      if (boostFrames > 0) boostFrames--;
      if (invulnFrames > 0) invulnFrames--;
      if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer === 0) combo = 1;
      }

      // Sync React HUD every 5 frames for crisp performance
      if (frameCount % 5 === 0) {
        setHudState({
          score: Math.floor(score),
          runStars,
          combo,
          activePowerUps: {
            magnet: Math.ceil(magnetFrames / 60),
            shield: shieldActive,
            multiplier: Math.ceil(multiplierFrames / 60),
            boost: Math.ceil(boostFrames / 60),
          },
          isNightPhase,
        });
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [screen, currentPlane, currentSkin, currentTheme, saveData.highScore]);

  // ==========================================================================
  // POINTER / TOUCH HANDLERS ON CANVAS
  // ==========================================================================
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    inputRef.current.pointerActive = true;
    inputRef.current.pointerTargetX = e.clientX - rect.left;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!inputRef.current.pointerActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    inputRef.current.pointerTargetX = e.clientX - rect.left;
  };

  const handlePointerUp = () => {
    inputRef.current.pointerActive = false;
  };

  // ==========================================================================
  // STORE & MISSION ACTIONS
  // ==========================================================================
  const handleBuyOrEquipPlane = (plane: PlaneModel) => {
    const isUnlocked = saveData.unlockedPlanes.includes(plane.id);
    if (isUnlocked) {
      setSaveData((prev) => ({ ...prev, selectedPlane: plane.id }));
      triggerToast(`Equipped ${plane.name}`);
      return;
    }
    if (saveData.stars < plane.price) {
      triggerToast(`Need ${plane.price - saveData.stars} more stars!`);
      return;
    }
    sound.playPurchase();
    setSaveData((prev) => ({
      ...prev,
      stars: prev.stars - plane.price,
      unlockedPlanes: [...prev.unlockedPlanes, plane.id],
      selectedPlane: plane.id,
    }));
    triggerToast(`Unlocked & Equipped ${plane.name}!`);
  };

  const handleBuyOrEquipSkin = (skin: PlaneSkin) => {
    const isUnlocked = saveData.unlockedSkins.includes(skin.id);
    if (isUnlocked) {
      setSaveData((prev) => ({ ...prev, selectedSkin: skin.id }));
      triggerToast(`Applied ${skin.name} livery`);
      return;
    }
    if (saveData.stars < skin.price) {
      triggerToast(`Need ${skin.price - saveData.stars} more stars!`);
      return;
    }
    sound.playPurchase();
    setSaveData((prev) => ({
      ...prev,
      stars: prev.stars - skin.price,
      unlockedSkins: [...prev.unlockedSkins, skin.id],
      selectedSkin: skin.id,
    }));
    triggerToast(`Unlocked ${skin.name} Livery!`);
  };

  const handleBuyOrEquipTheme = (theme: SkyTheme) => {
    const isUnlocked = saveData.unlockedThemes.includes(theme.id);
    if (isUnlocked) {
      setSaveData((prev) => ({ ...prev, selectedTheme: theme.id }));
      triggerToast(`Sky set to ${theme.name}`);
      return;
    }
    if (saveData.stars < theme.price) {
      triggerToast(`Need ${theme.price - saveData.stars} more stars!`);
      return;
    }
    sound.playPurchase();
    setSaveData((prev) => ({
      ...prev,
      stars: prev.stars - theme.price,
      unlockedThemes: [...prev.unlockedThemes, theme.id],
      selectedTheme: theme.id,
    }));
    triggerToast(`Unlocked ${theme.name} Sky!`);
  };

  const handleClaimMission = (mission: Mission) => {
    if (mission.claimed || mission.progress < mission.target) return;
    sound.playPurchase();
    setSaveData((prev) => ({
      ...prev,
      stars: prev.stars + mission.reward,
      missions: prev.missions.map((m) =>
        m.id === mission.id ? { ...m, claimed: true } : m
      ),
    }));
    triggerToast(`Claimed +${mission.reward} Stars!`);
  };

  const unclaimedCount = saveData.missions.filter(
    (m) => !m.claimed && m.progress >= m.target
  ).length;

  // ==========================================================================
  // RENDER UI
  // ==========================================================================
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-950 text-white font-sans select-none flex flex-col">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 border border-amber-400/50 text-amber-200 text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {toastMessage}
        </div>
      )}

      {/* ====================================================================
          TOP NAVIGATION BAR (Shown outside active flight)
         ==================================================================== */}
      {screen !== 'playing' && (
        <header className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border-b border-white/10 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
                SKYROLL
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Pilot LVL {saveData.level} • {saveData.xp % 500}/500 XP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Star Currency Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{saveData.stars.toLocaleString()}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() =>
                setSaveData((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
              }
              aria-label="Toggle Sound"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition active:scale-95"
            >
              {saveData.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </header>
      )}

      {/* ====================================================================
          1. MAIN MENU SCREEN
         ==================================================================== */}
      {screen === 'menu' && (
        <main
          className="flex-1 overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-8 relative"
          style={{
            background: `linear-gradient(180deg, ${currentTheme.bgTop} 0%, ${currentTheme.bgBottom} 100%)`,
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />

          <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-5 my-auto">
            {/* High Score & Active Loadout Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-black/40 border border-white/15 text-xs font-semibold text-amber-300 flex items-center gap-1.5 backdrop-blur-md">
                <Trophy className="w-3.5 h-3.5" /> Best: {saveData.highScore.toLocaleString()}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-black/40 border border-white/15 text-xs font-semibold text-sky-300 flex items-center gap-1.5 backdrop-blur-md">
                <Compass className="w-3.5 h-3.5" /> {currentTheme.name}
              </span>
            </div>

            {/* Interactive Plane Showcase */}
            <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl">
              <PlanePreviewCanvas
                plane={currentPlane}
                skin={currentSkin}
                theme={currentTheme}
              />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-white">{currentPlane.name}</h2>
                  <p className="text-xs text-slate-300">Livery: {currentSkin.name}</p>
                </div>
                <button
                  onClick={() => setScreen('hangar')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider border border-white/15 transition"
                >
                  Customize
                </button>
              </div>
            </div>

            {/* Primary Launch CTA */}
            <button
              onClick={() => setScreen('playing')}
              className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-lg sm:text-xl tracking-wider uppercase shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 transition transform active:scale-98 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white" />
              Launch Flight
            </button>

            {/* Secondary Navigation Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => setScreen('hangar')}
                className="p-4 rounded-2xl bg-slate-900/75 hover:bg-slate-800/85 border border-white/15 backdrop-blur-md flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <ShoppingBag className="w-6 h-6 text-amber-400" />
                <span className="font-bold text-sm">Hangar & Store</span>
                <span className="text-[11px] text-slate-400">
                  {saveData.unlockedPlanes.length}/{PLANES.length} Jets •{' '}
                  {saveData.unlockedSkins.length}/{SKINS.length} Skins
                </span>
              </button>

              <button
                onClick={() => setScreen('missions')}
                className="relative p-4 rounded-2xl bg-slate-900/75 hover:bg-slate-800/85 border border-white/15 backdrop-blur-md flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                {unclaimedCount > 0 && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center animate-pulse">
                    {unclaimedCount}
                  </span>
                )}
                <Award className="w-6 h-6 text-sky-400" />
                <span className="font-bold text-sm">Missions</span>
                <span className="text-[11px] text-slate-400">Earn Bonus Stars</span>
              </button>
            </div>

            {/* Cross-Device Control Hint */}
            <div className="w-full px-4 py-3 rounded-2xl bg-black/35 border border-white/10 flex items-center justify-around text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>Touch Drag / Tap / Tilt</span>
              </div>
              <div className="h-4 w-px bg-white/15" />
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-amber-400" />
                <span>A / D or ◀ / ▶ Keys</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ====================================================================
          2. ACTIVE GAMEPLAY CANVAS & CROSS-DEVICE HUD
         ==================================================================== */}
      {screen === 'playing' && (
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {/* Interactive Fullscreen Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full block touch-none cursor-crosshair"
          />

          {/* Top Floating HUD */}
          <div className="absolute top-0 inset-x-0 p-3 sm:p-5 flex items-start justify-between pointer-events-none">
            {/* Score & Combo */}
            <div className="flex flex-col gap-1.5">
              <div className="px-4 py-2 rounded-2xl bg-slate-950/65 backdrop-blur-md border border-white/15">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Score
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                    {hudState.score.toLocaleString()}
                  </span>
                  {hudState.combo > 1 && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {hudState.combo}x COMBO
                    </span>
                  )}
                </div>
              </div>

              {/* Active Power-up Status Pills */}
              <div className="flex flex-wrap gap-1.5">
                {hudState.activePowerUps.shield && (
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Shield className="w-3.5 h-3.5" /> Shield
                  </span>
                )}
                {hudState.activePowerUps.magnet > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Magnet className="w-3.5 h-3.5" /> {hudState.activePowerUps.magnet}s
                  </span>
                )}
                {hudState.activePowerUps.multiplier > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" /> 2X ({hudState.activePowerUps.multiplier}s)
                  </span>
                )}
                {hudState.activePowerUps.boost > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Zap className="w-3.5 h-3.5" /> Boost ({hudState.activePowerUps.boost}s)
                  </span>
                )}
              </div>
            </div>

            {/* Stars Collected & Day/Night Indicator */}
            <div className="flex flex-col items-end gap-2">
              <div className="px-4 py-2 rounded-2xl bg-slate-950/65 backdrop-blur-md border border-amber-400/30 flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-black text-amber-300 tabular-nums">
                  {hudState.runStars}
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-slate-950/60 border border-white/10 text-[11px] text-slate-300 flex items-center gap-1.5">
                {hudState.isNightPhase ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" /> Night Cycle
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Day Cycle
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Ergonomic Bottom Touch Controls (Also clickable on desktop) */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none sm:opacity-65 hover:opacity-100 transition-opacity">
            <button
              onPointerDown={() => {
                inputRef.current.left = true;
                inputRef.current.pointerTargetX = null;
              }}
              onPointerUp={() => (inputRef.current.left = false)}
              onPointerLeave={() => (inputRef.current.left = false)}
              aria-label="Steer Left"
              className="pointer-events-auto w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-white/10 active:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <span className="text-[11px] uppercase tracking-widest text-white/50 font-semibold hidden sm:inline">
              Drag Anywhere or Use Steer Pads
            </span>

            <button
              onPointerDown={() => {
                inputRef.current.right = true;
                inputRef.current.pointerTargetX = null;
              }}
              onPointerUp={() => (inputRef.current.right = false)}
              onPointerLeave={() => (inputRef.current.right = false)}
              aria-label="Steer Right"
              className="pointer-events-auto w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-white/10 active:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          3. HANGAR & STORE SCREEN (PLANES, SKINS, SKIES)
         ==================================================================== */}
      {screen === 'hangar' && (
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="w-full max-w-2xl flex flex-col gap-5 pb-8">
            {/* Back Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setScreen('menu')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold flex items-center gap-2 transition"
              >
                <Home className="w-4 h-4" /> Back to Base
              </button>
              <h2 className="text-xl font-black tracking-wide uppercase">Skyroll Hangar</h2>
            </div>

            {/* Live Preview Box */}
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-4 shadow-xl">
              <PlanePreviewCanvas
                plane={currentPlane}
                skin={currentSkin}
                theme={currentTheme}
              />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white/5">
                  <p className="text-[10px] uppercase text-slate-400">Speed</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 w-3 rounded-full ${n <= currentPlane.speedStat ? 'bg-amber-400' : 'bg-slate-700'
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <p className="text-[10px] uppercase text-slate-400">Handling</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 w-3 rounded-full ${n <= currentPlane.handlingStat ? 'bg-sky-400' : 'bg-slate-700'
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <p className="text-[10px] uppercase text-slate-400">Magnet</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 w-3 rounded-full ${n <= currentPlane.magnetStat ? 'bg-pink-400' : 'bg-slate-700'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10">
              {(['planes', 'skins', 'skies'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHangarTab(tab)}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition ${hangarTab === tab
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {tab === 'planes' ? 'Aircraft' : tab === 'skins' ? 'Plane Skins' : 'Sky Worlds'}
                </button>
              ))}
            </div>

            {/* TAB 1: AIRCRAFT */}
            {hangarTab === 'planes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLANES.map((plane) => {
                  const unlocked = saveData.unlockedPlanes.includes(plane.id);
                  const selected = saveData.selectedPlane === plane.id;
                  return (
                    <div
                      key={plane.id}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${selected
                          ? 'bg-amber-500/15 border-amber-400'
                          : 'bg-slate-900/80 border-white/10'
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-base">{plane.name}</h3>
                          {selected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                              Equipped
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{plane.tagline}</p>
                      </div>

                      <button
                        onClick={() => handleBuyOrEquipPlane(plane)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${selected
                            ? 'bg-white/10 text-amber-300 cursor-default'
                            : unlocked
                              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                      >
                        {selected ? (
                          <>
                            <Check className="w-4 h-4" /> Active Jet
                          </>
                        ) : unlocked ? (
                          'Select Jet'
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Unlock • {plane.price}{' '}
                            <Star className="w-3.5 h-3.5 fill-slate-950" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: PLANE SKINS */}
            {hangarTab === 'skins' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKINS.map((skin) => {
                  const unlocked = saveData.unlockedSkins.includes(skin.id);
                  const selected = saveData.selectedSkin === skin.id;
                  return (
                    <div
                      key={skin.id}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${selected
                          ? 'bg-sky-500/15 border-sky-400'
                          : 'bg-slate-900/80 border-white/10'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-extrabold text-base">{skin.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span
                              className="w-5 h-5 rounded-full border border-white/30"
                              style={{ backgroundColor: skin.primary }}
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-white/30"
                              style={{ backgroundColor: skin.secondary }}
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-white/30"
                              style={{ backgroundColor: skin.accent }}
                            />
                          </div>
                        </div>
                        {selected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-400 text-slate-950 uppercase">
                            Applied
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleBuyOrEquipSkin(skin)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${selected
                            ? 'bg-white/10 text-sky-300'
                            : unlocked
                              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                      >
                        {selected ? (
                          <>
                            <Check className="w-4 h-4" /> Equipped
                          </>
                        ) : unlocked ? (
                          'Apply Skin'
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Buy Skin • {skin.price}{' '}
                            <Star className="w-3.5 h-3.5 fill-slate-950" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: SKY ENVIRONMENTS */}
            {hangarTab === 'skies' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((theme) => {
                  const unlocked = saveData.unlockedThemes.includes(theme.id);
                  const selected = saveData.selectedTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${selected
                          ? 'bg-purple-500/15 border-purple-400'
                          : 'bg-slate-900/80 border-white/10'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-extrabold text-base">{theme.name}</h3>
                          <div
                            className="w-24 h-4 rounded-full mt-1.5 border border-white/20"
                            style={{
                              background: `linear-gradient(90deg, ${theme.bgTop}, ${theme.bgBottom})`,
                            }}
                          />
                        </div>
                        {selected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-400 text-slate-950 uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleBuyOrEquipTheme(theme)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${selected
                            ? 'bg-white/10 text-purple-300'
                            : unlocked
                              ? 'bg-purple-500 hover:bg-purple-400 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                      >
                        {selected ? (
                          <>
                            <Check className="w-4 h-4" /> Selected
                          </>
                        ) : unlocked ? (
                          'Set Sky Theme'
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Unlock • {theme.price}{' '}
                            <Star className="w-3.5 h-3.5 fill-slate-950" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ====================================================================
          4. MISSIONS & CHALLENGES SCREEN
         ==================================================================== */}
      {screen === 'missions' && (
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="w-full max-w-xl flex flex-col gap-4 pb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setScreen('menu')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold flex items-center gap-2 transition"
              >
                <Home className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-black uppercase tracking-wide">Flight Missions</h2>
            </div>

            {saveData.missions.map((mission) => {
              const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
              const isReady = !mission.claimed && mission.progress >= mission.target;

              return (
                <div
                  key={mission.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base text-white">{mission.title}</h3>
                      <p className="text-xs text-slate-400">{mission.description}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1 shrink-0">
                      +{mission.reward} <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {mission.progress.toLocaleString()} / {mission.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {mission.claimed ? (
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Reward Claimed
                    </div>
                  ) : isReady ? (
                    <button
                      onClick={() => handleClaimMission(mission)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition animate-pulse"
                    >
                      Claim +{mission.reward} Stars
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ====================================================================
          5. GAME OVER SUMMARY SCREEN
         ==================================================================== */}
      {screen === 'gameover' && (
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-slate-950">
          <div className="w-full max-w-md bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <CloudLightning className="w-8 h-8 text-rose-400" />
            </div>

            <div>
              {lastRun.isNewHigh && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
                  New High Score!
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-white">Flight Complete</h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentPlane.name} • {currentSkin.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] uppercase text-slate-400">Final Score</p>
                <p className="text-2xl font-black text-white mt-0.5">
                  {lastRun.score.toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/25">
                <p className="text-[11px] uppercase text-amber-300">Stars Earned</p>
                <p className="text-2xl font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                  +{lastRun.starsEarned} <Star className="w-5 h-5 fill-amber-400" />
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] uppercase text-slate-400">Hazards Dodged</p>
                <p className="text-lg font-extrabold text-sky-400">{lastRun.dodges}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] uppercase text-slate-400">Pilot XP</p>
                <p className="text-lg font-extrabold text-emerald-400">+{lastRun.xpEarned} XP</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => setScreen('playing')}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Fly Again
              </button>
              <button
                onClick={() => setScreen('hangar')}
                className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-white/15 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Hangar
              </button>
            </div>

            <button
              onClick={() => setScreen('menu')}
              className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
            >
              Return to Main Menu
            </button>
          </div>
        </main>
      )}
    </div>
  );
}