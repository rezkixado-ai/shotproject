import {
  Users, Camera, Smile, Eye, Drama, Clapperboard, Star, Coffee, Shield,
  LifeBuoy, BookOpen, Handshake, Ticket, Crown, MessageCircle, Mail,
  Youtube, Instagram, Music2, MapPin, Calendar, GraduationCap,
  VenetianMask, Sparkles, Film, Heart, Zap, Award, Play, Upload,
  X, Plus, Check, LogOut, ExternalLink, Save, Loader2, LayoutDashboard,
  Inbox, Settings, Image as ImageIcon, Link2, type LucideIcon,
} from 'lucide-react';

// Semantic key -> Lucide component. Content stores the key (e.g. "users"),
// never raw emoji, so it renders consistently and can be swapped from a
// fixed picker in the admin panel instead of free-text emoji input.
export const ICONS: Record<string, LucideIcon> = {
  users: Users,
  camera: Camera,
  smile: Smile,
  eye: Eye,
  drama: Drama,
  clapperboard: Clapperboard,
  star: Star,
  coffee: Coffee,
  shield: Shield,
  'life-buoy': LifeBuoy,
  'book-open': BookOpen,
  handshake: Handshake,
  ticket: Ticket,
  crown: Crown,
  message: MessageCircle,
  mail: Mail,
  email: Mail,
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Music2,
  'map-pin': MapPin,
  calendar: Calendar,
  'graduation-cap': GraduationCap,
  mask: VenetianMask,
  sparkles: Sparkles,
  film: Film,
  heart: Heart,
  zap: Zap,
  award: Award,
  check: Check,
  x: X,
  plus: Plus,
};

export const ICON_KEYS = Object.keys(ICONS);

export function Icon({ name, size = 20, className, strokeWidth = 1.8 }: { name: string; size?: number; className?: string; strokeWidth?: number }) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} />;
}

// Small set reused by admin/UI chrome (not content-editable, just internal icons).
export const UI = { Play, Upload, X, Plus, Check, LogOut, ExternalLink, Save, Loader2, LayoutDashboard, Inbox, Settings, ImageIcon, Link2, Film, Clapperboard };
