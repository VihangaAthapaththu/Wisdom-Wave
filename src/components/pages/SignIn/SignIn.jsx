import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { Eye, EyeOff } from 'lucide-react';
import { validateForm } from '@/lib/validation/validateForm';
import { signInSchema } from '@/lib/validation/schemas';
import { getApiError } from '@/lib/api/errorUtils';

/* ── Tiny animated dot canvas ── */
function DotCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 1 + Math.random() * 1.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.005,
      dx: (Math.random() - 0.5) * 0.00013,
      dy: (Math.random() - 0.5) * 0.00013,
    }));
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;
      dots.forEach(d => {
        d.x = (d.x + d.dx + 1) % 1;
        d.y = (d.y + d.dy + 1) % 1;
        const a = 0.13 + 0.18 * Math.sin(t * d.speed + d.phase);
        ctx.beginPath();
        ctx.arc(d.x * canvas.width, d.y * canvas.height, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,165,0,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ── Field error ── */
function FieldErr({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5 text-[11px] text-danger font-medium animate-[fadeIn_0.15s_ease]">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </p>
  );
}

export function SignIn() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
    if (fieldErrors.length) setFieldErrors([]);
  };
  const onBlur = e => setTouched(p => ({ ...p, [e.target.name]: true }));

  const fieldErr = field => {
    if (!touched[field]) return '';
    if (field === 'email' && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Enter a valid email address.';
    if (field === 'password' && form.password && form.password.length < 6)
      return 'Password must be at least 6 characters.';
    return '';
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); setFieldErrors([]);
    setTouched({ email: true, password: true });

    const { success, errors } = validateForm(signInSchema, { email: form.email, password: form.password });
    if (!success) {
      setFieldErrors(Object.entries(errors).map(([field, message]) => ({ field, message })));
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if(user.role === 'ADMIN') navigate('/dashboard')
      else if(user.role === 'LECTURER') navigate('/lecturer-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      const { status, message, fieldErrors: fe } = getApiError(err, 'Login failed. Please try again.');
      if (Object.keys(fe).length) {
        setFieldErrors(Object.entries(fe).map(([field, m]) => ({ field, message: m })));
      } else {
        setError(status ? `${message} (Error ${status})` : message);
      }
    } finally { setLoading(false); }
  };

  const inputCls = field =>
    `w-full px-4 py-3 rounded-xl border-[1.5px] bg-bg-paper text-[14px] text-gray-800 placeholder:text-gray-400 transition-all duration-200 outline-none
    ${fieldErr(field)
      ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
      : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white'}`;

  return (
    <div className="min-h-screen bg-bg-paper flex items-center justify-center p-5 font-sans">
      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Outfit:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes rise   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(7deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(13px) rotate(-5deg)} }
        @keyframes floatC { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.07)} }
        @keyframes spin   { to { transform:rotate(360deg) } }
        .anim-rise  { animation: rise 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .float-a    { animation: floatA 7s ease-in-out infinite; }
        .float-b    { animation: floatB 9s ease-in-out infinite 1.2s; }
        .float-c    { animation: floatC 6.5s ease-in-out infinite 0.6s; }
        .float-d    { animation: floatA 11s ease-in-out infinite 2.5s; }
        .float-e    { animation: floatB 8s ease-in-out infinite 0.3s; }
        .spin-svg   { animation: spin 0.85s linear infinite; }
        .jakarta    { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="w-full max-w-[960px] rounded-[24px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.10),0_4px_16px_rgba(0,0,0,0.06)] flex flex-col md:flex-row min-h-[620px]">

        {/* ── LEFT PANEL ── */}
        <div className="w-full md:w-[45%] relative overflow-hidden flex flex-col justify-between p-[52px_48px] text-white bg-gradient-to-br from-primary to-primary-600">

          {/* Floating shapes */}
          <div className="float-a absolute top-10 right-8 w-20 h-20 rounded-2xl bg-white/15" />
          <div className="float-b absolute top-36 right-20 w-11 h-11 rounded-full bg-white/20" />
          <div className="float-c absolute bottom-28 right-10 w-16 h-16 rounded-2xl bg-white/10 rotate-12" />
          <div className="float-d absolute bottom-48 left-5 w-7 h-7 rounded-full bg-white/20" />
          <div className="float-e absolute top-60 left-3 w-4 h-4 rounded bg-white/25" />
          {/* Radial glow */}
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 70%)' }} />

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-14">
              <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-md">
                <span className="jakarta font-extrabold text-xl text-primary-700 leading-none">W</span>
              </div>
              <span className="jakarta font-bold text-[15px] tracking-wide">Wisdom Wave</span>
            </div>

            <p className="jakarta font-extrabold text-[38px] leading-[1.15] mb-4">
              Welcome<br />back, learner.
            </p>
            <p className="text-white/80 text-[14.5px] leading-relaxed max-w-[270px]">
              Pick up right where you left off. Your courses, progress, and certificates are all here.
            </p>
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-7 pt-8 border-t border-white/25">
            {[['12K+','Learners'],['200+','Courses'],['98%','Completion']].map(([n,l]) => (
              <div key={l}>
                <div className="jakarta font-extrabold text-[22px] leading-none">{n}</div>
                <div className="text-white/70 text-[11px] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:flex-1 bg-white relative overflow-hidden flex flex-col justify-center p-[52px_48px]">
          <DotCanvas />

          <div className="relative z-10">
            {/* Header */}
            <div className="anim-rise mb-9" style={{ animationDelay: '0s' }}>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em] mb-2">
                Sign in to your account
              </p>
              <h2 className="jakarta font-extrabold text-[30px] text-gray-900 leading-tight">
                Welcome back
              </h2>
              <p className="text-gray-400 text-[13.5px] mt-2">Enter your credentials to continue learning.</p>
            </div>

            {/* Global error */}
            {(error || fieldErrors.length > 0) && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-[13px] text-red-600 animate-[fadeIn_0.2s_ease]">
                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  {error && <p>{error}</p>}
                  {fieldErrors.map((fe, i) => <p key={i}>{fe.message}</p>)}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">

              {/* Email */}
              <div className="anim-rise" style={{ animationDelay: '0.07s' }}>
                <label htmlFor="si-email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  className={inputCls('email')}
                  type="email" id="si-email" name="email"
                  value={form.email} onChange={onChange} onBlur={onBlur}
                  placeholder="you@example.com" autoComplete="email" required disabled={loading}
                />
                <FieldErr msg={fieldErr('email')} />
              </div>

              {/* Password */}
              <div className="anim-rise" style={{ animationDelay: '0.14s' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="si-pw" className="text-[13px] font-semibold text-gray-700">Password</label>
                  <a href="#forgot" className="text-[12.5px] font-semibold text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    className={`${inputCls('password')} pr-11`}
                    type={showPw ? 'text' : 'password'} id="si-pw" name="password"
                    value={form.password} onChange={onChange} onBlur={onBlur}
                    placeholder="••••••••" autoComplete="current-password" required disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} disabled={loading}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-150 focus:outline-none">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <FieldErr msg={fieldErr('password')} />
              </div>

              {/* Remember me */}
              <div className="anim-rise flex items-center gap-2.5" style={{ animationDelay: '0.21s' }}>
                <input
                  type="checkbox" id="si-remember" name="rememberMe"
                  checked={form.rememberMe} onChange={onChange} disabled={loading}
                  className="w-[15px] h-[15px] cursor-pointer accent-primary rounded"
                />
                <label htmlFor="si-remember" className="text-[13px] text-gray-500 cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <div className="anim-rise" style={{ animationDelay: '0.28s' }}>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-700 active:bg-[#e68900] text-white font-bold text-[15px] tracking-wide transition-all duration-200 shadow-[0_4px_16px_rgba(255,165,0,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,165,0,0.42)] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading && <svg className="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                    {loading ? 'Signing in…' : 'Sign In'}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
                </button>
              </div>
            </form>

            <p className="anim-rise text-center mt-7 text-[13.5px] text-gray-400" style={{ animationDelay: '0.35s' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">Create one now</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}