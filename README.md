# Alerta Bairro

Aplicativo da Global Solution 2026/2 da FIAP, no tema CitizenTech. O morador salva locais de São Paulo e consulta cenários de enchente, deslizamento, incêndio em vegetação e onda de calor. O painel destaca o alerta de maior gravidade entre os bairros acompanhados. Os cenários são identificados como simulação e os alertas ficam disponíveis dentro do app.

## Executar localmente

Instale o Node.js 22 e o Git. Rode os comandos a partir da pasta deste README.

```powershell
cd mobile
npm ci
npm run web
```

Abra a URL exibida pelo Expo. Para usar um emulador Android do Android Studio, execute `npm run android`. Em um celular Android, use o APK do perfil `avaliacao`.

O aplicativo usa a API .NET publicada no Azure para registrar usuários, autenticar sessões, consultar alertas e gerenciar os locais monitorados. A API precisa estar disponível durante a avaliação. Se precisar trocar o endereço em desenvolvimento, configure `EXPO_PUBLIC_API_URL` em `mobile/.env` usando `mobile/.env.example` como referência. [Ver status da API](https://alerta-bairro-gs262.azurewebsites.net/health)

Para conferir tipos e lint, rode `npm run typecheck` e `npm run lint` em `mobile`.

## Gerar e distribuir o APK

1. Entre na conta Expo com acesso à equipe `lucasfelix3423s-team` e abra o terminal em `mobile`. O perfil `avaliacao` usa a API no Azure. [Projeto no Expo](https://expo.dev/accounts/lucasfelix3423s-team/projects/gs-mobile)

2. Faça commit das mudanças antes de gerar o APK. O app registra o hash do commit em **Sobre o App**.

   ```powershell
   npx eas-cli@latest build --platform android --profile avaliacao
   ```

3. Baixe e instale o APK para testar cadastro, login, navegação, CRUD e logout em um Android. Compare o hash mostrado na tela **Sobre o App** com `git rev-parse HEAD` no commit enviado.
4. No Firebase do grupo, registre o aplicativo Android como `br.com.alertabairro.app`. Em **App Distribution**, envie o APK e adicione o e-mail do professor à versão como tester.

[Gerar APK com Expo](https://docs.expo.dev/build-reference/apk/) · [Distribuir no Firebase](https://firebase.google.com/docs/app-distribution/android/distribute-console?apptype=apk)

## Telas do aplicativo

| Tela | Uso |
|---|---|
| Login e Cadastro | Duas telas públicas. As demais exigem sessão válida. |
| Início | Alerta de maior gravidade dos locais acompanhados e ação para sair. |
| Alertas | Lista com filtros por gravidade e local. |
| Detalhes do alerta | Bairro, janela de previsão, gravidade e orientação do cenário. |
| Meus locais | Lista de locais da conta, com edição e confirmação de exclusão. |
| Adicionar ou editar local | Formulário de nome e bairro. |
| Sobre o App | Tela adicional com a versão e o hash do commit. |

O app usa Fetch para acessar a API. O aplicativo nativo protege o token de sessão com o armazenamento seguro do dispositivo. Os locais monitorados ficam vinculados à conta autenticada na API.

## Vídeo e entrega

**Link do vídeo** · A preencher após a gravação. Publique no YouTube como público ou não listado, com até 5 minutos.

Cadastre a conta, saia e entre para mostrar o login. No painel, adicione um local na **Mooca** para exibir o alerta de enchente. Abra o alerta e mostre os filtros. Edite o local para **Santana**, confirme a atualização e exclua o local. Mostre o hash da versão em **Sobre o App** e termine com o logout.

Crie um arquivo `.txt` com o nome do grupo, integrantes, link do vídeo e repositório. Envie o arquivo no Portal do Aluno. Dê ao professor acesso ao GitHub e à versão no Firebase App Distribution.
