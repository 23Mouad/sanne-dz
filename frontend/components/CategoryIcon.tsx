import {
  Shirt, Sparkles, GraduationCap, Scissors, PenTool, Ruler, Layers, ShoppingBag, Cog, Camera,
  Heart, Star, Zap, Package, Briefcase, Home, Music, Book, Wrench, Truck, MapPin, Coffee,
  PaintBucket, Feather, User, Globe, Flower, Shield, Cpu, Film, Tag
} from 'lucide-react'

export function CategoryIcon({ slug, size = 24, className = "" }: { slug: string, size?: number, className?: string }) {
  switch (slug) {
    // Standard icon slugs
    case 'scissors':
    case 'ateliers-couture': return <Scissors size={size} className={className} />
    case 'pen-tool':
    case 'modelistes': return <PenTool size={size} className={className} />
    case 'ruler':
    case 'patronistes': return <Ruler size={size} className={className} />
    case 'layers':
    case 'magasins-tissus': return <Layers size={size} className={className} />
    case 'shopping-bag':
    case 'merceries': return <ShoppingBag size={size} className={className} />
    case 'sparkles':
    case 'services-broderie': return <Sparkles size={size} className={className} />
    case 'graduation-cap':
    case 'formation-couture': return <GraduationCap size={size} className={className} />
    case 'cog':
    case 'location-machines': return <Cog size={size} className={className} />
    case 'shirt':
    case 'textiles': return <Shirt size={size} className={className} />
    case 'camera':
    case 'studios': return <Camera size={size} className={className} />

    // Extended icon set
    case 'heart': return <Heart size={size} className={className} />
    case 'star': return <Star size={size} className={className} />
    case 'zap': return <Zap size={size} className={className} />
    case 'package': return <Package size={size} className={className} />
    case 'briefcase': return <Briefcase size={size} className={className} />
    case 'home': return <Home size={size} className={className} />
    case 'music': return <Music size={size} className={className} />
    case 'book': return <Book size={size} className={className} />
    case 'tool': return <Wrench size={size} className={className} />
    case 'truck': return <Truck size={size} className={className} />
    case 'map-pin': return <MapPin size={size} className={className} />
    case 'coffee': return <Coffee size={size} className={className} />
    case 'paint-bucket': return <PaintBucket size={size} className={className} />
    case 'feather': return <Feather size={size} className={className} />
    case 'user': return <User size={size} className={className} />
    case 'globe': return <Globe size={size} className={className} />
    case 'flower': return <Flower size={size} className={className} />
    case 'shield': return <Shield size={size} className={className} />
    case 'cpu': return <Cpu size={size} className={className} />
    case 'film': return <Film size={size} className={className} />
    case 'tag': return <Tag size={size} className={className} />

    // Legacy fallbacks
    case 'mode': return <Shirt size={size} className={className} />
    case 'formation': return <GraduationCap size={size} className={className} />
    default: return <Sparkles size={size} className={className} />
  }
}
