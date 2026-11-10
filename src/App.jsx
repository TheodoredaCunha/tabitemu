import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, MapPin, CalendarDays, Users, Sparkles, Car, Languages, Hotel, MessageCircle, Plus, Trash2, Send, Check, X, Clock3 } from 'lucide-react';
import { translate, languages } from './i18n.js';
import { fetchStaffData } from './api.js';

const photos = {
  hero: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85',
};

// Fallback guides data for when Airtable is unavailable
const fallbackGuides = [
  { id: 'ren', name: 'Ren', photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&crop=faces&w=900&h=700&q=85' },
  { id: 'mika', name: 'Mika', photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&crop=faces&w=900&h=700&q=85' },
  { id: 'daichi', name: 'Daichi', photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&crop=faces&w=900&h=700&q=85' },
  { id: 'aiko', name: 'Aiko', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=900&h=700&q=85' },
  { id: 'kenji', name: 'Kenji', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=900&h=700&q=85' },
  { id: 'yui', name: 'Yui', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&w=900&h=700&q=85' },
];

const activityTypes = ['Food & drink', 'Sightseeing', 'Shopping', 'Culture & history', 'Anime & gaming', 'Nature & scenery', 'Transport', 'Free time'];
const interestOptions = ['Anime & manga', 'Gaming & arcades', 'Cars & motorsport', 'Fashion & streetwear', 'Food & cafés', 'History & culture', 'Architecture', 'Nature & scenic spots', 'Shopping'];
const destinations = ['Tokyo', 'Tokyo & Kyoto', 'Osaka & Kyoto', 'Hokkaido', 'Okinawa', 'Not sure yet'];
const services = [
  { id: 'hiace', icon: <Car/> }, { id: 'alphard', icon: <Car/> }, { id: 'guide', icon: <Users/> },
  { id: 'language', icon: <Languages/> }, { id: 'accom', icon: <Hotel/> },
];

const initialForm = { start: '', end: '', travelers: 2, destination: 'Tokyo', pace: 'Balanced', stay: 'Hotel', accommodation: '', interests: ['Food & cafés', 'History & culture'], notes: '' };

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem('tabitemu-lang');
    if (saved && languages[saved]) return saved;
  } catch { /* storage unavailable */ }
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en';
};

export default function App() {
  const [lang, setLang] = useState(getInitialLang);
  const [page, setPage] = useState('home');
  const [form, setForm] = useState(initialForm);
  const [plans, setPlans] = useState(null);
  const [activePlan, setActivePlan] = useState(0);
  const [chat, setChat] = useState([{ from: 'bot', key: 'chat.hi' }]);
  const [chatInput, setChatInput] = useState('');
  const [serviceSelections, setServiceSelections] = useState(['hiace']);
  const [serviceSent, setServiceSent] = useState(false);
  const [addModal, setAddModal] = useState(null);
  const [guides, setGuides] = useState(fallbackGuides);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [guidesError, setGuidesError] = useState(null);

  const t = (key, vars) => translate(lang, key, vars);

  // Fetch staff data from Airtable
  useEffect(() => {
    const loadGuides = async () => {
      setGuidesLoading(true);
      setGuidesError(null);
      try {
        const data = await fetchStaffData();
        if (data && data.length > 0) {
          setGuides(data);
        }
      } catch (error) {
        console.error('Failed to load guides from Airtable:', error);
        setGuidesError(error.message);
        // Keep using fallback guides
      } finally {
        setGuidesLoading(false);
      }
    };
    
    loadGuides();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('tabitemu-lang', lang); } catch { /* storage unavailable */ }
  }, [lang]);

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)');
    const narrow = window.matchMedia('(max-width: 800px)');
    const apply = () => {
      document.documentElement.dataset.input = touch.matches ? 'touch' : 'mouse';
      document.documentElement.dataset.device = narrow.matches ? 'mobile' : 'desktop';
    };
    apply();
    touch.addEventListener('change', apply); narrow.addEventListener('change', apply);
    return () => { touch.removeEventListener('change', apply); narrow.removeEventListener('change', apply); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = addModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [addModal]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleInterest = item => update('interests', form.interests.includes(item) ? form.interests.filter(x => x !== item) : [...form.interests, item]);
  const go = next => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const generatePlans = e => {
    e.preventDefault();
    const interests = form.interests.length ? form.interests : ['Food & cafés', 'History & culture'];
    const city = form.destination || 'Tokyo';
    const days = form.start && form.end ? Math.max(1, Math.round((new Date(form.end) - new Date(form.start)) / 86400000) + 1) : 3;
    const makeDays = prefix => Array.from({ length: Math.min(days, 4) }, (_, day) => ({
      day: day + 1, kind: Math.min(day, 2), city,
      stops: Array.from({ length: 5 }, (_, i) => ({ id: `${prefix}-${day}-${i}`, time: ['09:30', '11:00', '12:30', '14:30', '18:00'][i], key: `${prefix}.${day % 2}.${i}`, city, interest: prefix === 'e' && i === 1 ? (day % 2 === 0 ? interests[0] : (interests[1] || interests[0])) : interests[0] })),
    }));
    setPlans([
      { id: 'explore', days: makeDays('e') },
      { id: 'budget', days: makeDays('b') },
    ]);
    setActivePlan(0); setChat([{ from: 'bot', key: 'chat.ready' }]);
    go('results');
  };

  const stopName = stop => stop.name ?? t(stop.key, { city: t(`dest.${stop.city}`), interest: t(`int.${stop.interest}`) });
  const mapActive = (fn) => setPlans(prev => prev.map((p, pi) => pi !== activePlan ? p : fn(p)));
  const editStop = (dayIndex, stopIndex, value) => mapActive(p => ({ ...p, days: p.days.map((d, di) => di !== dayIndex ? d : ({ ...d, stops: d.stops.map((s, si) => si !== stopIndex ? s : ({ ...s, name: value })) })) }));
  const removeStop = (dayIndex, stopIndex) => mapActive(p => ({ ...p, days: p.days.map((d, di) => di !== dayIndex ? d : ({ ...d, stops: d.stops.filter((_, si) => si !== stopIndex) })) }));
  const openAddStop = dayIndex => setAddModal({ dayIndex, time: '16:00', type: activityTypes[0], name: '' });
  const closeAddStop = () => setAddModal(null);
  const addStop = e => {
    e.preventDefault();
    const { dayIndex, time, type } = addModal;
    const custom = addModal.name.trim();
    const stop = { id: `new-${Date.now()}`, time, type, key: `actdef.${type}`, ...(custom ? { name: custom } : {}) };
    mapActive(p => ({ ...p, days: p.days.map((d, di) => di !== dayIndex ? d : ({ ...d, stops: [...d.stops, stop].sort((a, b) => a.time.localeCompare(b.time)) })) }));
    closeAddStop();
  };
  const sendChat = e => {
    e.preventDefault(); if (!chatInput.trim()) return;
    const message = chatInput.trim();
    setChat(prev => [...prev, { from: 'user', text: message }, { from: 'bot', key: 'chat.reply' }]); setChatInput('');
  };
  const toggleService = id => setServiceSelections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const steps = [{ key: 'builder', label: t('step.details') }, { key: 'results', label: t('step.itinerary') }, { key: 'services', label: t('step.addons') }];
  const stepIndex = steps.findIndex(s => s.key === page);
  const canVisit = i => i <= stepIndex || (!!plans && i > 0);
  const backTarget = page === 'builder' ? 'home' : page === 'results' ? 'builder' : plans ? 'results' : 'builder';
  const travelers = Number(form.travelers) || 1;
  const pad = n => n.toString().padStart(2, '0');
  const brandText = <span>TABITEMU<span className="brand-dot">.</span><small>{t('brand.tagline')}</small></span>;

  return <>
    <header className="nav"><button className="brand" onClick={() => go('home')}><span className="brand-mark">旅</span>{brandText}</button>
      <div className="lang-switch" role="group" aria-label={t('lang.label')}>{Object.keys(languages).map(code => <button key={code} className={lang === code ? 'active' : ''} aria-pressed={lang === code} title={languages[code]} onClick={() => setLang(code)}>{code.toUpperCase()}</button>)}</div>
    </header>

    {stepIndex >= 0 && <div className="progress-bar"><button className="progress-back" onClick={() => go(backTarget)}><ArrowLeft size={15}/> {t(`back.${backTarget}`)}</button><ol className="progress-steps" aria-label={t('progress.aria')}>{steps.map((s, i) => <li key={s.key} className={`progress-step ${i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'}`} aria-current={i === stepIndex ? 'step' : undefined}><button disabled={!canVisit(i) || i === stepIndex} onClick={() => go(s.key)}><span className="track"/><span className="label"><b>{i < stepIndex ? <Check size={12}/> : `0${i + 1}`}</b> {s.label}</span></button></li>)}</ol><span className="progress-count">{t('progress.count', { n: stepIndex + 1, total: steps.length })}</span></div>}

    {page === 'home' && <main>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(232,242,233,.54), rgba(232,242,233,.22)), url(${photos.hero})` }}>
        <div className="hero-content"><div className="eyebrow light"><span/> {t('hero.eyebrow')}</div><h1>{t('hero.t1')}<br/><em>{t('hero.t2')}</em></h1><p>{t('hero.p')}</p><button className="button button-light hero-cta" onClick={() => go('builder')}>{t('hero.cta')} <ArrowRight size={20}/></button></div>
      </section>
      <section className="how-it-works section-wrap"><div className="section-heading"><div><div className="eyebrow">{t('how.eyebrow')}</div><h2>{t('how.t1')}<em>{t('how.t2')}</em></h2></div><p className="heading-copy">{t('how.p')}</p></div><div className="steps-grid"><div className="step-card"><div className="step-number">01</div><h3>{t('how.step1.title')}</h3><p>{t('how.step1.desc')}</p></div><div className="step-card"><div className="step-number">02</div><h3>{t('how.step2.title')}</h3><p>{t('how.step2.desc')}</p></div><div className="step-card"><div className="step-number">03</div><h3>{t('how.step3.title')}</h3><p>{t('how.step3.desc')}</p></div><div className="step-card"><div className="step-number">04</div><h3>{t('how.step4.title')}</h3><p>{t('how.step4.desc')}</p></div></div></section>
      <section className="guides-section section-wrap"><div className="section-heading"><div><div className="eyebrow">{t('guides.eyebrow')}</div><h2>{t('guides.t1')}<em>{t('guides.t2')}</em></h2></div><p className="heading-copy">{t('guides.copy')}</p></div>{guidesLoading ? <div className="guides-loading">{t('guides.loading')}</div> : guidesError ? <div className="guides-error">{t('guides.error')}</div> : <div className="guide-grid">{guides.map((g, i) => {const guideNameLower = g.name?.toLowerCase() || ''; const hasFallbackI18n = t(`guide.${i}.role`) !== `guide.${i}.role`; const role = g.role || (hasFallbackI18n ? t(`guide.${i}.role`) : ''); const bio = g.bio || (hasFallbackI18n ? t(`guide.${i}.bio`) : ''); const tags = (g.tags && g.tags.length > 0) ? g.tags : (hasFallbackI18n ? t(`guide.${i}.tags`).split('|') : []); const photoUrl = g.photo || g.image || null; return <article className="guide-card" key={g.id || g.name}><div className="guide-image">{photoUrl && <img src={photoUrl} alt={t('guide.alt', { name: g.name })}/> }<span>{t('guide.meet', { name: g.name.toUpperCase() })}</span></div><div className="guide-info"><h3>{g.name}</h3><strong>{role}</strong><p>{bio}</p><div className="tag-row">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>;})</ div>}</section>
    </main>}

    {page === 'builder' && <main className="builder-page"><div className="page-hero"><div className="eyebrow light">{t('builder.eyebrow')}</div><h1>{t('builder.t1')}<br/><em>{t('builder.t2')}</em></h1><p>{t('builder.p')}</p></div><div className="builder-layout"><form className="planner-form" onSubmit={generatePlans}><div className="form-top"><div className="eyebrow">{t('form.step1')}</div><h2>{t('form.h1')}</h2><p>{t('form.p1')}</p></div><div className="field-grid"><label>{t('form.arrival')} <span className="input-icon"><CalendarDays size={16}/><input type="date" lang={lang} value={form.start} onChange={e => update('start', e.target.value)}/></span></label><label>{t('form.departure')} <span className="input-icon"><CalendarDays size={16}/><input type="date" lang={lang} min={form.start || undefined} value={form.end} onChange={e => update('end', e.target.value)}/></span></label><label>{t('form.travelers')} <span className="input-icon"><Users size={16}/><input type="number" min="1" max="30" value={form.travelers} onChange={e => update('travelers', e.target.value)}/></span></label><label>{t('form.where')} <span className="input-icon"><MapPin size={16}/><select value={form.destination} onChange={e => update('destination', e.target.value)}>{destinations.map(d => <option key={d} value={d}>{t(`dest.${d}`)}</option>)}</select></span></label></div><div className="form-divider"/><div className="eyebrow">{t('form.step2')}</div><h2>{t('form.h2')}</h2><div className="choice-block"><span className="field-title">{t('form.pace')}</span><div className="choice-row">{['Relaxed', 'Balanced', 'Packed'].map(v => <button type="button" key={v} className={form.pace === v ? 'choice selected' : 'choice'} onClick={() => update('pace', v)}>{t(`pace.${v}`)}</button>)}</div></div><div className="choice-block"><span className="field-title">{t('form.stay')}</span><div className="choice-row">{['Hotel', 'Ryokan', 'Apartment', 'Already booked'].map(v => <button type="button" key={v} className={form.stay === v ? 'choice selected' : 'choice'} onClick={() => update('stay', v)}>{t(`stay.${v}`)}</button>)}</div></div><label className="full-label">{t('form.accom')} <textarea rows="2" placeholder={t('form.accom.ph')} value={form.accommodation} onChange={e => update('accommodation', e.target.value)}/></label><div className="form-divider"/><div className="eyebrow">{t('form.step3')}</div><h2>{t('form.h3')}</h2><p className="form-hint">{t('form.hint')}</p><div className="interest-grid">{interestOptions.map(item => <button type="button" key={item} className={form.interests.includes(item) ? 'interest selected' : 'interest'} onClick={() => toggleInterest(item)}>{form.interests.includes(item) && <Check size={14}/>} {t(`int.${item}`)}</button>)}</div><label className="full-label">{t('form.notes')} <textarea rows="3" placeholder={t('form.notes.ph')} value={form.notes} onChange={e => update('notes', e.target.value)}/></label><button className="button button-dark generate-button" type="submit"><Sparkles size={17}/> {t('form.generate')} <ArrowRight size={17}/></button><p className="disclaimer">{t('form.disclaimer')}</p></form></div>
    </main>}

    {page === 'results' && plans && <main className="results-page"><div className="page-hero"><div className="eyebrow light">{t('results.eyebrow')}</div><h1>{t('results.h1')}</h1><p>{t(travelers === 1 ? 'results.hero.one' : 'results.hero.many', { dest: t(`dest.${form.destination}`), n: travelers })}</p></div><section className="results-section"><div className="results-heading"><div><div className="eyebrow">{t('results.options')}</div><h2>{t('results.h2a')}<em>{t('results.h2b')}</em></h2><p>{t('results.p')}</p></div><button className="text-link" onClick={() => go('builder')}>{t('results.edit')} <ArrowRight size={15}/></button></div><div className="results-layout"><div className="results-main"><div className="plan-tabs">{plans.map((p, i) => <button key={p.id} className={activePlan === i ? 'plan-tab active' : 'plan-tab'} onClick={() => setActivePlan(i)}><span>{pad(i + 1)}</span><div><strong>{t(`plan.${p.id}.name`)}</strong><small>{t(`plan.${p.id}.sub`)}</small></div><b>{t(`plan.${p.id}.price`)}</b></button>)}</div><div className="itinerary-timeline">{plans[activePlan].days.map((day, di) => <section className="timeline-day" key={day.day}><div className="day-title"><span>{t('day.label')} {pad(day.day)}</span><h3>{t('day.word')} {day.day} · {t(`day.kind${day.kind}`, { city: t(`dest.${day.city}`) })}</h3></div>{day.stops.map((stop, si) => <div className="stop-row" key={stop.id}><span className="stop-time">{stop.time}</span><input aria-label={t('stop.edit')} value={stopName(stop)} onChange={e => editStop(di, si, e.target.value)}/><button className="icon-button" onClick={() => removeStop(di, si)} aria-label={t('stop.remove')}><Trash2 size={15}/></button></div>)}<button className="add-stop" onClick={() => openAddStop(di)}><Plus size={15}/> {t('stop.add')}</button></section>)}</div><div className="results-footer"><p>{t('results.footer')}</p><button className="button button-dark" onClick={() => go('services')}>{t('results.addons')} <ArrowRight size={16}/></button></div></div><aside className="chat-panel"><div className="chat-heading"><span className="chat-icon"><MessageCircle size={18}/></span><div><strong>{t('chat.title')}</strong><small>{t('chat.sub')}</small></div><span className="demo-label">{t('chat.demo')}</span></div><div className="chat-messages">{chat.map((m, i) => <div key={i} className={`chat-bubble ${m.from}`}>{m.key ? t(m.key) : m.text}</div>)}</div><form className="chat-input" onSubmit={sendChat}><input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t('chat.ph')}/><button type="submit" aria-label={t('chat.send')}><Send size={17}/></button></form></aside></div></section>{addModal && <div className="modal-backdrop" onClick={closeAddStop}><form className="modal" role="dialog" aria-modal="true" aria-labelledby="add-stop-title" onClick={e => e.stopPropagation()} onSubmit={addStop} onKeyDown={e => e.key === 'Escape' && closeAddStop()}><button type="button" className="icon-button modal-close" onClick={closeAddStop} aria-label={t('modal.close')}><X size={18}/></button><div className="eyebrow">{t('day.label')} {pad(plans[activePlan].days[addModal.dayIndex].day)}</div><h3 id="add-stop-title">{t('modal.title')}</h3><label className="full-label">{t('modal.time')} <span className="input-icon"><Clock3 size={16}/><input type="time" required autoFocus value={addModal.time} onChange={e => setAddModal(m => ({ ...m, time: e.target.value }))}/></span></label><span className="field-title modal-title">{t('modal.type')}</span><div className="interest-grid">{activityTypes.map(type => <button type="button" key={type} className={addModal.type === type ? 'interest selected' : 'interest'} onClick={() => setAddModal(m => ({ ...m, type }))}>{addModal.type === type && <Check size={14}/>} {t(`act.${type}`)}</button>)}</div><label className="full-label">{t('modal.what')} <span className="input-icon"><input type="text" maxLength={120} value={addModal.name} onChange={e => setAddModal(m => ({ ...m, name: e.target.value }))} placeholder={t(`actph.${addModal.type}`)}/></span></label><div className="modal-actions"><button type="button" className="button button-light" onClick={closeAddStop}>{t('modal.cancel')}</button><button type="submit" className="button button-dark">{t('modal.submit')}</button></div></form></div>}</main>}

    {page === 'services' && <main className="services-page"><div className="page-hero services-hero"><div className="eyebrow light">{t('services.eyebrow')}</div><h1>{t('services.t1')}<br/><em>{t('services.t2')}</em></h1><p>{t('services.p')}</p></div><section className="services-content section-wrap"><div className="services-intro"><div className="eyebrow">{t('services.step')}</div><h2>{t('services.h1')}<br/>{t('services.h2')}<em>{t('services.h3')}</em></h2><p>{t('services.intro')}</p></div><div className="service-list">{services.map(s => <button type="button" key={s.id} className={serviceSelections.includes(s.id) ? 'service-option selected' : 'service-option'} onClick={() => toggleService(s.id)}><span className="service-icon">{s.icon}</span><span className="service-copy"><strong>{t(`svc.${s.id}.name`)}</strong><small>{t(`svc.${s.id}.desc`)}</small><b>{t(`svc.${s.id}.price`)}</b></span><span className="service-check">{serviceSelections.includes(s.id) ? <Check size={17}/> : <Plus size={17}/>}</span></button>)}</div><div className="service-request"><div><div className="eyebrow">{t('services.request')}</div><h3>{t(serviceSelections.length === 1 ? 'services.count.one' : 'services.count.many', { n: serviceSelections.length })}</h3><p>{serviceSelections.length ? serviceSelections.map(id => t(`svc.${id}.name`)).join(' · ') : t('services.none')}</p></div><button className="button button-dark" disabled={!serviceSelections.length} onClick={() => setServiceSent(true)}>{t('services.send')} <ArrowRight size={16}/></button>{serviceSent && <p className="success-note"><Check size={16}/> {t('services.sent')}</p>}</div></section><section className="services-bottom"><div><div className="eyebrow light">{t('services.bottom.eyebrow')}</div><h2>{t('services.bottom.t1')}<br/><em>{t('services.bottom.t2')}</em></h2><p>{t('services.bottom.p')}</p></div><button className="button button-light" onClick={() => go('builder')}>{t('services.bottom.cta')} <ArrowRight size={16}/></button></section></main>}

    <footer className="footer"><div className="footer-top"><button className="brand footer-brand" onClick={() => go('home')}><span className="brand-mark">旅</span>{brandText}</button><p>{t('footer.tagline')}</p></div><div className="footer-bottom"><span>{t('footer.copy')}</span><span>{t('footer.made')} <span className="red-heart">♥</span></span></div></footer>
  </>;
}
