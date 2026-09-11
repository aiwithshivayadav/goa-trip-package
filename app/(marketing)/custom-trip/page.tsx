"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Users, Sparkles, Phone, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

export default function CustomTripPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-500">Loading...</div></div>}>
      <CustomTripContent />
    </Suspense>
  );
}

function CustomTripContent() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("package") || "";

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    travelDateFrom: "",
    travelDateTo: "",
    adults: 2,
    children: 0,
    interests: preselected ? [preselected] : [] as string[],
    hotelPreference: "3-star",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  function updateForm(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleInterest(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          productInterest: form.interests.join(", "),
          travelDateFrom: form.travelDateFrom,
          travelDateTo: form.travelDateTo,
          adults: form.adults,
          children: form.children,
          message: `Hotel: ${form.hotelPreference}. ${form.message}`,
          source: "custom-trip-wizard",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Enquiry sent! Our planner will reach you in 30 minutes.");
      } else {
        toast.error("Something went wrong. Please try WhatsApp instead.");
      }
    } catch {
      toast.error("Network error. Please try WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lagoon-50">
            <Check className="h-8 w-8 text-lagoon" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-3">
            Quote Request <span className="text-lagoon">Received!</span>
          </h1>
          <p className="text-gray-500 mb-8">
            Our dedicated planner will share a personalised itinerary on WhatsApp within 30 minutes.
          </p>
          <a
            href="https://wa.me/919890830249"
            className="inline-flex h-12 items-center justify-center rounded-full bg-lagoon px-8 text-sm font-bold text-white"
          >
            Chat on WhatsApp Now
          </a>
        </div>
      </div>
    );
  }

  const interests = [
    "Honeymoon", "Family vacation", "Group / Friends", "Bachelor party",
    "Corporate offsite", "Cruise + dinner", "Yacht charter", "Water activities",
    "Sightseeing", "Nightlife & parties", "Adventure sports", "Relaxation & spa",
  ];

  const hotelOptions = ["Budget (hostels)", "3-star", "4-star", "5-star luxury", "No preference"];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-hero-gradient py-16 text-center md:py-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-amber mb-3">Personalised for you</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Plan Your Dream <span className="text-lagoon-100">Goa Trip</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            4 quick steps. Custom itinerary in your hands within 30 minutes.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="mx-auto max-w-2xl px-4 py-12 md:px-8">
        {/* Progress bar */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= s ? "bg-lagoon text-white" : "bg-white border border-border-warm text-gray-400"
              }`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && <div className={`h-0.5 w-12 sm:w-20 mx-1 transition-colors ${step > s ? "bg-lagoon" : "bg-border-warm"}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border-warm bg-white p-6 md:p-8">
          {/* Step 1: Dates & Travelers */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-5 w-5 text-lagoon" />
                <h2 className="text-lg font-bold text-ink">When are you travelling?</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">From date</label>
                  <input type="date" value={form.travelDateFrom} onChange={(e) => updateForm("travelDateFrom", e.target.value)} className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">To date</label>
                  <input type="date" value={form.travelDateTo} onChange={(e) => updateForm("travelDateTo", e.target.value)} className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Adults</label>
                  <input type="number" min={1} max={50} value={form.adults} onChange={(e) => updateForm("adults", parseInt(e.target.value) || 1)} className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Children (0-12 yrs)</label>
                  <input type="number" min={0} max={20} value={form.children} onChange={(e) => updateForm("children", parseInt(e.target.value) || 0)} className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-5 w-5 text-lagoon" />
                <h2 className="text-lg font-bold text-ink">What interests you?</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-lg px-3 py-3 text-sm font-medium transition-all text-left ${
                      form.interests.includes(interest)
                        ? "bg-lagoon-50 border border-lagoon text-lagoon"
                        : "bg-white border border-border-warm text-gray-500 hover:border-lagoon"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Hotel preference */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-5 w-5 text-lagoon" />
                <h2 className="text-lg font-bold text-ink">Hotel preference?</h2>
              </div>
              <div className="space-y-2">
                {hotelOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateForm("hotelPreference", option)}
                    className={`w-full rounded-lg px-4 py-4 text-sm font-medium text-left transition-all ${
                      form.hotelPreference === option
                        ? "bg-lagoon-50 border border-lagoon text-lagoon"
                        : "bg-white border border-border-warm text-gray-500 hover:border-lagoon"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="h-5 w-5 text-lagoon" />
                <h2 className="text-lg font-bold text-ink">Your details</h2>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Name *</label>
                <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Your full name" required className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink placeholder:text-gray-400 focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Phone (WhatsApp) *</label>
                <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+91 98908 30249" required className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink placeholder:text-gray-400 focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email (optional)</label>
                <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="your@email.com" className="w-full h-12 rounded-lg bg-white border border-border-warm px-4 text-ink placeholder:text-gray-400 focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Special requests (optional)</label>
                <textarea value={form.message} onChange={(e) => updateForm("message", e.target.value)} placeholder="Anything specific you'd like..." rows={3} className="w-full rounded-lg bg-white border border-border-warm px-4 py-3 text-ink placeholder:text-gray-400 focus:border-lagoon focus:ring-1 focus:ring-lagoon transition-colors resize-none" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={() => setStep((s) => (s - 1) as Step)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-ink transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button onClick={() => setStep((s) => (s + 1) as Step)} className="flex h-11 items-center justify-center rounded-xl bg-lagoon px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="flex h-11 items-center justify-center rounded-xl bg-lagoon px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                {loading ? "Sending..." : "Get My Free Quote"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your planner responds within 30 minutes on WhatsApp. No spam, ever.
        </p>
      </section>
    </div>
  );
}
