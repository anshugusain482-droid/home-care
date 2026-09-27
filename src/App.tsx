import { useEffect, useMemo, useState } from "react";
import heroImage from "./imports/Screenshot_2026-09-26_122639.png";

type Screen = "home" | "services" | "caregivers" | "recipient" | "schedule" | "checkout" | "success";

type CareRecipient = {
  relationship: "Myself" | "Parent" | "Grandparent" | "Spouse" | "Other";
  name: string;
  phone: string;
  useForUpdates: boolean;
};

type Caregiver = {
  id: number;
  name: string;
  initials: string;
  qualification: string;
  rating: number;
  reviews: number;
  experience: number;
  specializations: string[];
  languages: string[];
  availability: string;
  slots: string[];
  price: number;
  about: string;
  qualifications: string[];
};

type CareSchedule = {
  date: string;
  time: string;
  duration: string;
};

type Service = {
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  rating: string;
  icon: IconName;
};

type IconName =
  | "heart"
  | "shield"
  | "activity"
  | "doctor"
  | "lab"
  | "equipment"
  | "clock"
  | "calendar"
  | "check"
  | "phone"
  | "search"
  | "arrow"
  | "star"
  | "location"
  | "card"
  | "cash"
  | "upi"
  | "menu"
  | "close";

const iconPaths: Record<IconName, React.ReactNode> = {
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4" />,
  activity: <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />,
  doctor: <><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M5 21a7 7 0 0 1 14 0M19 3v4M17 5h4" /></>,
  lab: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M8 15h8" /></>,
  equipment: <><path d="M6 20v-5a6 6 0 0 1 12 0v5M4 20h16M9 8V4h6v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  arrow: <path d="m9 18 6-6-6-6" />,
  star: <path d="m12 2 3 6 6.5 1-4.8 4.7 1.1 6.5L12 17l-5.8 3.2 1.1-6.5L2.5 9 9 8l3-6Z" />,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 9v6M18 9v6" /></>,
  upi: <path d="M5 4h6l-4 16H1L5 4Zm9 0h4l5 8-9 8 4-8-4-8Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

const services: Service[] = [
  { name: "Home Nursing", category: "Nursing", description: "Qualified nurses for injections, wound care, IV therapy and daily clinical support.", duration: "2–12 hours", price: "₹799", rating: "4.9", icon: "heart" },
  { name: "Elder Care", category: "Elder Care", description: "Patient, compassionate assistance for everyday comfort, mobility and companionship.", duration: "4–24 hours", price: "₹699", rating: "4.8", icon: "shield" },
  { name: "Physiotherapy", category: "Physiotherapy", description: "Personalised recovery sessions with certified physiotherapists at your home.", duration: "45–60 min", price: "₹599", rating: "4.9", icon: "activity" },
  { name: "Doctor Visit", category: "Doctor Consultation", description: "Experienced physicians for diagnosis, consultation and follow-up care.", duration: "30–45 min", price: "₹999", rating: "4.8", icon: "doctor" },
  { name: "Lab Tests", category: "Lab Tests", description: "Safe sample collection at home with digital reports from accredited labs.", duration: "15–30 min", price: "₹399", rating: "4.7", icon: "lab" },
  { name: "Medical Equipment", category: "Equipment", description: "Hospital-grade equipment delivered, installed and demonstrated at home.", duration: "Flexible rental", price: "₹499", rating: "4.8", icon: "equipment" },
];

const caregivers: Caregiver[] = [
  { id: 1, name: "Anita Rao", initials: "AR", qualification: "Registered Nurse, RN", rating: 4.9, reviews: 128, experience: 8, specializations: ["Elder Care", "Wound Care", "IV Therapy"], languages: ["Hindi", "English"], availability: "Available today", slots: ["9:00 AM", "10:30 AM", "1:00 PM", "4:30 PM"], price: 799, about: "Anita provides calm, attentive clinical care with a focus on elderly patients and post-surgery recovery.", qualifications: ["B.Sc. Nursing", "Registered Nurse Council certification", "Advanced wound-care training"] },
  { id: 2, name: "Rohan Mehta", initials: "RM", qualification: "Senior Caregiver", rating: 4.8, reviews: 94, experience: 6, specializations: ["Mobility Support", "Dementia Care"], languages: ["Hindi", "English", "Marathi"], availability: "Available today", slots: ["10:30 AM", "12:00 PM", "3:00 PM"], price: 699, about: "Rohan supports daily routines, mobility and companionship while helping families maintain a safe home environment.", qualifications: ["Certified General Duty Assistant", "Dementia care certification", "First aid trained"] },
  { id: 3, name: "Dr. Neha Kapoor", initials: "NK", qualification: "Physiotherapist, MPT", rating: 4.9, reviews: 156, experience: 10, specializations: ["Post-surgery Rehab", "Pain Management"], languages: ["Hindi", "English", "Punjabi"], availability: "Next available tomorrow", slots: ["9:00 AM", "1:00 PM", "5:30 PM"], price: 999, about: "Neha creates practical recovery plans for mobility, strength and pain management in the comfort of home.", qualifications: ["Master of Physiotherapy", "Orthopaedic rehabilitation certification", "10 years clinical practice"] },
  { id: 4, name: "Sana Ali", initials: "SA", qualification: "Registered Nurse, GNM", rating: 4.7, reviews: 81, experience: 5, specializations: ["Medication Support", "Diabetes Care"], languages: ["Hindi", "English", "Urdu"], availability: "Available today", slots: ["9:00 AM", "12:00 PM", "4:30 PM"], price: 749, about: "Sana combines clinical precision with clear communication so patients and families always understand the care plan.", qualifications: ["General Nursing and Midwifery", "Diabetes educator training", "Basic life support certification"] },
  { id: 5, name: "Vikram Singh", initials: "VS", qualification: "Home Health Aide", rating: 4.8, reviews: 73, experience: 7, specializations: ["Elder Care", "Daily Living Support"], languages: ["Hindi", "English"], availability: "Available this week", slots: ["10:30 AM", "3:00 PM", "5:30 PM"], price: 649, about: "Vikram offers dependable personal assistance, mobility support and companionship for older adults.", qualifications: ["Certified Home Health Aide", "Elder-care specialization", "First aid trained"] },
  { id: 6, name: "Pooja Nair", initials: "PN", qualification: "Critical Care Nurse", rating: 4.9, reviews: 112, experience: 9, specializations: ["Post-operative Care", "IV Therapy"], languages: ["English", "Hindi", "Malayalam"], availability: "Available tomorrow", slots: ["9:00 AM", "1:00 PM", "4:30 PM"], price: 899, about: "Pooja supports complex recovery needs with careful monitoring and reassuring communication.", qualifications: ["B.Sc. Nursing", "Critical-care certification", "Advanced cardiac life support"] },
];

function Button({ children, variant = "primary", onClick, icon }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; icon?: IconName }) {
  return <button className={`button button-${variant}`} onClick={onClick}>{children}{icon && <Icon name={icon} size={17} />}</button>;
}

