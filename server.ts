import compression from 'compression';
import Database from 'better-sqlite3';
import express, { type Request, type Response, type NextFunction } from 'express';
import { randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type TicketType = 'camping' | 'visitor' | 'supporter';

interface TicketRow {
  id: number;
  name: string;
  email: string;
  type: TicketType;
  serial: string;
  revolut_user: string | null;
  created_at: string;
}

interface WaitlistRow {
  id: number;
  email: string;
  created_at: string;
}

interface ContentBlockRow {
  key: string;
  page: string;
  label: string;
  value: string;
  field_type: 'text' | 'textarea';
  updated_at: string;
}

interface GalleryItemRow {
  id: number;
  title: string;
  image_url: string;
  tilt: string;
  sort_order: number;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT || 3000);
const dbPath = process.env.SQLITE_PATH || path.join(__dirname, 'data', 'tickets.sqlite');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('temp_store = MEMORY');
db.pragma('cache_size = -20000');
db.pragma('mmap_size = 268435456');
db.pragma('busy_timeout = 5000');

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('camping', 'visitor', 'supporter')),
    serial TEXT NOT NULL UNIQUE,
    revolut_user TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tickets_email_created_at
    ON tickets(email, created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_tickets_type_created_at
    ON tickets(type, created_at DESC);

  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS content_blocks (
    key TEXT PRIMARY KEY,
    page TEXT NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    field_type TEXT NOT NULL DEFAULT 'text' CHECK (field_type IN ('text', 'textarea')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_content_blocks_page
    ON content_blocks(page, key);

  CREATE TABLE IF NOT EXISTS gallery_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tilt TEXT NOT NULL DEFAULT 'rotate-1 translate-y-1',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_gallery_items_active_order
    ON gallery_items(is_active, sort_order, id);
`);

db.pragma('optimize');

const defaultContentBlocks = [
  ['home.hero.title_1', 'Kezdőlap', 'Hero főcím 1. sor', 'BUDAFOKI', 'text'],
  ['home.hero.title_2', 'Kezdőlap', 'Hero főcím 2. sor', 'SÁTRAS CIGÁNYOK', 'text'],
  ['home.hero.subtitle', 'Kezdőlap', 'Hero alcím', 'Duna Party Fesztivál', 'text'],
  ['tickets.header.title', 'Jegyek', 'Jegyoldal címe', '★ JEGYEK ★', 'text'],
  ['tickets.header.description', 'Jegyek', 'Jegyoldal bevezető', 'A fesztivál látogatása mindenki számára ingyenes, de a kempinghelyek korlátozott száma miatt regisztrációhoz kötött. Igényeld meg a saját névre szóló digitális belépődet egy perc alatt!', 'textarea'],
  ['program.header.title', 'Program', 'Program oldal címe', '★ FESZTIVÁL PROGRAM ★', 'text'],
  ['program.header.description', 'Program', 'Program oldal bevezető', 'Nézd meg, mi vár rád a 3 napos őrület alatt! Koncertek a parton, gasztro élmények a tábortűznél, és közös programok egész délután.', 'textarea'],
  ['location.header.title', 'Helyszín', 'Helyszín oldal címe', '★ UTICÉL & HELYSZÍN ★', 'text'],
  ['location.header.description', 'Helyszín', 'Helyszín oldal bevezető', 'A II. Budafoki Sátras Cigányok Fesztivál közvetlenül a vadregényes kavicsos Duna-parton kerül megrendezésre. Nézd meg az interaktív térképet és a megközelítési módokat!', 'textarea'],
  ['gallery.header.title', 'Galéria', 'Galéria oldal címe', '★ FOTÓALBUM & HANGULAT ★', 'text'],
  ['gallery.header.description', 'Galéria', 'Galéria oldal bevezető', 'Lapozd át a tavalyi kempingezés és az előkészületek legmelegebb, analóg hangulatú polaroid képeit! Itt nincsenek mesterséges effektek, csak tiszta nevetés és a természet közelsége.', 'textarea'],
  ['contact.header.title', 'Kapcsolat', 'Kapcsolat oldal címe', 'KAPCSOLAT & INFÓ', 'text'],
  ['contact.header.description', 'Kapcsolat', 'Kapcsolat oldal bevezető', 'Kérdésed van a jegyekkel kapcsolatban? Szeretnél fellépni, főzni vagy önkéntesként segíteni a tábor építésében? Írj nekünk bátran, és válaszolunk amilyen gyorsan csak tudunk!', 'textarea'],
] as const;

const seedContentBlock = db.prepare(`
  INSERT INTO content_blocks (key, page, label, value, field_type)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(key) DO NOTHING
`);

for (const block of defaultContentBlocks) {
  seedContentBlock.run(...block);
}

const defaultGalleryItems = [
  ['Dunaparti Chill 🌊', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&fm=webp&w=600&q=72', '-rotate-2 translate-y-1', 10],
  ['Fesztivál Sátortábor ⛺', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&fm=webp&w=600&q=72', 'rotate-3 -translate-y-1', 20],
  ['Meleg Fényfüzérek 💡', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&fm=webp&w=600&q=72', '-rotate-1 translate-y-2', 30],
  ['Duna-parti Naplemente 🌅', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&fm=webp&w=600&q=72', 'rotate-2 translate-y-0', 40],
  ['Bogrács Vacsora 🔥', 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&fm=webp&w=600&q=72', '-rotate-3 -translate-y-2', 50],
  ['Haverok & Buli 🍻', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&fm=webp&w=600&q=72', 'rotate-1 translate-y-1', 60],
] as const;

const galleryCount = db.prepare('SELECT COUNT(*) AS count FROM gallery_items').get() as { count: number };
if (galleryCount.count === 0) {
  const seedGalleryItem = db.prepare(`
    INSERT INTO gallery_items (title, image_url, tilt, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  const seedGallery = db.transaction(() => {
    for (const item of defaultGalleryItems) {
      seedGalleryItem.run(...item);
    }
  });
  seedGallery();
}

const insertTicket = db.prepare(`
  INSERT INTO tickets (name, email, type, serial, revolut_user)
  VALUES (@name, @email, @type, @serial, @revolutUser)
`);
const insertWaitlistEmail = db.prepare(`
  INSERT INTO waitlist (email)
  VALUES (?)
  ON CONFLICT(email) DO NOTHING
`);
const getTicketBySerial = db.prepare('SELECT * FROM tickets WHERE serial = ?');
const deleteTicketBySerial = db.prepare('DELETE FROM tickets WHERE serial = ?');
const getTicketById = db.prepare('SELECT * FROM tickets WHERE id = ?');
const updateTicketById = db.prepare(`
  UPDATE tickets
  SET name = @name,
      email = @email,
      type = @type,
      revolut_user = @revolutUser
  WHERE id = @id
`);
const deleteTicketById = db.prepare('DELETE FROM tickets WHERE id = ?');
const getContentBlocks = db.prepare('SELECT * FROM content_blocks ORDER BY page COLLATE NOCASE, key COLLATE NOCASE');
const updateContentBlock = db.prepare(`
  UPDATE content_blocks
  SET value = ?, updated_at = datetime('now')
  WHERE key = ?
`);
const getPublicGalleryItems = db.prepare(`
  SELECT * FROM gallery_items
  WHERE is_active = 1
  ORDER BY sort_order ASC, id ASC
`);
const getAdminGalleryItems = db.prepare('SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC');
const getGalleryItemById = db.prepare('SELECT * FROM gallery_items WHERE id = ?');
const insertGalleryItem = db.prepare(`
  INSERT INTO gallery_items (title, image_url, tilt, sort_order, is_active)
  VALUES (@title, @imageUrl, @tilt, @sortOrder, @isActive)
`);
const updateGalleryItemById = db.prepare(`
  UPDATE gallery_items
  SET title = @title,
      image_url = @imageUrl,
      tilt = @tilt,
      sort_order = @sortOrder,
      is_active = @isActive,
      updated_at = datetime('now')
  WHERE id = @id
`);
const deleteGalleryItemById = db.prepare('DELETE FROM gallery_items WHERE id = ?');

function toClientTicket(row: TicketRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    type: row.type,
    serial: row.serial,
    date: new Intl.DateTimeFormat('hu-HU').format(new Date(`${row.created_at}Z`)),
    revolutUser: row.revolut_user || undefined,
  };
}

function toClientWaitlist(row: WaitlistRow) {
  return {
    id: row.id,
    email: row.email,
    date: new Intl.DateTimeFormat('hu-HU').format(new Date(`${row.created_at}Z`)),
  };
}

function toClientContentBlock(row: ContentBlockRow) {
  return {
    key: row.key,
    page: row.page,
    label: row.label,
    value: row.value,
    fieldType: row.field_type,
    updatedAt: row.updated_at,
  };
}

function toClientGalleryItem(row: GalleryItemRow) {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    tilt: row.tilt,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    updatedAt: row.updated_at,
  };
}

function getCookie(req: Request, name: string) {
  const cookies = req.headers.cookie?.split(';') || [];
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }
  return '';
}

