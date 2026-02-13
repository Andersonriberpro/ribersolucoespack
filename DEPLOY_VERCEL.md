# 🚀 Guia de Deploy na Vercel

## Pré-requisitos
- Conta na Vercel (https://vercel.com)
- Projeto no GitHub (você já fez isso!)
- Credenciais do Supabase e Gemini API

## Passo a Passo

### 1. Importar Projeto na Vercel

1. Acesse https://vercel.com e faça login
2. Clique em **"Add New Project"**
3. Selecione **"Import Git Repository"**
4. Escolha seu repositório do GitHub
5. A Vercel detectará automaticamente que é um projeto Vite

### 2. Configurar Variáveis de Ambiente

> [!IMPORTANT]
> **CRÍTICO**: Você DEVE configurar as variáveis de ambiente antes do deploy!

Na página de configuração do projeto na Vercel, adicione as seguintes variáveis:

| Nome da Variável | Valor | Onde Obter |
|------------------|-------|------------|
| `VITE_SUPABASE_URL` | Sua URL do Supabase | Dashboard do Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anônima | Dashboard do Supabase → Settings → API |
| `GEMINI_API_KEY` | Sua chave da API Gemini | Google AI Studio |

**Como adicionar:**
1. Na página de configuração do projeto, vá até **"Environment Variables"**
2. Adicione cada variável acima
3. Selecione **"Production"**, **"Preview"** e **"Development"**

### 3. Configurações de Build (já configuradas!)

✅ As seguintes configurações já estão prontas no `vercel.json`:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: Configurado para SPA routing

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (leva 1-3 minutos)
3. Pronto! Seu projeto estará no ar 🎉

### 5. Após o Deploy

A Vercel fornecerá:
- **URL de produção**: `https://seu-projeto.vercel.app`
- **URLs de preview**: Para cada commit/PR
- **Logs de build**: Para debug se necessário

## 🔄 Deploys Automáticos

A partir de agora, **cada push** para o GitHub fará deploy automático:
- Push para `main` → Deploy em produção
- Push para outras branches → Deploy de preview

## 🐛 Troubleshooting

### Build falhou?
1. Verifique os logs na Vercel
2. Confirme que as variáveis de ambiente estão corretas
3. Teste localmente: `npm run build`

### Página em branco após deploy?
1. Verifique o console do navegador (F12)
2. Confirme que as variáveis `VITE_*` estão configuradas
3. Verifique se o Supabase está acessível

### Erro 404 ao navegar?
- Já está resolvido pelo `vercel.json` (rewrites configurados)

## 📝 Notas Importantes

> [!WARNING]
> - **NUNCA** commite o arquivo `.env.local` (já está no `.gitignore`)
> - As variáveis de ambiente devem ser configuradas **na Vercel**, não no código
> - A Gemini API Key é sensível - mantenha segura!

## 🎯 Checklist Final

Antes de fazer deploy, confirme:
- [ ] Projeto está no GitHub
- [ ] Variáveis de ambiente preparadas (Supabase + Gemini)
- [ ] `vercel.json` está no repositório
- [ ] Testou `npm run build` localmente

## 🔗 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel + Vite](https://vercel.com/docs/frameworks/vite)
- [Supabase Dashboard](https://app.supabase.com)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
