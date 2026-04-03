import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Layers, Plus, Pencil, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { StokvelsService, StokvelDTO } from '../../../services/stokvelsService';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/context/AppContext';
import { hasPermission, Permission } from '../../../auth/permissions';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:   'bg-green-400/10 text-green-500',
  INACTIVE: 'bg-muted text-muted-foreground',
};

export function AdminStokvelsPage() {
  const { currentUser } = useApp();
  useSetPageHeader('Stokvels', 'Manage stokvel groups on the platform');

  const [stokvels, setStokvels]     = useState<StokvelDTO[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editStokvel, setEditStokvel] = useState<StokvelDTO | null>(null);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  // Create form refs
  const createNameRef = useRef<HTMLInputElement>(null);
  const createDescRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editName, setEditName]     = useState('');
  const [editDesc, setEditDesc]     = useState('');

  if (!hasPermission(currentUser.role, Permission.MANAGE_STOKVELS)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  useEffect(() => {
    StokvelsService.list()
      .then(setStokvels)
      .catch(() => toast.error('Failed to load stokvels'))
      .finally(() => setLoading(false));
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const name = createNameRef.current?.value.trim() ?? '';
    const desc = createDescRef.current?.value.trim() ?? '';
    if (!name) { setFormError('Name is required'); return; }
    setSaving(true);
    try {
      const created = await StokvelsService.create({ name, description: desc || undefined });
      setStokvels(prev => [...prev, created]);
      setShowCreate(false);
      toast.success(`Stokvel "${created.name}" created`);
      if (createNameRef.current) createNameRef.current.value = '';
      if (createDescRef.current) createDescRef.current.value = '';
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create stokvel');
    } finally {
      setSaving(false);
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────

  function openEdit(s: StokvelDTO) {
    setEditStokvel(s);
    setEditName(s.name);
    setEditDesc(s.description ?? '');
    setFormError(null);
  }

  async function handleSaveEdit() {
    if (!editStokvel) return;
    setFormError(null);
    if (!editName.trim()) { setFormError('Name is required'); return; }
    setSaving(true);
    try {
      const updated = await StokvelsService.update(editStokvel.id, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      });
      setStokvels(prev => prev.map(s => s.id === updated.id ? updated : s));
      setEditStokvel(null);
      toast.success(`Stokvel "${updated.name}" updated`);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to update stokvel');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(s: StokvelDTO) {
    const newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await StokvelsService.setStatus(s.id, newStatus);
      setStokvels(prev => prev.map(x => x.id === updated.id ? updated : x));
      toast.success(`${updated.name} is now ${updated.status.toLowerCase()}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Header action ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? '…' : `${stokvels.length} stokvel${stokvels.length !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={() => { setShowCreate(v => !v); setFormError(null); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Stokvel
        </button>
      </div>

      {/* ── Create form ────────────────────────────────────────────────────── */}
      {showCreate && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-4">Create a new stokvel</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                ref={createNameRef}
                type="text"
                placeholder="Stokvel name"
                maxLength={100}
                className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                ref={createDescRef}
                type="text"
                placeholder="Description (optional)"
                className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            {formError && <p className="text-destructive text-xs">{formError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Creating…' : 'Create Stokvel'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-5 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stokvels list ──────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">All Stokvels</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Stokvel groups registered on the platform</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-secondary rounded-xl" />)}
          </div>
        ) : stokvels.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No stokvels yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stokvels.map(s => (
              <div key={s.id} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{s.name}</p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.description}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 hidden sm:inline ${STATUS_COLORS[s.status] ?? 'bg-muted text-muted-foreground'}`}>
                  {s.status}
                </span>
                <p className="text-xs text-muted-foreground shrink-0 hidden md:block">
                  {new Date(s.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    title="Edit stokvel"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(s)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                      s.status === 'ACTIVE'
                        ? 'border-red-400/30 bg-red-400/5 text-red-500 hover:bg-red-400/15'
                        : 'border-green-400/30 bg-green-400/5 text-green-500 hover:bg-green-400/15'
                    }`}
                    title={s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  >
                    {s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit modal ─────────────────────────────────────────────────────── */}
      {editStokvel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Edit Stokvel</h3>
              <button onClick={() => setEditStokvel(null)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Name</label>
                <input
                  type="text"
                  value={editName}
                  maxLength={100}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Description</label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            {formError && <p className="text-destructive text-xs">{formError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setEditStokvel(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
