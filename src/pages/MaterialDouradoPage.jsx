import { Link } from 'react-router-dom'
import MaterialDouradoGame from '../components/MaterialDouradoGame'

function MaterialDouradoPage() {
  return (
    <main className="game-page">
      <div className="site-shell">
        <header className="game-topbar">
          <Link className="back-link" to="/">
            Voltar aos jogos
          </Link>
          <h1>Material Dourado</h1>
          <p>Monte o número pedido usando dezenas e unidades.</p>
        </header>

        <MaterialDouradoGame />
      </div>
    </main>
  )
}

export default MaterialDouradoPage
