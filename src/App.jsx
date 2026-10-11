import { Button } from "./Button.jsx";
import "./styles.css";

const counters = ["Um", "Dois", "Três", "Quatro"];

function App() {
  return (
    <main className="page-shell">
      <header className="intro">
        <div className="brand-mark" aria-label="React, fundamentos">
          <span className="brand-mark__icon" aria-hidden="true">
            ⚛
          </span>
          <span>
            React <span className="brand-mark__divider">/</span> Fundamentos
          </span>
        </div>

        <p className="eyebrow">Exercício interativo</p>
        <h1>Um clique de cada vez.</h1>
        <p className="intro__copy">
          Cada botão guarda seu próprio estado. Clique e acompanhe os contadores
          evoluírem de forma independente.
        </p>

        <div className="lesson-meta" aria-label="Resumo do exercício">
          <span>
            <strong>04</strong> contadores
          </span>
          <span>
            <strong>01</strong> estado por botão
          </span>
          <span>
            <strong>∞</strong> incrementos
          </span>
        </div>
      </header>

      <section className="counter-grid" aria-label="Contadores independentes">
        {counters.map((label, index) => (
          <Button key={label} number={String(index + 1).padStart(2, "0")}>
            Contador {label.toLowerCase()}
          </Button>
        ))}
      </section>

      <footer className="page-footer">
        <span>
          Pratique componentização com <code>useState</code>.
        </span>
        <span>
          NLW 5 <span aria-hidden="true">·</span> React
        </span>
      </footer>
    </main>
  );
}

export default App;
