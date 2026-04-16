import { Link } from 'react-router-dom'

const games = [
  {
    title: 'Desafio Matemático',
    description:
      'Pratique soma, subtração, multiplicação e divisão com perguntas rápidas e respostas em botões.',
    href: '/jogos/matematica',
    status: 'Disponível',
    image: '/images/Acertou.png',
    featured: true,
  },
  {
    title: 'Jogo da Memória',
    description: 'Encontre pares e treine atenção, concentração e memória visual.',
    status: 'Em breve',
  },
  {
    title: 'Caça-Palavras',
    description: 'Descubra palavras escondidas e desenvolva leitura e vocabulário.',
    status: 'Em breve',
  },
]

function HomePage() {
  return (
    <main className="site-home">
      <div className="site-shell">
        <section className="hero">
          <p className="eyebrow">Aprender brincando</p>
          <h1>Espaço de Jogos Educativos</h1>
          <p className="hero-text">
            Escolha um jogo para treinar matemática, raciocínio e outras habilidades.
          </p>
        </section>

        <section className="games-section">
          <h2>Escolha um jogo</h2>
          <div className="game-grid">
            {games.map((game) => (
              <article
                key={game.title}
                className={`game-card ${game.featured ? 'featured' : 'muted'}`}
              >
                <p className="game-tag">{game.status}</p>

                {game.image ? (
                  <img
                    className="game-thumb"
                    src={game.image}
                    alt={`Miniatura do jogo ${game.title}`}
                  />
                ) : null}

                <h3>{game.title}</h3>
                <p>{game.description}</p>

                {game.href ? (
                  <Link className="game-link" to={game.href}>
                    Abrir jogo
                  </Link>
                ) : (
                  <span className="game-link disabled">Em construção</span>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
