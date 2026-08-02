import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Button, Badge } from '../../components/ui';
import { Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Home() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-primary-subtle">
      {/* ── Navigation ── */}
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50',
          scrolled
            ? 'bg-glass-bg backdrop-blur-lg shadow-sm border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center py-4">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <svg className="w-6 h-6 text-text-on-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block text-base font-extrabold text-text tracking-tight">Dr. ZAID's</span>
                <span className="block text-sm font-semibold text-primary-text tracking-wide">Homeo Care</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Specializations', 'Approach', 'About', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-semibold text-text-muted hover:text-primary-text relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a href="#contact" className="text-sm font-semibold text-text-muted hover:text-primary-text px-4 py-2">
                Contact
              </a>

              {/* Theme Switcher Toggle */}
              <ThemeToggle />

              <Button variant="primary" onClick={() => navigate('/login')}>
                Doctor Portal →
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                aria-label="Toggle Navigation Menu"
                className="p-2 rounded-lg text-text hover:bg-surface-hover cursor-pointer"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-surface border-t border-border px-4 py-6 space-y-4 shadow-xl">
            {['Specializations', 'Approach', 'About', 'Testimonials', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold text-text hover:text-primary-text py-2"
              >
                {item}
              </a>
            ))}
            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
              Doctor Portal →
            </Button>
          </div>
        )}
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
          {/* Background blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-175 h-175 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -left-40 w-125 h-125 bg-primary/5 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left — copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-primary-subtle border border-primary-border px-4 py-1.5 rounded-full mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-xs font-bold text-primary-subtle-text uppercase tracking-widest">
                    Now Accepting New Patients
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-text leading-[1.08] tracking-tight mb-6">
                  Heal Deeper.<br />
                  <span className="text-primary-text">Live Better.</span>
                </h1>

                <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-10 max-w-xl">
                  Dr. MD Zaid delivers precision homeopathic care — evidence-informed, deeply personalised, and built around your unique biological blueprint. From chronic conditions to acute care, we restore health at its root.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-14">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-text-on-brand px-8 py-4 rounded-xl font-bold text-base hover:bg-primary-hover shadow-lg shadow-primary/30 active:scale-95"
                  >
                    Book a Consultation
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#approach"
                    className="inline-flex items-center justify-center gap-2 bg-surface text-text border border-border px-8 py-4 rounded-xl font-bold text-base hover:bg-surface-hover hover:border-border-strong active:scale-95 shadow-sm"
                  >
                    How It Works
                  </a>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
                  {[
                    ['12+', 'Years of Practice'],
                    ['5,000+', 'Patients Treated'],
                    ['98%', 'Satisfaction Rate'],
                    ['6', 'Specialisations'],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <p className="text-2xl font-extrabold text-text">{val}</p>
                      <p className="text-xs font-semibold text-text-subtle uppercase tracking-wide mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — visual card */}
              <div className="hidden lg:flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Main card */}
                  <div className="bg-surface rounded-3xl shadow-2xl p-8 border border-border">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <CheckCircle2 className="w-9 h-9 text-text-on-brand" />
                      </div>
                      <div>
                        <p className="font-extrabold text-text text-lg">Dr. MD Zaid</p>
                        <p className="text-sm text-primary-text font-semibold">BHMS, Clinical Homeopath</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {[
                        { label: 'Constitutional Prescribing', pct: 95 },
                        { label: 'Chronic Disease Management', pct: 92 },
                        { label: 'Patient Satisfaction', pct: 98 },
                      ].map(({ label, pct }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs font-semibold text-text-muted mb-1.5">
                            <span>{label}</span>
                            <span className="text-primary-text font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-bg-subtle rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['🫁', 'Respiratory'],
                        ['🧴', 'Dermatology'],
                        ['🧠', 'Mental Health'],
                        ['🦴', 'Musculoskeletal'],
                      ].map(([icon, name]) => (
                        <div key={name} className="flex items-center gap-2 bg-bg-subtle rounded-xl px-3 py-2.5 border border-border">
                          <span className="text-lg">{icon}</span>
                          <span className="text-xs font-semibold text-text">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-5 -right-5 bg-primary text-text-on-brand rounded-2xl px-4 py-3 shadow-xl shadow-primary/40">
                    <p className="text-xs font-semibold opacity-90">Consultations</p>
                    <p className="text-2xl font-extrabold">Online &amp; In-Clinic</p>
                  </div>

                  {/* Floating review */}
                  <div className="absolute -bottom-5 -left-5 bg-surface-raised text-text rounded-2xl px-4 py-3 shadow-xl border border-border flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['bg-primary', 'bg-info', 'bg-warning'].map((c, i) => (
                        <div key={i} className={cn('w-7 h-7 rounded-full border-2 border-surface', c)} />
                      ))}
                    </div>
                    <div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-warning fill-warning" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-text mt-0.5">Trusted by 5,000+ patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Bar (Inverse dark surface bg-sidebar-bg) ── */}
        <section className="bg-sidebar-bg py-10 border-y border-sidebar-border text-sidebar-text">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 text-sidebar-muted">
              {[
                { icon: '🏥', text: 'Registered Clinical Practice' },
                { icon: '🔬', text: 'Evidence-Based Protocols' },
                { icon: '🌍', text: 'Online Consultations Worldwide' },
                { icon: '📋', text: 'EMR-Integrated Patient Records' },
                { icon: '🛡️', text: 'Confidential & Secure' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-semibold text-sidebar-text">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Specializations ── */}
        <section id="specializations" className="py-28 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-xs font-bold text-primary-text uppercase tracking-widest bg-primary-subtle border border-primary-border px-4 py-1.5 rounded-full mb-4">
                Clinical Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-text mb-5 leading-tight">
                Specialised Care for<br />Complex Conditions
              </h2>
              <p className="text-lg text-text-muted leading-relaxed">
                Advanced homeopathic protocols designed for conditions that demand deep constitutional understanding and sustained clinical attention.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPECIALIZATIONS.map((s) => (
                <SpecCard key={s.title} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Approach ── */}
        <section id="approach" className="py-28 overflow-hidden bg-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Steps */}
              <div>
                <span className="inline-block text-xs font-bold text-primary-text uppercase tracking-widest bg-primary-subtle border border-primary-border px-4 py-1.5 rounded-full mb-6">
                  Our Methodology
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-text mb-4 leading-tight">
                  A Rigorous, Patient-First<br />
                  <span className="text-primary-text">Clinical Process.</span>
                </h2>
                <p className="text-lg text-text-muted mb-12 leading-relaxed">
                  Every patient receives a bespoke treatment plan built on systematic analysis, not templates.
                </p>
                <div className="space-y-0">
                  {APPROACH_STEPS.map((step, i) => (
                    <div key={step.title} className="flex gap-6 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-xl bg-primary text-text-on-brand flex items-center justify-center font-extrabold text-sm shadow-lg shadow-primary/25 shrink-0 z-10">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        {i < APPROACH_STEPS.length - 1 && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
                      </div>
                      <div className={cn('pb-10', i === APPROACH_STEPS.length - 1 && 'pb-0')}>
                        <h4 className="text-lg font-bold text-text mb-2">{step.title}</h4>
                        <p className="text-text-muted leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — info card grid */}
              <div id="about" className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-primary text-text-on-brand rounded-2xl p-8 shadow-md">
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="text-xl font-extrabold mb-2">Holistic by Design</h3>
                  <p className="opacity-90 text-sm leading-relaxed">
                    We treat the whole person — body, mind, and environment — not just the presenting symptom. Homeopathy at its most scientific.
                  </p>
                </div>
                {[
                  { icon: '🧬', title: 'Genetic Awareness', desc: 'Family history and inherited tendencies inform every prescription.' },
                  { icon: '📈', title: 'Data-Driven Follow-Up', desc: 'EMR-integrated progress tracking ensures measurable outcomes.' },
                  { icon: '⏱️', title: 'Timely Access', desc: 'Online slots available within 48 hours for new patients.' },
                  { icon: '🤝', title: 'Collaborative Care', desc: 'Works alongside your existing physicians for integrative health.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="bg-surface border border-border rounded-2xl p-5 hover:shadow-lg">
                    <div className="text-2xl mb-3">{icon}</div>
                    <h4 className="font-bold text-text text-sm mb-1">{title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="py-28 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-xs font-bold text-primary-text uppercase tracking-widest bg-primary-subtle border border-primary-border px-4 py-1.5 rounded-full mb-4">
                Patient Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-text mb-5">
                Real Results, Real People
              </h2>
              <p className="text-lg text-text-muted">
                Hear from patients who found lasting relief through precision homeopathic care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact / CTA (Inverse dark surface bg-sidebar-bg) ── */}
        <section id="contact" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-sidebar-bg text-sidebar-text rounded-3xl overflow-hidden border border-sidebar-border">
              {/* BG glow */}
              <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-125 h-125 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-primary/10 rounded-full blur-[80px]" />
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-0">
                {/* Left copy */}
                <div className="p-12 md:p-16 lg:p-20">
                  <span className="inline-block text-xs font-bold text-sidebar-accent uppercase tracking-widest bg-primary-subtle/20 border border-primary-border/30 px-4 py-1.5 rounded-full mb-6">
                    Get in Touch
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-sidebar-text mb-6 leading-tight">
                    Ready to Start<br />Your Healing Journey?
                  </h2>
                  <p className="text-sidebar-muted text-lg leading-relaxed mb-10">
                    Book a consultation today. In-clinic and online appointments available. Most patients see measurable improvement within 4–8 weeks.
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: '📞', label: 'Phone / WhatsApp', value: '+91 98765 43210' },
                      { icon: '📧', label: 'Email', value: 'drzaid@homeocare.in' },
                      { icon: '📍', label: 'Clinic', value: 'Available on appointment' },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-subtle/20 border border-primary-border/30 rounded-lg flex items-center justify-center text-lg">
                          {icon}
                        </div>
                        <div>
                          <p className="text-xs text-sidebar-muted font-semibold">{label}</p>
                          <p className="text-sidebar-text font-semibold">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right form */}
                <div className="bg-surface/10 backdrop-blur-sm border-l border-sidebar-border p-12 md:p-16 lg:p-20">
                  <h3 className="text-xl font-bold text-sidebar-text mb-8">Send a Message</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-sidebar-muted mb-2">First Name</label>
                        <input
                          type="text"
                          placeholder="Jane"
                          className="w-full bg-surface/20 border border-sidebar-border text-sidebar-text placeholder:text-sidebar-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-sidebar-muted mb-2">Last Name</label>
                        <input
                          type="text"
                          placeholder="Doe"
                          className="w-full bg-surface/20 border border-sidebar-border text-sidebar-text placeholder:text-sidebar-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-sidebar-muted mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        className="w-full bg-surface/20 border border-sidebar-border text-sidebar-text placeholder:text-sidebar-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-sidebar-muted mb-2">Primary Concern</label>
                      <select className="w-full bg-sidebar-bg border border-sidebar-border text-sidebar-text rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                        <option value="">Select condition area</option>
                        {SPECIALIZATIONS.map((s) => (
                          <option key={s.title} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-sidebar-muted mb-2">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Briefly describe your health concern..."
                        className="w-full bg-surface/20 border border-sidebar-border text-sidebar-text placeholder:text-sidebar-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                    <Button type="submit" variant="primary" fullWidth size="lg">
                      Request Consultation →
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer (Inverse dark surface bg-sidebar-bg) ── */}
      <footer className="bg-sidebar-bg text-sidebar-muted pt-16 pb-8 border-t border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-text-on-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sidebar-text font-extrabold text-sm">Dr. ZAID's Homeo Care</p>
                  <p className="text-sidebar-accent text-xs font-medium">Precision Homeopathy</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-sidebar-muted max-w-sm">
                Leading the way in evidence-informed homeopathic medicine. Ethical, safe, and effective healing — for every stage of life.
              </p>
            </div>

            <div>
              <h5 className="text-sidebar-text font-bold text-sm mb-5">Navigation</h5>
              <ul className="space-y-3 text-sm">
                {['Specializations', 'Approach', 'About', 'Testimonials', 'Contact'].map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} className="text-sidebar-muted hover:text-sidebar-text">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-sidebar-text font-bold text-sm mb-5">Legal</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-sidebar-muted hover:text-sidebar-text">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sidebar-muted hover:text-sidebar-text">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sidebar-muted hover:text-sidebar-text">
                    Cookie Policy
                  </a>
                </li>
              </ul>
              <div className="mt-8">
                <h5 className="text-sidebar-text font-bold text-sm mb-4">Doctor Portal</h5>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sidebar-text border-sidebar-border hover:bg-sidebar-hover hover:text-sidebar-text"
                  onClick={() => navigate('/login')}
                >
                  Sign In →
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-sidebar-muted">
            <p>© 2026 Dr. ZAID's Homeo Care. All rights reserved.</p>
            <p>Homeopathy is a complementary medicine. Always consult your primary physician for emergencies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const SPECIALIZATIONS = [
  { icon: '🫁', title: 'Chronic Respiratory', desc: 'Targeted protocols for Asthma, Allergic Rhinitis, and Sinusitis using deep-acting constitutional remedies that address root immune dysfunction.', tag: 'Chronic' },
  { icon: '🧴', title: 'Dermatological Care', desc: 'Systemic treatment for Psoriasis, Eczema, Urticaria, and Acne — addressing internal triggers, not just surface symptoms.', tag: 'Integrative' },
  { icon: '🧠', title: 'Mental Wellness', desc: 'Non-habit-forming support for Anxiety, Depression, OCD, and Stress Disorders — balancing mind and body in harmony.', tag: 'Holistic' },
  { icon: '🦴', title: 'Musculoskeletal', desc: 'Lasting relief from Arthritis, Spondylosis, and Sciatica without the long-term side effects of conventional medication.', tag: 'Chronic' },
  { icon: '🩸', title: 'Lifestyle Disorders', desc: 'Sustainable management of Diabetes, Hypertension, Hypothyroidism, and Obesity through metabolic rebalancing.', tag: 'Preventive' },
  { icon: '👶', title: 'Paediatric Care', desc: 'Gentle, safe healing for childhood infections, recurring fevers, developmental delays, and immune strengthening.', tag: 'Gentle' },
];

const APPROACH_STEPS = [
  { title: 'Comprehensive Case Analysis', desc: 'A 60-minute deep-dive into your medical history, family patterns, lifestyle, and mental-emotional state to understand the full picture.' },
  { title: 'Constitutional Remedy Selection', desc: 'Remedies matched to your unique individuality — not your diagnosis — ensuring high specificity and lasting clinical effect.' },
  { title: 'Structured Follow-Up Protocol', desc: 'Scheduled review consultations at 4, 8, and 12 weeks. Progress tracked in our EMR system with data-driven adjustments.' },
  { title: 'Sustained Wellness Planning', desc: 'Post-treatment lifestyle, nutritional, and preventive guidance to maintain your restored health for years ahead.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Psoriasis Patient, 3 years', quote: 'After six years of failed treatments, Dr. Zaid\'s approach gave me visible improvement within 8 weeks. My skin is now 90% clear. I cannot recommend him highly enough.', stars: 5 },
  { name: 'Ahmed K.', role: 'Anxiety & IBS, 2 years', quote: 'The level of understanding and patience Dr. Zaid brings is exceptional. He identified patterns no other doctor had considered. I feel like a different person today.', stars: 5 },
  { name: 'Fatima R.', role: 'Paediatric Care', quote: 'My son\'s recurring throat infections have completely stopped after four months of treatment. The online consultation process was seamless and professional.', stars: 5 },
];

function SpecCard({ icon, title, desc, tag }: { icon: string; title: string; desc: string; tag: string }) {
  return (
    <div className="group bg-surface border border-border rounded-2xl p-7 hover:border-primary-border shadow-xs cursor-default">
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 bg-primary-subtle rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>
        <Badge variant="primary">{tag}</Badge>
      </div>
      <h3 className="text-base font-extrabold text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, quote, stars }: { name: string; role: string; quote: string; stars: number }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-7 hover:shadow-lg">
      <div className="flex gap-0.5 mb-5">
        {[...Array(stars)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-warning text-warning" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-text-muted text-sm leading-relaxed mb-6">"{quote}"</blockquote>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-text-on-brand font-bold text-sm">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-text text-sm">{name}</p>
          <p className="text-xs text-text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}
