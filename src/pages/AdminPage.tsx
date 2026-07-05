import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Check,
  ClipboardList,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Inbox,
  Loader2,
  Mail,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { invalidateContentCache } from '../hooks/useContent';

type TicketType = 'camping' | 'visitor' | 'supporter';
type AdminTab = 'tickets' | 'content' | 'gallery' | 'waitlist';

interface AdminTicket {
  id: number;
  name: string;
  email: string;
  type: TicketType;
  serial: string;
  date: string;
  revolutUser?: string;
}

interface Overview {
  totalTickets: number;
  campingTickets: number;
  visitorTickets: number;
  supporterTickets: number;
  waitlistTotal: number;
  galleryTotal: number;
}

interface ContentBlock {
  key: string;
  page: string;
  label: string;
  value: string;
  fieldType: 'text' | 'textarea';
  updatedAt: string;
}

interface WaitlistItem {
  id: number;
  email: string;
  date: string;
}

interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  tilt: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
}

const blankGalleryItem: Omit<GalleryItem, 'id' | 'updatedAt'> = {
  title: '',
  imageUrl: '',
  tilt: 'rotate-1 translate-y-1',
  sortOrder: 100,
  isActive: true,
};

const ticketLabels: Record<TicketType, string> = {
  camping: 'Sátorozó',
  visitor: 'Napi látogató',
  supporter: 'Támogatói',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('tickets');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState(blankGalleryItem);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingTicket, setEditingTicket] = useState<AdminTicket | null>(null);
  const [draftBlocks, setDraftBlocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | number | null>(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('bsc_admin_token') || '');

  const adminFetch = (url: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (adminToken) {
      headers.set('x-admin-token', adminToken);
    }

    return fetch(url, { ...init, headers });
  };

  const loadOverview = async () => {
    const response = await adminFetch('/api/admin/overview');
    if (!response.ok) throw new Error('Nem sikerült betölteni a statisztikákat.');
    setOverview(await response.json());
  };

  const loadTickets = async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (typeFilter !== 'all') params.set('type', typeFilter);

    const response = await adminFetch(`/api/admin/tickets?${params.toString()}`);
    if (!response.ok) throw new Error('Nem sikerült betölteni a jegyeket.');
    const data = await response.json();
    setTickets(data.tickets);
  };

  const loadContent = async () => {
    const response = await adminFetch('/api/admin/content');
    if (!response.ok) throw new Error('Nem sikerült betölteni a tartalmakat.');
    const data = await response.json();
    setContentBlocks(data.blocks);
    setDraftBlocks(Object.fromEntries(data.blocks.map((block: ContentBlock) => [block.key, block.value])));
  };

  const loadGallery = async () => {
    const response = await adminFetch('/api/admin/gallery');
    if (!response.ok) throw new Error('Nem sikerült betölteni a galériát.');
    const data = await response.json();
    setGalleryItems(data.items);
    const maxSort = data.items.reduce((max: number, item: GalleryItem) => Math.max(max, item.sortOrder), 0);
    setNewGalleryItem((draft) => ({ ...draft, sortOrder: maxSort + 10 }));
  };

  const loadWaitlist = async () => {
    const response = await adminFetch('/api/admin/waitlist');
    if (!response.ok) throw new Error('Nem sikerült betölteni a feliratkozókat.');
    const data = await response.json();
    setWaitlist(data.waitlist);
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadOverview(), loadTickets(), loadContent(), loadGallery(), loadWaitlist()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen admin hiba történt.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadTickets().catch((err) => setError(err instanceof Error ? err.message : 'Nem sikerült frissíteni a jegyeket.'));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, typeFilter]);

  const groupedBlocks = useMemo(() => {
    return contentBlocks.reduce<Record<string, ContentBlock[]>>((groups, block) => {
      groups[block.page] = groups[block.page] || [];
      groups[block.page].push(block);
      return groups;
    }, {});
  }, [contentBlocks]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const saveTicket = async () => {
    if (!editingTicket) return;
    setSavingId(editingTicket.id);
    setError('');

    try {
      const response = await adminFetch(`/api/admin/tickets/${editingTicket.id}`, {
        method: 'PUT',
        body: JSON.stringify(editingTicket),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Nem sikerült menteni a jegyet.');

      setTickets((current) => current.map((ticket) => (ticket.id === data.ticket.id ? data.ticket : ticket)));
      setEditingTicket(null);
      await loadOverview();
      showToast('Jegy mentve az adatbázisba.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mentési hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteTicket = async (ticket: AdminTicket) => {
    if (!window.confirm(`Törlöd ezt a jegyet?\n${ticket.name} - ${ticket.serial}`)) return;
    setSavingId(ticket.id);
    setError('');

    try {
      const response = await adminFetch(`/api/admin/tickets/${ticket.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Nem sikerült törölni a jegyet.');

      setTickets((current) => current.filter((item) => item.id !== ticket.id));
      await loadOverview();
      showToast('Jegy törölve.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Törlési hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const saveContentBlock = async (block: ContentBlock) => {
    setSavingId(block.key);
    setError('');

    try {
      const response = await adminFetch(`/api/admin/content/${encodeURIComponent(block.key)}`, {
        method: 'PUT',
        body: JSON.stringify({ value: draftBlocks[block.key] }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Nem sikerült menteni a tartalmat.');

      setContentBlocks((current) => current.map((item) => (item.key === block.key ? data.block : item)));
      invalidateContentCache();
      showToast('Tartalom mentve az adatbázisba.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tartalom mentési hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteWaitlistItem = async (item: WaitlistItem) => {
    if (!window.confirm(`Törlöd a feliratkozót?\n${item.email}`)) return;
    setSavingId(`waitlist-${item.id}`);

    try {
      const response = await adminFetch(`/api/admin/waitlist/${item.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Nem sikerült törölni a feliratkozót.');

      setWaitlist((current) => current.filter((entry) => entry.id !== item.id));
      await loadOverview();
      showToast('Feliratkozó törölve.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Törlési hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const saveGalleryItem = async (item: GalleryItem) => {
    setSavingId(`gallery-${item.id}`);
    setError('');

    try {
      const response = await adminFetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Nem sikerült menteni a képet.');

      setGalleryItems((current) => current.map((entry) => (entry.id === item.id ? data.item : entry)));
      await loadOverview();
      showToast('Galéria kép mentve.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Galéria mentési hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const createGalleryItem = async () => {
    setSavingId('gallery-new');
    setError('');

    try {
      const response = await adminFetch('/api/admin/gallery', {
        method: 'POST',
        body: JSON.stringify(newGalleryItem),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Nem sikerült létrehozni a képet.');

      setGalleryItems((current) => [...current, data.item].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id));
      setNewGalleryItem({ ...blankGalleryItem, sortOrder: data.item.sortOrder + 10 });
      await loadOverview();
      showToast('Új galéria kép hozzáadva.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Galéria létrehozási hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteGalleryItem = async (item: GalleryItem) => {
    if (!window.confirm(`Törlöd ezt a képet?\n${item.title}`)) return;
    setSavingId(`gallery-${item.id}`);
    setError('');

    try {
      const response = await adminFetch(`/api/admin/gallery/${item.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Nem sikerült törölni a képet.');

      setGalleryItems((current) => current.filter((entry) => entry.id !== item.id));
      await loadOverview();
      showToast('Galéria kép törölve.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Galéria törlési hiba történt.');
    } finally {
      setSavingId(null);
    }
  };

  const statCards = [
    { label: 'Összes jegy', value: overview?.totalTickets || 0, icon: Ticket, tone: 'bg-[#EAF7F8] text-turquoise' },
    { label: 'Sátorozó', value: overview?.campingTickets || 0, icon: Users, tone: 'bg-[#FFF4DD] text-darkbrown' },
    { label: 'Támogatói', value: overview?.supporterTickets || 0, icon: ShieldCheck, tone: 'bg-[#FCECE3] text-orange' },
    { label: 'Galéria képek', value: overview?.galleryTotal || 0, icon: ImageIcon, tone: 'bg-[#EEF2E6] text-olive' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1E6] text-darkbrown">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-darkbrown/10 bg-[#FFFDF6] px-5 py-6">
          <div className="mb-8">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-darkbrown text-cream">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-retro text-xl uppercase leading-tight">Admin központ</h1>
            <p className="mt-2 text-xs font-bold text-darkbrown/55">Jegyek, tartalmak és feliratkozók DB-alapú kezelése.</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'tickets', label: 'Jegyek', icon: Ticket },
              { id: 'content', label: 'Oldalak szerkesztése', icon: FileText },
              { id: 'gallery', label: 'Galéria', icon: ImageIcon },
              { id: 'waitlist', label: 'Feliratkozók', icon: Inbox },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                    isActive ? 'bg-darkbrown text-cream shadow-sm' : 'text-darkbrown/70 hover:bg-darkbrown/5 hover:text-darkbrown'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange">II. Budafoki Sátras Cigányok</p>
              <h2 className="mt-1 font-retro text-2xl uppercase leading-tight sm:text-3xl">Vezérlőpult</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={adminToken}
                onChange={(event) => {
                  setAdminToken(event.target.value);
                  localStorage.setItem('bsc_admin_token', event.target.value);
                }}
                placeholder="Admin token"
                className="h-10 w-full rounded-xl border border-darkbrown/15 bg-white px-3 text-xs font-bold outline-none transition focus:border-orange sm:w-40"
              />
              <div className="flex rounded-xl border border-darkbrown/10 bg-cream p-1 lg:hidden">
                {[
                  { id: 'tickets', label: 'Jegyek' },
                  { id: 'content', label: 'Oldalak' },
                  { id: 'gallery', label: 'Galéria' },
                  { id: 'waitlist', label: 'Lista' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`rounded-lg px-3 py-2 text-xs font-black ${activeTab === item.id ? 'bg-darkbrown text-cream' : 'text-darkbrown/65'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                onClick={loadAll}
                className="inline-flex items-center gap-2 rounded-xl border border-darkbrown/15 bg-white px-4 py-2 text-xs font-black text-darkbrown transition hover:bg-cream"
              >
                <RefreshCcw className="h-4 w-4" />
                Frissítés
              </button>
            </div>
          </header>

          {toast && (
            <div className="fixed right-4 top-4 z-[9999] flex items-center gap-2 rounded-xl bg-olive px-4 py-3 text-xs font-black text-cream shadow-lg">
              <Check className="h-4 w-4" />
              {toast}
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              <span>{error}</span>
              <button onClick={() => setError('')} aria-label="Hiba bezárása">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <section className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm">
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black tabular-nums">{card.value}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-wider text-darkbrown/45">{card.label}</p>
                </div>
              );
            })}
          </section>

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-darkbrown/10 bg-[#FFFDF6]">
              <Loader2 className="h-7 w-7 animate-spin text-orange" />
            </div>
          ) : (
            <>
              {activeTab === 'tickets' && (
                <section className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-darkbrown/10 p-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <h3 className="font-retro text-xl uppercase">Jegyek kezelése</h3>
                      <p className="mt-1 text-xs font-bold text-darkbrown/55">Keresés, szerkesztés, támogatói adatok és törlés.</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-darkbrown/40" />
                        <input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Név, e-mail, sorszám..."
                          className="h-11 w-full rounded-xl border border-darkbrown/15 bg-white pl-9 pr-3 text-sm font-bold outline-none transition focus:border-orange sm:w-72"
                        />
                      </div>
                      <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                        className="h-11 rounded-xl border border-darkbrown/15 bg-white px-3 text-sm font-black outline-none transition focus:border-orange"
                      >
                        <option value="all">Minden típus</option>
                        <option value="camping">Sátorozó</option>
                        <option value="visitor">Napi látogató</option>
                        <option value="supporter">Támogatói</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-darkbrown/10 bg-cream/60 text-[10px] font-black uppercase tracking-widest text-darkbrown/50">
                        <tr>
                          <th className="px-4 py-3">Vendég</th>
                          <th className="px-4 py-3">Jegy</th>
                          <th className="px-4 py-3">Sorszám</th>
                          <th className="px-4 py-3">Revolut</th>
                          <th className="px-4 py-3">Dátum</th>
                          <th className="px-4 py-3 text-right">Művelet</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-darkbrown/10">
                        {tickets.map((ticket) => (
                          <tr key={ticket.id} className="align-top hover:bg-cream/40">
                            <td className="px-4 py-4">
                              <p className="font-black">{ticket.name}</p>
                              <p className="mt-1 text-xs font-bold text-darkbrown/50">{ticket.email}</p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="rounded-full bg-darkbrown px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cream">
                                {ticketLabels[ticket.type]}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-mono text-xs font-black">{ticket.serial}</td>
                            <td className="px-4 py-4 text-xs font-bold text-darkbrown/65">{ticket.revolutUser || '-'}</td>
                            <td className="px-4 py-4 text-xs font-bold text-darkbrown/65">{ticket.date}</td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingTicket(ticket)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-turquoise/10 text-turquoise transition hover:bg-turquoise hover:text-cream"
                                  aria-label="Jegy szerkesztése"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteTicket(ticket)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                                  aria-label="Jegy törlése"
                                >
                                  {savingId === ticket.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!tickets.length && <EmptyState title="Nincs találat" text="Próbálj más keresést vagy jegytípust." />}
                  </div>
                </section>
              )}

              {activeTab === 'content' && (
                <section className="space-y-4">
                  <div className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm">
                    <h3 className="font-retro text-xl uppercase">Oldalak szerkesztése</h3>
                    <p className="mt-1 text-xs font-bold text-darkbrown/55">
                      Ezek a mezők adatbázisban élnek. Újabb oldalmezők ugyanebbe a rendszerbe köthetők.
                    </p>
                  </div>

                  {(Object.entries(groupedBlocks) as Array<[string, ContentBlock[]]>).map(([page, blocks]) => (
                    <div key={page} className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 font-retro text-lg uppercase">
                        <ClipboardList className="h-5 w-5 text-orange" />
                        {page}
                      </h4>
                      <div className="grid gap-4 xl:grid-cols-2">
                        {blocks.map((block) => (
                          <div key={block.key} className="rounded-xl border border-darkbrown/10 bg-white p-4">
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-darkbrown/55">{block.label}</label>
                            {block.fieldType === 'textarea' ? (
                              <textarea
                                value={draftBlocks[block.key] || ''}
                                onChange={(event) => setDraftBlocks((draft) => ({ ...draft, [block.key]: event.target.value }))}
                                className="min-h-28 w-full resize-y rounded-xl border border-darkbrown/15 bg-[#FFFDF6] p-3 text-sm font-bold leading-relaxed outline-none transition focus:border-orange"
                              />
                            ) : (
                              <input
                                value={draftBlocks[block.key] || ''}
                                onChange={(event) => setDraftBlocks((draft) => ({ ...draft, [block.key]: event.target.value }))}
                                className="h-11 w-full rounded-xl border border-darkbrown/15 bg-[#FFFDF6] px-3 text-sm font-bold outline-none transition focus:border-orange"
                              />
                            )}
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <span className="truncate font-mono text-[10px] font-bold text-darkbrown/35">{block.key}</span>
                              <button
                                onClick={() => saveContentBlock(block)}
                                disabled={savingId === block.key}
                                className="inline-flex items-center gap-2 rounded-lg bg-darkbrown px-3 py-2 text-xs font-black text-cream transition hover:bg-orange disabled:cursor-wait disabled:bg-darkbrown/50"
                              >
                                {savingId === block.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Mentés
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {activeTab === 'gallery' && (
                <section className="space-y-4">
                  <div className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <h3 className="font-retro text-xl uppercase">Galéria szerkesztő</h3>
                        <p className="mt-1 text-xs font-bold text-darkbrown/55">
                          Cseréld a képeket URL alapján, állíts címet, sorrendet és láthatóságot. Minden adat SQLite-ba mentődik.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-xl bg-olive/10 px-3 py-2 text-xs font-black text-olive">
                        <ImageIcon className="h-4 w-4" />
                        {galleryItems.filter((item) => item.isActive).length} aktív kép
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm">
                    <h4 className="mb-4 flex items-center gap-2 font-retro text-lg uppercase">
                      <Plus className="h-5 w-5 text-orange" />
                      Új kép hozzáadása
                    </h4>
                    <div className="grid gap-4 xl:grid-cols-[180px_1fr]">
                      <div className="aspect-square overflow-hidden rounded-xl border border-darkbrown/10 bg-cream">
                        {newGalleryItem.imageUrl ? (
                          <img src={newGalleryItem.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-darkbrown/30">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3 lg:grid-cols-2">
                        <AdminField label="Kép címe">
                          <input
                            value={newGalleryItem.title}
                            onChange={(event) => setNewGalleryItem((draft) => ({ ...draft, title: event.target.value }))}
                            className="admin-input"
                            placeholder="Pl. Tábortűz este"
                          />
                        </AdminField>
                        <AdminField label="Kép URL">
                          <input
                            value={newGalleryItem.imageUrl}
                            onChange={(event) => setNewGalleryItem((draft) => ({ ...draft, imageUrl: event.target.value }))}
                            className="admin-input"
                            placeholder="https://.../kep.webp"
                          />
                        </AdminField>
                        <AdminField label="Sorrend">
                          <input
                            type="number"
                            value={newGalleryItem.sortOrder}
                            onChange={(event) => setNewGalleryItem((draft) => ({ ...draft, sortOrder: Number(event.target.value) }))}
                            className="admin-input"
                          />
                        </AdminField>
                        <AdminField label="Polaroid dőlés">
                          <select
                            value={newGalleryItem.tilt}
                            onChange={(event) => setNewGalleryItem((draft) => ({ ...draft, tilt: event.target.value }))}
                            className="admin-input"
                          >
                            <option value="-rotate-3 -translate-y-2">Balra erős</option>
                            <option value="-rotate-2 translate-y-1">Balra enyhe</option>
                            <option value="rotate-1 translate-y-1">Jobbra enyhe</option>
                            <option value="rotate-3 -translate-y-1">Jobbra erős</option>
                            <option value="rotate-0 translate-y-0">Egyenes</option>
                          </select>
                        </AdminField>
                        <label className="flex items-center gap-2 rounded-xl border border-darkbrown/10 bg-white px-3 py-3 text-sm font-black">
                          <input
                            type="checkbox"
                            checked={newGalleryItem.isActive}
                            onChange={(event) => setNewGalleryItem((draft) => ({ ...draft, isActive: event.target.checked }))}
                            className="h-4 w-4 accent-orange"
                          />
                          Publikus képként látszódjon
                        </label>
                        <button
                          onClick={createGalleryItem}
                          disabled={savingId === 'gallery-new'}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-4 py-3 text-sm font-black text-cream transition hover:bg-darkbrown disabled:cursor-wait disabled:bg-darkbrown/50"
                        >
                          {savingId === 'gallery-new' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                          Kép létrehozása
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-4 shadow-sm">
                        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                          <div className="aspect-square overflow-hidden rounded-xl border border-darkbrown/10 bg-cream">
                            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                          </div>
                          <div className="space-y-3">
                            <div className="grid gap-3 md:grid-cols-2">
                              <AdminField label="Cím">
                                <input
                                  value={item.title}
                                  onChange={(event) =>
                                    setGalleryItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, title: event.target.value } : entry)))
                                  }
                                  className="admin-input"
                                />
                              </AdminField>
                              <AdminField label="Sorrend">
                                <input
                                  type="number"
                                  value={item.sortOrder}
                                  onChange={(event) =>
                                    setGalleryItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, sortOrder: Number(event.target.value) } : entry)))
                                  }
                                  className="admin-input"
                                />
                              </AdminField>
                            </div>
                            <AdminField label="Kép URL">
                              <input
                                value={item.imageUrl}
                                onChange={(event) =>
                                  setGalleryItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, imageUrl: event.target.value } : entry)))
                                }
                                className="admin-input"
                              />
                            </AdminField>
                            <div className="grid gap-3 md:grid-cols-2">
                              <AdminField label="Polaroid dőlés">
                                <select
                                  value={item.tilt}
                                  onChange={(event) =>
                                    setGalleryItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, tilt: event.target.value } : entry)))
                                  }
                                  className="admin-input"
                                >
                                  <option value="-rotate-3 -translate-y-2">Balra erős</option>
                                  <option value="-rotate-2 translate-y-1">Balra enyhe</option>
                                  <option value="rotate-1 translate-y-1">Jobbra enyhe</option>
                                  <option value="rotate-3 -translate-y-1">Jobbra erős</option>
                                  <option value="rotate-0 translate-y-0">Egyenes</option>
                                </select>
                              </AdminField>
                              <label className="flex items-end">
                                <button
                                  onClick={() =>
                                    setGalleryItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, isActive: !entry.isActive } : entry)))
                                  }
                                  className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-black transition ${
                                    item.isActive
                                      ? 'border-olive/20 bg-olive/10 text-olive hover:bg-olive hover:text-cream'
                                      : 'border-darkbrown/10 bg-darkbrown/5 text-darkbrown/55 hover:bg-darkbrown hover:text-cream'
                                  }`}
                                >
                                  {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                  {item.isActive ? 'Publikus' : 'Rejtett'}
                                </button>
                              </label>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                              <button
                                onClick={() => deleteGalleryItem(item)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                              >
                                {savingId === `gallery-${item.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Törlés
                              </button>
                              <button
                                onClick={() => saveGalleryItem(item)}
                                disabled={savingId === `gallery-${item.id}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-darkbrown px-3 py-2 text-xs font-black text-cream transition hover:bg-orange disabled:cursor-wait disabled:bg-darkbrown/50"
                              >
                                {savingId === `gallery-${item.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Mentés
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'waitlist' && (
                <section className="rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] shadow-sm">
                  <div className="border-b border-darkbrown/10 p-4">
                    <h3 className="font-retro text-xl uppercase">Feliratkozók</h3>
                    <p className="mt-1 text-xs font-bold text-darkbrown/55">Előregisztrációs lista DB-ből.</p>
                  </div>
                  <div className="divide-y divide-darkbrown/10">
                    {waitlist.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-black">{item.email}</p>
                          <p className="mt-1 text-xs font-bold text-darkbrown/45">{item.date}</p>
                        </div>
                        <button
                          onClick={() => deleteWaitlistItem(item)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          {savingId === `waitlist-${item.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          Törlés
                        </button>
                      </div>
                    ))}
                    {!waitlist.length && <EmptyState title="Nincs feliratkozó" text="A lista itt jelenik meg, amikor valaki feliratkozik." />}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {editingTicket && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-darkbrown/10 bg-[#FFFDF6] p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange">Jegy szerkesztése</p>
                <h3 className="mt-1 font-retro text-2xl uppercase">{editingTicket.serial}</h3>
              </div>
              <button onClick={() => setEditingTicket(null)} className="rounded-lg p-2 text-darkbrown/50 hover:bg-darkbrown/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Név">
                <input
                  value={editingTicket.name}
                  onChange={(event) => setEditingTicket({ ...editingTicket, name: event.target.value })}
                  className="admin-input"
                />
              </AdminField>
              <AdminField label="E-mail">
                <input
                  type="email"
                  value={editingTicket.email}
                  onChange={(event) => setEditingTicket({ ...editingTicket, email: event.target.value })}
                  className="admin-input"
                />
              </AdminField>
              <AdminField label="Jegytípus">
                <select
                  value={editingTicket.type}
                  onChange={(event) => setEditingTicket({ ...editingTicket, type: event.target.value as TicketType })}
                  className="admin-input"
                >
                  <option value="camping">Sátorozó</option>
                  <option value="visitor">Napi látogató</option>
                  <option value="supporter">Támogatói</option>
                </select>
              </AdminField>
              <AdminField label="Revolut / tranzakció">
                <input
                  value={editingTicket.revolutUser || ''}
                  onChange={(event) => setEditingTicket({ ...editingTicket, revolutUser: event.target.value })}
                  className="admin-input"
                  placeholder="Csak támogatói jegynél"
                />
              </AdminField>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setEditingTicket(null)}
                className="rounded-xl border border-darkbrown/15 bg-white px-4 py-3 text-sm font-black text-darkbrown"
              >
                Mégse
              </button>
              <button
                onClick={saveTicket}
                disabled={savingId === editingTicket.id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-4 py-3 text-sm font-black text-cream transition hover:bg-darkbrown disabled:cursor-wait disabled:bg-darkbrown/50"
              >
                {savingId === editingTicket.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Mentés DB-be
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(58, 36, 24, 0.16);
          background: #fff;
          padding: 0 12px;
          font-size: 14px;
          font-weight: 700;
          outline: none;
        }
        .admin-input:focus {
          border-color: #D9793D;
          box-shadow: 0 0 0 3px rgba(217, 121, 61, 0.12);
        }
      `}</style>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-wider text-darkbrown/55">{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-darkbrown/45">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="font-retro text-lg uppercase">{title}</p>
      <p className="mt-1 text-sm font-bold text-darkbrown/50">{text}</p>
    </div>
  );
}
