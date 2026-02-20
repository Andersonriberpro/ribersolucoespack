
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth, UserProfile } from './AuthContext';

const AdminPanel: React.FC = () => {
    const { user, userProfile, isAdmin, refreshProfile } = useAuth();
    const [activeSection, setActiveSection] = useState<'profile' | 'users'>('profile');

    // Profile form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Users management state
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.full_name || '');
            setPhone(userProfile.phone || '');
            setAvatarPreview(userProfile.avatar_url);
        }
    }, [userProfile]);

    useEffect(() => {
        if (isAdmin && activeSection === 'users') {
            loadAllUsers();
        }
    }, [isAdmin, activeSection]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const loadAllUsers = async () => {
        setLoadingUsers(true);
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setAllUsers(data as UserProfile[]);
        } catch (err: any) {
            showMessage('error', 'Erro ao carregar usuários: ' + err.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (!file.type.startsWith('image/')) {
            showMessage('error', 'Por favor, selecione uma imagem válida.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showMessage('error', 'A imagem deve ter no máximo 2MB.');
            return;
        }

        setUploadingAvatar(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // Remove old avatar if exists
            const { data: existingFiles } = await supabase.storage
                .from('avatars')
                .list(user.id);

            if (existingFiles && existingFiles.length > 0) {
                await supabase.storage
                    .from('avatars')
                    .remove(existingFiles.map(f => `${user.id}/${f.name}`));
            }

            // Upload new avatar
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const avatarUrl = urlData.publicUrl + '?t=' + Date.now();

            // Update profile
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setAvatarPreview(avatarUrl);
            await refreshProfile();
            showMessage('success', 'Foto de perfil atualizada com sucesso!');
        } catch (err: any) {
            showMessage('error', 'Erro ao enviar foto: ' + err.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            showMessage('success', 'Dados salvos com sucesso!');
        } catch (err: any) {
            showMessage('error', 'Erro ao salvar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            showMessage('error', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage('error', 'As senhas não coincidem.');
            return;
        }

        setSavingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            setNewPassword('');
            setConfirmPassword('');
            showMessage('success', 'Senha alterada com sucesso!');
        } catch (err: any) {
            showMessage('error', 'Erro ao alterar senha: ' + err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    const handleChangeRole = async (userId: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (error) throw error;

            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            showMessage('success', 'Permissão atualizada com sucesso!');
        } catch (err: any) {
            showMessage('error', 'Erro ao atualizar permissão: ' + err.message);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                        <i className="fas fa-shield-alt mr-1"></i>Admin
                    </span>
                );
            case 'user':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                        <i className="fas fa-user mr-1"></i>Usuário
                    </span>
                );
            case 'viewer':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                        <i className="fas fa-eye mr-1"></i>Visualizador
                    </span>
                );
            default:
                return null;
        }
    };

    const sections = [
        { id: 'profile' as const, icon: 'fa-user-circle', label: 'Meu Perfil' },
        ...(isAdmin ? [{ id: 'users' as const, icon: 'fa-users-cog', label: 'Gerenciar Usuários' }] : [])
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <i className="fas fa-cog text-xl"></i>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Administração</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Gerencie seu perfil e configurações do sistema</p>
                </div>
            </div>

            {/* Message Toast */}
            {message && (
                <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${message.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                    }`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-lg`}></i>
                    <span className="font-bold text-sm">{message.text}</span>
                </div>
            )}

            {/* Sub-navigation */}
            <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
                {sections.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeSection === s.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <i className={`fas ${s.icon}`}></i>
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Profile Section */}
            {activeSection === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-xl overflow-hidden mx-auto">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                                            <i className="fas fa-user text-4xl text-indigo-400"></i>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                >
                                    {uploadingAvatar ? (
                                        <i className="fas fa-circle-notch animate-spin"></i>
                                    ) : (
                                        <i className="fas fa-camera"></i>
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-5">
                                {userProfile?.full_name || 'Usuário'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{user?.email}</p>
                            <div className="mt-3">
                                {getRoleBadge(userProfile?.role || 'user')}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <i className="fas fa-calendar-alt text-indigo-500 w-4"></i>
                                    <span className="font-medium">Membro desde: {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('pt-BR') : '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <i className="fas fa-clock text-indigo-500 w-4"></i>
                                    <span className="font-medium">Atualizado: {userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString('pt-BR') : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Data Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-id-card text-indigo-600 dark:text-indigo-400 text-sm"></i>
                                </div>
                                Dados Pessoais
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Nome Completo</label>
                                    <div className="relative group">
                                        <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">E-mail</label>
                                    <div className="relative group">
                                        <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors"></i>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Telefone</label>
                                    <div className="relative group">
                                        <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Permissão</label>
                                    <div className="relative">
                                        <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                                        <input
                                            type="text"
                                            value={userProfile?.role === 'admin' ? 'Administrador' : userProfile?.role === 'viewer' ? 'Visualizador' : 'Usuário'}
                                            disabled
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="px-8 py-3 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <i className="fas fa-circle-notch animate-spin"></i>
                                    ) : (
                                        <><i className="fas fa-save"></i> Salvar Alterações</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-lock text-amber-600 dark:text-amber-400 text-sm"></i>
                                </div>
                                Alterar Senha
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Nova Senha</label>
                                    <div className="relative group">
                                        <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
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

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Confirmar Nova Senha</label>
                                    <div className="relative group">
                                        <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={savingPassword || !newPassword}
                                    className="px-8 py-3 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-100 dark:shadow-none transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {savingPassword ? (
                                        <i className="fas fa-circle-notch animate-spin"></i>
                                    ) : (
                                        <><i className="fas fa-key"></i> Alterar Senha</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Management Section */}
            {activeSection === 'users' && isAdmin && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <i className="fas fa-users text-emerald-600 dark:text-emerald-400 text-sm"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">Usuários do Sistema</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{allUsers.length} usuário(s) registrado(s)</p>
                            </div>
                        </div>
                        <button
                            onClick={loadAllUsers}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all flex items-center gap-2"
                        >
                            <i className="fas fa-sync-alt"></i> Atualizar
                        </button>
                    </div>

                    {loadingUsers ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-500 font-bold text-sm">Carregando usuários...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuário</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telefone</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Permissão</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Desde</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(u => (
                                        <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden flex-shrink-0">
                                                        {u.avatar_url ? (
                                                            <img src={u.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                                                                <i className="fas fa-user text-indigo-400 text-xs"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{u.full_name || 'Sem nome'}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium">{u.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{u.phone || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(u.role)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                    {new Date(u.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.id !== user?.id ? (
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="user">Usuário</option>
                                                        <option value="viewer">Visualizador</option>
                                                    </select>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">Você</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
