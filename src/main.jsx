import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, MapPin, CalendarDays, Users, Sparkles, Car, Languages, Hotel, MessageCircle, Plus, Trash2, Send, Check, Menu, X, Clock3, Heart, Compass, Instagram } from 'lucide-react';
import './styles.css';

const photos = {
  hero: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85',
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80',
  friends: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
  women: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
  couple: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
  anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
  fashion: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
  cars: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  guide1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
  guide2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  guide3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
};

const groupStories = [
  { image: photos.family, title: 'A family adventure', detail: 'A little of everything, at everyone’s pace.', tag: 'Family trip' },
  { image: photos.friends, title: 'Friends on the move', detail: 'Arcades, late-night eats and city energy.', tag: 'Friends getaway' },
  { image: photos.women, title: 'A well-deserved escape', detail: 'Shopping, culture and memorable moments.', tag: 'Girls’ trip' },
  { image: photos.couple, title: 'Two tickets to Japan', detail: 'A personal route for two curious travelers.', tag: 'Couples trip' },
];
const guides = [
  { image: photos.guide1, name: 'Ren', role: 'Anime & gaming specialist', bio: 'From iconic anime neighborhoods to hidden figure shops and retro arcades, Ren knows where fandom comes to life.', tags: ['Anime', 'Gaming', 'Akihabara'] },
  { image: photos.guide2, name: 'Mika', role: 'Fashion & street culture', bio: 'Explore Tokyo’s independent labels, vintage stores, streetwear corners and the people shaping local style.', tags: ['Fashion', 'Vintage', 'Streetwear'] },
  { image: photos.guide3, name: 'Daichi', role: 'Cars & local culture', bio: 'A car enthusiast who can take you beyond the obvious, from automotive landmarks to local food stops.', tags: ['Cars', 'Food', 'Local spots'] },
];
const activityTypes = [
  { label: 'Food & drink', name: 'Local food stop (choose a spot)' },
  { label: 'Sightseeing', name: 'Sightseeing stop (choose a landmark)' },
  { label: 'Shopping', name: 'Shopping stop (choose a district)' },
  { label: 'Culture & history', name: 'Cultural visit (choose a site)' },
  { label: 'Anime & gaming', name: 'Anime or gaming stop (choose a spot)' },
  { label: 'Nature & scenery', name: 'Scenic stop (choose a place)' },
  { label: 'Transport', name: 'Private transfer' },
  { label: 'Free time', name: 'Free time' },
];
const interestOptions = ['Anime & manga', 'Gaming & arcades', 'Cars & motorsport', 'Fashion & streetwear', 'Food & cafés', 'History & culture', 'Architecture', 'Nature & scenic spots', 'Shopping'];

