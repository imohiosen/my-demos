export const lucideIconsIndex = {
  "accessibility": {
    "category": "accessibility",
    "tags": ["accessibility", "a11y", "universal", "disabled", "handicap"],
    "icons": [
      "accessibility",
      "ear",
      "ear-off",
      "eye",
      "eye-off"
    ]
  },
  "arrows": {
    "category": "arrows",
    "tags": ["arrow", "direction", "navigation", "pointer", "move"],
    "icons": [
      "arrow-up",
      "arrow-down",
      "arrow-left",
      "arrow-right",
      "arrow-up-down",
      "arrow-left-right",
      "chevron-up",
      "chevron-down",
      "chevron-left",
      "chevron-right",
      "move",
      "move-diagonal",
      "move-horizontal",
      "move-vertical"
    ]
  },
  "communication": {
    "category": "communication",
    "tags": ["message", "chat", "mail", "phone", "contact"],
    "icons": [
      "mail",
      "message-circle",
      "message-square",
      "phone",
      "phone-call",
      "send",
      "inbox",
      "at-sign"
    ]
  },
  "files": {
    "category": "files",
    "tags": ["file", "document", "folder", "storage", "save"],
    "icons": [
      "file",
      "file-text",
      "folder",
      "folder-open",
      "save",
      "download",
      "upload",
      "paperclip",
      "archive"
    ]
  },
  "media": {
    "category": "media",
    "tags": ["play", "pause", "music", "video", "audio", "volume"],
    "icons": [
      "play",
      "pause",
      "stop",
      "skip-forward",
      "skip-back",
      "volume-2",
      "volume-1",
      "volume-x",
      "music",
      "video"
    ]
  },
  "navigation": {
    "category": "navigation",
    "tags": ["menu", "home", "search", "filter", "navigation"],
    "icons": [
      "menu",
      "home",
      "search",
      "filter",
      "map-pin",
      "compass",
      "navigation",
      "more-horizontal",
      "more-vertical"
    ]
  },
  "ui": {
    "category": "ui",
    "tags": ["settings", "close", "add", "edit", "delete", "interface"],
    "icons": [
      "settings",
      "x",
      "plus",
      "minus",
      "edit",
      "trash-2",
      "copy",
      "check",
      "alert-circle",
      "info"
    ]
  },
  "weather": {
    "category": "weather",
    "tags": ["sun", "moon", "cloud", "rain", "weather"],
    "icons": [
      "sun",
      "moon",
      "cloud",
      "cloud-rain",
      "cloud-snow",
      "wind",
      "thermometer"
    ]
  }
};

export type IconCategory = keyof typeof lucideIconsIndex;

export function searchIcons(query: string): string[] {
  const results: string[] = [];
  const searchTerm = query.toLowerCase();

  Object.values(lucideIconsIndex).forEach(category => {
    // Search in category name
    if (category.category.includes(searchTerm)) {
      results.push(...category.icons);
    }
    
    // Search in tags
    if (category.tags.some(tag => tag.includes(searchTerm))) {
      results.push(...category.icons);
    }
    
    // Search in icon names
    category.icons.forEach(icon => {
      if (icon.includes(searchTerm)) {
        results.push(icon);
      }
    });
  });
  const x = [...new Set(results.slice(0, 20))]; // Remove duplicates and limit to 20 results
  console.log("Search results for:", query, x);
  return x;
}