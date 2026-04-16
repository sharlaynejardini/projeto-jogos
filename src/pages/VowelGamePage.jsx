import { Link } from 'react-router-dom'
import VowelGame from '../components/VowelGame'

function VowelGamePage() {
  return (
    <main className="game-page">
      <div className="site-shell">
        <header className="game-topbar">
          <Link className="back-link" to="/">
            Voltar aos jogos
          </Link>
          <h1>Jogo das Vogais</h1>
          <p>Complete as palavras escolhendo as vogais corretas.</p>
        </header>

        <VowelGame />
      </div>
    </main>
  )
}

export default VowelGamePage
