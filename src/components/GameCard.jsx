import { Link } from 'react-router-dom'

function GameCard({ title, description, href, status, image, featured = false, external = false }) {
  const cardClassName = `game-card ${featured ? 'featured' : 'muted'}`

  if (href) {
    if (external) {
      return (
        <div className="col-12 col-md-6 col-xl-3">
          <a className={`${cardClassName} card-link h-100`} href={href}>
            <p className="game-tag">{status}</p>
            {image ? <img className="game-thumb" src={image} alt={`Miniatura do jogo ${title}`} /> : null}
            <h3>{title}</h3>
            <p>{description}</p>
            <span className="game-card-cta">Abrir jogo</span>
          </a>
        </div>
      )
    }

    return (
      <div className="col-12 col-md-6 col-xl-3">
        <Link className={`${cardClassName} card-link h-100`} to={href}>
          <p className="game-tag">{status}</p>
          {image ? <img className="game-thumb" src={image} alt={`Miniatura do jogo ${title}`} /> : null}
          <h3>{title}</h3>
          <p>{description}</p>
          <span className="game-card-cta">Abrir jogo</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="col-12 col-md-6 col-xl-3">
      <article className={`${cardClassName} h-100`}>
        <p className="game-tag">{status}</p>
        {image ? <img className="game-thumb" src={image} alt={`Miniatura do jogo ${title}`} /> : null}
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="game-link disabled">Em construção</span>
      </article>
    </div>
  )
}

export default GameCard
