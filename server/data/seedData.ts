import { ICategory, IBrand, IProduct, ISiteSettings } from '../types';

export const defaultSettings: ISiteSettings = {
  businessName: 'Al Mushtaq Building Material Store',
  subtitle: 'Building Materials / Construction Supplies / Hardware',
  phone: '+92 301 3242408',
  whatsapp: '+92 301 3242408',
  email: 'info@almushtaqmaterials.com',
  address: 'Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan',
  city: 'Rahim Yar Khan',
  openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: Closed',
  deliveryAreas: ['Rahim Yar Khan City', 'Manthar Road', 'Sadiqabad', 'Khanpur', 'Liaquatpur', 'Industrial Area'],
  deliveryFee: 1500,
  freeDeliveryThreshold: 50000,
  announcementBarText: 'Quality Building Materials | Rahim Yar Khan | Bulk Orders & Project Quotes Available',
  heroHeading: 'Build Strong. Build Better.',
  heroSubheading: 'Quality building materials, hardware and construction supplies for your next project.',
  returnPolicy: 'Standard return within 7 days for unopened and undamaged materials. Custom mixed paints and customized cut steel are non-returnable. Please retain original invoice.',
  warrantyPolicy: 'Manufacturer warranties apply to branded tools, electrical switches, water pumps, and plumbing fixtures as provided by original manufacturers.',
  socialLinks: {
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: ''
  }
};