function setActiveTicketCookie(res: Response, serial: string) {
  res.cookie('bsc_active_ticket', serial, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !isDev,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
}

function generateSerial(type: TicketType) {
  return `BSC-2026-${type.substring(0, 3).toUpperCase()}-${randomInt(1000, 10000)}`;
}

function validateTicketPayload(body: unknown) {
  const payload = body as Record<string, unknown>;
  const name = String(payload.name || '').trim().replace(/\s+/g, ' ');
  const email = String(payload.email || '').trim().toLowerCase();
  const type = String(payload.type || '') as TicketType;
  const revolutUser = String(payload.revolutUser || '').trim();
  const revolutConfirmed = Boolean(payload.revolutConfirmed);

  if (name.length < 3) {
    return { error: 'Kérjük, adj meg egy valódi nevet (legalább 3 karakter)!' };
  }
  if (name.length > 80) {
    return { error: 'A név legfeljebb 80 karakter lehet.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Kérjük, érvényes e-mail címet adj meg!' };
  }
  if (!['camping', 'visitor', 'supporter'].includes(type)) {
    return { error: 'Ismeretlen jegytípus.' };
  }
  if (type === 'supporter' && revolutUser.length < 3) {
    return { error: 'Támogatói jegyhez kérjük add meg a küldő Revolut @nevét vagy a tranzakció azonosítót!' };
  }
  if (type === 'supporter' && !revolutConfirmed) {
    return { error: 'Kérjük, jelöld be, hogy elutaltad az 5.000 Ft-ot Revoluton!' };
  }

  return {
    value: {
      name,
      email,
      type,
      revolutUser: type === 'supporter' ? revolutUser.slice(0, 120) : null,
    },
  };
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    next();
    return;
  }

  const authHeader = req.headers.authorization || '';
  const headerToken = req.headers['x-admin-token'];
  const providedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : String(headerToken || '');

  if (providedToken !== token) {
    res.status(401).json({ error: 'Admin jogosultság szükséges.' });
    return;
  }

  next();
}

