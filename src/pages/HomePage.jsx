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
    title: 'Material Dourado',
    description: 'Monte numeros com unidades, dezenas, centenas e milhares em 20 desafios por nivel.',
    href: '/jogos/material-dourado',
    status: 'Novo',
    image: '/images/jogoMaterialDourado/dezena.png',
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
      <div className="site-shell container-fluid px-0">
        <section className="hero home-banner">
          <p className="eyebrow">Aprender brincando</p>
          <h1>Jogos educativos para explorar, montar e descobrir</h1>
          <p className="hero-text">
            Escolha uma atividade e pratique matematica, leitura e raciocinio com jogos
            visuais, coloridos e pensados para as criancas.
          </p>
          <div className="home-hero-badges">
            <span>Atividades visuais</span>
            <span>Niveis progressivos</span>
            <span>Aprendizagem divertida</span>
          </div>
        </section>

        <section className="games-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Escolha uma aventura</p>
              <h2>Jogos disponiveis</h2>
            </div>
            <p className="section-copy">Cada jogo trabalha uma habilidade diferente de forma leve e interativa.</p>
          </div>
          <div className="row g-3 game-grid">
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
