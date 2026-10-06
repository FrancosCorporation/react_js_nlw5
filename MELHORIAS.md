# MELHORIAS — react_js_nlw5

> **Gerado por análise de código em 2026-10-05** · Stack: CRA (react-scripts 4.0.3) + React 17 — exercício NLW5 (contador com useState)
> Branch `main` · 3 arquivos em src/ (App, Button, index) · script de teste sem arquivos · sem CI
>
> **Este arquivo é um plano de execução.** Cada item tem ID, `arquivo:linha`, mudança exata, critério de aceite e comando de verificação.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. **Projeto de estudo enxuto** (contador de botão) — README já diz que não é o app da NLW. Plano proporcional; não inventar features.
4. **Idioma:** português.

---

## 1. Diagnóstico executivo

Exercício da NLW5: `Button` com contador próprio (`useState`), `App` renderiza 4 botões. Sem rede, sem API, sem assets além dos padrões do CRA.

**O que está bem (não regredir):**

| Item | Evidência |
|---|---|
| README honesto (diz "não é o app completo") | `README.md` |
| Componente autocontestado (contador local) | `src/Button.js:5-8` |
| Dockerfile multi-stage com serve | `Dockerfile` |
| yarn.lock versionado | raiz |

**O que está quebrado:**

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
| TEST-01 | Script de teste sem arquivos de teste | **P1** | `package.json` | — |
| SEC-01 | react-scripts 4.0.3 sem manutenção (npm audit) | **P2** | `package.json` | — |
| DEVOPS-02 | Sem CI | **P2** | *(ausente)* `.github/workflows/` | TEST-01 |
| IMP-01 | CRA → Vite (estratégia de portfólio) | **P3** | `package.json` | TEST-01 |

---

## 3. Segurança

### SEC-01 · react-scripts 4.0.3 sem manutenção · [P2]

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

### TEST-01 · `react-scripts test` sem nenhum arquivo de teste · [P1]

- **Arquivo:** `package.json` (`"test": "react-scripts test"`), `src/` (sem `*.test.*`)
- **Evidência:** `ls src/` = App.js, Button.js, index.js — zero testes; o script entra em watch e não falha por ausência.
- **Impacto:** falso verde — CI futuro "passaria" sem testar nada; regressão do `Button` (ex.: `setCounter(counter+1)` em lote — clássico do React 17) passaria.
- **Mudança:** criar `src/Button.test.js`: render, clique incrementa `1→2`, quatro botões independentes (clique num não muda outro). Desligar watch em CI (`--watchAll=false`).
- **Aceite:** `npm test` executa ≥ 3 asserções e falha se o incremento quebrar.
- **Verificação:**
  ```bash
  CI=true npm test 2>&1 | tail -5
  ```

---

## 6. DevOps / Infra

### DEVOPS-01 · Build em node:16 EOL + fallback `npm install` · [P1]

- **Arquivo:** `Dockerfile`
- **Evidência:**
  ```dockerfile
  FROM node:16-alpine AS build     # Node 16 EOL desde set/2023
  RUN npm ci || npm install        # fallback mascara lock dessincronizado
  ```
  Estágio de build em runtime sem patches; `|| npm install` entrega árvore não-auditada quando o lock diverge.
- **Impacto:** imagem de build com CVEs conhecidos; builds não reproduzíveis.
- **Mudança:** `FROM node:20-alpine AS build` (alinhado ao estágio serve) e `RUN npm ci` puro.
- **Aceite:** build falha com lock errado; `docker build` verde com lock certo.
- **Verificação:**
  ```bash
  grep -n 'FROM node:\|npm install' Dockerfile
  ```

### DEVOPS-02 · Sem CI · [P2]

- **Arquivo:** *(ausente)* `.github/workflows/`
- **Evidência:** nenhum workflow; sem `.github/`.
- **Impacto:** `TEST-01` não teria onde rodar; build Docker não é exercitado por PR.
- **Mudança:** workflow: `CI=true npm test` + `npm run build` (+ `docker build` opcional).
- **Aceite:** PR quebrado bloqueado.
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
- **Mudança:** `npm create vite@latest` + copiar `src/`, ajustar `index.html` (raiz), remover react-scripts; manter testes via Vitest (compatível com o `TEST-01`).
- **Aceite:** `npm run dev/build/test` no Vite, app idêntico.
- **Verificação:**
  ```bash
  grep -c 'react-scripts' package.json   # 0 após migração
  ```

---

## 8. Ordem de execução (waves)

### Wave 1 — Funciona/infra (P1)
1. **`DOC-01`** — README verdadeiro (desbloqueia onboarding).
2. **`DEVOPS-01`** — node:20 + `npm ci`.
3. **`TEST-01`** — 3 testes do Button.

### Wave 2 — Qualidade (P2)
4. **`SEC-01`** — auditar e registrar.
5. **`DEVOPS-02`** — CI (roda o teste novo).

### Wave 3 — Estratégia (P3)
6. **`IMP-01`** — Vite (depois dos testes — são a rede de segurança).

**Dependências:** `DEVOPS-02` depois de `TEST-01` · `IMP-01` depois de `TEST-01`+`DEVOPS-02`.

---

## 9. Fora de escopo / riscos

| Item | Decisão | Motivo |
|---|---|---|
| Recriar o app Happy completo | **Não** | README deixa claro que é recorte de estudo; o app real está em `react_js_nlw5`↔Happy-React-Js (§docs do workspace). |
| Adicionar router/estado global | **Não** | Exercício de useState; inflar destrói o propósito didático. |
| Subir dev server exposto na rede | **Não** | CRA dev server sem HTTPS — manter localhost. |

**Riscos:** `IMP-01` pode quebrar paths do CRA (`PUBLIC_URL`) — app é mínimo, risco baixo.

---

## 10. Definição de pronto (DoD)

**Doc/infra**
- [ ] `DOC-01` — comando do README sobe o app
- [ ] `DEVOPS-01` — node:20 + `npm ci` puro
- [ ] `DEVOPS-02` — CI com teste+build

**Qualidade**
- [ ] `TEST-01` — ≥ 3 asserções do Button
- [ ] `SEC-01` — audit revisado
- [ ] `IMP-01` — (opcional) Vite

**Validação final:**
```bash
CI=true npm test 2>&1 | tail -3
grep -n 'FROM node:' Dockerfile
grep -n 'docker' README.md
```

---

*Fim do plano. Gerado por leitura direta do código em 2026-10-05. Nenhum item já estava corrigido — todos apontam para defeitos ainda presentes.*