function App() {
  const [page, setPage] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [form, setForm] = useState({ start: '', end: '', travelers: 2, destination: 'Tokyo', pace: 'Balanced', stay: 'Hotel', accommodation: '', interests: ['Food & cafés', 'History & culture'], notes: '' });
  const [plans, setPlans] = useState(null);
  const [activePlan, setActivePlan] = useState(0);
  const [chat, setChat] = useState([{ from: 'bot', text: 'Hi! I’m your Tabitemu trip assistant. Tell me what you’d like to change and I’ll help shape your itinerary.' }]);
  const [chatInput, setChatInput] = useState('');
  const [serviceSelections, setServiceSelections] = useState(['Private HiAce']);
  const [serviceSent, setServiceSent] = useState(false);
  const [addModal, setAddModal] = useState(null);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleInterest = item => update('interests', form.interests.includes(item) ? form.interests.filter(x => x !== item) : [...form.interests, item]);
  const go = next => { setPage(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const generatePlans = e => {
    e.preventDefault();
    const interests = form.interests.length ? form.interests : ['Food & cafés', 'History & culture'];
    const city = form.destination || 'Tokyo';
    const days = form.start && form.end ? Math.max(1, Math.round((new Date(form.end) - new Date(form.start)) / 86400000) + 1) : 3;
    const makeStops = (budget) => {
      const pool = budget ? [
        ['Local breakfast & neighborhood walk', 'Explore a lively local shopping street', 'Affordable ramen lunch', 'Public garden or shrine visit', 'Depachika food hall dinner'],
        ['Free city viewpoint', 'Vintage and second-hand shopping', 'Casual sushi or curry lunch', 'Arcade time with a set budget', 'Convenience-store snack tasting'],
      ] : [
        [`Meet your specialist guide in ${city}`, `${interests[0]} deep dive with a local expert`, 'A carefully selected local lunch', 'A hidden neighborhood discovery', 'Dinner reservation matched to your taste'],
        ['A slower morning and coffee stop', `${interests[1] || interests[0]} experience`, 'Private transfer to a special spot', 'Flexible shopping and photo stops', 'A memorable local dinner'],
      ];
      return Array.from({ length: Math.min(days, 4) }, (_, day) => ({ day: day + 1, title: `Day ${day + 1} · ${day === 0 ? city + ' highlights' : day === 1 ? 'Explore your interests' : 'A day at your pace'}`, stops: pool[day % pool.length].map((name, i) => ({ id: `${budget ? 'b' : 'e'}-${day}-${i}`, time: ['09:30', '11:00', '12:30', '14:30', '18:00'][i], name })) }));
    };
    setPlans([
      { name: 'Explore more', subtitle: 'A richer, experience-led route', price: 'Flexible budget', days: makeStops(false) },
      { name: 'Budget-friendly', subtitle: 'Great experiences, thoughtful spending', price: 'Cost-conscious', days: makeStops(true) },
    ]);
    setActivePlan(0); setChat([{ from: 'bot', text: 'Your two draft itineraries are ready! Pick the one you like, then tell me what you want to adjust.' }]);
    go('results');
  };
  const editStop = (dayIndex, stopIndex, value) => setPlans(prev => prev.map((p, pi) => pi !== activePlan ? p : ({ ...p, days: p.days.map((d, di) => di !== dayIndex ? d : ({ ...d, stops: d.stops.map((s, si) => si !== stopIndex ? s : ({ ...s, name: value })) })) })));
  const removeStop = (dayIndex, stopIndex) => setPlans(prev => prev.map((p, pi) => pi !== activePlan ? p : ({ ...p, days: p.days.map((d, di) => di !== dayIndex ? d : ({ ...d, stops: d.stops.filter((_, si) => si !== stopIndex) })) })));
  const openAddStop = dayIndex => setAddModal({ dayIndex, time: '16:00', type: activityTypes[0].label, name: '' });
  const closeAddStop = () => setAddModal(null);
  const addStop = e => {
    e.preventDefault();
    const { dayIndex, time, type } = addModal;
    const name = addModal.name.trim() || activityTypes.find(t => t.label === type).name;
    const stop = { id: `new-${Date.now()}`, time, type, name };
    setPlans(prev => prev.map((p, pi) => pi !== activePlan ? p : ({ ...p, days: p.days.map((d, di) => di !== dayIndex ? d : ({ ...d, stops: [...d.stops, stop].sort((a, b) => a.time.localeCompare(b.time)) })) })));
    closeAddStop();
  };
  const sendChat = e => {
    e.preventDefault(); if (!chatInput.trim()) return;
    const message = chatInput.trim(); setChat(prev => [...prev, { from: 'user', text: message }, { from: 'bot', text: 'Great idea. This prototype can capture your request, but itinerary changes through chat are a demo stub for now. You can edit the stops directly above. In the live version, I’ll update the plan based on this message.' }]); setChatInput('');
  };
  const toggleService = name => setServiceSelections(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  const steps = [{ key: 'builder', label: 'Trip details' }, { key: 'results', label: 'Your itinerary' }, { key: 'services', label: 'Add-ons' }];
  const stepIndex = steps.findIndex(s => s.key === page);
  const canVisit = i => i <= stepIndex || (!!plans && i > 0);
  const backTarget = page === 'builder' ? 'home' : page === 'results' ? 'builder' : plans ? 'results' : 'builder';
  const backLabel = { home: 'Back to home', builder: 'Back to trip details', results: 'Back to itinerary' }[backTarget];

  return <>
    <header className="nav"><button className="brand" onClick={() => go('home')}><span className="brand-mark">旅</span><span>TABITEMU<span className="brand-dot">.</span><small>YOUR JAPAN, YOUR WAY</small></span></button>
      <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}><button onClick={() => go('home')}>Discover</button><button onClick={() => go('builder')}>Plan your trip</button><button onClick={() => go('services')}>Our services</button><button className="nav-cta" onClick={() => go('builder')}>Build my itinerary <ArrowRight size={15}/></button></nav>
      <button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
    </header>

    {stepIndex >= 0 && <div className="progress-bar"><button className="progress-back" onClick={() => go(backTarget)}><ArrowLeft size={15}/> {backLabel}</button><ol className="progress-steps" aria-label="Booking progress">{steps.map((s, i) => <li key={s.key} className={`progress-step ${i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'}`} aria-current={i === stepIndex ? 'step' : undefined}><button disabled={!canVisit(i) || i === stepIndex} onClick={() => go(s.key)}><span className="track"/><span className="label"><b>{i < stepIndex ? <Check size={12}/> : `0${i + 1}`}</b> {s.label}</span></button></li>)}</ol><span className="progress-count">Step {stepIndex + 1} of {steps.length}</span></div>}

    {page === 'home' && <main>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17,27,25,.76), rgba(17,27,25,.16)), url(${photos.hero})` }}>
        <div className="hero-content"><div className="eyebrow light"><span/> PRIVATE TOURS · JAPAN</div><h1>Japan is better<br/><em>your way.</em></h1><p>Not another package tour. A private Japan experience shaped around what you love, with a local specialist by your side.</p><button className="button button-light" onClick={() => go('builder')}>Create your itinerary <ArrowRight size={17}/></button><div className="hero-note"><span className="tiny-avatars"><i>あ</i><i>旅</i><i>J</i></span> Made for your kind of adventure</div></div>
        <div className="hero-side-label">TOKYO · KYOTO · BEYOND</div>
      </section>
      <section className="intro section-wrap"><div className="eyebrow">A DIFFERENT WAY TO TRAVEL</div><div className="intro-grid"><h2>Your interests.<br/><em>Your people.</em><br/>Your Japan.</h2><div><p className="lead">Whether you’re here for anime, vintage fashion, JDM culture, food, history—or a little bit of everything—we bring the right people and places together.</p><p>Choose the experiences you care about and mix different specialties into one private journey. No rigid packages. No one-size-fits-all schedule.</p><button className="text-link" onClick={() => go('builder')}>Build a trip that feels like yours <ArrowRight size={16}/></button></div></div></section>
      <section className="stories-section"><div className="section-wrap"><div className="section-heading"><div><div className="eyebrow">REAL PEOPLE, PERSONAL ROUTES</div><h2>Every trip has<br/><em>its own story.</em></h2></div><div className="carousel-controls"><button onClick={() => setStoryIndex((storyIndex + groupStories.length - 1) % groupStories.length)} aria-label="Previous"><ChevronLeft/></button><button onClick={() => setStoryIndex((storyIndex + 1) % groupStories.length)} aria-label="Next"><ChevronRight/></button></div></div><div className="story-grid">{[0,1,2].map(offset => { const item = groupStories[(storyIndex + offset) % groupStories.length]; return <article className={`story-card story-${offset}`} key={item.title}><img src={item.image} alt={item.title}/><div className="story-overlay"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.detail}</p></div></article>; })}</div><div className="carousel-dots">{groupStories.map((s,i)=><button key={s.title} className={i===storyIndex?'active':''} onClick={()=>setStoryIndex(i)} aria-label={`Show story ${i+1}`}/>)}</div></div></section>
      <section className="guides-section section-wrap"><div className="section-heading"><div><div className="eyebrow">YOUR LOCAL INSIDER</div><h2>Meet your <em>people.</em></h2></div><p className="heading-copy">Not just guides. Passionate locals who know their scene, their city and the little details that make a trip unforgettable.</p></div><div className="guide-grid">{guides.map(g=><article className="guide-card" key={g.name}><div className="guide-image"><img src={g.image} alt={`${g.name}, tour guide`}/><span>MEET {g.name.toUpperCase()}</span></div><div className="guide-info"><h3>{g.name}</h3><strong>{g.role}</strong><p>{g.bio}</p><div className="tag-row">{g.tags.map(t=><span key={t}>{t}</span>)}</div></div></article>)}</div><div className="center-action"><button className="button button-dark" onClick={()=>go('builder')}>Find your specialist <ArrowRight size={17}/></button></div></section>
      <section className="mix-banner"><div className="mix-copy"><div className="eyebrow light">THE TABITEMU DIFFERENCE</div><h2>Why choose one<br/>when you can <em>mix it up?</em></h2><p>Start your morning exploring vintage shops with a fashion insider. Spend the afternoon at an anime landmark. Finish with a local food crawl. Your day, your combination.</p><button className="button button-light" onClick={()=>go('builder')}>Mix your interests <ArrowRight size={17}/></button></div><div className="mix-images"><img src={photos.fashion} alt="Tokyo fashion"/><img src={photos.anime} alt="Anime culture"/><img src={photos.food} alt="Japanese food"/></div></section>
      <section className="bottom-cta section-wrap"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Let’s make this trip<br/><em>yours.</em></h2></div><button className="button button-dark" onClick={()=>go('builder')}>Start planning <ArrowRight size={17}/></button></section>
    </main>}

    {page === 'builder' && <main className="builder-page"><div className="page-hero"><div className="eyebrow light">YOUR TRIP STARTS HERE</div><h1>Let’s plan a Japan<br/><em>that feels like you.</em></h1><p>Tell us a little about your trip. We’ll sketch out two ways to experience it.</p></div><div className="builder-layout"><form className="planner-form" onSubmit={generatePlans}><div className="form-top"><div className="eyebrow">01 / THE BASICS</div><h2>First, the details.</h2><p>We’ll use these to shape your first itinerary draft.</p></div><div className="field-grid"><label>Arrival date <span className="input-icon"><CalendarDays size={16}/><input type="date" value={form.start} onChange={e=>update('start',e.target.value)}/></span></label><label>Departure date <span className="input-icon"><CalendarDays size={16}/><input type="date" min={form.start||undefined} value={form.end} onChange={e=>update('end',e.target.value)}/></span></label><label>Number of travelers <span className="input-icon"><Users size={16}/><input type="number" min="1" max="30" value={form.travelers} onChange={e=>update('travelers',e.target.value)}/></span></label><label>Where would you like to go? <span className="input-icon"><MapPin size={16}/><select value={form.destination} onChange={e=>update('destination',e.target.value)}><option>Tokyo</option><option>Tokyo & Kyoto</option><option>Osaka & Kyoto</option><option>Hokkaido</option><option>Okinawa</option><option>Not sure yet</option></select></span></label></div><div className="form-divider"/><div className="eyebrow">02 / YOUR TRAVEL STYLE</div><h2>What feels right?</h2><div className="choice-block"><span className="field-title">Travel pace</span><div className="choice-row">{['Relaxed','Balanced','Packed'].map(v=><button type="button" key={v} className={form.pace===v?'choice selected':'choice'} onClick={()=>update('pace',v)}>{v}</button>)}</div></div><div className="choice-block"><span className="field-title">Accommodation preference</span><div className="choice-row">{['Hotel','Ryokan','Apartment','Already booked'].map(v=><button type="button" key={v} className={form.stay===v?'choice selected':'choice'} onClick={()=>update('stay',v)}>{v}</button>)}</div></div><label className="full-label">Any accommodation requirements? <textarea rows="2" placeholder="e.g. family room, near a train station, accessible room…" value={form.accommodation} onChange={e=>update('accommodation',e.target.value)}/></label><div className="form-divider"/><div className="eyebrow">03 / WHAT YOU LOVE</div><h2>Pick your interests.</h2><p className="form-hint">Mix and match as many as you like. That’s the whole point.</p><div className="interest-grid">{interestOptions.map(item=><button type="button" key={item} className={form.interests.includes(item)?'interest selected':'interest'} onClick={()=>toggleInterest(item)}>{form.interests.includes(item)&&<Check size={14}/>} {item}</button>)}</div><label className="full-label">Anything else we should know? <textarea rows="3" placeholder="A must-see place, dietary needs, a surprise celebration, your dream experience…" value={form.notes} onChange={e=>update('notes',e.target.value)}/></label><button className="button button-dark generate-button" type="submit"><Sparkles size={17}/> Generate my itineraries <ArrowRight size={17}/></button><p className="disclaimer">This is a prototype. Itinerary generation currently uses sample content.</p></form>
      <aside className="planner-aside"><div className="aside-photo" style={{backgroundImage:`url(${photos.cars})`}}><div><span>YOUR TRIP, YOUR RULES</span><h3>Curiosity is<br/>the best itinerary.</h3></div></div><div className="aside-note"><Compass size={20}/><div><strong>Local knowledge, not tourist traps.</strong><p>Our specialists help you get closer to the things you came to Japan for.</p></div></div><div className="aside-note"><Heart size={20}/><div><strong>Built around your group.</strong><p>From solo travelers to families and friend groups, we’ll find your pace.</p></div></div></aside></div>
    </main>}

    {page === 'results' && plans && <main className="results-page"><div className="page-hero"><div className="eyebrow light">YOUR FIRST DRAFT</div><h1>Your trip, your way.</h1><p>Draft itineraries for {form.destination}, shaped around {form.travelers} traveler{Number(form.travelers) === 1 ? '' : 's'} and your interests.</p></div><section className="results-section"><div className="results-heading"><div><div className="eyebrow">YOUR ITINERARY OPTIONS</div><h2>Two ways to <em>explore.</em></h2><p>Choose a direction. You can edit every stop below.</p></div><button className="text-link" onClick={()=>go('builder')}>Edit trip details <ArrowRight size={15}/></button></div><div className="results-layout"><div className="results-main"><div className="plan-tabs">{plans.map((p,i)=><button key={p.name} className={activePlan===i?'plan-tab active':'plan-tab'} onClick={()=>setActivePlan(i)}><span>{i===0?'01':'02'}</span><div><strong>{p.name}</strong><small>{p.subtitle}</small></div><b>{p.price}</b></button>)}</div><div className="itinerary-timeline">{plans[activePlan].days.map((day,di)=><section className="timeline-day" key={day.day}><div className="day-title"><span>DAY {day.day.toString().padStart(2,'0')}</span><h3>{day.title}</h3></div>{day.stops.map((stop,si)=><div className="stop-row" key={stop.id}><span className="stop-time">{stop.time}</span><input aria-label="Edit activity" value={stop.name} onChange={e=>editStop(di,si,e.target.value)}/><button className="icon-button" onClick={()=>removeStop(di,si)} aria-label="Remove stop"><Trash2 size={15}/></button></div>)}<button className="add-stop" onClick={()=>openAddStop(di)}><Plus size={15}/> Add a stop</button></section>)}</div><div className="results-footer"><p>Like the direction? The next step would be confirming guide availability and a quote.</p><button className="button button-dark" onClick={()=>go('services')}>Explore add-on services <ArrowRight size={16}/></button></div></div><aside className="chat-panel"><div className="chat-heading"><span className="chat-icon"><MessageCircle size={18}/></span><div><strong>Fine-tune with your trip assistant</strong><small>Ask for ideas or tell us what to change</small></div><span className="demo-label">DEMO</span></div><div className="chat-messages">{chat.map((m,i)=><div key={i} className={`chat-bubble ${m.from}`}>{m.text}</div>)}</div><form className="chat-input" onSubmit={sendChat}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="e.g. Add more vintage shopping…"/><button type="submit" aria-label="Send message"><Send size={17}/></button></form></aside></div></section>{addModal && plans && <div className="modal-backdrop" onClick={closeAddStop}><form className="modal" role="dialog" aria-modal="true" aria-labelledby="add-stop-title" onClick={e=>e.stopPropagation()} onSubmit={addStop} onKeyDown={e=>e.key==='Escape'&&closeAddStop()}><button type="button" className="icon-button modal-close" onClick={closeAddStop} aria-label="Close"><X size={18}/></button><div className="eyebrow">DAY {plans[activePlan].days[addModal.dayIndex].day.toString().padStart(2,'0')}</div><h3 id="add-stop-title">Add a stop</h3><label className="full-label">Time <span className="input-icon"><Clock3 size={16}/><input type="time" required autoFocus value={addModal.time} onChange={e=>setAddModal(m=>({...m,time:e.target.value}))}/></span></label><span className="field-title modal-title">Activity type</span><div className="interest-grid">{activityTypes.map(t=><button type="button" key={t.label} className={addModal.type===t.label?'interest selected':'interest'} onClick={()=>setAddModal(m=>({...m,type:t.label}))}>{addModal.type===t.label&&<Check size={14}/>} {t.label}</button>)}</div><label className="full-label">What would you like to do? <span className="input-icon"><input type="text" maxLength={120} value={addModal.name} onChange={e=>setAddModal(m=>({...m,name:e.target.value}))} placeholder={`e.g. ${{ 'Food & drink':'Tsukiji street food tour','Sightseeing':'Tokyo Skytree','Shopping':'Vintage shops in Shimokitazawa','Culture & history':'Senso-ji Temple','Anime & gaming':'Akihabara retro arcades','Nature & scenery':'Shinjuku Gyoen garden','Transport':'Private transfer to Hakone','Free time':'Free time to explore' }[addModal.type]}`}/></span></label><div className="modal-actions"><button type="button" className="button button-light" onClick={closeAddStop}>Cancel</button><button type="submit" className="button button-dark">Add to itinerary</button></div></form></div>}</main>}

    {page === 'services' && <main className="services-page"><div className="page-hero services-hero"><div className="eyebrow light">MORE THAN A TOUR</div><h1>The details that make<br/><em>the journey.</em></h1><p>Build your own support team, from getting around to getting local insight.</p></div><section className="services-content section-wrap"><div className="services-intro"><div className="eyebrow">04 / MAKE IT YOURS</div><h2>Add the support<br/>you <em>need.</em></h2><p>Choose only what makes sense for your group. These are optional services, not fixed bundles.</p></div><div className="service-list">{[{name:'Private HiAce',desc:'Comfortable private transport for groups and luggage.',price:'From ¥55,000 / day',icon:<Car/>},{name:'Private Alphard',desc:'A premium ride for smaller groups who want extra comfort.',price:'Request a quote',icon:<Car/>},{name:'Specialist tour guide',desc:'A local expert in anime, fashion, cars, food, history and more.',price:'From ¥35,000 / day',icon:<Users/>},{name:'Language & local assistance',desc:'Help with translation, reservations and navigating local situations.',price:'Request a quote',icon:<Languages/>},{name:'Accommodation support',desc:'Recommendations and help finding a stay that fits your route.',price:'Planning support',icon:<Hotel/>}].map(s=><button type="button" key={s.name} className={serviceSelections.includes(s.name)?'service-option selected':'service-option'} onClick={()=>toggleService(s.name)}><span className="service-icon">{s.icon}</span><span className="service-copy"><strong>{s.name}</strong><small>{s.desc}</small><b>{s.price}</b></span><span className="service-check">{serviceSelections.includes(s.name)?<Check size={17}/>:<Plus size={17}/>}</span></button>)}</div><div className="service-request"><div><div className="eyebrow">YOUR REQUEST</div><h3>{serviceSelections.length} service{serviceSelections.length===1?'':'s'} selected</h3><p>{serviceSelections.length?serviceSelections.join(' · '):'Select any services you’re interested in.'}</p></div><button className="button button-dark" disabled={!serviceSelections.length} onClick={()=>setServiceSent(true)}>Request these services <ArrowRight size={16}/></button>{serviceSent&&<p className="success-note"><Check size={16}/> Request saved in this demo. No booking has been made.</p>}</div></section><section className="services-bottom"><div><div className="eyebrow light">NOT SURE WHAT YOU NEED?</div><h2>We’ll figure it<br/><em>out together.</em></h2><p>Start with your interests. We’ll help you decide which specialists and services make sense.</p></div><button className="button button-light" onClick={()=>go('builder')}>Start with your itinerary <ArrowRight size={16}/></button></section></main>}

    <footer className="footer"><div className="footer-top"><button className="brand footer-brand" onClick={()=>go('home')}><span className="brand-mark">旅</span><span>TABITEMU<span className="brand-dot">.</span><small>YOUR JAPAN, YOUR WAY</small></span></button><p>Private Japan journeys, made personal.</p><div className="footer-links"><button onClick={()=>go('home')}>Discover</button><button onClick={()=>go('builder')}>Plan your trip</button><button onClick={()=>go('services')}>Services</button></div></div><div className="footer-bottom"><span>© 2026 Tabitemu. Prototype concept.</span><span>Made for curious travelers <span className="red-heart">♥</span></span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
