# MELHORIAS — react_js_nlw5

> **Diagnóstico original de 2026-10-05** · Stack original: CRA (react-scripts 4.0.3) + React 17 — exercício NLW5 (contador com useState)
> Branch `master` · Stack atual: Vite 8.3 + React 19.3 · teste automatizado pendente
>
> O diagnóstico abaixo registra o estado original. Para o estado atual, consulte a seção de execução e as notas de cada item.

## Estado da execução · 2026-10-11

- [x] **SEC-01:** CRA 4 removido e dependências migradas para Vite/React atuais. O lockfile npm final passa em `npm audit --audit-level=high` sem vulnerabilidades.
- [x] **DEVOPS-01:** Node 16 substituído por Node 24 LTS e Docker usa `npm ci` sem fallback.
- [ ] **TEST-01:** testes automatizados continuam pendentes; o antigo script do CRA foi removido para não indicar falsamente que há testes.
- [x] **DEVOPS-02:** workflow de lint, build, audit e imagem Docker publicado; execução `ff402001b7fe754018b1b7c2f798b86862bf500b` passou. Integração de testes fica pendente com TEST-01.
- [x] **DOC-01:** README usa `docker build` e `docker run`, sem depender de Compose; a porta local é publicada apenas em `127.0.0.1`.
- [x] **IMP-01 (implementação):** CRA migrado para Vite e React 19; os quatro contadores mantêm estado independente e incrementam com atualização funcional. O aceite automatizado permanece pendente com TEST-01.

O `npm audit` inicial não rodou porque o repositório tinha apenas `yarn.lock`, e o ambiente não tem o comando `yarn`. Após a migração, o lockfile npm atual foi auditado e passou sem vulnerabilidades.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. **Projeto de estudo enxuto** (contador de botão) — README já diz que não é o app da NLW. Plano proporcional; não inventar features.
4. **Idioma:** português.

---

## 1. Diagnóstico executivo original

Exercício da NLW5: `Button` com contador próprio (`useState`), `App` renderiza 4 botões. Sem rede, sem API, sem assets além dos padrões do CRA.

**O que está bem (não regredir):**

| Item | Evidência |
|---|---|
| README honesto (diz "não é o app completo") | `README.md` |
| Componente autocontestado (contador local) | `src/Button.jsx` |
| Dockerfile multi-stage com serve | `Dockerfile` |
| yarn.lock versionado | raiz |

**Defeitos encontrados naquela análise:**