function validateGalleryPayload(body: unknown) {
  const payload = body as Record<string, unknown>;
  const title = String(payload.title || '').trim();
  const imageUrl = String(payload.imageUrl || '').trim();
  const tilt = String(payload.tilt || 'rotate-1 translate-y-1').trim();
  const sortOrder = Number(payload.sortOrder || 0);
  const isActive = Boolean(payload.isActive);

  if (title.length < 2) {
    return { error: 'A kép címe legalább 2 karakter legyen.' };
  }
  if (!/^https?:\/\/.+/i.test(imageUrl) && !imageUrl.startsWith('/')) {
    return { error: 'Adj meg érvényes kép URL-t.' };
  }
  if (!Number.isFinite(sortOrder)) {
    return { error: 'A sorrend mező csak szám lehet.' };
  }

  return {
    value: {
      title: title.slice(0, 120),
      imageUrl,
      tilt: tilt.slice(0, 80),
      sortOrder,
      isActive: isActive ? 1 : 0,
    },
  };
}

const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '32kb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/tickets/active', (req, res) => {
  const serial = getCookie(req, 'bsc_active_ticket');
  if (!serial) {
    res.status(404).json({ error: 'Nincs aktív jegy.' });
    return;
  }

  const ticket = getTicketBySerial.get(serial) as TicketRow | undefined;
  if (!ticket) {
    res.clearCookie('bsc_active_ticket');
    res.status(404).json({ error: 'Nincs aktív jegy.' });
    return;
  }

  res.json({ ticket: toClientTicket(ticket) });
});

