import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  onLogin: (userData: any) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          setError(error.message);
        } else if (data.user) {
          alert('Cadastro realizado! Verifique seu e-mail para confirmação.');
          setIsSignUpMode(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          onLogin(data.user);
        }
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        setError(error.message);
      } else {
        setForgotEmailSent(true);
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar enviar o e-mail de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="w-full max-w-md z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 transition-colors">
            <button
              onClick={() => { setIsForgotMode(false); setForgotEmailSent(false); }}
              className="text-slate-400 hover:text-indigo-600 mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <i className="fas fa-arrow-left"></i> Voltar ao Login
            </button>

            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Recuperar Senha</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
              {forgotEmailSent
                ? "Se o e-mail estiver cadastrado, você receberá instruções em instantes."
                : "Informe seu e-mail corporativo para receber o link de redefinição."}
            </p>

            {!forgotEmailSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : "Enviar Link de Recuperação"}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-2xl text-center">
                <i className="fas fa-paper-plane text-emerald-500 text-3xl mb-4"></i>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">E-mail enviado com sucesso!</p>
                <p className="text-emerald-600/70 dark:text-emerald-500/70 text-xs mt-2">Verifique sua caixa de entrada e spam.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-10 transition-colors">

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none mb-6 rotate-3">
              <i className="fas fa-scroll text-3xl"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight text-center">RiberPack</h1>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2">Gestão de Embalagens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail corporativo"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Senha</label>
                {!isSignUpMode && (
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative group">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {!isSignUpMode && (
              <div className="flex items-center gap-2 ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">Mantenha-me conectado</label>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 border border-rose-100 dark:border-rose-500/20">
                <i className="fas fa-circle-exclamation text-lg"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {isLoading ? (
                <i className="fas fa-circle-notch animate-spin text-lg"></i>
              ) : (
                <>
                  {isSignUpMode ? 'Criar Minha Conta' : 'Entrar no Sistema'}
                  <i className="fas fa-chevron-right ml-1"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsSignUpMode(!isSignUpMode); setError(''); }}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all"
            >
              {isSignUpMode ? (
                <>Já possui uma conta? <span className="text-indigo-600 dark:text-indigo-400">Entre aqui</span></>
              ) : (
                <>Não tem acesso? <span className="text-indigo-600 dark:text-indigo-400">Solicite seu cadastro</span></>
              )}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-700"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon'}`}></i>
            </button>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Ribersoluções © 2024</p>
              <p className="text-[8px] text-slate-300 dark:text-slate-600 font-bold">Versão estável 2.4.1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