1. **README manda `docker compose up --build` mas não existe `docker-compose.yml`** no repo (só `Dockerfile`) — instrução inicial falha.
2. **Build em `node:16-alpine` (EOL)** + `RUN npm ci || npm install` mascarando lockfile (`Dockerfile`).
3. **`"test": "react-scripts test"` sem nenhum arquivo `*.test.*` em src/** — script morto (interativo, sai 0 sem testar nada).
4. react-scripts 4.0.3 (2021, sem manutenção) — superfície de dev vulnerável (webpack-dev-server etc.).

---

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Depende de |
|---|---|---|---|---|
| DOC-01 | README: `docker compose up` sem compose no repo | **P1** | `README.md` | — |
| DEVOPS-01 | Build em node:16 EOL + `npm ci || npm install` | **P1** | `Dockerfile` | — |
| TEST-01 | Sem cobertura automatizada | **P1** | `src/`, `package.json` | — |
| SEC-01 | react-scripts 4.0.3 sem manutenção (npm audit) | **P2** | `package.json` | — |
| DEVOPS-02 | CI sem testes automatizados | **P2** | `.github/workflows/ci.yml` | TEST-01 |
| IMP-01 | CRA → Vite (estratégia de portfólio) | **P3** | `package.json` | — (cobertura complementar: TEST-01) |

---

## 3. Segurança

### SEC-01 · react-scripts 4.0.3 sem manutenção · [P2]

- **Estado atual:** concluído; CRA foi removido, o lockfile npm foi auditado sem vulnerabilidades de alta severidade e a CI mantém a auditoria ativa.

- **Arquivo:** `package.json`
- **Evidência:** `"react-scripts": "^4.0.1"` (resolve 4.0.3, 2021). A cadeia CRA4 (webpack-dev-server <4, postcss antigo) tem advisories públicos acumulados; Dependabot marca sem correção upstream (CRA está em manutenção mínima).
- **Impacto:** risco **de desenvolvimento** (dev server exposto localmente, supply-chain de build) — não de produção estática.
- **Mudança:** rodar `npm audit` e registrar contagem no item; decidir upgrade CRA4→5 (paliativo) ou Vite (`IMP-01`, solução).
- **Aceite:** audit revisado e decisão registrada.
- **Verificação:**
  ```bash
  npm audit 2>&1 | tail -5
  ```

---

## 4. Bugs e defeitos funcionais

*(Nenhum bug funcional no código do exercício — `Button.js` e `App.js` corretos para o propósito.)*

---

## 5. Qualidade: testes

### TEST-01 · Sem cobertura automatizada do contador · [P1]

- **Arquivo:** `src/Button.jsx`, `src/App.jsx`, `package.json`
- **Evidência atual:** não há arquivos `*.test.*` nem script de teste; a CI não declara aprovação automatizada do comportamento.
- **Impacto:** regressões no incremento ou no isolamento entre os quatro contadores podem passar pela CI.
- **Mudança pendente:** criar testes para renderização, incremento e independência dos contadores; adicionar um script `npm test` não interativo e incluí-lo na CI.
- **Aceite:** `npm test` executa ≥ 3 asserções e falha se o incremento quebrar.
- **Verificação:**
  ```bash
  CI=true npm test 2>&1 | tail -5
  ```

---

## 6. DevOps / Infra

### DEVOPS-01 · Build em node:16 EOL + fallback `npm install` · [P1]

- **Estado atual:** concluído; os estágios usam Node 24 e o build instala dependências somente com `npm ci`.

- **Arquivo:** `Dockerfile`
- **Evidência:**
  ```dockerfile
  FROM node:16-alpine AS build     # Node 16 EOL desde set/2023
  RUN npm ci || npm install        # fallback mascara lock dessincronizado
  ```
  Estágio de build em runtime sem patches; `|| npm install` entrega árvore não-auditada quando o lock diverge.
- **Impacto:** imagem de build com CVEs conhecidos; builds não reproduzíveis.
- **Mudança:** `FROM node:24-alpine AS build` e `RUN npm ci` puro.
- **Aceite:** build falha com lock errado; `docker build` verde com lock certo.
- **Verificação:**
  ```bash
  grep -n 'FROM node:\|npm install' Dockerfile
  ```

### DEVOPS-02 · CI sem testes automatizados · [P2]

- **Arquivo:** `.github/workflows/ci.yml`
- **Evidência atual:** workflow executa `npm ci`, lint, build, audit e `docker build`; execução remota para `ff402001b7fe754018b1b7c2f798b86862bf500b` concluída com sucesso.
- **Pendente:** adicionar a etapa `npm test` quando TEST-01 tiver testes reais.
- **Aceite atual:** lint, build, audit e imagem Docker são verificados em push e pull request para `master`; aceite de testes depende de TEST-01.
- **Verificação:**
  ```bash
  ls .github/workflows/
  ```

---

## 7. Documentação

### DOC-01 · README executa comando inexistente · [P1]

- **Arquivo:** `README.md`
- **Evidência:** "### Rodar com Docker: `docker compose up --build`" — `git ls-files` **não tem** `docker-compose.yml` (só `Dockerfile`). Quem segue o README falha na primeira linha.
- **Impacto:** onboarding quebrado; desconfiança no resto da doc.
- **Mudança:** ou (a) adicionar `docker-compose.yml` mínimo (`build: .`, `ports: 3000:3000`), ou (b) trocar o README para `docker build -t nlw5 . && docker run -p 3000:3000 nlw5`. Preferir (b) — compose é supérfluo pra 1 serviço.
- **Aceite:** comando do README sobe o app.
- **Verificação:**
  ```bash
  grep -n 'docker' README.md && (ls docker-compose.yml 2>/dev/null || grep -n 'docker build' README.md)
  ```

### IMP-01 · CRA → Vite (estratégia) · [P3]

- **Arquivo:** `package.json`
- **Evidência:** CRA4 sem manutenção real; app tem 3 arquivos — migração é **pequena**.
- **Impacto:** dívida só cresce se o portfólio for mantido vivo.
- **Estado atual:** CRA removido, `index.html` e componentes adaptados ao Vite e React atualizado. A aplicação preserva quatro contadores independentes; `npm run lint` e `npm run build` passam na CI.
- **Validação complementar:** a cobertura automatizada da interação depende de TEST-01.
- **Aceite:** `npm run dev`/`npm run build` no Vite, app com os quatro contadores independentes; cobertura automatizada fica registrada em TEST-01.
- **Verificação:**
  ```bash
  grep -c 'react-scripts' package.json   # 0 após migração
  ```

---

## 8. Ordem de execução (waves)

### Itens concluídos

`DOC-01`, `DEVOPS-01`, `SEC-01` e a migração `IMP-01` estão implementados. O workflow de `DEVOPS-02` já valida lint, build, audit e a imagem Docker.

### Pendência

1. **`TEST-01`** — adicionar testes para renderização, incremento e independência dos contadores.
2. **`DEVOPS-02`** — incluir `npm test` na CI depois de TEST-01.

**Dependências atuais:** incluir testes na CI depende de TEST-01. A migração IMP-01 já foi implementada; TEST-01 complementa sua validação.

---

## 9. Fora de escopo / riscos

| Item | Decisão | Motivo |
|---|---|---|
| Recriar o app Happy completo | **Não** | README deixa claro que é recorte de estudo; o app real está em `react_js_nlw5`↔Happy-React-Js (§docs do workspace). |
| Adicionar router/estado global | **Não** | Exercício de useState; inflar destrói o propósito didático. |
| Subir dev server exposto na rede | **Não** | CRA dev server sem HTTPS — manter localhost. |

**Risco pendente:** sem TEST-01, mudanças futuras ainda podem regredir o incremento ou o isolamento dos contadores sem falhar na CI.

---

## 10. Definição de pronto (DoD)

**Doc/infra**
- [x] `DOC-01` — comando do README sobe o app
- [x] `DEVOPS-01` — node:24 + `npm ci` puro
- [x] `DEVOPS-02` — CI de lint, build, audit e Docker; execução remota verde
- [ ] `DEVOPS-02` — integrar testes automatizados após TEST-01

**Qualidade**
- [ ] `TEST-01` — ≥ 3 asserções do Button
- [x] `SEC-01` — CRA substituído e audit npm zerado
- [x] `IMP-01` — CRA migrado para Vite; comportamento preservado

**Validação final:**
O CI atual executa lint, build, audit e `docker build`. Quando TEST-01 for implementado, adicionar e validar `npm test` na workflow.

---

*Fim do plano. O diagnóstico inicial foi feito em 2026-10-05; o estado de execução foi atualizado em 2026-10-11.*
