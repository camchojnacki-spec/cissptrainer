import {
  Shield,
  Database,
  Building,
  Network,
  Key,
  ClipboardCheck,
  Monitor,
  Code,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const domainIconMap: Record<string, LucideIcon> = {
  Shield,
  Database,
  Building,
  Network,
  Key,
  ClipboardCheck,
  Monitor,
  Code,
};

export function getDomainIcon(iconName: string): LucideIcon {
  return domainIconMap[iconName] || Shield;
}
