'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import styles from './showcase.module.css'

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Feature {
  icon: string
  title: string
  desc: string
  color: string
}

interface Step {
  num: string
  title: string
  desc: string
}

interface Testimonial {
  quote: string
  name: string
  uni: string
  avatar: string
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const heroImages = [
  '/download (8).jpg',
  '/download (9).jpg',
  '/download (10).jpg',
  '/download (11).jpg',
  '/Bedsitters for Rent.jpg',
  '/Cosy Bedsitter arrangement design.jpg',
  '/Complejo de 13 departamentos en Mendoza_ Argentina_.jpg',
  '/The Beginners Guide To Real Estate Investing - Fox Real Estate.jpg',
]

const galleryImages = [
  { src: '/Cosy Bedsitter arrangement design.jpg', title: 'Cosy Bedsitter', location: 'Westlands, Nairobi' },
  { src: '/download (10).jpg', title: 'Modern Studio', location: 'Ruiru, Kiambu' },
  { src: '/Complejo de 13 departamentos en Mendoza_ Argentina_.jpg', title: 'Apartment Complex', location: 'Thika Road' },
  { src: '/download (11).jpg', title: 'Student Housing', location: 'Juja, Kiambu' },
  { src: '/Bedsitters for Rent.jpg', title: 'Bedsitter Suite', location: 'Rongai, Kajiado' },
  { src: '/The Beginners Guide To Real Estate Investing - Fox Real Estate.jpg', title: 'Premium Apartments', location: 'Kilimani, Nairobi' },
  { src: '/download (8).jpg', title: 'Shared Living', location: 'Kasarani, Nairobi' },
  { src: '/download (9).jpg', title: 'Single Room', location: 'Ngong Road' },
]

const features: Feature[] = [
  { icon: '🛡️', title: 'Verified Listings', desc: 'Every property is physically inspected for safety, cleanliness, and quality. Zero scams.', color: '#2DB670' },
  { icon: '📍', title: 'Campus-Centric', desc: 'Filter rooms by walking distance from your university. No more long commutes.', color: '#2196F3' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Browse, schedule viewings, and secure your room — all within the platform.', color: '#FF9800' },
  { icon: '⭐', title: 'Student Reviews', desc: 'Real reviews from real students who lived there. No fake ratings, ever.', color: '#E91E63' },
  { icon: '💬', title: 'Direct Chat', desc: 'Message landlords directly. No middlemen, no brokerage fees, just conversation.', color: '#9C27B0' },
  { icon: '🏪', title: 'Marketplace', desc: 'Buy and sell student essentials. Furniture, books, appliances — all in one place.', color: '#2DB670' },
]

const steps: Step[] = [
  { num: '01', title: 'Create Account', desc: 'Sign up free in under 2 minutes with your student email' },
  { num: '02', title: 'Set Preferences', desc: 'Tell us your budget, room type, and preferred distance from campus' },
  { num: '03', title: 'Browse & Book', desc: 'View verified listings and schedule viewings instantly' },
  { num: '04', title: 'Move In', desc: 'Chat with your landlord, confirm your room, and move in stress-free' },
]

const testimonials: Testimonial[] = [
  { quote: "Found my bedsitter in Westlands in literally 20 minutes. No agent fees, no drama.", name: "Amara K.", uni: "UoN Student", avatar: "A" },
  { quote: "Listed my property and had 5 inquiries within 2 days. CampusHub is a game changer.", name: "Mr. Ochieng", uni: "Landlord, Ruiru", avatar: "O" },
  { quote: "The verified badge gave me peace of mind as a first-year student.", name: "Faith M.", uni: "JKUAT Student", avatar: "F" },
  { quote: "Moved from Mombasa, didn't know Nairobi at all. CampusHub sorted me out completely.", name: "Brian T.", uni: "Strathmore Student", avatar: "B" },
  { quote: "My tenancy rate went from 70% to 98% since listing on CampusHub.", name: "Mrs. Wanjiku", uni: "Landlord, Thika Rd", avatar: "W" },
  { quote: "The campus-centric filter is pure genius. 5 mins walk to KU gates!", name: "Cynthia A.", uni: "KU Student", avatar: "C" },
]

// ─── COUNTER COMPONENT ───────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix
      },
    })
    return () => controls.stop()
  }, [inView, to, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── 3D TILT CARD ────────────────────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 12
    ref.current.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

// ─── HERO IMAGE SLIDESHOW ────────────────────────────────────────────────────
function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.heroSlideshow}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={styles.heroSlide}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <Image
            src={heroImages[currentIndex]}
            alt="Student housing"
            fill
            style={{ objectFit: 'cover' }}
            priority={currentIndex === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className={styles.heroOverlay} />
      {/* Slide indicators */}
      <div className={styles.slideIndicators}>
        {heroImages.map((_, i) => (
          <button
            key={i}
            className={`${styles.slideIndicator} ${i === currentIndex ? styles.slideIndicatorActive : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── GALLERY LIGHTBOX ────────────────────────────────────────────────────────
function GalleryLightbox({ image, onClose }: { image: typeof galleryImages[0]; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className={styles.lightboxOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.lightboxContent}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.lightboxClose} onClick={onClose}>✕</button>
        <div className={styles.lightboxImageWrap}>
          <Image
            src={image.src}
            alt={image.title}
            fill
            style={{ objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
            sizes="(max-width: 768px) 95vw, 800px"
          />
        </div>
        <div className={styles.lightboxInfo}>
          <h3>{image.title}</h3>
          <p>📍 {image.location}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee({ items }: { items: Testimonial[] }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{ display: 'flex', gap: '1.5rem', width: 'max-content' }}
        animate={{ x: [0, -50 * items.length * 16] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((t, i) => (
          <div key={i} className={styles.testimonialCard}>
            <p className={styles.testimonialQuote}>&quot;{t.quote}&quot;</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.avatar}>{t.avatar}</div>
              <div>
                <div className={styles.authorName}>{t.name}</div>
                <div className={styles.authorUni}>{t.uni}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── SECTION REVEAL ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ShowcasePage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, -80])
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<typeof galleryImages[0] | null>(null)

  return (
    <div className={styles.root}>
      {/* ── NAVBAR ── */}
      <motion.nav
        className={styles.navbar}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#2DB670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(45,182,112,0.15)" />
                <polyline points="9 22 9 12 15 12 15 22" stroke="#2DB670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={styles.logoText}>Campus<span className={styles.logoAccent}>Hub</span></span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how" className={styles.navLink}>How It Works</a>
            <a href="#gallery" className={styles.navLink}>Gallery</a>
            <a href="#landlords" className={styles.navLink}>For Landlords</a>
            <a href="#testimonials" className={styles.navLink}>Reviews</a>
          </div>
          <div className={styles.navActions}>
            <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.navLogin}>Log In</a>
            <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.navCta}>
              Sign Up <span className={styles.arrow}>→</span>
            </a>
          </div>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`${styles.menuLine} ${menuOpen ? styles.menuLineTop : ''}`} />
            <div className={`${styles.menuLine} ${menuOpen ? styles.menuLineMid : ''}`} />
            <div className={`${styles.menuLine} ${menuOpen ? styles.menuLineBot : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href="#features" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#gallery" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Gallery</a>
            <a href="#landlords" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>For Landlords</a>
            <a href="#testimonials" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Reviews</a>
            <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.mobileCta}>Sign Up →</a>
          </motion.div>
        )}
      </motion.nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <HeroSlideshow />

        <motion.div className={styles.heroContent} style={{ y: heroY }}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.badgeDot} />
            Trusted
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Find Your Perfect
            <br />
            <span className={styles.heroTitleGreen}>Campus Home</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            The safest way to find verified, affordable off-campus housing near
            your university. No scams. No surprises. Just quality student
            accommodation.
          </motion.p>

          <motion.div
            className={styles.heroSearchBar}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <div className={styles.searchInputWrap}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search by location or university..."
                className={styles.searchInput}
              />
            </div>
            <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.searchBtn}>
              Find Rooms <span className={styles.arrow}>→</span>
            </a>
          </motion.div>

          <motion.div
            className={styles.heroPills}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {['✅ Free to browse', '🔒 Verified listings', '💸 No hidden fees'].map((p, i) => (
              <span key={i} className={styles.pill}>{p}</span>
            ))}
          </motion.div>
        </motion.div>
      </section>


      {/* ── FEATURES ── */}
      <section id="features" className={styles.section}>
        <Reveal>
          <div className={styles.sectionTag}>Why CampusHub</div>
          <h2 className={styles.sectionTitle}>
            Built for students,
            <br />
            <span className={styles.green}>by people who get it.</span>
          </h2>
          <p className={styles.sectionSub}>
            Everything you need to find, secure, and settle into your perfect student home.
          </p>
        </Reveal>

        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <TiltCard className={styles.featureCard}>
                <div className={styles.featureCardGlow} style={{ background: f.color }} />
                <div className={styles.featureIcon} style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className={styles.sectionAlt}>
        <div className={styles.howInner}>
          <Reveal>
            <div className={styles.sectionTag}>The Process</div>
            <h2 className={styles.sectionTitle}>
              Move in 4 simple<br />
              <span className={styles.green}>steps.</span>
            </h2>
          </Reveal>

          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className={styles.stepCard}>
                  <div className={styles.stepNum}>{s.num}</div>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepDesc}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className={styles.howCta}>
              <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.primaryBtn}>
                <span>Start Your Search</span>
                <span className={styles.btnGlow} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className={styles.section}>
        <Reveal>
          <div className={styles.sectionTag}>Gallery</div>
          <h2 className={styles.sectionTitle}>
            Explore available
            <br />
            <span className={styles.green}>student spaces.</span>
          </h2>
          <p className={styles.sectionSub}>
            Browse through real photos of verified student accommodations near top Kenyan universities.
          </p>
        </Reveal>

        <div className={styles.galleryGrid}>
          {galleryImages.map((img, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <motion.div
                className={styles.galleryCard}
                whileHover={{ y: -6 }}
                onClick={() => setLightboxImage(img)}
              >
                <div className={styles.galleryImageWrap}>
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className={styles.galleryImageOverlay}>
                    <span className={styles.galleryViewBtn}>View</span>
                  </div>
                </div>
                <div className={styles.galleryCardInfo}>
                  <h4 className={styles.galleryCardTitle}>{img.title}</h4>
                  <p className={styles.galleryCardLocation}>📍 {img.location}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxImage && (
          <GalleryLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        )}
      </AnimatePresence>

      {/* ── FOR STUDENTS ── */}
      <section className={styles.splitSection}>
        <div className={styles.splitContent}>
          <Reveal>
            <div className={styles.sectionTag}>For Students</div>
            <h2 className={styles.sectionTitle}>
              Your next home is
              <br />
              <span className={styles.green}>closer than you think.</span>
            </h2>
            <p className={styles.sectionSub}>
              Stop paying agents. Stop getting scammed. Start browsing hundreds of verified rooms near your campus right now — for free.
            </p>
            <ul className={styles.benefitsList}>
              {[
                'Browse rooms by distance from your university',
                'Chat directly with verified landlords',
                'Read real reviews from fellow students',
                'No hidden fees, no broker commissions',
              ].map((b, i) => (
                <motion.li key={i} className={styles.benefitItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <span className={styles.checkIcon}>✓</span> {b}
                </motion.li>
              ))}
            </ul>
            <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.primaryBtn}>
              <span>Find My Room</span>
              <span className={styles.btnGlow} />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.2} className={styles.splitVisual}>
          <div className={styles.splitImageWrap}>
            <Image
              src="/Cosy Bedsitter arrangement design.jpg"
              alt="Cosy student room"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className={styles.splitImageBadge}>✅ Verified</div>
          </div>
        </Reveal>
      </section>

      {/* ── FOR LANDLORDS ── */}
      <section id="landlords" className={styles.splitSectionReverse}>
        <Reveal delay={0.2} className={styles.splitVisual}>
          <div className={styles.splitImageWrap}>
            <Image
              src="/Complejo de 13 departamentos en Mendoza_ Argentina_.jpg"
              alt="Apartment complex"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
        <div className={styles.splitContent}>
          <Reveal>
            <div className={styles.sectionTag} style={{ borderColor: '#FF9800', color: '#FF9800' }}>For Landlords</div>
            <h2 className={styles.sectionTitle}>
              Fill your units
              <br />
              <span style={{ color: '#FF9800' }}>faster than ever.</span>
            </h2>
            <p className={styles.sectionSub}>
              Join thousands of landlords reaching Kenya&apos;s largest network of verified student tenants directly.
            </p>
            <ul className={styles.benefitsList}>
              {[
                'Reach 12,000+ students actively searching',
                'Get a verified badge for increased trust',
                'Manage inquiries and bookings in one dashboard',
                'Flexible plans — list from KES 300/month',
              ].map((b, i) => (
                <motion.li key={i} className={styles.benefitItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <span className={styles.checkIconGold}>✓</span> {b}
                </motion.li>
              ))}
            </ul>
            <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.goldBtn}>
              <span>List Your Property</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className={styles.testimonialSection}>
        <Reveal>
          <div className={styles.sectionTag}>Real Stories</div>
          <h2 className={styles.sectionTitle}>
            Students & landlords
            <br />
            <span className={styles.green}>love CampusHub.</span>
          </h2>
        </Reveal>
        <div style={{ marginTop: '3rem' }}>
          <Marquee items={testimonials} />
        </div>
      </section>

      {/* ── UNIVERSITIES ── */}
      <section className={styles.uniSection}>
        <Reveal>
          <p className={styles.uniLabel}>Trusted by students from Kenya&apos;s top universities</p>
        </Reveal>
        <div className={styles.uniGrid}>
          {['University of Nairobi', 'JKUAT', 'Strathmore', 'KU', 'Daystar', 'USIU', 'MKU', 'Kabarak'].map((u, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className={styles.uniTag}>{u}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <Reveal>
          <div className={styles.ctaInner}>
            <div className={styles.ctaBadge}>🏠 Join Today</div>
            <h2 className={styles.ctaTitle}>
              Your perfect campus home
              <br />
              <span className={styles.green}>is one click away.</span>
            </h2>
            <p className={styles.ctaSub}>
              Join 12,000+ students who&apos;ve found their home through CampusHub.
              <br />Free to browse. No hidden fees. Verified listings only.
            </p>
            <div className={styles.ctaBtns}>
              <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.primaryBtnLg}>
                <span>Find a Room Now</span>
                <span className={styles.btnGlow} />
              </a>
              <a href="https://campushub.yreen.co.ke/" target="_blank" rel="noreferrer" className={styles.outlineBtn}>
                List Your Property →
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.logo} style={{ marginBottom: '0.75rem' }}>
              <div className={styles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#2DB670" strokeWidth="2" fill="rgba(45,182,112,0.15)" />
                  <polyline points="9 22 9 12 15 12 15 22" stroke="#2DB670" strokeWidth="2" />
                </svg>
              </div>
              <span className={styles.logoText}>Campus<span className={styles.logoAccent}>Hub</span></span>
            </div>
            <p className={styles.footerTagline}>Student housing made simple.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Platform</div>
              <a href="#" className={styles.footerLink}>Browse Rooms</a>
              <a href="#" className={styles.footerLink}>Make Request</a>
              <a href="#" className={styles.footerLink}>Marketplace</a>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Landlords</div>
              <a href="#" className={styles.footerLink}>List Property</a>
              <a href="#" className={styles.footerLink}>Pricing</a>
              <a href="#" className={styles.footerLink}>Dashboard</a>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Company</div>
              <a href="#" className={styles.footerLink}>About</a>
              <a href="#" className={styles.footerLink}>Contact</a>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 CampusHub Kenya. All rights reserved.</span>
          <span className={styles.footerBottomAccent}>Built for Kenyan students 🇰🇪</span>
        </div>
      </footer>
    </div>
  )
}