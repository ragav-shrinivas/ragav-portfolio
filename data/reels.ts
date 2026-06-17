export interface Reel {
  id: string;
  title: string;
  /** Short category tag shown on the card (e.g. "Commercial Edit"). */
  tag: string;
  description: string;
  /** Instagram Reel permalink opened on click. */
  instagramUrl: string;
  /** Local (or Supabase) preview video. */
  videoUrl: string;
  accent: "red" | "blue";
  order: number;
}

/**
 * Static seed data — mirrors the Supabase `reels` table.
 * Served as the fallback / build-time data until Supabase is connected.
 */
export const reels: Reel[] = [
  {
    id: "reel-01",
    title: "Commercial Edit",
    tag: "Commercial",
    description:
      "High-impact commercial edit with punchy pacing, sound design and brand-forward storytelling.",
    instagramUrl:
      "https://www.instagram.com/reel/DTA6cJ8jzMZ/?igsh=MW5xNHJ0ZHZybnhneQ==",
    videoUrl: "/videos/video1.mp4",
    accent: "red",
    order: 1,
  },
  {
    id: "reel-02",
    title: "Cinematic Storytelling",
    tag: "Cinematic",
    description:
      "Cinematic storytelling piece — mood, motion and narrative crafted for emotional pull.",
    instagramUrl:
      "https://www.instagram.com/reel/DTLPTOYD52M/?igsh=eXJqOXVsYWQ0b3ow",
    videoUrl: "/videos/video2.mp4",
    accent: "blue",
    order: 2,
  },
  {
    id: "reel-03",
    title: "Social Media Campaign",
    tag: "Social",
    description:
      "Scroll-stopping social campaign content optimized for reach, retention and engagement.",
    instagramUrl:
      "https://www.instagram.com/reel/DTnZtT0CYOe/?igsh=YWZzZGVwMzhicDQ=",
    videoUrl: "/videos/video3.mp4",
    accent: "red",
    order: 3,
  },
  {
    id: "reel-04",
    title: "Promotional Content",
    tag: "Promo",
    description:
      "Promotional content built to convert — clear hook, tight edit and a strong call to action.",
    instagramUrl:
      "https://www.instagram.com/reel/DLNDzKUzVRu/?igsh=MTBuMGRxczZiaDF4ag==",
    videoUrl: "/videos/video4.mp4",
    accent: "blue",
    order: 4,
  },
  {
    id: "reel-05",
    title: "Creative Brand Edit",
    tag: "Branding",
    description:
      "Creative brand edit blending visual identity, rhythm and premium finishing.",
    instagramUrl:
      "https://www.instagram.com/reel/DS40jwCk0b5/?igsh=b29maGh1NHB1Nm5r",
    videoUrl: "/videos/video5.mp4",
    accent: "red",
    order: 5,
  },
  {
    id: "reel-06",
    title: "Motion Graphics Showcase",
    tag: "Motion",
    description:
      "Motion graphics showcase — kinetic typography, transitions and animated brand assets.",
    instagramUrl:
      "https://www.instagram.com/reel/DPtbEUhE5r-/?igsh=MWZ1MTBlbXZibzY1bQ==",
    videoUrl: "/videos/video6.mp4",
    accent: "blue",
    order: 6,
  },
];
