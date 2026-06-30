#!/bin/bash

# Script para configurar variáveis de ambiente para deploy na Google Play Store
# Requer: GitHub CLI (gh) instalado e autenticado

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar se gh está instalado
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) não está instalado."
    echo "Instale em: https://cli.github.com/"
    exit 1
fi

# Verificar se está logado no GitHub
if ! gh auth status &> /dev/null; then
    print_error "Você não está logado no GitHub CLI."
    echo "Execute: gh auth login"
    exit 1
fi

print_info "Configurador de Variáveis de Ambiente - Google Play Store"
echo ""

# Repositório padrão
REPO="vapesmadcat-blip/Sensor-status"
read -p "Repositório (padrão: $REPO): " INPUT_REPO
REPO=${INPUT_REPO:-$REPO}

echo ""
print_info "Você precisa de dois secrets:"
echo "  1. EXPO_TOKEN - Token de acesso do Expo"
echo "  2. GOOGLE_PLAY_SERVICE_ACCOUNT_JSON - Arquivo JSON da Service Account"
echo ""

# ============================================================================
# EXPO_TOKEN
# ============================================================================
echo ""
print_info "=== CONFIGURANDO EXPO_TOKEN ==="
echo ""
echo "Para obter o EXPO_TOKEN:"
echo "  1. Vá em https://expo.dev/"
echo "  2. Faça login com sua conta"
echo "  3. Vá em Account Settings > Access Tokens"
echo "  4. Clique em 'Create Token'"
echo ""

read -sp "Cole o EXPO_TOKEN (será ocultado): " EXPO_TOKEN
echo ""

if [ -z "$EXPO_TOKEN" ]; then
    print_error "EXPO_TOKEN não pode estar vazio."
    exit 1
fi

print_info "Configurando EXPO_TOKEN no GitHub..."
echo "$EXPO_TOKEN" | gh secret set EXPO_TOKEN --repo "$REPO" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "EXPO_TOKEN configurado com sucesso!"
else
    print_error "Erro ao configurar EXPO_TOKEN. Verifique suas permissões."
    exit 1
fi

# ============================================================================
# GOOGLE_PLAY_SERVICE_ACCOUNT_JSON
# ============================================================================
echo ""
print_info "=== CONFIGURANDO GOOGLE_PLAY_SERVICE_ACCOUNT_JSON ==="
echo ""
echo "Para obter o arquivo JSON:"
echo "  1. Vá em https://console.cloud.google.com/"
echo "  2. Crie um novo projeto ou selecione um existente"
echo "  3. Vá em APIs & Services > Credentials"
echo "  4. Clique em 'Create Credentials' > 'Service Account'"
echo "  5. Preencha os detalhes e clique em 'Create and Continue'"
echo "  6. Na aba 'Keys', clique em 'Add Key' > 'Create new key'"
echo "  7. Selecione 'JSON' e clique em 'Create'"
echo "  8. Um arquivo JSON será baixado"
echo ""

read -p "Caminho do arquivo JSON (ex: ~/Downloads/service-account.json): " JSON_PATH

# Expandir ~ para o caminho completo
JSON_PATH="${JSON_PATH/#\~/$HOME}"

if [ ! -f "$JSON_PATH" ]; then
    print_error "Arquivo não encontrado: $JSON_PATH"
    exit 1
fi

# Validar se é um JSON válido
if ! jq empty "$JSON_PATH" 2>/dev/null; then
    print_error "Arquivo não é um JSON válido."
    exit 1
fi

print_info "Configurando GOOGLE_PLAY_SERVICE_ACCOUNT_JSON no GitHub..."

# Ler o arquivo e configurar como secret
gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON --repo "$REPO" < "$JSON_PATH"

if [ $? -eq 0 ]; then
    print_success "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON configurado com sucesso!"
else
    print_error "Erro ao configurar GOOGLE_PLAY_SERVICE_ACCOUNT_JSON."
    exit 1
fi

# ============================================================================
# VERIFICAÇÃO FINAL
# ============================================================================
echo ""
print_info "=== VERIFICANDO SECRETS ==="
echo ""

SECRETS=$(gh secret list --repo "$REPO")

if echo "$SECRETS" | grep -q "EXPO_TOKEN"; then
    print_success "EXPO_TOKEN configurado ✓"
else
    print_warning "EXPO_TOKEN não encontrado"
fi

if echo "$SECRETS" | grep -q "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON"; then
    print_success "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON configurado ✓"
else
    print_warning "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON não encontrado"
fi

echo ""
print_success "Configuração concluída!"
echo ""
print_info "Próximos passos:"
echo "  1. Vá em https://play.google.com/console"
echo "  2. Crie um novo app ou selecione um existente"
echo "  3. Vá em Settings > Users and permissions"
echo "  4. Clique em 'Invite user'"
echo "  5. Cole o email da Service Account (encontrado no JSON: 'client_email')"
echo "  6. Selecione as permissões necessárias"
echo "  7. Clique em 'Send invite'"
echo ""
print_info "Depois, você pode disparar o workflow em:"
echo "  https://github.com/$REPO/actions"
