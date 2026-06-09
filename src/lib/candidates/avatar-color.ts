const GRADIENTS = [
  "from-violet-400 to-indigo-600",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-orange-400 to-amber-600",
  "from-pink-400 to-rose-600",
  "from-cyan-400 to-blue-500",
];

export function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
