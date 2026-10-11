# Contadores independentes · React

Exercício de fundamentos de React criado durante a NLW 5. O projeto continua enxuto: quatro componentes `Button`, cada um com seu próprio `useState`, mostram como a componentização mantém estados independentes.

## Requisitos

- Node.js 24 LTS (ou Node.js 22.12+);
- npm 9 ou mais recente.

## Desenvolvimento

```bash
npm ci
npm start
```

Abra <http://localhost:5173>. Cada contador começa em 1; o botão incrementa apenas o estado daquele componente.

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos estáticos são gerados em `dist/`. `npm run preview` serve uma prévia local. Para servir a build pelo servidor HTTP incluído no Node, execute `npm run serve` após gerar `dist/`.

## Docker

```bash
docker build -t react-js-nlw5 .
docker run --rm -p 3000:3000 react-js-nlw5
```

Abra <http://localhost:3000>. A imagem compila com Node 24, instala dependências com `npm ci` sem fallback e serve os arquivos como usuário `node`, com healthcheck.

## Stack

- React 19.3 e React DOM 19.3;
- Vite 8 com o plugin oficial de React;
- ESLint 10;
- servidor HTTP pequeno baseado apenas nos módulos nativos do Node na imagem de produção.

## Qualidade

```bash
npm run lint
npm run build
npm audit --audit-level=high
```

O workflow de CI executa essas verificações e compila a imagem em pushes e pull requests para `master`. Testes automatizados ainda não estão configurados.

## Licença

MIT — consulte [LICENSE](LICENSE).
