import type { SiteContent } from './types';
import { DEFAULT_TEXTS } from './defaults';

export function getText(content: SiteContent | null | undefined, key: string): string {
  if (content?.texts && content.texts[key]) return content.texts[key];
  return DEFAULT_TEXTS[key] || '';
}
