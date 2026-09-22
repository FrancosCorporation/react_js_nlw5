# react_js_nlw5

## 🐳 Instalação e Execução (Docker) — recomendado

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose

### Rodar com Docker
```bash
docker compose up --build
```


### Sem Docker (local)
```bash
npm install
npm start
```


**Projeto de estudo** — primeiros passos com React (Create React App) durante a Next Level Week 5 da Rocketseat, em junho de 2021.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-17-61DAFB?style=flat&logo=react&logoColor=black)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Status](https://img.shields.io/badge/status-projeto%20de%20estudo-blue)

## Sobre

Exercício de fundamentos do React feito durante a NLW 5 (trilha ReactJS). O objetivo era praticar componentização e estado com `useState`, criando um componente de botão reutilizável que mantém um contador próprio. O projeto é enxuto e **não corresponde ao app completo do evento** — é o recorte de estudo que ficou versionado.

## Funcionalidades

Comprovadas pelo código atual:

- Componente `Button` reutilizável que exibe um contador interno e o incrementa a cada clique (`src/Button.js`);
- Renderização de quatro instâncias do botão com textos e contadores independentes (`src/App.js`);
- Ponto de entrada padrão do Create React App (`src/index.js` + `public/index.html`).

## Stack

- **JavaScript** (sem TypeScript)
- **React 17** + `react-dom`
- **Create React App** (`react-scripts` 4.0.3)
- Dependências padrão de teste do CRA (`@testing-library/*`, `web-vitals`) — não há arquivos de teste versionados

## Como rodar

Pré-requisito: Node.js com Yarn (existe `yarn.lock` no repositório).

```bash
yarn install
yarn start
```

Abre em `http://localhost:3000`. Outros scripts disponíveis no `package.json`:

```bash
yarn test    # runner de testes do CRA (sem testes versionados)
yarn build   # build de produção em /build
yarn eject   # irreversível; não recomendado
```

## Estrutura do projeto

```
.
├── public/
│   └── index.html
├── src/
│   ├── App.js        # renderiza os botões de exemplo
│   ├── Button.js     # componente com contador via useState
│   └── index.js      # bootstrap do ReactDOM
├── aula.md           # anotações da aula
└── package.json
```

## Observações

- `aula.md` guarda a anotação original da aula (criação do projeto com `npx create-react-app`).
- Não há testes automatizados versionados apesar das dependências de teste.

## Licença

MIT — veja [LICENSE](LICENSE).
