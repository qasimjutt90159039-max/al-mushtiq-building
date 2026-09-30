import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = path.resolve(process.cwd(), 'public/images/products');
const heroDir = path.resolve(process.cwd(), 'public/images/hero');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });

const images = [
  // CEMENT & CONCRETE
  {
    name: 'cement_bag_real.jpg',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'cement_stack_real.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=85'
  },
  // BRICKS & BLOCKS
  {
    name: 'bricks_real.jpg',
    url: 'https://images.unsplash.com/photo-1584463699028-2d3345d3121a?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'wire_cut_bricks_real.jpg',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'concrete_blocks_real.jpg',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'pavers_real.jpg',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=85'
  },
  // STEEL & IRON
  {
    name: 'steel_rebar_real.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'steel_beams_real.jpg',
    url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'gi_sheet_real.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'binding_wire_real.jpg',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=85'
  },
  // SAND & AGGREGATES
  {
    name: 'sand_chenab_real.jpg',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'crush_margalla_real.jpg',
    url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'gravel_real.jpg',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=85'
  },
  // TILES & FLOORING
  {
    name: 'tiles_marble_real.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'tiles_slate_real.jpg',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'tiles_wood_real.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'tiles_subway_real.jpg',
    url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'tiles_outdoor_real.jpg',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=85'
  },
  // PAINTS
  {
    name: 'paint_bucket_real.jpg',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'paint_roller_real.jpg',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'paint_swatches_real.jpg',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=85'
  },
  // PLUMBING
  {
    name: 'pvc_pipe_real.jpg',
    url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'ppr_pipe_real.jpg',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'brass_valve_real.jpg',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'water_tap_real.jpg',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=85'
  },
  // ELECTRICAL
  {
    name: 'copper_wire_real.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'switch_plate_real.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'circuit_breaker_real.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=85'
  },
  // HARDWARE & TOOLS
  {
    name: 'claw_hammer_real.jpg',
    url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'screwdriver_set_real.jpg',
    url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'wrench_real.jpg',
    url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'tape_measure_real.jpg',
    url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'drill_bits_real.jpg',
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'wire_nails_real.jpg',
    url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'door_lock_real.jpg',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'brass_padlock_real.jpg',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'safety_helmet_real.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'water_tank_real.jpg',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=85'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting download of ${images.length} real product photographs...`);
  for (const img of images) {
    const dest = path.join(outDir, img.name);
    try {
      await downloadFile(img.url, dest);
      console.log(`Downloaded: ${img.name}`);
    } catch (err) {
      console.error(`Error downloading ${img.name}:`, err.message);
    }
  }

  // Also download real hero construction site photo
  const heroDest = path.join(heroDir, 'hero_construction_real.jpg');
  try {
    await downloadFile('https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=1400&auto=format&fit=crop&q=90', heroDest);
    console.log(`Downloaded: hero_construction_real.jpg`);
  } catch (err) {
    console.error('Error downloading hero photo:', err.message);
  }

  console.log('All real photos downloaded successfully!');
}

run();
