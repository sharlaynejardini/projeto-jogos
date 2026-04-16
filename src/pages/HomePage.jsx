import GameCard from '../components/GameCard'

const games = [
  {
    title: 'Desafio Matemático',
    description:
      'Pratique soma, subtração, multiplicação e divisão com perguntas rápidas e respostas em botões.',
    href: '/jogos/matematica',
    status: 'Disponível',
    image: '/images/desafiomatemático.png',
    featured: true,
  },
  {
    title: 'Jogo da Memória',
    description: 'Combine vogais com palavras e imagens em um jogo da memória divertido.',
    href: '/jogos/memoria-vogais/index.html',
    status: 'Novo',
    image: '/images/jogoMemoria.png',
    external: true,
  },
  {
    title: 'Jogo das Vogais',
    description: 'Observe a imagem e complete a palavra escolhendo as vogais corretas.',
    href: '/jogos/vogais',
    status: 'Novo',
    image: '/images/jogoVogais.png',
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
              <GameCard key={game.title} {...game} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
