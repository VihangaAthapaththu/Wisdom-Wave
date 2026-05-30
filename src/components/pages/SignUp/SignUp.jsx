import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { Eye, EyeOff } from 'lucide-react';

/* ── Light-beam keyframes injected once ─────────────────── */
const BEAM_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

  @keyframes beam-sweep {
    0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
  }
  @keyframes beam-sweep-slow {
    0%   { transform: translateX(-120%) skewX(-24deg); opacity: 0; }
    20%  { opacity: 0.6; }
    80%  { opacity: 0.6; }
    100% { transform: translateX(220%) skewX(-24deg); opacity: 0; }
  }
  @keyframes beam-glow {
    0%, 100% { opacity: 0.12; }
    50%       { opacity: 0.28; }
  }
  @keyframes wsu-dot-drift {
    0%   { transform: translate(0, 0); }
    33%  { transform: translate(3px, -5px); }
    66%  { transform: translate(-4px, 2px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes wsu-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wsu-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .beam-1 {
    animation: beam-sweep 7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    animation-delay: 0s;
  }
  .beam-2 {
    animation: beam-sweep-slow 9s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    animation-delay: 2.5s;
  }
  .beam-3 {
    animation: beam-sweep 11s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    animation-delay: 5s;
  }
  .beam-4 {
    animation: beam-sweep-slow 13s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    animation-delay: 1.2s;
  }
  .beam-glow { animation: beam-glow 4s ease-in-out infinite; }

  .wsu-rise   { animation: wsu-rise 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .wsu-fade-in { animation: wsu-fade 0.2s ease both; }
  .wsu-d0 { animation-delay: 0.00s; }
  .wsu-d1 { animation-delay: 0.07s; }
  .wsu-d2 { animation-delay: 0.13s; }
  .wsu-d3 { animation-delay: 0.19s; }
  .wsu-d4 { animation-delay: 0.25s; }
  .wsu-d5 { animation-delay: 0.31s; }
  .wsu-d6 { animation-delay: 0.37s; }

  .wsu-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #ede9e3;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #1a1714;
    background: #faf8f5;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
  }
  .wsu-input:focus {
    border-color: #FFA500;
    box-shadow: 0 0 0 4px rgba(255,165,0,0.18);
    background: #fff;
  }
  .wsu-input::placeholder { color: #9e9890; }
  .wsu-input.err  { border-color: #e53e3e; }
  .wsu-input.err:focus { box-shadow: 0 0 0 4px rgba(229,62,62,0.12); }
  .wsu-input.ok   { border-color: #38a169; }

  .wsu-btn {
    width: 100%; padding: 13px;
    background: #FFA500; color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700; font-size: 15px;
    border: none; border-radius: 12px; cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 16px rgba(255,165,0,0.35);
    letter-spacing: 0.01em;
  }
  .wsu-btn:hover:not(:disabled) {
    background: #FF9500; transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255,165,0,0.45);
  }
  .wsu-btn:active:not(:disabled) { transform: translateY(0); }
  .wsu-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .wsu-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%);
    pointer-events: none;
  }
  .str-seg {
    height: 3px; flex: 1; border-radius: 2px;
    transition: background 0.3s ease;
  }
  .eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: #9e9890; display: flex; align-items: center;
    transition: color 0.15s;
  }
  .eye-btn:hover { color: #FFA500; }
  .eye-btn:disabled { cursor: not-allowed; }
  .wsu-link { color: #FFA500; font-weight: 600; text-decoration: none; }
  .wsu-link:hover { text-decoration: underline; }
  .wsu-check { accent-color: #FFA500; width: 15px; height: 15px; cursor: pointer; flex-shrink: 0; margin-top: 2px; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = 'wsu-beam-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = BEAM_CSS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

/* ── Dot canvas (right panel background) ───────────────── */
function DotCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const dots = Array.from({ length: 48 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 1 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.005,
      dx: (Math.random() - 0.5) * 0.0001,
      dy: (Math.random() - 0.5) * 0.0001,
    }));
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;
      dots.forEach(d => {
        d.x = (d.x + d.dx + 1) % 1;
        d.y = (d.y + d.dy + 1) % 1;
        const opacity = 0.12 + 0.16 * Math.sin(t * d.speed + d.phase);
        ctx.beginPath();
        ctx.arc(d.x * canvas.width, d.y * canvas.height, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,165,0,${opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ── Strength ────────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8)  s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: 'Weak',   color: '#e53e3e' };
  if (s === 2) return { score: 2, label: 'Fair',   color: '#dd6b20' };
  if (s === 3) return { score: 3, label: 'Good',   color: '#d69e2e' };
  return               { score: 4, label: 'Strong', color: '#38a169' };
}

/* ── Helpers ─────────────────────────────────────────────── */
const InfoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const CrossIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function FieldErr({ msg }) {
  if (!msg) return null;
  return (
    <p className="wsu-fade-in flex items-center gap-1 mt-1" style={{ color: '#e53e3e', fontSize: 12 }}>
      <InfoIcon /> {msg}
    </p>
  );
}

function EyeBtn({ show, onToggle, disabled }) {
  return (
    <button type="button" className="eye-btn" onClick={onToggle} disabled={disabled}
      aria-label={show ? 'Hide password' : 'Show password'}>
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );
}

/* ── Light beams (left panel) ────────────────────────────── */
function LightBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 'inherit' }}>
      {/* Ambient glow pools */}
      <div className="beam-glow absolute rounded-full"
        style={{ width: 320, height: 320, top: -80, left: -80,
          background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)' }} />
      <div className="beam-glow absolute rounded-full"
        style={{ width: 240, height: 240, bottom: 60, right: -40, animationDelay: '2s',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)' }} />

      {/* Sweeping light beams */}
      <div className="beam-1 absolute inset-y-0"
        style={{ left: '-30%', width: '18%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.13) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.13) 60%, transparent 100%)',
          filter: 'blur(1px)' }} />
      <div className="beam-2 absolute inset-y-0"
        style={{ left: '-20%', width: '10%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 60%, transparent 100%)' }} />
      <div className="beam-3 absolute inset-y-0"
        style={{ left: '-25%', width: '14%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)',
          filter: 'blur(2px)' }} />
      <div className="beam-4 absolute inset-y-0"
        style={{ left: '-15%', width: '8%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)' }} />
    </div>
  );
}

/* ── SignUp ───────────────────────────────────────────────── */
export function SignUp() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false });
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError]     = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
    if (fieldErrors.length) setFieldErrors([]);
  };
  const onBlur = e => setTouched(p => ({ ...p, [e.target.name]: true }));

  const fieldErr = field => {
    if (!touched[field]) return '';
    if (field === 'fullName'        && form.fullName        && form.fullName.trim().length < 2)      return 'Full name must be at least 2 characters.';
    if (field === 'email'           && form.email           && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (field === 'password'        && form.password        && form.password.length < 8)              return 'Password must be at least 8 characters.';
    if (field === 'confirmPassword' && form.confirmPassword && form.confirmPassword !== form.password) return 'Passwords do not match.';
    return '';
  };

  const match   = form.confirmPassword && form.password === form.confirmPassword;
  const noMatch = form.confirmPassword && form.password !== form.confirmPassword;

  const ic = (field) => {
    let cls = 'wsu-input';
    if (fieldErr(field)) cls += ' err';
    else if (field === 'confirmPassword' && match) cls += ' ok';
    return cls;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); setFieldErrors([]);
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!form.acceptTerms) { setError('Please accept the Terms of Service and Privacy Policy.'); return; }
    setLoading(true);
    try {
      await register({ name: form.fullName, email: form.email, password: form.password, confirmPassword: form.confirmPassword });
      navigate('/student-dashboard');
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) setFieldErrors(res.errors);
      else setError(res?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: '#faf8f5', fontFamily: "'Outfit', sans-serif", color: '#1a1714' }}>
      <StyleInjector />

      <div className="w-full grid overflow-hidden relative"
        style={{
          maxWidth: 960,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          borderRadius: 24,
          boxShadow: '0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
          minHeight: 680,
        }}>

        {/* ── LEFT — brand ── */}
        <div className="relative flex flex-col justify-between overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #FF9A00 0%, #FF6200 100%)',
            padding: '52px 48px',
          }}>
          <LightBeams />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-12">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, color: '#FF7A00', lineHeight: 1 }}>W</span>
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '0.02em' }}>
                Wisdom Wave
              </span>
            </div>

            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 38, color: '#fff', lineHeight: 1.18, marginBottom: 16 }}>
              Start your<br />learning<br />journey today.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, lineHeight: 1.7, maxWidth: 270 }}>
              Join a global community of IT professionals building real skills through hands-on courses.
            </p>
          </div>

          {/* Feature pills */}
          <div className="relative z-10">
            <div className="flex flex-col gap-3 pt-7" style={{ borderTop: '1px solid rgba(255,255,255,0.25)' }}>
              {['✦  Personalized learning paths', '✦  Industry-recognized certificates', '✦  Expert mentor support', '✦  Real-time progress tracking'].map(t => (
                <div key={t} style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — form ── */}
        <div className="relative flex flex-col justify-center overflow-hidden overflow-y-auto"
          style={{ background: '#fff', padding: '44px 48px' }}>
          <DotCanvas />
          <div className="relative z-10">

            {/* Header */}
            <div className="wsu-rise wsu-d0 mb-7">
              <p style={{ fontSize: 12, fontWeight: 600, color: '#FFA500', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Create your account
              </p>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 30, color: '#1a1714', lineHeight: 1.15 }}>
                Get started for free
              </h2>
              <p style={{ color: '#9e9890', fontSize: 14, marginTop: 8 }}>Takes under a minute. No credit card needed.</p>
            </div>

            {/* Global error */}
            {(error || fieldErrors.length > 0) && (
              <div className="wsu-fade-in flex gap-2.5 items-start mb-5 rounded-xl p-3"
                style={{ background: '#FFF5F5', border: '1.5px solid #FED7D7' }}>
                <InfoIcon />
                <div style={{ color: '#e53e3e', fontSize: 13 }}>
                  {error && <span>{error}</span>}
                  {fieldErrors.map((fe, i) => <div key={i}>{fe.message}</div>)}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">

              {/* Full name */}
              <div className="wsu-rise wsu-d1">
                <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 600, color: '#4b4540', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  htmlFor="su-name">Full Name</label>
                <div className="relative">
                  <input className={ic('fullName')} style={{ paddingRight: touched.fullName && !fieldErr('fullName') && form.fullName ? 40 : 14 }}
                    type="text" id="su-name" name="fullName" value={form.fullName}
                    onChange={onChange} onBlur={onBlur} placeholder="Your full name"
                    autoComplete="name" required disabled={loading} />
                  {touched.fullName && !fieldErr('fullName') && form.fullName && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3.5 flex" style={{ color: '#38a169' }}>
                      <CheckIcon />
                    </span>
                  )}
                </div>
                <FieldErr msg={fieldErr('fullName')} />
              </div>

              {/* Email */}
              <div className="wsu-rise wsu-d2">
                <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 600, color: '#4b4540', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  htmlFor="su-email">Email Address</label>
                <div className="relative">
                  <input className={ic('email')} style={{ paddingRight: touched.email && !fieldErr('email') && form.email ? 40 : 14 }}
                    type="email" id="su-email" name="email" value={form.email}
                    onChange={onChange} onBlur={onBlur} placeholder="you@example.com"
                    autoComplete="email" required disabled={loading} />
                  {touched.email && !fieldErr('email') && form.email && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3.5 flex" style={{ color: '#38a169' }}>
                      <CheckIcon />
                    </span>
                  )}
                </div>
                <FieldErr msg={fieldErr('email')} />
              </div>

              {/* Passwords */}
              <div className="wsu-rise wsu-d3 grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Password */}
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 600, color: '#4b4540', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                    htmlFor="su-pw">Password</label>
                  <div className="relative">
                    <input className={ic('password')} style={{ paddingRight: 44 }}
                      type={showPw ? 'text' : 'password'} id="su-pw" name="password" value={form.password}
                      onChange={onChange} onBlur={onBlur} placeholder="Min. 8 chars"
                      autoComplete="new-password" required disabled={loading} />
                    <EyeBtn show={showPw} onToggle={() => setShowPw(v => !v)} disabled={loading} />
                  </div>
                  <FieldErr msg={fieldErr('password')} />
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(l => (
                          <div key={l} className="str-seg" style={{ background: strength.score >= l ? strength.color : '#ede9e3' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 600, color: '#4b4540', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                    htmlFor="su-cpw">Confirm Password</label>
                  <div className="relative">
                    <input className={ic('confirmPassword')} style={{ paddingRight: 44 }}
                      type={showCpw ? 'text' : 'password'} id="su-cpw" name="confirmPassword" value={form.confirmPassword}
                      onChange={onChange} onBlur={onBlur} placeholder="Re-enter"
                      autoComplete="new-password" required disabled={loading} />
                    <EyeBtn show={showCpw} onToggle={() => setShowCpw(v => !v)} disabled={loading} />
                  </div>
                  {form.confirmPassword && form.password && (
                    <p className="flex items-center gap-1 mt-1.5"
                      style={{ fontSize: 11, fontWeight: 600, color: match ? '#38a169' : '#e53e3e' }}>
                      {match
                        ? <><CheckIcon size={11} /> Passwords match</>
                        : <><CrossIcon /> Don't match</>}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="wsu-rise wsu-d4 flex items-start gap-2.5 mt-0.5">
                <input className="wsu-check" type="checkbox" id="su-terms" name="acceptTerms"
                  checked={form.acceptTerms} onChange={onChange} disabled={loading} />
                <label htmlFor="su-terms" style={{ fontSize: 13, color: '#4b4540', cursor: 'pointer', lineHeight: 1.5, userSelect: 'none' }}>
                  I agree to the{' '}
                  <a href="#terms" className="wsu-link">Terms of Service</a> and{' '}
                  <a href="#privacy" className="wsu-link">Privacy Policy</a>
                </label>
              </div>

              {/* Submit */}
              <div className="wsu-rise wsu-d5">
                <button type="submit" className="wsu-btn" disabled={loading || !!noMatch}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg style={{ animation: 'spin 0.8s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Creating account…
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>

            <p className="wsu-rise wsu-d6 text-center mt-5" style={{ fontSize: 14, color: '#9e9890' }}>
              Already have an account?{' '}
              <Link to="/signin" className="wsu-link">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}