app.post('/api/tickets', (req, res) => {
  const validation = validateTicketPayload(req.body);
  if ('error' in validation) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const payload = validation.value;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const serial = generateSerial(payload.type);
    try {
      insertTicket.run({ ...payload, serial });
      const ticket = getTicketBySerial.get(serial) as TicketRow;
      setActiveTicketCookie(res, serial);
      res.status(201).json({ ticket: toClientTicket(ticket) });
      return;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('UNIQUE')) {
        throw error;
      }
    }
  }

  res.status(503).json({ error: 'Nem sikerült egyedi jegyszámot generálni, kérjük próbáld újra.' });
});

app.post('/api/waitlist', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Kérjük, érvényes e-mail címet adj meg!' });
    return;
  }

  insertWaitlistEmail.run(email);
  res.status(201).json({ ok: true });
});

app.get('/api/content', (_req, res) => {
  const blocks = getContentBlocks.all() as ContentBlockRow[];
  res.json({
    content: Object.fromEntries(blocks.map((block) => [block.key, block.value])),
  });
});

app.get('/api/gallery', (_req, res) => {
  const items = getPublicGalleryItems.all() as GalleryItemRow[];
  res.json({ items: items.map(toClientGalleryItem) });
});

app.get('/api/admin/overview', requireAdmin, (_req, res) => {
  const totals = db.prepare(`
    SELECT
      COUNT(*) AS totalTickets,
      SUM(CASE WHEN type = 'camping' THEN 1 ELSE 0 END) AS campingTickets,
      SUM(CASE WHEN type = 'visitor' THEN 1 ELSE 0 END) AS visitorTickets,
      SUM(CASE WHEN type = 'supporter' THEN 1 ELSE 0 END) AS supporterTickets,
      (SELECT COUNT(*) FROM waitlist) AS waitlistTotal,
      (SELECT COUNT(*) FROM gallery_items) AS galleryTotal
    FROM tickets
  `).get() as Record<string, number | null>;

  res.json({
    totalTickets: totals.totalTickets || 0,
    campingTickets: totals.campingTickets || 0,
    visitorTickets: totals.visitorTickets || 0,
    supporterTickets: totals.supporterTickets || 0,
    waitlistTotal: totals.waitlistTotal || 0,
    galleryTotal: totals.galleryTotal || 0,
  });
});

app.get('/api/admin/tickets', requireAdmin, (req, res) => {
  const search = String(req.query.search || '').trim();
  const type = String(req.query.type || 'all');
  const filters: string[] = [];
  const params: Record<string, string | number> = {};

  if (search) {
    filters.push('(name LIKE @search OR email LIKE @search OR serial LIKE @search OR revolut_user LIKE @search)');
    params.search = `%${search}%`;
  }

  if (['camping', 'visitor', 'supporter'].includes(type)) {
    filters.push('type = @type');
    params.type = type;
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const tickets = db.prepare(`
    SELECT * FROM tickets
    ${where}
    ORDER BY created_at DESC, id DESC
    LIMIT 500
  `).all(params) as TicketRow[];

  res.json({ tickets: tickets.map(toClientTicket) });
});

app.put('/api/admin/tickets/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Érvénytelen jegy azonosító.' });
    return;
  }

  const validation = validateTicketPayload({
    ...req.body,
    revolutConfirmed: req.body?.type === 'supporter' ? true : req.body?.revolutConfirmed,
  });
  if ('error' in validation) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const currentTicket = getTicketById.get(id) as TicketRow | undefined;
  if (!currentTicket) {
    res.status(404).json({ error: 'Nem található ilyen jegy.' });
    return;
  }

  updateTicketById.run({ ...validation.value, id });
  const updatedTicket = getTicketById.get(id) as TicketRow;
  res.json({ ticket: toClientTicket(updatedTicket) });
});

