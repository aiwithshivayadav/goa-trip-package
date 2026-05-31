"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Plus, X, Upload, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Admin Product Add/Edit Page
 * Multi-image upload, rich form, inclusions/exclusions editor
 */
export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "package" as string,
    shortDesc: "",
    longDesc: "",
    basePrice: "",
    originalPrice: "",
    priceUnit: "per person",
    duration: "",
    capacity: "",
    location: "",
    status: "active",
    isFeatured: false,
    isSelfServe: false,
    isQuoteLed: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([""]);
  const [exclusions, setExclusions] = useState<string[]>([""]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [itinerary, setItinerary] = useState<{ day: number; title: string; description: string }[]>([]);
  const [faq, setFaq] = useState<{ q: string; a: string }[]>([]);

  function updateForm(field: string, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
    if (field === "name" && isNew) {
      setForm((p) => ({ ...p, slug: (value as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
    }
  }

  function addImage() {
    if (!newImageUrl.trim()) return;
    setImages((p) => [...p, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  function removeImage(index: number) {
    setImages((p) => p.filter((_, i) => i !== index));
  }

  function updateListItem(list: string[], setList: (v: string[]) => void, index: number, value: string) {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  }

  function addListItem(list: string[], setList: (v: string[]) => void) {
    setList([...list, ""]);
  }

  function removeListItem(list: string[], setList: (v: string[]) => void, index: number) {
    setList(list.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.basePrice) {
      toast.error("Name, slug, and price are required");
      return;
    }
    setSaving(true);
    try {
      // TODO: POST to /api/products when DB is wired
      toast.success(isNew ? "Product created!" : "Product updated!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-surface">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold text-white">{isNew ? "Add New Product" : "Edit Product"}</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02] disabled:opacity-50">
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      {/* Basic Info */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Goa Honeymoon Classic — 3N/4D" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">URL Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} placeholder="goa-honeymoon-classic-3n4d" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white font-mono placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Type *</label>
            <select value={form.type} onChange={(e) => updateForm("type", e.target.value)} className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold transition-colors">
              <option value="package">Package</option>
              <option value="cruise">Cruise</option>
              <option value="yacht">Yacht</option>
              <option value="activity">Activity</option>
              <option value="hotel">Hotel</option>
              <option value="party">Party</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold transition-colors">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm("isFeatured", e.target.checked)} className="accent-gold" /> Featured
            </label>
            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
              <input type="checkbox" checked={form.isSelfServe} onChange={(e) => updateForm("isSelfServe", e.target.checked)} className="accent-gold" /> Self-serve
            </label>
            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
              <input type="checkbox" checked={form.isQuoteLed} onChange={(e) => updateForm("isQuoteLed", e.target.checked)} className="accent-gold" /> Quote-led
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Short Description</label>
          <textarea value={form.shortDesc} onChange={(e) => updateForm("shortDesc", e.target.value)} placeholder="One-liner shown on cards..." rows={2} className="w-full rounded-lg bg-surface border border-border-gold px-3 py-2 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Long Description</label>
          <textarea value={form.longDesc} onChange={(e) => updateForm("longDesc", e.target.value)} placeholder="Detailed description shown on the product page..." rows={4} className="w-full rounded-lg bg-surface border border-border-gold px-3 py-2 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none" />
        </div>
      </div>

      {/* Pricing & Details */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">Pricing & Details</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Base Price (₹) *</label>
            <input type="number" value={form.basePrice} onChange={(e) => updateForm("basePrice", e.target.value)} placeholder="12999" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Original Price (₹)</label>
            <input type="number" value={form.originalPrice} onChange={(e) => updateForm("originalPrice", e.target.value)} placeholder="17999" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Price Unit</label>
            <select value={form.priceUnit} onChange={(e) => updateForm("priceUnit", e.target.value)} className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold transition-colors">
              <option>per person</option>
              <option>per couple</option>
              <option>per hour</option>
              <option>per event</option>
              <option>per night</option>
              <option>per booking</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Duration</label>
            <input type="text" value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} placeholder="3N / 4D" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Capacity</label>
            <input type="text" value={form.capacity} onChange={(e) => updateForm("capacity", e.target.value)} placeholder="200 guests" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="Mandovi River, Panjim" className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">Images</h2>
        <p className="text-xs text-text-dim">Add multiple images. First image is the hero/cover. Drag to reorder.</p>

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-cosmic-800">
                <Image src={img} alt={`Product image ${i + 1}`} fill sizes="200px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute top-2 left-2 rounded bg-gold-gradient px-1.5 py-0.5 text-[9px] font-bold text-cosmic-950">COVER</span>
                )}
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded bg-cosmic-950/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add image URL */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Paste image URL (https://...)"
            onKeyDown={(e) => e.key === "Enter" && addImage()}
            className="flex-1 h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
          />
          <button onClick={addImage} className="flex h-10 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-gold hover:bg-surface transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        <p className="text-[10px] text-text-dim">Paste image URLs from goatrippackage.com/wp-content/uploads/ or any public URL. File upload coming soon.</p>
      </div>

      {/* Inclusions */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Inclusions</h2>
          <button onClick={() => addListItem(inclusions, setInclusions)} className="text-xs text-gold hover:text-gold-200"><Plus className="h-3.5 w-3.5 inline mr-1" />Add</button>
        </div>
        {inclusions.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => updateListItem(inclusions, setInclusions, i, e.target.value)} placeholder="e.g. Breakfast daily" className="flex-1 h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
            <button onClick={() => removeListItem(inclusions, setInclusions, i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-text-dim hover:text-rose hover:bg-surface transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>

      {/* Exclusions */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Exclusions</h2>
          <button onClick={() => addListItem(exclusions, setExclusions)} className="text-xs text-gold hover:text-gold-200"><Plus className="h-3.5 w-3.5 inline mr-1" />Add</button>
        </div>
        {exclusions.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => updateListItem(exclusions, setExclusions, i, e.target.value)} placeholder="e.g. Flights" className="flex-1 h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
            <button onClick={() => removeListItem(exclusions, setExclusions, i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-text-dim hover:text-rose hover:bg-surface transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Highlights (green badges)</h2>
          <button onClick={() => addListItem(highlights, setHighlights)} className="text-xs text-gold hover:text-gold-200"><Plus className="h-3.5 w-3.5 inline mr-1" />Add</button>
        </div>
        {highlights.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => updateListItem(highlights, setHighlights, i, e.target.value)} placeholder="e.g. Sunset Cruise for 2" className="flex-1 h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
            <button onClick={() => removeListItem(highlights, setHighlights, i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-text-dim hover:text-rose hover:bg-surface transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end gap-3 pt-4">
        <Link href="/admin/products" className="flex h-10 items-center px-4 rounded-lg border border-border-gold text-sm text-text-muted hover:text-white transition-colors">Cancel</Link>
        <button onClick={handleSave} disabled={saving} className="flex h-10 items-center gap-1.5 rounded-lg bg-gold-gradient px-6 text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