function Logo({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  return <button className={`logo ${light ? "logo-light" : ""}`} onClick={onClick ?? (() => window.scrollTo({ top: 0, behavior: "smooth" }))}><span className="logo-mark"><Icon name="heart" size={19} /></span><span>Home<span>Care</span></span></button>;
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Header({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const [open, setOpen] = useState(false);
  const goHome = (id?: string) => {
    setScreen("home");
    setOpen(false);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 20);
  };
  const flowSteps: { screen: Screen; label: string }[] = [
    { screen: "services", label: "Service" },
    { screen: "caregivers", label: "Caregiver" },
    { screen: "recipient", label: "Recipient" },
    { screen: "schedule", label: "Schedule" },
    { screen: "checkout", label: "Review" },
    { screen: "success", label: "Confirmed" },
  ];
  const activeStep = flowSteps.findIndex((step) => step.screen === screen);
  return (
    <header className="header">
      <div className="container nav">
        <Logo onClick={() => goHome()} />
        <nav className={open ? "nav-links nav-open" : "nav-links"}>
          <button onClick={() => goHome()}>Home</button>
          <button onClick={() => goHome("services")}>Services</button>
          <button onClick={() => goHome("about")}>About</button>
          <button onClick={() => goHome("contact")}>Contact</button>
        </nav>
        <div className="nav-actions">
          <button className="login">Log in</button>
          <button className="signup">Sign up</button>
          <Button onClick={() => setScreen("services")}>Book Care Now</Button>
        </div>
        <button className="menu-button" aria-label="Open navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      </div>
      {screen !== "home" && <div className="progress-bar">{flowSteps.map((step, index) => <span key={step.screen} className={index === activeStep ? "active" : index < activeStep ? "done" : ""}>{index + 1}. {step.label}</span>)}</div>}
    </header>
  );
}

function Home({ setScreen, selectService }: { setScreen: (s: Screen) => void; selectService: (s: Service) => void }) {
  const [homeCategory, setHomeCategory] = useState("All");
  const [homeQuery, setHomeQuery] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const features = [
    ["shield", "Verified professionals", "Every caregiver is background-checked and credential verified."],
    ["card", "Transparent pricing", "Clear costs before you book, with no hidden charges."],
    ["clock", "Quick booking", "Find and confirm trusted care in just a few minutes."],
    ["phone", "24/7 support", "A caring support team whenever you need a hand."],
  ] as const;
  const reviews = [
    ["PS", "Priya Sharma", "Booked for her mother", "The nurse was warm, punctual and extremely professional. Mom felt comfortable from the very first visit."],
    ["AM", "Arjun Mehta", "Post-surgery care", "Booking was simple and the care coordinator kept us updated throughout. It gave our family real peace of mind."],
    ["NV", "Neha Verma", "Physiotherapy", "Our therapist was knowledgeable and patient. The home sessions made recovery so much less stressful."],
  ];
  const homeCategories = ["All", "Nursing", "Elder Care", "Physiotherapy", "Lab Tests", "Doctor Consultation"];
  const visibleServices = services.filter((service) => (homeCategory === "All" || service.category === homeCategory) && service.name.toLowerCase().includes(homeQuery.toLowerCase()));
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  return (
    <main>
      <section className="hero">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="pill"><Icon name="shield" size={15} />Trusted care, right at home</div>
            <h1>Home Healthcare Made<br /><em>Simple &amp; Reliable</em></h1>
            <p className="hero-text">Book verified nurses, caregivers, physiotherapists and doctors for your loved ones—without leaving home.</p>
            <div className="hero-buttons"><Button onClick={() => setScreen("services")} icon="arrow">Book a Service</Button><Button variant="secondary" onClick={scrollToContact} icon="phone">Talk to an Expert</Button></div>
            <div className="hero-trust"><span><Icon name="check" size={13} />5000+ Happy Families</span><span><Icon name="shield" size={13} />Verified Professionals</span><span><Icon name="clock" size={13} />24/7 Support</span></div>
          </div>
          <div className="hero-visual">
            <div className="image-frame">
              <img src={heroImage} alt="A home-care nurse and family member supporting an elderly patient" />
            </div>
          </div>
        </div>
        <div className="container stat-row">
          <div><strong>5,000+</strong><span>Families supported</span></div><div><strong>200+</strong><span>Verified professionals</span></div><div><strong>15+</strong><span>Cities covered</span></div><div><strong>4.9<span>★</span></strong><span>Average rating</span></div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <SectionHeading eyebrow="CARE FOR EVERY NEED" title="Popular healthcare services" copy="Professional support, personalised for you and delivered with compassion." />
          <div className="home-service-tools">
            <label><Icon name="search" size={16} /><input value={homeQuery} onChange={(event) => setHomeQuery(event.target.value)} placeholder="Search services..." aria-label="Search popular services" /></label>
            <div>{homeCategories.map((item) => <button className={homeCategory === item ? "active" : ""} onClick={() => setHomeCategory(item)} key={item}>{item === "Doctor Consultation" ? "Doctor" : item}</button>)}</div>
          </div>
          <div className="services-grid">
            {visibleServices.map((service) => <ServiceCard key={service.name} service={service} onSelect={() => selectService(service)} />)}
          </div>
          {!visibleServices.length && <div className="home-empty"><Icon name="search" /><strong>No matching services</strong><button onClick={() => { setHomeQuery(""); setHomeCategory("All"); }}>Clear filters</button></div>}
          <div className="center-action"><Button variant="secondary" onClick={() => setScreen("services")} icon="arrow">Explore all services</Button></div>
        </div>
      </section>

      <section className="section section-tint" id="why">
        <div className="container">
          <SectionHeading eyebrow="WHY US" title="Choose HomeCare?" copy="Built around safety, simplicity and the people you love." />
          <div className="features-grid">
            {features.map(([icon, title, copy], i) => <article className="feature-card" key={title}><span className="feature-number">0{i + 1}</span><div className="feature-icon"><Icon name={icon} /></div><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <SectionHeading eyebrow="HOW IT WORKS" title="How It Works" copy="Get professional healthcare at your doorstep in four simple steps." />
          <div className="steps">
            {[
              ["search", "Select a service", "Tell us what kind of care you need."],
              ["calendar", "Pick your schedule", "Choose a date and time that works."],
              ["check", "Confirm booking", "Review your details and payment."],
              ["heart", "Receive care", "Your professional arrives at home."],
            ].map(([icon, title, copy], i) => <div className="step" key={title}><div className="step-top"><span>{i + 1}</span><div className="step-icon"><Icon name={icon as IconName} /></div></div><h3>{title}</h3><p>{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section reviews-section" id="reviews">
        <div className="container">
          <SectionHeading eyebrow="TESTIMONIALS" title="What Families Say About Us" copy="Because the best care is felt, not just delivered." />
          <div className="reviews-grid">
            {reviews.map(([initials, name, role, review]) => <article className="review-card" key={name}><div className="stars">★★★★★</div><blockquote>“{review}”</blockquote><div className="reviewer"><span>{initials}</span><div><strong>{name}</strong><small>{role}</small></div></div></article>)}
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow">ABOUT US</p>
            <h2>Redefining home healthcare in India</h2>
            <p>HomeCare was founded with one belief: quality healthcare should feel personal, dependable and close to home. We make professional care accessible to families when they need it most.</p>
            <p>Our network brings together trusted nurses, caregivers, physiotherapists and doctors. Every professional is verified, trained and supported by our dedicated care team.</p>
            <div className="about-stats"><div><strong>5000+</strong><span>Families cared for</span></div><div><strong>200+</strong><span>Certified caregivers</span></div><div><strong>15+</strong><span>Cities</span></div><div><strong>4.9/5</strong><span>Average rating</span></div></div>
          </div>
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1758691462413-b07dee2933fe?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200"
              alt="Doctor checking an elderly patient’s blood pressure during a home consultation"
            />
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="team-grid">
            <article className="team-member" />
            <article className="team-member" />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-ring cta-ring-one" /><div className="cta-ring cta-ring-two" />
        <div className="container cta-content"><div><p className="eyebrow light">CARE STARTS HERE</p><h2>Need Healthcare Support Today?</h2><p>Book trusted, professional caregivers and nurses for your loved ones.</p></div><Button variant="secondary" onClick={() => setScreen("services")} icon="arrow">Book Care Now</Button></div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container">
          <SectionHeading eyebrow="GET IN TOUCH" title="Contact us" copy="Have a question or need help choosing a service? Our team is available 24/7 to assist you." />
          <div className="contact-grid">
            <div className="contact-list">
              <div><span><Icon name="phone" /></span><p><small>Call us</small><strong>+91 98765 43210</strong><em>Mon–Sun, 24 hours</em></p></div>
              <div><span><Icon name="heart" /></span><p><small>Email us</small><strong>support@homecare.in</strong><em>We respond within 2 hours</em></p></div>
              <div><span><Icon name="location" /></span><p><small>Visit us</small><strong>48, Green Park, New Delhi</strong><em>Delhi, India 110016</em></p></div>
              <div><span><Icon name="clock" /></span><p><small>Emergency helpline</small><strong>+91 800-HOMECARE</strong><em>For urgent care needs</em></p></div>
            </div>
            {messageSent ? <div className="contact-success"><span><Icon name="check" size={32} /></span><h3>Message received</h3><p>Thank you for reaching out. A HomeCare expert will contact you within two hours.</p><Button variant="secondary" onClick={() => setMessageSent(false)}>Send another message</Button></div> :
              <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setMessageSent(true); }}>
                <label>Full name<input required placeholder="Enter your name" /></label>
                <label>Email address<input required type="email" placeholder="you@example.com" /></label>
                <label>Message<textarea required placeholder="How can we help you?" /></label>
                <Button>Send message</Button>
              </form>}
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ service, onSelect, large = false }: { service: Service; onSelect: () => void; large?: boolean }) {
  return (
    <article className={`service-card ${large ? "service-card-large" : ""}`}>
      <div className="service-card-top"><span className="service-icon"><Icon name={service.icon} /></span><span className="rating"><Icon name="star" size={13} />{service.rating}</span></div>
      <div><p className="service-category">{service.category}</p><h3>{service.name}</h3><p className="service-description">{service.description}</p></div>
      {large && <div className="duration"><Icon name="clock" size={16} />{service.duration}</div>}
      <div className="service-bottom"><div><small>Starting from</small><strong>{service.price}<small>/visit</small></strong></div><Button onClick={onSelect} icon="arrow">{large ? "Book service" : "Book now"}</Button></div>
    </article>
  );
}

function ServicesScreen({ onBack, onContinue, initial }: { onBack: () => void; onContinue: (s: Service) => void; initial: Service | null }) {
  const [category, setCategory] = useState("All services");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Service | null>(initial);
  const categories = ["All services", "Nursing", "Elder Care", "Physiotherapy", "Lab Tests", "Doctor Consultation"];
  const filtered = useMemo(() => services.filter((service) => (category === "All services" || service.category === category) && service.name.toLowerCase().includes(query.toLowerCase())), [category, query]);
  useEffect(() => {
    if (!detail) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setDetail(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [detail]);
  return (
    <main className="inner-page">
      <div className="container">
        <button className="back-button" onClick={onBack}>← Back to home</button>
        <div className="page-title"><div><p className="eyebrow">FIND THE RIGHT SUPPORT</p><h1>How can we care for you?</h1><p>Choose from trusted healthcare services, personalised for your needs.</p></div><div className="help-badge"><Icon name="phone" /><span><small>Need help choosing?</small><strong>Call +91 800-CARE</strong></span></div></div>
        <div className="search-box"><Icon name="search" /><input aria-label="Search services" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for nursing, physiotherapy, lab tests..." /></div>
        <div className="filters">{categories.map((item) => <button className={category === item ? "filter active" : "filter"} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="services-grid service-selection">{filtered.map((service) => <ServiceCard key={service.name} service={service} large onSelect={() => setDetail(service)} />)}</div>
        {!filtered.length && <div className="empty-state"><Icon name="search" size={32} /><h3>No services found</h3><p>Try another search or category.</p></div>}
      </div>
      {detail && <div className="drawer-backdrop" onClick={() => setDetail(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" aria-label="Close details" onClick={() => setDetail(null)}><Icon name="close" /></button><span className="drawer-icon"><Icon name={detail.icon} size={30} /></span><p className="eyebrow">{detail.category}</p><h2>{detail.name}</h2><p className="drawer-intro">{detail.description}</p><div className="detail-block"><h3>What’s included</h3>{["Verified care professional", "Personalised care assessment", "All essential care supplies", "Follow-up support"].map((item) => <p key={item}><span><Icon name="check" size={15} /></span>{item}</p>)}</div><div className="price-box"><span><small>Starting price</small><strong>{detail.price}</strong></span><span><small>Typical duration</small><strong>{detail.duration}</strong></span></div><Button onClick={() => onContinue(detail)} icon="arrow">Continue booking</Button><small className="safe-note"><Icon name="shield" size={14} /> Secure booking · No payment charged yet</small></aside></div>}
    </main>
  );
}

function CaregiversScreen({ service, onBack, onSelect }: { service: Service; onBack: () => void; onSelect: (caregiver: Caregiver) => void }) {
  const [profile, setProfile] = useState<Caregiver | null>(null);
  const [experience, setExperience] = useState("All");
  const [rating, setRating] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [specialization, setSpecialization] = useState("All");
  const [language, setLanguage] = useState("All");
  const [sort, setSort] = useState("Rating");
  const [compare, setCompare] = useState<number[]>([]);
  const visibleCaregivers = useMemo(() => {
    const filtered = caregivers.filter((caregiver) =>
      (experience === "All" || caregiver.experience >= Number(experience)) &&
      (rating === "All" || caregiver.rating >= Number(rating)) &&
      (availability === "All" || caregiver.availability.toLowerCase().includes(availability.toLowerCase())) &&
      (specialization === "All" || caregiver.specializations.includes(specialization)) &&
      (language === "All" || caregiver.languages.includes(language))
    );
    return [...filtered].sort((a, b) => sort === "Experience" ? b.experience - a.experience : sort === "Availability" ? a.availability.localeCompare(b.availability) : sort === "Price" ? a.price - b.price : b.rating - a.rating);
  }, [experience, rating, availability, specialization, language, sort]);
  const toggleCompare = (id: number) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  useEffect(() => {
    if (!profile) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setProfile(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [profile]);
  return <main className="inner-page caregiver-page"><div className="container caregiver-container">
    <button className="back-button" onClick={onBack}>← Back to services</button>
    <div className="page-title"><div><p className="eyebrow">VERIFIED PROFESSIONALS</p><h1>Choose your caregiver</h1><p>Select a verified professional based on experience, expertise, reviews and availability.</p></div><div className="sample-label"><Icon name="shield" size={16} />Sample profile data</div></div>
    <div className="caregiver-filters">
      <label>Experience<select value={experience} onChange={(event) => setExperience(event.target.value)}><option>All</option><option value="5">5+ years</option><option value="8">8+ years</option></select></label>
      <label>Rating<select value={rating} onChange={(event) => setRating(event.target.value)}><option>All</option><option value="4.8">4.8+</option><option value="4.9">4.9</option></select></label>
      <label>Availability<select value={availability} onChange={(event) => setAvailability(event.target.value)}><option>All</option><option value="today">Today</option><option value="tomorrow">Tomorrow</option></select></label>
      <label>Specialization<select value={specialization} onChange={(event) => setSpecialization(event.target.value)}><option>All</option><option>Elder Care</option><option>Wound Care</option><option>IV Therapy</option><option>Post-surgery Rehab</option></select></label>
      <label>Language<select value={language} onChange={(event) => setLanguage(event.target.value)}><option>All</option><option>Hindi</option><option>English</option><option>Marathi</option><option>Punjabi</option></select></label>
      <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option>Rating</option><option>Experience</option><option>Availability</option><option>Price</option></select></label>
    </div>
    {compare.length > 0 && <div className="compare-bar"><span><Icon name="check" size={15} />{compare.length} of 3 profiles selected to compare</span><div>{compare.map((id) => <small key={id}>{caregivers.find((item) => item.id === id)?.name}<button aria-label="Remove from compare" onClick={() => toggleCompare(id)}>×</button></small>)}</div></div>}
    <div className="caregiver-grid">
      {visibleCaregivers.map((caregiver) => <article className="caregiver-profile-card" key={caregiver.id}>
        <div className="caregiver-card-head"><span className="profile-avatar">{caregiver.initials}</span><div><h2>{caregiver.name}</h2><p>{caregiver.qualification}</p></div><span className="verified-mark" title="Identity and credentials verified"><Icon name="shield" size={14} /></span></div>
        <div className="caregiver-rating"><span><Icon name="star" size={13} />{caregiver.rating}</span> · {caregiver.reviews} sample reviews</div>
        <div className="caregiver-meta"><span>{caregiver.experience} years experience</span><span><Icon name="check" size={12} />Verified professional</span></div>
        <div className="tag-list">{caregiver.specializations.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
        <p className="language-line">{caregiver.languages.join(" · ")}</p>
        <div className="availability-line"><span className="live-dot" />{caregiver.availability}</div>
        <div className="caregiver-price"><span><small>For {service.name}</small><strong>₹{caregiver.price}<small>/visit</small></strong></span><label><input type="checkbox" checked={compare.includes(caregiver.id)} disabled={!compare.includes(caregiver.id) && compare.length >= 3} onChange={() => toggleCompare(caregiver.id)} /> Compare</label></div>
        <div className="caregiver-actions"><Button variant="secondary" onClick={() => setProfile(caregiver)}>View profile</Button><Button onClick={() => onSelect(caregiver)}>Select caregiver</Button></div>
      </article>)}
    </div>
    {!visibleCaregivers.length && <div className="empty-state"><Icon name="search" size={30} /><h3>No matching caregivers</h3><p>Try adjusting one or more filters.</p></div>}
  </div>
  {profile && <div className="drawer-backdrop" onClick={() => setProfile(null)}><aside className="drawer caregiver-drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" aria-label="Close profile" onClick={() => setProfile(null)}><Icon name="close" /></button>
    <div className="profile-drawer-head"><span className="profile-avatar large">{profile.initials}</span><div><p className="eyebrow">SAMPLE PROFILE</p><h2>{profile.name}</h2><p>{profile.qualification}</p></div></div>
    <div className="profile-trust"><span><Icon name="star" size={14} />{profile.rating} · {profile.reviews} sample reviews</span><span><Icon name="shield" size={14} />Verified credentials</span><span>{profile.experience} years experience</span></div>
    <div className="profile-section"><h3>About</h3><p>{profile.about}</p></div>
    <div className="profile-section"><h3>Qualifications</h3>{profile.qualifications.map((item) => <p className="check-line" key={item}><Icon name="check" size={14} />{item}</p>)}</div>
    <div className="profile-section profile-two-col"><div><h3>Specializations</h3><p>{profile.specializations.join(", ")}</p></div><div><h3>Languages</h3><p>{profile.languages.join(", ")}</p></div></div>
    <div className="profile-service"><div><small>Service</small><strong>{service.name}</strong></div><div><small>Availability</small><strong>{profile.availability}</strong></div><div><small>Price</small><strong>₹{profile.price}/visit</strong></div></div>
    <div className="profile-section"><h3>Recent reviews <small>Sample content</small></h3><div className="mini-reviews"><article><span>★★★★★</span><p>Clear, patient and professional throughout the visit.</p><small>Sample review · Family booking</small></article><article><span>★★★★★</span><p>Arrived on time and explained every step of the care plan.</p><small>Sample review · Home visit</small></article></div></div>
    <Button onClick={() => onSelect(profile)} icon="arrow">Select caregiver</Button>
  </aside></div>}
  </main>;
}

function RecipientScreen({ caregiver, initial, onBack, onContinue }: { caregiver: Caregiver; initial: CareRecipient; onBack: () => void; onContinue: (recipient: CareRecipient) => void }) {
  const [recipient, setRecipient] = useState(initial);
  const [attempted, setAttempted] = useState(false);
  const isMyself = recipient.relationship === "Myself";
  const nameError = attempted && !isMyself && !recipient.name.trim();
  const phoneError = attempted && !isMyself && !/^[+\d][\d\s-]{9,}$/.test(recipient.phone.trim());
  const submit = () => { setAttempted(true); if (!isMyself && (nameError || !recipient.name.trim() || !/^[+\d][\d\s-]{9,}$/.test(recipient.phone.trim()))) return; onContinue(recipient); };
  return <main className="inner-page"><div className="container flow-container">
    <button className="back-button" onClick={onBack}>← Back to caregivers</button>
    <div className="page-title"><div><p className="eyebrow">CARE RECIPIENT</p><h1>Who is this care for?</h1><p>Tell us who will receive care from {caregiver.name}.</p></div></div>
    <div className="panel recipient-panel flow-panel"><div className="booking-for-label"><Icon name="heart" size={14} />Booking for someone else?</div>
      <div className="recipient-options" role="group" aria-label="Select who will receive care">{(["Myself", "Parent", "Grandparent", "Spouse", "Other"] as CareRecipient["relationship"][]).map((relationship) => <button type="button" key={relationship} aria-pressed={recipient.relationship === relationship} className={recipient.relationship === relationship ? "recipient-option active" : "recipient-option"} onClick={() => { setAttempted(false); setRecipient({ ...recipient, relationship }); }}><span className="recipient-radio">{recipient.relationship === relationship && <Icon name="check" size={12} />}</span>{relationship}</button>)}</div>
      {!isMyself && <div className="recipient-details"><div className="recipient-details-heading"><strong>Care recipient details</strong><small>Used only to coordinate care.</small></div><div className="form-grid"><label>Full name<input aria-invalid={nameError} value={recipient.name} onChange={(event) => setRecipient({ ...recipient, name: event.target.value })} placeholder="Enter full name" />{nameError && <span className="field-error">Please enter the recipient’s full name.</span>}</label><label>Phone number<input aria-invalid={phoneError} type="tel" inputMode="tel" value={recipient.phone} onChange={(event) => setRecipient({ ...recipient, phone: event.target.value })} placeholder="+91 XXXXX XXXXX" />{phoneError && <span className="field-error">Enter a valid phone number.</span>}</label><label className="full">Relationship<input value={recipient.relationship} readOnly /></label></div><label className="updates-check"><input type="checkbox" checked={recipient.useForUpdates} onChange={(event) => setRecipient({ ...recipient, useForUpdates: event.target.checked })} /><span><strong>Use this person’s phone number for booking updates</strong><small>Booking confirmations and care updates can be sent to this number.</small></span></label></div>}
      <div className="flow-actions"><Button variant="secondary" onClick={onBack}>Back</Button><Button onClick={submit} icon="arrow">Continue to schedule</Button></div>
    </div>
  </div></main>;
}

function ScheduleScreen({ caregiver, initial, onBack, onContinue }: { caregiver: Caregiver; initial: CareSchedule; onBack: () => void; onContinue: (schedule: CareSchedule) => void }) {
  const [schedule, setSchedule] = useState(initial);
  const available = caregiver.slots.includes(schedule.time);
  return <main className="inner-page"><div className="container flow-container">
    <button className="back-button" onClick={onBack}>← Back to care recipient</button>
    <div className="page-title"><div><p className="eyebrow">DATE &amp; TIME</p><h1>Schedule your care</h1><p>Choose a convenient time based on {caregiver.name}’s availability.</p></div></div>
    <div className="panel flow-panel"><div className="schedule-caregiver"><span className="profile-avatar">{caregiver.initials}</span><div><strong>{caregiver.name}</strong><small>{caregiver.qualification}</small></div><span><Icon name="shield" size={14} />Verified</span></div>
      <div className="schedule-grid"><label>Date<input type="date" value={schedule.date} min="2025-06-18" onChange={(event) => setSchedule({ ...schedule, date: event.target.value })} /></label><label>Duration<select value={schedule.duration} onChange={(event) => setSchedule({ ...schedule, duration: event.target.value })}><option>1 hour</option><option>2 hours</option><option>4 hours</option><option>8 hours</option></select></label></div>
      <div className="time-slots"><label>Available times</label><div>{["9:00 AM", "10:30 AM", "12:00 PM", "1:00 PM", "3:00 PM", "4:30 PM", "5:30 PM"].map((time) => <button key={time} disabled={!caregiver.slots.includes(time)} className={schedule.time === time ? "active" : ""} onClick={() => setSchedule({ ...schedule, time })}>{time}</button>)}</div></div>
      <div className={available ? "availability-message" : "availability-message unavailable"}><Icon name={available ? "check" : "clock"} size={15} />{available ? `${caregiver.name} is available at this time.` : "This caregiver is not available at this time. Choose another time or caregiver."}</div>
      <div className="flow-actions"><Button variant="secondary" onClick={onBack}>Back</Button><Button onClick={() => available && onContinue(schedule)} icon="arrow">Review booking</Button></div>
    </div>
  </div></main>;
}

function Checkout({ service, caregiver, recipient, schedule, onBack, onSuccess }: { service: Service; caregiver: Caregiver; recipient: CareRecipient; schedule: CareSchedule; onBack: () => void; onSuccess: (bookedBy: string) => void }) {
  const [payment, setPayment] = useState("UPI");
  const [bookedBy, setBookedBy] = useState("Aarav Sharma");
  const [bookingPhone, setBookingPhone] = useState("+91 98765 43210");
  const isMyself = recipient.relationship === "Myself";
  const recipientName = isMyself ? bookedBy : recipient.name;
  const recipientPhone = isMyself ? bookingPhone : recipient.phone;
  const displayDate = new Date(`${schedule.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main className="inner-page checkout-page"><div className="container narrow">
      <button className="back-button" onClick={onBack}>← Back to schedule</button>
      <div className="page-title"><div><p className="eyebrow">ALMOST THERE</p><h1>Review and confirm</h1><p>Check your booking details before confirming care.</p></div></div>
      <div className="checkout-grid">
        <section className="checkout-form">
          <div className="panel"><div className="panel-heading"><span>1</span><div><h2>Care details</h2><p>Booking contact and service address</p></div></div><div className="form-grid"><label>Booked by<input value={bookedBy} onChange={(event) => setBookedBy(event.target.value)} /></label><label>Phone number<input type="tel" value={bookingPhone} onChange={(event) => setBookingPhone(event.target.value)} /></label><label className="full">Care address<input defaultValue="42, Green Park, New Delhi – 110016" /></label></div></div>
          <div className="panel"><div className="panel-heading"><span>2</span><div><h2>Payment method</h2><p>Choose how you’d like to pay</p></div></div><div className="payment-options">{[["upi", "UPI", "Google Pay, PhonePe, BHIM"], ["card", "Card", "Credit or debit card"], ["cash", "Cash", "Pay after service"]].map(([icon, name, copy]) => <button key={name} onClick={() => setPayment(name)} className={payment === name ? "payment active" : "payment"}><span><Icon name={icon as IconName} /></span><div><strong>{name}</strong><small>{copy}</small></div><i /></button>)}</div></div>
        </section>
        <aside className="summary panel"><p className="eyebrow">BOOKING SUMMARY</p><div className="summary-service"><span className="profile-avatar small-avatar">{caregiver.initials}</span><div><h3>{caregiver.name}</h3><p>{caregiver.qualification}</p><small>{caregiver.experience} years · {caregiver.rating} ★ · Verified</small></div></div><div className="recipient-summary"><div><span>CARE FOR</span><strong>{recipientName}</strong><small>{recipient.relationship}</small></div>{recipientPhone && <div><span>CONTACT</span><strong>{recipientPhone}</strong>{!isMyself && recipient.useForUpdates && <small>Receives updates</small>}</div>}</div><div className="summary-list"><p><span><Icon name={service.icon} />Service</span><strong>{service.name}</strong></p><p><span><Icon name="calendar" />Date</span><strong>{displayDate}</strong></p><p><span><Icon name="clock" />Time</span><strong>{schedule.time} · {schedule.duration}</strong></p><p><span><Icon name="location" />Address</span><strong>Green Park, Delhi</strong></p><p><span><Icon name="card" />Payment</span><strong>{payment}</strong></p></div><div className="arrival"><span className="live-dot" /><div><strong>{caregiver.name} is available</strong><small>Confirmed for your selected time</small></div></div><div className="total"><span>Total payable</span><strong>₹{caregiver.price}</strong></div><Button onClick={() => onSuccess(bookedBy)} icon="check">Confirm booking</Button><small className="safe-note"><Icon name="shield" size={14} /> Your details are private and secure</small></aside>
      </div>
    </div></main>
  );
}

function Success({ service, caregiver, recipient, schedule, bookedBy, onHome }: { service: Service; caregiver: Caregiver; recipient: CareRecipient; schedule: CareSchedule; bookedBy: string; onHome: () => void }) {
  const careFor = recipient.relationship === "Myself" ? bookedBy : recipient.name;
  const displayDate = new Date(`${schedule.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return <main className="success-page"><div className="success-card"><div className="success-illustration"><div className="success-ring"><Icon name="check" size={48} /></div><span className="spark one" /><span className="spark two" /><span className="spark three" /></div><p className="eyebrow">BOOKING ID · HC20482</p><h1>Booking confirmed<br />successfully</h1><p className="success-copy">Your caregiver has been assigned and will arrive at the scheduled time. We’ve sent the details to your phone.</p>{recipient.relationship !== "Myself" && <div className="booking-people"><div><small>BOOKED BY</small><strong>{bookedBy}</strong></div><Icon name="arrow" /><div><small>CARE FOR</small><strong>{careFor}</strong><span>{recipient.relationship}</span></div></div>}<div className="caregiver-card"><div className="caregiver-avatar">{caregiver.initials}</div><div><small>Your caregiver</small><strong>{caregiver.name} <span><Icon name="shield" size={14} /></span></strong><p>{caregiver.qualification} · {caregiver.experience} years · {caregiver.rating} ★</p></div><button aria-label="Call caregiver"><Icon name="phone" /></button></div><div className="success-details"><div><Icon name={service.icon} /><span><small>Service</small><strong>{service.name}</strong></span></div><div><Icon name="calendar" /><span><small>Date & time</small><strong>{displayDate}, {schedule.time}</strong></span></div></div><div className="success-actions three"><Button icon="location">Track caregiver</Button><Button variant="secondary">View booking</Button><Button variant="secondary" onClick={onHome}>Return home</Button></div><p className="support-line">Need help? <strong>Call our 24/7 care team at +91 800-HOMECARE</strong></p></div></main>;
}

function Footer() {
  return <footer><div className="container footer-grid"><div className="footer-brand"><Logo light /><p>Compassionate, verified healthcare at home for every family.</p><small>© 2025 HomeCare. All rights reserved.</small></div><div><strong>Services</strong><button>Home nursing</button><button>Elder care</button><button>Physiotherapy</button><button>Doctor visits</button></div><div><strong>Company</strong><button>About us</button><button>Careers</button><button>Contact</button><button>Privacy policy</button></div><div><strong>Get in touch</strong><p>support@homecare.in</p><p>+91 800-HOMECARE</p><p>New Delhi, India</p></div></div></footer>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selected, setSelected] = useState<Service>(services[0]);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver>(caregivers[0]);
  const [initialDetail, setInitialDetail] = useState<Service | null>(null);
  const [confirmedRecipient, setConfirmedRecipient] = useState<CareRecipient>({ relationship: "Myself", name: "", phone: "", useForUpdates: false });
  const [schedule, setSchedule] = useState<CareSchedule>({ date: "2025-06-18", time: "10:30 AM", duration: "1 hour" });
  const [bookedBy, setBookedBy] = useState("Aarav Sharma");
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navigate = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const selectFromHome = (service: Service) => { setInitialDetail(service); navigate("services"); };
  const continueBooking = (service: Service) => { setSelected(service); setInitialDetail(null); navigate("caregivers"); };
  const chooseCaregiver = (caregiver: Caregiver) => { setSelectedCaregiver(caregiver); navigate("recipient"); };
  const saveRecipient = (recipient: CareRecipient) => { setConfirmedRecipient(recipient); navigate("schedule"); };
  const saveSchedule = (nextSchedule: CareSchedule) => { setSchedule(nextSchedule); navigate("checkout"); };
  const finishBooking = (bookingName: string) => { setBookedBy(bookingName); navigate("success"); };
  return <><Header screen={screen} setScreen={navigate} />{screen === "home" && <Home setScreen={navigate} selectService={selectFromHome} />}{screen === "services" && <ServicesScreen initial={initialDetail} onBack={() => navigate("home")} onContinue={continueBooking} />}{screen === "caregivers" && <CaregiversScreen service={selected} onBack={() => navigate("services")} onSelect={chooseCaregiver} />}{screen === "recipient" && <RecipientScreen caregiver={selectedCaregiver} initial={confirmedRecipient} onBack={() => navigate("caregivers")} onContinue={saveRecipient} />}{screen === "schedule" && <ScheduleScreen caregiver={selectedCaregiver} initial={schedule} onBack={() => navigate("recipient")} onContinue={saveSchedule} />}{screen === "checkout" && <Checkout service={selected} caregiver={selectedCaregiver} recipient={confirmedRecipient} schedule={schedule} onBack={() => navigate("schedule")} onSuccess={finishBooking} />}{screen === "success" && <Success service={selected} caregiver={selectedCaregiver} recipient={confirmedRecipient} schedule={schedule} bookedBy={bookedBy} onHome={() => navigate("home")} />}{screen === "home" && <Footer />}{showTop && <button className="back-to-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}</>;
}