app.delete('/api/admin/tickets/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Érvénytelen jegy azonosító.' });
    return;
  }

  deleteTicketById.run(id);
  res.status(204).end();
});

app.get('/api/admin/waitlist', requireAdmin, (_req, res) => {
  const waitlist = db.prepare('SELECT * FROM waitlist ORDER BY created_at DESC, id DESC LIMIT 500').all() as WaitlistRow[];
  res.json({ waitlist: waitlist.map(toClientWaitlist) });
});

app.delete('/api/admin/waitlist/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Érvénytelen feliratkozó azonosító.' });
    return;
  }

  db.prepare('DELETE FROM waitlist WHERE id = ?').run(id);
  res.status(204).end();
});

app.get('/api/admin/content', requireAdmin, (_req, res) => {
  const blocks = getContentBlocks.all() as ContentBlockRow[];
  res.json({ blocks: blocks.map(toClientContentBlock) });
});

app.put('/api/admin/content/:key', requireAdmin, (req, res) => {
  const key = String(req.params.key || '');
  const value = String(req.body?.value || '').trim();
  const block = db.prepare('SELECT * FROM content_blocks WHERE key = ?').get(key) as ContentBlockRow | undefined;

  if (!block) {
    res.status(404).json({ error: 'Nem található ilyen tartalomblokk.' });
    return;
  }

  if (!value) {
    res.status(400).json({ error: 'A mező nem lehet üres.' });
    return;
  }

  updateContentBlock.run(value, key);
  const updatedBlock = db.prepare('SELECT * FROM content_blocks WHERE key = ?').get(key) as ContentBlockRow;
  res.json({ block: toClientContentBlock(updatedBlock) });
});

app.get('/api/admin/gallery', requireAdmin, (_req, res) => {
  const items = getAdminGalleryItems.all() as GalleryItemRow[];
  res.json({ items: items.map(toClientGalleryItem) });
});

app.post('/api/admin/gallery', requireAdmin, (req, res) => {
  const validation = validateGalleryPayload(req.body);
  if ('error' in validation) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const result = insertGalleryItem.run(validation.value);
  const item = getGalleryItemById.get(result.lastInsertRowid) as GalleryItemRow;
  res.status(201).json({ item: toClientGalleryItem(item) });
});

app.put('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Érvénytelen kép azonosító.' });
    return;
  }

  const validation = validateGalleryPayload(req.body);
  if ('error' in validation) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const currentItem = getGalleryItemById.get(id) as GalleryItemRow | undefined;
  if (!currentItem) {
    res.status(404).json({ error: 'Nem található ilyen galéria kép.' });
    return;
  }

  updateGalleryItemById.run({ ...validation.value, id });
  const item = getGalleryItemById.get(id) as GalleryItemRow;
  res.json({ item: toClientGalleryItem(item) });
});

app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Érvénytelen kép azonosító.' });
    return;
  }

  deleteGalleryItemById.run(id);
  res.status(204).end();
});

app.delete('/api/tickets/active', (req, res) => {
  const serial = getCookie(req, 'bsc_active_ticket');
  if (serial) {
    deleteTicketBySerial.run(serial);
  }
  res.clearCookie('bsc_active_ticket');
  res.status(204).end();
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Szerverhiba történt, kérjük próbáld újra.' });
});

if (isDev) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(
    express.static(distPath, {
      etag: true,
      immutable: true,
      maxAge: '1y',
      setHeaders(res, filePath) {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    }),
  );
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  console.log(`SQLite database: ${dbPath}`);
});
