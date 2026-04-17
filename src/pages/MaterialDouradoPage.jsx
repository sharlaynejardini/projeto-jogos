import { Link } from 'react-router-dom'
import MaterialDouradoGame from '../components/MaterialDouradoGame'

function MaterialDouradoPage() {
  return (
    <main className="game-page material-page">
      <div className="site-shell">
        <header className="game-topbar material-topbar">
          <Link className="back-link" to="/">
            Voltar aos jogos
          </Link>
          <h1>Material Dourado</h1>
          <p>Monte o numero pedido usando unidades, dezenas, centenas e milhares.</p>
        </header>

        <MaterialDouradoGame />
      </div>
    </main>
  )
}

export default MaterialDouradoPage
