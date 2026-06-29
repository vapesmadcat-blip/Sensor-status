# Design - Location & Humidity Cleaner

## Screen List

1. **Home Screen** - Painel principal com funções de reset
2. **Location History** - Visualização e filtro do histórico de localização
3. **Settings** - Configurações do app

## Primary Content and Functionality

### Home Screen
- **Header com logo/ícone** do app
- **Dois cards principais** (um para cada função):
  - Card de Localização: ícone de GPS, título "Limpar Histórico de Localização", descrição do que faz, botão "Limpar"
  - Card de Umidade: ícone de gota/umidade, título "Resetar Sensor de Umidade", descrição, botão "Resetar"
- **Status badges** mostrando:
  - Quantidade de registros de localização armazenados
  - Estado do sensor de umidade
- **Botão flutuante** ou link para acessar histórico filtrado
- **Seção de últimas ações** mostrando timestamp das últimas limpezas

### Location History Screen
- **Barra de filtro no topo**:
  - Filtro por data (últimas 24h, 7 dias, 30 dias, tudo)
  - Filtro por tipo de localização (GPS, WiFi, célula)
  - Campo de busca por local
- **Lista de registros de localização**:
  - Cada item mostra: data/hora, tipo de localização, endereço/coordenadas
  - Ícones visuais diferenciando tipo (GPS = satélite, WiFi = rede, Célula = torre)
- **Contador total** de registros filtrados
- **Botão "Deletar Selecionados"** para remover itens específicos
- **Botão "Limpar Tudo"** com confirmação

### Settings Screen
- **Tema** (claro/escuro/automático)
- **Notificações** (ativar/desativar alertas de limpeza)
- **Frequência de limpeza automática** (desativada, semanal, mensal)
- **Sobre o app** (versão, desenvolvedor)

## Key User Flows

### Flow 1: Limpar Histórico de Localização
1. Usuário abre app → Home Screen
2. Usuário toca no card "Limpar Histórico de Localização"
3. App mostra modal de confirmação com número de registros a deletar
4. Usuário confirma → Histórico é deletado
5. App mostra toast/notificação de sucesso
6. Home Screen atualiza mostrando "0 registros"

### Flow 2: Resetar Sensor de Umidade
1. Usuário abre app → Home Screen
2. Usuário toca no card "Resetar Sensor de Umidade"
3. App mostra modal de confirmação
4. Usuário confirma → Sistema de umidade é resetado
5. App mostra toast/notificação de sucesso
6. Home Screen atualiza status

### Flow 3: Filtrar e Deletar Histórico Específico
1. Usuário toca no botão "Ver Histórico" → Location History Screen
2. Usuário ajusta filtros (data, tipo)
3. Lista atualiza mostrando apenas registros filtrados
4. Usuário seleciona registros específicos
5. Usuário toca "Deletar Selecionados"
6. App mostra confirmação e deleta

## Color Choices

- **Primary**: `#0a7ea4` (azul vibrante - transmite confiança e tecnologia)
- **Background**: `#ffffff` (claro) / `#151718` (escuro)
- **Surface**: `#f5f5f5` (claro) / `#1e2022` (escuro)
- **Success**: `#22C55E` (verde - para ações bem-sucedidas)
- **Warning**: `#F59E0B` (âmbar - para confirmações)
- **Error**: `#EF4444` (vermelho - para ações destrutivas)
- **Text Primary**: `#11181C` (claro) / `#ECEDEE` (escuro)
- **Text Secondary**: `#687076` (claro) / `#9BA1A6` (escuro)

## Visual Elements

- **Ícones**: GPS, gota/umidade, lixeira, filtro, check, X
- **Ilustrações**: Ícones grandes e coloridos para cada função
- **Animações**: Suave fade-in ao abrir screens, scale feedback nos botões
- **Feedback visual**: Toast notifications, loading spinners, checkmarks de sucesso
