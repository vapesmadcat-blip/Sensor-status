# Location & Humidity Cleaner - TODO

## Core Features

- [x] Home screen com cards de localização e umidade
- [x] Ícones e ilustrações para cada função
- [x] Implementar lógica de limpeza de histórico de localização
- [x] Implementar lógica de reset de sensor de umidade
- [x] Location History screen com lista de registros
- [x] Filtro por tipo de localização (GPS, WiFi, Célula)
- [x] Seleção de registros individuais
- [x] Deletar registros selecionados
- [x] Deletar todos os registros com confirmação
- [x] Status badges mostrando quantidade de registros
- [x] Histórico de últimas ações (timestamp)
- [x] Persistência de configurações com AsyncStorage
- [x] Hooks customizados para histórico e sensor
- [x] Confirmação com Alert antes de deletar
- [x] Feedback tátil com Haptics
- [ ] Filtro por data (24h, 7 dias, 30 dias, tudo)
- [ ] Busca por local/endereço
- [ ] Settings screen (tema, notificações, frequência de limpeza)

## UI/Design

- [x] Gerar logo/ícone do app
- [x] Atualizar app.config.ts com branding
- [x] Implementar tema claro/escuro
- [x] Adicionar animações suaves (fade-in, scale feedback)
- [x] Garantir design responsivo e one-handed usage
- [x] Adicionar ícones para GPS, umidade, lixeira, filtro
- [ ] Criar componentes reutilizáveis (Card, Button, Filter)

## Testing

- [x] Testar fluxo de limpeza de localização
- [x] Testar fluxo de reset de umidade
- [x] Testar filtros de histórico
- [x] Testar seleção e deleção de registros
- [x] Testar persistência de dados
- [x] Testar tema claro/escuro
- [ ] Testar em dispositivo real (Android)

## Deployment

- [x] Criar checkpoint final
- [ ] Gerar APK para Android (usar botão Publish na UI)
- [x] Documentar instruções de uso

## Painel de Monitoramento de Sensores (NOVO)

- [x] Criar aba "Sensores" na navegação
- [x] Implementar hook para monitorar sensores do sistema
- [x] Criar componentes visuais para cada sensor
- [x] Monitorar sensor de umidade/temperatura
- [x] Monitorar status da bateria
- [x] Monitorar GPS (ativo/inativo)
- [x] Monitorar conectividade (WiFi, Celular, Bluetooth)
- [x] Monitorar espaço de armazenamento
- [x] Monitorar acelerômetro e giroscópio
- [x] Sistema de alertas com cores (verde/amarelo/vermelho)
- [x] Atualização em tempo real dos dados
- [ ] Histórico de alertas
- [ ] Exportar relatório de sensores
