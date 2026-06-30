# Configuração do Deploy para Google Play Store

Este guia explica como configurar o workflow de deploy automático para a Google Play Store.

## Pré-requisitos

1. **Conta Google Play Developer**: Crie uma conta em [Google Play Console](https://play.google.com/console)
2. **App criado no Google Play Console**: Crie um novo app e configure os detalhes básicos
3. **Service Account**: Crie uma conta de serviço com permissões para fazer upload de apps

## Passo 1: Criar uma Service Account

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services > Credentials**
4. Clique em **Create Credentials > Service Account**
5. Preencha os detalhes e clique em **Create and Continue**
6. Pule as etapas opcionais e clique em **Done**

## Passo 2: Criar uma Chave JSON

1. Na página de Service Accounts, clique na conta que você criou
2. Vá para a aba **Keys**
3. Clique em **Add Key > Create new key**
4. Selecione **JSON** e clique em **Create**
5. Um arquivo JSON será baixado automaticamente

## Passo 3: Configurar Permissões no Google Play Console

1. Acesse [Google Play Console](https://play.google.com/console)
2. Vá em **Settings > Users and permissions**
3. Clique em **Invite user**
4. Cole o email da Service Account (encontrado no JSON baixado: `client_email`)
5. Selecione as permissões necessárias:
   - ✅ Release management
   - ✅ View app information
   - ✅ View financial data
6. Clique em **Send invite**

## Passo 4: Adicionar o Secret no GitHub

1. Abra o arquivo JSON que foi baixado
2. Copie todo o conteúdo do arquivo
3. No seu repositório GitHub, vá em **Settings > Secrets and variables > Actions**
4. Clique em **New repository secret**
5. Nome: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
6. Valor: (Cole o conteúdo completo do arquivo JSON)
7. Clique em **Add secret**

## Passo 5: Atualizar o eas.json

Certifique-se de que o `eas.json` está configurado para gerar um **AAB** (Android App Bundle) em vez de APK:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

## Passo 6: Disparar o Deploy

1. Vá na aba **Actions** do seu repositório
2. Selecione o workflow **"Build and Deploy to Google Play Store"**
3. Clique em **Run workflow**
4. O app será construído e enviado para a fila de revisão do Google Play

## Tracks Disponíveis

O workflow está configurado para fazer upload no track **internal** (teste interno). Você pode alterar para:

- `internal` - Teste interno (recomendado para testes)
- `alpha` - Teste alfa (grupo limitado)
- `beta` - Teste beta (grupo maior)
- `production` - Produção (disponível para todos)

Para mudar, edite o arquivo `deploy-play-store.yml` e altere a linha:
```yaml
track: internal
```

## Notas Importantes

- O primeiro upload pode levar alguns minutos
- Você pode acompanhar o progresso no [Google Play Console](https://play.google.com/console)
- Certifique-se de que o `versionCode` no `app.config.ts` é incrementado a cada build
- O app passará por revisão antes de ser publicado
