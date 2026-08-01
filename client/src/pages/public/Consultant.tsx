import { useState, useEffect, useRef } from 'react';
import Reveal from '../../components/common/Reveal';
import { useReveal } from '../../hooks/useReveal';

/**
 * Consultant landing page — positions Dr. MD Zaid as a consulting homeopath.
 *
 * Deployed standalone to GitHub Pages via `main.landing.tsx`, so this component
 * must stay free of API calls, auth state, and router dependencies.
 *
 * Motion is intentionally restrained: this is a medical practice page, so
 * animation supports reading order rather than competing with it. No scroll
 * hijacking, no custom cursor — a prospective patient looking for a phone
 * number should never have to wait on an animation. All of it is disabled
 * under prefers-reduced-motion (see index.css).
 */

const WHATSAPP_NUMBER = '919876543210';
const EMAIL = 'drzaid@homeocare.in';

const NAV_LINKS = [
  ['Credentials', 'credentials'],
  ['Consultations', 'consultations'],
  ['Conditions', 'conditions'],
  ['Process', 'process'],
  ['FAQ', 'faq'],
] as const;

export default function Consultant() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Condense the header past the fold, and tuck it away while scrolling down so
  // long copy gets the full viewport. Any upward scroll brings it straight back.
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);
        // Ignore jitter, and never hide the nav near the top of the page.
        if (Math.abs(y - lastY.current) > 8) {
          setHidden(y > lastY.current && y > 220);
          lastY.current = y;
        }
        frame = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // A hidden header must not keep focusable links in the tab order.
  useEffect(() => {
    if (hidden) setMobileOpen(false);
  }, [hidden]);

  const bookingHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Dr. Zaid, I'd like to book a homeopathic consultation.",
  )}`;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>

      {/* ── Navigation ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[transform,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
          scrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        } ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="#top" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/30 group-hover:shadow-teal-600/50 transition-shadow">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block text-base font-extrabold text-slate-900 tracking-tight">Dr. MD Zaid</span>
                <span className="block text-sm font-semibold text-teal-600 tracking-wide">Consulting Homeopath</span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-teal-600 after:transition-all hover:after:w-full"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors px-4 py-2">
                Email
              </a>
              <a
                href={bookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/25 active:scale-95"
              >
                Book Consultation →
              </a>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-6 space-y-4 shadow-xl">
            {NAV_LINKS.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-2"
              >
                {label}
              </a>
            ))}
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full mt-2 bg-teal-600 text-white py-3 rounded-lg text-sm font-bold"
            >
              Book Consultation →
            </a>
          </div>
        )}
      </header>

      <main id="top">
        {/* ── Hero ── */}
        <section className="relative flex items-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-teal-50/40">
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="drift absolute -top-40 -right-40 w-175 h-175 bg-teal-400/10 rounded-full blur-[120px]" />
            <div
              className="drift absolute bottom-0 -left-40 w-125 h-125 bg-teal-600/8 rounded-full blur-[100px]"
              style={{ animationDelay: '-11s' }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 w-full">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7">
                <div className="hero-in inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
                  </span>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
                    Accepting new patients · Slots within 48 hrs
                  </span>
                </div>

                {/* Fluid scale: tracks viewport width between the two bounds so
                    the headline holds its proportion without breakpoint jumps. */}
                <h1
                  className="font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.25rem, 5.2vw, 4rem)' }}
                >
                  <span className="hero-in block" style={{ ['--hero-delay' as string]: '80ms' }}>
                    A homeopath who takes
                  </span>
                  <span
                    className="hero-in block text-teal-600"
                    style={{ ['--hero-delay' as string]: '180ms' }}
                  >
                    the full case.
                  </span>
                </h1>

                <p
                  className="hero-in text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl"
                  style={{ ['--hero-delay' as string]: '280ms' }}
                >
                  I'm Dr. MD Zaid, BHMS — a consulting classical homeopath. Every patient gets a
                  60&#8209;minute first consultation, a remedy matched to their whole constitution, and
                  structured follow-up with progress tracked in writing. No templates, no guesswork.
                </p>

                <div
                  className="hero-in flex flex-col sm:flex-row gap-4 mb-12"
                  style={{ ['--hero-delay' as string]: '380ms' }}
                >
                  <a
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-[background-color,transform,box-shadow] duration-300 hover:bg-teal-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-600/40 shadow-lg shadow-teal-600/30 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    Book a Consultation
                    {/* Arrow nudges forward on hover — a small directional cue. */}
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="#consultations"
                    className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-bold text-base transition-[color,border-color,transform] duration-300 hover:border-teal-300 hover:text-teal-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    See formats &amp; fees
                  </a>
                </div>

                <dl
                  className="hero-in flex flex-wrap gap-x-10 gap-y-6 pt-8 border-t border-slate-100"
                  style={{ ['--hero-delay' as string]: '480ms' }}
                >
                  {STATS.map(([val, label]) => (
                    <div key={label}>
                      <dd className="text-2xl font-extrabold text-slate-900 tabular-nums">
                        <CountUp value={val} />
                      </dd>
                      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{label}</dt>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Consultation summary card */}
              <div
                className="hero-in lg:col-span-5"
                style={{ ['--hero-delay' as string]: '320ms' }}
              >
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-200/80 p-8 border border-slate-100">
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-6">
                    What a first consultation includes
                  </p>
                  <ul className="space-y-4 mb-8">
                    {FIRST_CONSULT_INCLUDES.map(item => (
                      <li key={item} className="flex gap-3">
                        <svg className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-500">First consultation</span>
                      <span className="text-2xl font-extrabold text-slate-900">₹1,200</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      60 minutes · online or in-clinic · includes written case summary
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="bg-slate-900 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal stagger className="flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-4">
              {TRUST_ITEMS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <span className="text-xl" aria-hidden="true">{icon}</span>
                  <span className="text-sm font-semibold text-slate-300">{text}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Credentials / About ── */}
        <section id="credentials" className="py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
              <Reveal>
                <SectionEyebrow>About the consultant</SectionEyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Twelve years of classical<br />homeopathic practice.
                </h2>
                <div className="space-y-4 text-slate-500 leading-relaxed">
                  <p>
                    I trained in classical homeopathy and have spent the last twelve years in
                    full-time consulting practice, working mostly with people who arrive after
                    conventional treatment has plateaued — long-standing skin conditions, recurring
                    respiratory illness, anxiety that hasn't responded to the usual routes.
                  </p>
                  <p>
                    My practice is deliberately unhurried. A first consultation runs a full hour
                    because a constitutional prescription depends on detail that a fifteen-minute
                    appointment simply cannot surface. I keep structured written records for every
                    patient, which means follow-ups start from evidence rather than recollection.
                  </p>
                  <p>
                    I'm equally clear about limits: homeopathy is complementary medicine. I refer on
                    when a case needs conventional investigation or emergency care, and I'm happy to
                    work alongside your existing physicians.
                  </p>
                </div>
              </Reveal>

              <Reveal stagger className="grid sm:grid-cols-2 gap-4">
                {CREDENTIALS.map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="lift bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-100 hover:border-teal-200"
                  >
                    <div className="text-2xl mb-3" aria-hidden="true">{icon}</div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">{title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Consultation formats & fees ── */}
        <section id="consultations" className="py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <SectionEyebrow center>Consultation formats</SectionEyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                Transparent formats, transparent fees
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                No packages you have to commit to up front. Book what you need, when you need it.
              </p>
            </Reveal>

            <Reveal stagger className="grid md:grid-cols-3 gap-6 items-start">
              {CONSULT_TIERS.map(tier => <TierCard key={tier.name} {...tier} bookingHref={bookingHref} />)}
            </Reveal>

            <p className="text-center text-sm text-slate-400 mt-10 max-w-2xl mx-auto">
              Remedies are dispensed separately and typically cost ₹150–₹400 per month. Fees are
              indicative — confirmed when your appointment is scheduled.
            </p>
          </div>
        </section>

        {/* ── Conditions ── */}
        <section id="conditions" className="py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <SectionEyebrow center>Areas of focus</SectionEyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                Conditions I see most often
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Chronic, constitutional cases where sustained attention changes the outcome.
              </p>
            </Reveal>

            <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONDITIONS.map(c => <ConditionCard key={c.title} {...c} />)}
            </Reveal>
          </div>
        </section>

        {/* ── Process ── */}
        <section id="process" className="py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
              <Reveal>
                <SectionEyebrow>How it works</SectionEyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                  What working together<br /><span className="text-teal-600">actually looks like.</span>
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Four stages, and you'll know at each point what happens next and roughly when.
                </p>
              </Reveal>

              <ol className="space-y-0">
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessStep
                    key={step.title}
                    step={step}
                    index={i}
                    isLast={i === PROCESS_STEPS.length - 1}
                  />
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <SectionEyebrow center>Patient experiences</SectionEyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">
                In their own words
              </h2>
            </Reveal>
            <Reveal stagger className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => <TestimonialCard key={t.name} {...t} />)}
            </Reveal>
            <p className="text-center text-xs text-slate-400 mt-10">
              Individual results vary. Testimonials describe personal experience and are not a
              guarantee of clinical outcome.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-28 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <SectionEyebrow center>Common questions</SectionEyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Before you book
              </h2>
            </Reveal>
            <Reveal stagger className="space-y-3">
              {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
            </Reveal>
          </div>
        </section>

        {/* ── Booking CTA ── */}
        <section id="book" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-slate-900 rounded-4xl overflow-hidden">
              <div className="absolute inset-0 overflow-hidden z-0" aria-hidden="true">
                <div className="drift absolute top-0 right-0 w-125 h-125 bg-teal-600/20 rounded-full blur-[100px]" />
                <div
                  className="drift absolute bottom-0 left-0 w-100 h-100 bg-teal-400/10 rounded-full blur-[80px]"
                  style={{ animationDelay: '-8s' }}
                />
              </div>

              <Reveal className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center max-w-3xl mx-auto">
                <SectionEyebrow dark center>Book an appointment</SectionEyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                  Ready to have your whole case heard?
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-10">
                  Message me on WhatsApp or send an email with a one-line summary of your concern.
                  I'll reply with the next available slots — usually within one working day.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <a
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/30 active:scale-95"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.44 0 1.44 1.05 2.83 1.2 3.02.15.2 2.06 3.15 4.99 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.09 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
                    </svg>
                    WhatsApp Dr. Zaid
                  </a>
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent('Consultation enquiry')}`}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all active:scale-95"
                  >
                    Email instead
                  </a>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 text-left sm:text-center">
                  {[
                    ['Phone / WhatsApp', '+91 98765 43210'],
                    ['Email', EMAIL],
                    ['Consultation hours', 'Mon–Sat, 10am–7pm IST'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-white font-semibold text-sm break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm">Dr. MD Zaid</p>
                  <p className="text-teal-500 text-xs font-medium">BHMS · Consulting Homeopath</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                Classical homeopathic consultation for chronic and constitutional conditions.
                Online and in-clinic.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm mb-5">On this page</h3>
              <ul className="space-y-3 text-sm">
                {NAV_LINKS.map(([label, id]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="hover:text-teal-400 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm mb-5">Get in touch</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                    WhatsApp · +91 98765 43210
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="hover:text-teal-400 transition-colors">{EMAIL}</a>
                </li>
                <li className="text-slate-500">Mon–Sat, 10am–7pm IST</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} Dr. MD Zaid. All rights reserved.</p>
            <p className="md:text-right max-w-md">
              Homeopathy is a complementary medicine. This page is not medical advice — always
              consult a qualified physician, and seek emergency care for urgent symptoms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS: ReadonlyArray<readonly [string, string]> = [
  ['12 yrs', 'In practice'],
  ['5,000+', 'Cases taken'],
  ['60 min', 'First consultation'],
  ['48 hrs', 'Typical wait'],
];

const FIRST_CONSULT_INCLUDES = [
  'A full hour, unhurried — medical history, family patterns, lifestyle and mental-emotional picture',
  'Review of any existing reports or investigations you bring',
  'A constitutional remedy selected for you, with dosage explained in plain language',
  'A written case summary and a clear follow-up date before you leave',
];

const TRUST_ITEMS = [
  { icon: '🎓', text: 'BHMS qualified' },
  { icon: '📋', text: 'Written records for every case' },
  { icon: '🌍', text: 'Online consultations worldwide' },
  { icon: '🤝', text: 'Works alongside your physician' },
  { icon: '🔒', text: 'Confidential' },
];

const CREDENTIALS = [
  { icon: '🎓', title: 'BHMS, classical training', desc: 'Bachelor of Homeopathic Medicine & Surgery, with post-graduate study in classical repertory method.' },
  { icon: '🗂️', title: 'Documented practice', desc: 'Every consultation recorded in a structured EMR, so follow-ups build on evidence, not memory.' },
  { icon: '🌐', title: 'Online & in-clinic', desc: 'Video consultation for patients outside the city, with remedies couriered where permitted.' },
  { icon: '🧭', title: 'Clear about scope', desc: 'Referral onward when a case needs conventional investigation, imaging, or urgent care.' },
];

const CONSULT_TIERS = [
  {
    name: 'First consultation',
    price: '₹1,200',
    duration: '60 minutes',
    desc: 'The full case-taking session for new patients.',
    features: [
      'Complete history & constitutional analysis',
      'Review of existing reports',
      'Remedy prescription with dosage plan',
      'Written case summary',
    ],
    featured: true,
  },
  {
    name: 'Follow-up',
    price: '₹600',
    duration: '25 minutes',
    desc: 'Scheduled review to assess response and adjust.',
    features: [
      'Progress assessment against baseline',
      'Remedy or potency adjustment',
      'Updated written record',
      'Next review scheduled',
    ],
    featured: false,
  },
  {
    name: 'Acute consultation',
    price: '₹400',
    duration: '15 minutes',
    desc: 'Short-notice help for an acute episode.',
    features: [
      'Same-day slots where available',
      'Focused acute prescription',
      'For existing patients preferred',
      'Escalation advice if it worsens',
    ],
    featured: false,
  },
];

const CONDITIONS = [
  { icon: '🧴', title: 'Skin', tag: 'Chronic', desc: 'Psoriasis, eczema, urticaria, and acne — treated systemically rather than surface-only.', items: ['Psoriasis', 'Eczema', 'Urticaria', 'Acne'] },
  { icon: '🫁', title: 'Respiratory', tag: 'Chronic', desc: 'Asthma, allergic rhinitis, and recurring sinusitis, with attention to underlying immune patterns.', items: ['Asthma', 'Allergic rhinitis', 'Sinusitis'] },
  { icon: '🧠', title: 'Mental & emotional', tag: 'Holistic', desc: 'Non-habit-forming support for anxiety, low mood, sleep disturbance, and stress-related complaints.', items: ['Anxiety', 'Low mood', 'Insomnia'] },
  { icon: '🦴', title: 'Musculoskeletal', tag: 'Chronic', desc: 'Arthritis, cervical and lumbar spondylosis, and sciatica managed over the long term.', items: ['Arthritis', 'Spondylosis', 'Sciatica'] },
  { icon: '🩸', title: 'Metabolic & lifestyle', tag: 'Preventive', desc: 'Adjunctive support for thyroid disorder, blood-sugar control, and weight, alongside your physician.', items: ['Hypothyroidism', 'Diabetes (adjunct)', 'Weight'] },
  { icon: '👶', title: 'Paediatric', tag: 'Gentle', desc: 'Recurring childhood infection, tonsillitis, appetite and immunity, with gentle dosing.', items: ['Recurring infection', 'Tonsillitis', 'Immunity'] },
];

const PROCESS_STEPS = [
  { title: 'Enquiry & scheduling', when: 'Day 0', desc: "Message me on WhatsApp or email with a one-line summary. I'll confirm a slot and send a short intake form so no time is lost in the session itself." },
  { title: 'The first consultation', when: '60 min', desc: 'A full hour of case-taking, online or in clinic. You leave with a prescription, dosage instructions in writing, and a scheduled review date.' },
  { title: 'Structured follow-up', when: 'Weeks 4, 8, 12', desc: "Reviews at set intervals to compare against your baseline. Where a remedy isn't acting, we change course deliberately rather than waiting and hoping." },
  { title: 'Maintenance & discharge', when: 'Ongoing', desc: "Once the picture is stable, we taper contact to as-needed and I give you lifestyle and preventive guidance to hold the ground you've gained." },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Psoriasis · 3 years under care', quote: "After six years of treatments that plateaued, I saw visible improvement within eight weeks. What struck me first was simply being asked questions nobody had asked before.", stars: 5 },
  { name: 'Ahmed K.', role: 'Anxiety & IBS · 2 years', quote: "Dr. Zaid connected my digestive symptoms and my anxiety as one picture, which no one else had done. The follow-up structure kept me honest about my own progress.", stars: 5 },
  { name: 'Fatima R.', role: 'Paediatric care', quote: "My son's recurring throat infections stopped after about four months. The online consultations were straightforward and he was comfortable throughout.", stars: 5 },
];

const FAQS = [
  { q: 'How soon should I expect to see a change?', a: 'It depends on how long-standing the condition is. Acute complaints often respond within days; chronic constitutional cases usually show the first clear signs between four and eight weeks. I set a review at week four precisely so we can judge this together rather than guess.' },
  { q: 'Can I continue my current medication?', a: "Yes, and in most cases you should. Do not stop prescribed conventional medication to start homeopathy. I'll ask what you're taking, work around it, and coordinate with your physician where that helps. Any tapering is their call, not mine." },
  { q: 'Is an online consultation as good as being in the clinic?', a: 'For most chronic cases, yes — case-taking is largely conversation, and video works well. Where a physical examination genuinely matters, I will say so and we arrange an in-clinic visit or a referral.' },
  { q: 'What do I need to bring or prepare?', a: 'Any recent investigation reports, a list of current medication with doses, and a rough timeline of when your symptoms began and what makes them better or worse. The intake form I send covers the rest.' },
  { q: 'Do you treat emergencies?', a: 'No. Homeopathy is not appropriate for medical emergencies. For chest pain, breathing difficulty, severe bleeding, sudden weakness, or any acute deterioration, go to a hospital immediately.' },
  { q: 'What are the fees, and are remedies included?', a: 'Consultation fees are listed above. Remedies are dispensed separately and generally run ₹150–₹400 per month. There are no mandatory packages — you book each consultation as you need it.' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * One numbered stage of the process timeline.
 *
 * Reveals itself, and grows its connector line toward the next step, so the
 * sequence reads in order as the reader scrolls rather than arriving at once.
 */
function ProcessStep({
  step, index, isLast,
}: {
  step: { title: string; when: string; desc: string };
  index: number;
  isLast: boolean;
}) {
  const { ref, revealed, instant } = useReveal<HTMLLIElement>({ threshold: 0.5 });

  return (
    <li
      ref={ref}
      data-revealed={revealed}
      data-instant={instant || undefined}
      className="reveal flex gap-6"
    >
      <div className="flex flex-col items-center" aria-hidden="true">
        <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 shrink-0 z-10">
          {String(index + 1).padStart(2, '0')}
        </div>
        {!isLast && (
          <div className="w-px flex-1 my-1 bg-teal-100 relative overflow-hidden">
            {/* scaleY rather than height: transform stays off the layout path. */}
            <span
              className={`absolute inset-0 bg-teal-500 origin-top transition-transform duration-700 ease-out motion-reduce:transition-none ${
                revealed ? 'scale-y-100' : 'scale-y-0'
              }`}
              style={{ transitionDelay: '160ms' }}
            />
          </div>
        )}
      </div>
      <div className={isLast ? '' : 'pb-10'}>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
            {step.when}
          </span>
        </div>
        <p className="text-slate-500 leading-relaxed">{step.desc}</p>
      </div>
    </li>
  );
}

/**
 * Counts a stat up to its final value once scrolled into view.
 *
 * Takes the display string (e.g. "5,000+", "12 yrs") and animates only the
 * numeric part, preserving any prefix/suffix. The final rendered text is always
 * exactly the input string, so nothing depends on the animation completing.
 */
function CountUp({ value, duration = 1100 }: { value: string; duration?: number }) {
  const { ref, revealed } = useReveal<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState<string | null>(null);

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, '')) : NaN;

  useEffect(() => {
    if (!revealed || !match || Number.isNaN(target)) return;

    // Honour the OS reduced-motion setting: jump straight to the value.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / duration, 1);
      // Ease-out cubic: fast start, gentle settle.
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      setDisplay(`${match[1]}${current.toLocaleString('en-IN')}${match[3]}`);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(null); // hand back to the exact source string
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [revealed, target, duration, value]);

  return <span ref={ref}>{display ?? value}</span>;
}

function SectionEyebrow({ children, center, dark }: { children: React.ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <span
      className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 ${
        dark
          ? 'text-teal-400 bg-teal-600/20 border border-teal-600/30'
          : 'text-teal-600 bg-teal-50 border border-teal-100'
      } ${center ? 'mx-auto' : ''}`}
    >
      {children}
    </span>
  );
}

function TierCard({
  name, price, duration, desc, features, featured, bookingHref,
}: {
  name: string; price: string; duration: string; desc: string;
  features: string[]; featured: boolean; bookingHref: string;
}) {
  return (
    <div
      className={`lift rounded-2xl p-7 ${
        featured
          ? 'bg-slate-900 border border-slate-900 shadow-2xl shadow-slate-300/50 md:-mt-4 md:pb-11 hover:shadow-slate-400/50'
          : 'bg-white border border-slate-100 hover:shadow-lg hover:shadow-slate-100 hover:border-teal-200'
      }`}
    >
      {featured && (
        <span className="inline-block text-xs font-bold text-teal-400 bg-teal-600/20 border border-teal-600/30 px-3 py-1 rounded-full mb-4">
          Start here
        </span>
      )}
      <h3 className={`text-base font-extrabold mb-1 ${featured ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
      <p className={`text-sm mb-5 ${featured ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>

      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-3xl font-extrabold ${featured ? 'text-white' : 'text-slate-900'}`}>{price}</span>
      </div>
      <p className={`text-xs font-semibold mb-6 ${featured ? 'text-teal-400' : 'text-teal-600'}`}>{duration}</p>

      <ul className="space-y-3 mb-7">
        {features.map(f => (
          <li key={f} className="flex gap-2.5">
            <svg
              className={`w-4 h-4 shrink-0 mt-0.5 ${featured ? 'text-teal-400' : 'text-teal-600'}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className={`text-sm leading-relaxed ${featured ? 'text-slate-300' : 'text-slate-600'}`}>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={bookingHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`block text-center w-full py-3 rounded-xl text-sm font-bold transition-[background-color,color,border-color,box-shadow] duration-300 active:scale-[0.98] ${
          featured
            ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-600/30'
            : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-teal-300 hover:text-teal-700'
        }`}
      >
        Book this →
      </a>
    </div>
  );
}

function ConditionCard({ icon, title, tag, desc, items }: {
  icon: string; title: string; tag: string; desc: string; items: string[];
}) {
  return (
    <div className="lift group bg-white border border-slate-100 rounded-2xl p-7 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50">
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl transition-[background-color,transform] duration-300 group-hover:bg-teal-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          aria-hidden="true"
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">{tag}</span>
      </div>
      <h3 className="text-base font-extrabold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(i => (
          <span key={i} className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, quote, stars }: {
  name: string; role: string; quote: string; stars: number;
}) {
  return (
    <figure className="lift bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-100 hover:border-teal-200">
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: stars }).map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-slate-600 text-sm leading-relaxed mb-6">"{quote}"</blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{name}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-white border border-slate-100 rounded-2xl overflow-hidden transition-colors duration-300 hover:border-teal-200 open:border-teal-200">
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
        <span className="text-sm font-bold text-slate-900">{q}</span>
        <svg
          className="w-5 h-5 text-teal-600 shrink-0 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <p className="px-6 pb-6 -mt-1 text-sm text-slate-500 leading-relaxed">{a}</p>
    </details>
  );
}
