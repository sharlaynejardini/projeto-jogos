import { Link } from 'react-router-dom'
import VowelGame from '../components/VowelGame'

function VowelGamePage() {
  return (
    <main className="game-page vowel-page">
      <div className="site-shell container-fluid px-0">
        <header className="game-topbar vowel-topbar">
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
