import { Link } from 'react-router-dom'

function GameCard({ title, description, href, status, image, featured = false, external = false }) {
  const cardClassName = `game-card ${featured ? 'featured' : 'muted'}`

  if (href) {
    if (external) {
      return (
        <a className={`${cardClassName} card-link`} href={href}>
          <p className="game-tag">{status}</p>
          {image ? <img className="game-thumb" src={image} alt={`Miniatura do jogo ${title}`} /> : null}
          <h3>{title}</h3>
          <p>{description}</p>
        </a>
      )
    }

    return (
      <Link className={`${cardClassName} card-link`} to={href}>
        <p className="game-tag">{status}</p>
        {image ? <img className="game-thumb" src={image} alt={`Miniatura do jogo ${title}`} /> : null}
        <h3>{title}</h3>
        <p>{description}</p>
      </Link>
    )
  }

  return (
    <article className={cardClassName}>
      <p className="game-tag">{status}</p>
      {image ? <img className="game-thumb" src={image} alt={`Miniatura do jogo ${title}`} /> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="game-link disabled">Em construção</span>
    </article>
  )
}

export default GameCard