export const defaultCategories: ICategory[] = [
  { _id: 'cat-1', name: 'Cement', slug: 'cement', description: 'Ordinary Portland Cement, Sulphate Resistant, and White Cement for foundation and masonry.', iconName: 'Layers', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80', order: 1, isActive: true },
  { _id: 'cat-2', name: 'Bricks & Blocks', slug: 'bricks-blocks', description: 'Red clay bricks, fly-ash bricks, solid and hollow concrete masonry blocks.', iconName: 'Boxes', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80', order: 2, isActive: true },
  { _id: 'cat-3', name: 'Steel & Iron', slug: 'steel-iron', description: 'Deformed reinforcement rebar, angle iron, channels, flat bars, and binding wire.', iconName: 'Hammer', image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80', order: 3, isActive: true },
  { _id: 'cat-4', name: 'Sand & Crush', slug: 'sand-crush', description: 'River Chenab and Ravi construction sand, Margalla and Sargodha crushed aggregates.', iconName: 'Mountain', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80', order: 4, isActive: true },
  { _id: 'cat-5', name: 'Tiles', slug: 'tiles', description: 'Ceramic, porcelain, vitrified floor and wall tiles for interior and exterior design.', iconName: 'Grid', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', order: 5, isActive: true },
  { _id: 'cat-6', name: 'Paints', slug: 'paints', description: 'Interior emulsions, weather-shield exterior paints, primers, and enamel finishes.', iconName: 'Paintbrush', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80', order: 6, isActive: true },
  { _id: 'cat-7', name: 'Plumbing', slug: 'plumbing', description: 'Water supply lines, sanitary valves, bib cocks, faucets, and drainage fittings.', iconName: 'Wrench', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80', order: 7, isActive: true },
  { _id: 'cat-8', name: 'Electrical', slug: 'electrical', description: 'Copper wiring, circuit breakers, switches, conduit pipes, and distribution panels.', iconName: 'Zap', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', order: 8, isActive: true },
  { _id: 'cat-9', name: 'Sanitary Ware', slug: 'sanitary-ware', description: 'Ceramic basins, commodes, flush tanks, sink units, and bathroom accessories.', iconName: 'Bath', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80', order: 9, isActive: true },
  { _id: 'cat-10', name: 'Hardware', slug: 'hardware', description: 'Door locks, brass hinges, construction nails, drywall screws, bolts, and fasteners.', iconName: 'Key', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80', order: 10, isActive: true },
  { _id: 'cat-11', name: 'Tools', slug: 'tools', description: 'Masonry trowels, hammers, power drill sets, cutting discs, and tape measures.', iconName: 'Tool', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80', order: 11, isActive: true },
  { _id: 'cat-12', name: 'PVC Pipes', slug: 'pvc-pipes', description: 'Unplasticized PVC pressure and non-pressure pipes for plumbing and sewerage.', iconName: 'CircleDot', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', order: 12, isActive: true },
  { _id: 'cat-13', name: 'PPR Pipes', slug: 'ppr-pipes', description: 'Polypropylene random copolymer hot & cold sanitary water supply piping.', iconName: 'Disc', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80', order: 13, isActive: true },
  { _id: 'cat-14', name: 'Water Tanks', slug: 'water-tanks', description: 'Heavy-duty multi-layer food grade polyethylene overhead water storage tanks.', iconName: 'Container', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', order: 14, isActive: true },
  { _id: 'cat-15', name: 'Adhesives', slug: 'adhesives', description: 'Polymer modified tile adhesives, bond adhesives, and wood working glue.', iconName: 'Droplet', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', order: 15, isActive: true },
  { _id: 'cat-16', name: 'Waterproofing', slug: 'waterproofing', description: 'Bituminous coatings, elastomeric liquid membranes, and chemical roof sealants.', iconName: 'Shield', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', order: 16, isActive: true },
  { _id: 'cat-17', name: 'Construction Chemicals', slug: 'construction-chemicals', description: 'Concrete plasticizers, curing compounds, shuttering oils, and grouts.', iconName: 'FlaskConical', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', order: 17, isActive: true },
  { _id: 'cat-18', name: 'Roofing Materials', slug: 'roofing-materials', description: 'Corrugated GI sheets, fiberglass sheets, thermal insulation, and roof tiles.', iconName: 'Home', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', order: 18, isActive: true },
  { _id: 'cat-19', name: 'Doors & Windows', slug: 'doors-windows', description: 'Iron safety grilles, aluminum sections, door frames, and accessories.', iconName: 'DoorClosed', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', order: 19, isActive: true },
  { _id: 'cat-20', name: 'Safety Equipment', slug: 'safety-equipment', description: 'Construction helmets, heavy-duty safety gloves, goggles, and safety boots.', iconName: 'HardHat', image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80', order: 20, isActive: true }
];

export const defaultBrands: IBrand[] = [
  { _id: 'brand-1', name: 'DG Khan', slug: 'dg-khan', description: 'Renowned high-strength Portland cement manufacturing.', isActive: true },
  { _id: 'brand-2', name: 'Bestway', slug: 'bestway', description: 'Premium building cement and construction binders.', isActive: true },
  { _id: 'brand-3', name: 'Maple Leaf', slug: 'maple-leaf', description: 'High quality grey and white Portland cement.', isActive: true },
  { _id: 'brand-4', name: 'Lucky Cement', slug: 'lucky-cement', description: 'Durable construction cement for civil structures.', isActive: true },
  { _id: 'brand-5', name: 'Fauji', slug: 'fauji', description: 'Consistent quality cement for infrastructure.', isActive: true },
  { _id: 'brand-6', name: 'Mughal Steel', slug: 'mughal-steel', description: 'Engineered Grade 60 and Grade 40 deformed steel rebars.', isActive: true },
  { _id: 'brand-7', name: 'Master', slug: 'master', description: 'Sanitary fittings, tiles, and luxury bathroom ware.', isActive: true },
  { _id: 'brand-8', name: 'Berger', slug: 'berger', description: 'Architectural decorative coatings and exterior weather paints.', isActive: true },
  { _id: 'brand-9', name: 'Nippon', slug: 'nippon', description: 'Japanese technology paints, primers and protective finishes.', isActive: true },
  { _id: 'brand-10', name: 'Popular', slug: 'popular', description: 'PVC, UPVC and PPR pipes and precision fittings.', isActive: true },
  { _id: 'brand-11', name: 'Dadex', slug: 'dadex', description: 'Heavy-duty construction pipes, drainage and roofing systems.', isActive: true },
  { _id: 'brand-12', name: 'Fast Cables', slug: 'fast-cables', description: '99.9% pure copper electrical wires and cables.', isActive: true },
  { _id: 'brand-13', name: 'Pakistan Cables', slug: 'pakistan-cables', description: 'Certified copper conductor wires and industrial conduits.', isActive: true },
  { _id: 'brand-14', name: 'Stanley', slug: 'stanley', description: 'Professional hand tools, measuring tapes, and hardware.', isActive: true },
  { _id: 'brand-15', name: 'Total', slug: 'total', description: 'Industrial power tools, cutting tools, and masonry gear.', isActive: true },
  { _id: 'brand-16', name: 'Ingco', slug: 'ingco', description: 'High performance power tools and contractor hand equipment.', isActive: true }
];
