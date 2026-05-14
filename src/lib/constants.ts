
export const DEFAULT_CATEGORIES = [
  { name: "ID Card", icon: "🪪" },
  { name: "Wallet", icon: "👛" },
  { name: "Phone", icon: "📱" },
  { name: "Keys", icon: "🔑" },
  { name: "Charger / Cable", icon: "🔌" },
  { name: "Laptop / Tablet", icon: "💻" },
  { name: "Bag / Backpack", icon: "🎒" },
  { name: "Clothing", icon: "👕" },
  { name: "Headphones / Earbuds", icon: "🎧" },
  { name: "Water Bottle", icon: "🧴" },
  { name: "Books / Notes", icon: "📚" },
  { name: "Glasses", icon: "👓" },
  { name: "Jewelry / Watch", icon: "⌚" },
  { name: "Umbrella", icon: "☂️" },
  { name: "Other", icon: "📦" },
] as const;

// Badge definitions
export const BADGES = {
  FIRST_FINDER: {
    type: "FIRST_FINDER",
    name: "First Finder",
    description: "Returned your first found item",
    icon: "🔍",
  },
  GOOD_SAMARITAN: {
    type: "GOOD_SAMARITAN",
    name: "Good Samaritan",
    description: "Returned 5 items",
    icon: "🤝",
  },
  CAMPUS_HERO: {
    type: "CAMPUS_HERO",
    name: "Campus Hero",
    description: "Returned 10 items",
    icon: "🦸",
  },
  QUICK_RESPONDER: {
    type: "QUICK_RESPONDER",
    name: "Quick Responder",
    description: "Responded to a match within 1 hour",
    icon: "⚡",
  },
  TRUSTED_MEMBER: {
    type: "TRUSTED_MEMBER",
    name: "Trusted Member",
    description: "Active for 6+ months with no flags",
    icon: "⭐",
  },
  HELPFUL_REPORTER: {
    type: "HELPFUL_REPORTER",
    name: "Helpful Reporter",
    description: "Reported 10+ found items",
    icon: "📋",
  },
} as const;

// Contact preferences
export const CONTACT_PREFERENCES = [
  { value: "in_app", label: "In-app messaging only" },
  { value: "phone", label: "Phone call" },
  { value: "both", label: "Both messaging & phone" },
] as const;
