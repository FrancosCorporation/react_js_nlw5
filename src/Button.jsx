import { useState } from "react";

export function Button({ children, number }) {
  const [counter, setCounter] = useState(1);

  return (
    <article className="counter-card">
      <div className="counter-card__topline">
        <span className="counter-card__number">{number}</span>
        <span className="counter-card__status">
          <span className="counter-card__status-dot" aria-hidden="true" />
          Ativo
        </span>
      </div>

      <p className="counter-card__label">{children}</p>
      <output className="counter-card__value" aria-live="polite">
        {counter}
      </output>

      <button
        className="counter-card__button"
        type="button"
        aria-label={`Adicionar 1 ao ${children}`}
        onClick={() => setCounter((current) => current + 1)}
      >
        <span>Incrementar</span>
        <span className="counter-card__button-icon" aria-hidden="true">
          +
        </span>
      </button>
    </article>
  );
}
