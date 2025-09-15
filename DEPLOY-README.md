# 🚀 Deploy Frontend - Lineage CP

Este documento explica como fazer deploy do frontend React na VPS com Docker e Nginx.

## 📋 Configuração Implementada

### 🏗️ Arquitetura:
- **React App** → Build estático
- **Nginx Container** → Serve os arquivos estáticos
- **Nginx Proxy** → SSL/HTTPS e proxy reverso
- **GitHub Actions** → Deploy automático

### 🌐 URLs:
- **Produção**: https://omegateam.com.br
- **Health Check**: https://omegateam.com.br/health

## 🔧 Estrutura dos Arquivos

```
frontend/
├── Dockerfile                     # Build da aplicação React
├── nginx.conf                     # Configuração do Nginx interno
├── docker-compose.production.yml  # Orquestração dos containers
├── nginx/
│   ├── nginx.conf                 # Configuração principal do proxy
│   └── conf.d/
│       └── frontend.conf          # Configuração do domínio
├── scripts/
│   └── setup-ssl.sh              # Script para configurar SSL
└── .github/workflows/
    └── deploy.yml                 # Pipeline de deploy automático
```

## 🚀 Deploy Automático

### Como Funciona:
1. **Push para main** → Dispara GitHub Actions
2. **Build** → Compila React + cria imagem Docker
3. **Deploy** → Envia para VPS e inicia containers
4. **SSL** → Configura certificados automaticamente
5. **Health Check** → Verifica se está funcionando

### Configurar Secrets no GitHub:
No repositório do frontend, adicione os secrets:

```
SSH_USER=root
SSH_PASSWORD=prestigio
SERVER_HOST=89.116.29.83
```

## 🧪 Teste Local

```bash
# Build da aplicação
npm run build

# Build da imagem Docker
docker build -t lineage-frontend .

# Testar localmente
docker run -p 8080:80 lineage-frontend
```

## 🌐 Configuração DNS

Para funcionar em produção, configure o DNS:

```
omegateam.com.br     A    89.116.29.83
www.omegateam.com.br A    89.116.29.83
```

## 🔐 SSL/HTTPS

### Certificado Auto-assinado (Teste):
```bash
# No servidor
cd /var/www/lineage-cp-frontend
bash scripts/setup-ssl.sh self-signed
```

### Let's Encrypt (Produção):
```bash
# No servidor
cd /var/www/lineage-cp-frontend
bash scripts/setup-ssl.sh letsencrypt
```

## 🐛 Solução de Problemas

### Container não inicia:
```bash
# Ver logs
docker logs lineage-frontend-prod
docker logs lineage-frontend-nginx-prod

# Verificar status
docker ps
```

### SSL não funciona:
```bash
# Regenerar certificados
bash scripts/setup-ssl.sh self-signed

# Reiniciar nginx
docker-compose -f docker-compose.production.yml restart nginx
```

### Rotas não funcionam:
- Verifique se o `nginx.conf` tem `try_files $uri $uri/ /index.html;`
- Isso é necessário para React Router funcionar

## 📊 Monitoramento

### Logs em tempo real:
```bash
# Todos os containers
docker-compose -f docker-compose.production.yml logs -f

# Apenas frontend
docker logs -f lineage-frontend-prod

# Apenas nginx
docker logs -f lineage-frontend-nginx-prod
```

### Health Checks:
```bash
# Teste local
curl -k https://localhost/health

# Teste público (após DNS configurado)
curl -k https://omegateam.com.br/health
```

## 🔄 Comandos Úteis

```bash
# Reiniciar tudo
docker-compose -f docker-compose.production.yml restart

# Parar tudo
docker-compose -f docker-compose.production.yml down

# Ver status
docker-compose -f docker-compose.production.yml ps

# Rebuild e restart
docker-compose -f docker-compose.production.yml up -d --build
```

## 🎯 Próximos Passos

1. **Fazer commit** das alterações
2. **Push para main** → Dispara deploy automático
3. **Configurar DNS** para omegateam.com.br
4. **Configurar Let's Encrypt** para SSL válido
5. **Testar todas as rotas** do frontend

## 📝 Notas Importantes

- **React Router**: Configurado para funcionar com nginx
- **Cache**: Assets estáticos têm cache de 1 ano
- **Gzip**: Compressão habilitada para melhor performance
- **Security Headers**: Headers de segurança configurados
- **Rate Limiting**: Proteção contra spam/ataques

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs dos containers
2. Teste a conectividade de rede
3. Verifique a configuração DNS
4. Confirme que as portas 80/443 estão abertas
5. Verifique as variáveis de ambiente
