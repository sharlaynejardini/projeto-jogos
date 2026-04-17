import { Link } from 'react-router-dom'
import MathGame from '../components/MathGame'

function MathGamePage() {
  return (
    <main className="game-page math-page">
      <div className="site-shell container-fluid px-0">
        <header className="game-topbar math-topbar">
          <Link className="back-link" to="/">
            Voltar aos jogos
          </Link>
          <h1>Desafio Matemático</h1>
          <p>Escolha as operações e clique em Começar para iniciar as rodadas.</p>
        </header>

        <MathGame />
      </div>
    </main>
  )
}

export default MathGamePage
