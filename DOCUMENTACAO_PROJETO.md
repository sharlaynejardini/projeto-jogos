# Documentação do Projeto

Este documento explica, passo a passo, o que foi feito no projeto, como a estrutura foi organizada e qual é a lógica principal de cada parte.

## 1. Objetivo do projeto

O projeto foi transformado em uma plataforma de jogos educativos para crianças.

A ideia principal é:

- ter uma página inicial com os jogos disponíveis
- permitir crescer para novos jogos sem bagunçar o código
- manter uma interface simples, visual e amigável para crianças
- evitar barra de rolagem para facilitar o uso em tela cheia

Hoje o projeto já possui:

- um portal inicial com seleção de jogos
- o jogo `Desafio Matemático`
- o jogo `Jogo das Vogais`
- um `Jogo da Memória` de vogais

## 2. Por que o projeto foi convertido para React

Antes, o projeto estava em arquivos separados de `HTML`, `CSS` e `JS`.

Isso funciona bem em projetos pequenos, mas quando começamos a ter:

- vários jogos
- várias telas
- componentes reaproveitáveis
- navegação entre páginas

fica mais inteligente usar React.

A lógica da mudança foi esta:

- em vez de várias páginas soltas, passamos a ter uma aplicação organizada
- em vez de repetir blocos de interface, criamos componentes reutilizáveis
- em vez de atualizar a tela “na mão”, o React atualiza a interface quando o estado muda

## 3. Estrutura principal do projeto

A estrutura principal ficou assim:

```text
src/
  components/
    GameCard.jsx
    MathGame.jsx
    VowelGame.jsx
  pages/
    HomePage.jsx
    MathGamePage.jsx
    VowelGamePage.jsx
  App.jsx
  App.css
  index.css

public/
  images/
  jogos/
    memoria-vogais/
      index.html
      style.css
      script.js
```

### Lógica dessa organização

- `pages/`: representam telas completas do site
- `components/`: representam blocos reutilizáveis ou jogos
- `public/`: guarda arquivos estáticos, como imagens e o jogo da memória em HTML/CSS/JS puro

## 4. Entrada da aplicação React

O React começa pela aplicação principal e pelas rotas.

### `src/App.jsx`

Esse arquivo organiza as rotas do projeto.

Exemplo da lógica:

- `/` abre a página inicial
- `/jogos/matematica` abre o jogo matemático
- `/jogos/vogais` abre o jogo das vogais

Ou seja: o React decide qual tela mostrar com base no endereço.

## 5. Página inicial

### `src/pages/HomePage.jsx`

Essa é a tela principal do portal.

Ela mostra os cards dos jogos.

A lógica usada foi:

1. criar uma lista de jogos em um array
2. cada objeto do array possui título, descrição, imagem e link
3. usar `map()` para transformar esses dados em cartões visuais

Isso é importante porque evita repetir código.

Em vez de escrever manualmente cada card, fazemos assim:

- o dado descreve o jogo
- o componente renderiza o visual

## 6. Componente de cartão do jogo

### `src/components/GameCard.jsx`

Esse componente foi criado para representar cada jogo da home.

Ele recebe informações por `props`, por exemplo:

- `title`
- `description`
- `href`
- `image`
- `status`

### Lógica

O componente não “inventa” conteúdo sozinho.

Ele apenas recebe dados da `HomePage` e monta o cartão.

Isso é um conceito central do React:

- a página pai envia os dados
- o componente filho monta a interface

Também foi feita a lógica de:

- cartão clicável
- efeito de destaque ao passar o mouse
- suporte a link interno do React
- suporte a link externo no caso do jogo da memória

## 7. Jogo matemático

### `src/pages/MathGamePage.jsx`

Essa página funciona como um invólucro do jogo.

Ela exibe:

- botão de voltar
- título
- subtítulo
- componente principal do jogo

### `src/components/MathGame.jsx`

Aqui está a lógica principal do jogo matemático.

## 8. Estados usados no jogo matemático

No React, usamos `useState` para guardar informações que mudam na tela.

Exemplos que foram usados:

- `selectedOperations`: operações escolhidas pelo aluno
- `selectedLevel`: nível atual (`Nube` ou `Pro`)
- `score`: pontuação
- `round`: rodada atual
- `currentQuestion`: pergunta atual
- `answerOptions`: alternativas de resposta
- `message`: mensagem mostrada ao jogador
- `gameStarted`: diz se a partida começou
- `gameFinished`: diz se a partida terminou
- `feedbackImage`: controla se aparece a imagem de acerto ou erro

### Lógica dos estados

Quando um desses valores muda, o React redesenha a interface automaticamente.

Exemplo:

- o aluno acerta
- `score` aumenta
- o placar atualiza sem precisar mexer manualmente no HTML

## 9. Como a pergunta matemática é criada

O jogo usa funções auxiliares.

### `randomNumber(min, max)`

Sorteia um número aleatório dentro de um intervalo.

### `createQuestion(selectedOperations, levelKey)`

Essa função:

1. escolhe uma das operações selecionadas
2. lê o nível escolhido
3. gera dois números
4. calcula a resposta correta
5. devolve os dados da conta

Exemplo de retorno:

```js
{
  num1: 8,
  num2: 4,
  symbol: "+",
  answer: 12
}
```

### Lógica dos níveis

- `Nube`: números menores
- `Pro`: números maiores

Assim, o aluno escolhe a dificuldade antes de jogar.

## 10. Como as alternativas são geradas

### `createAnswerOptions(correctAnswer)`

Essa função cria:

- 1 resposta correta
- 3 respostas erradas

Depois embaralha a ordem.

### Por que isso é importante

Se a resposta certa sempre estivesse no mesmo lugar, a criança poderia decorar a posição.

Ao embaralhar:

- o jogo fica mais justo
- o aluno precisa pensar na conta

## 11. Lógica das rodadas no jogo matemático

Foi definido que cada partida possui `10 rodadas`.

### Como funciona

- o aluno escolhe o nível
- escolhe as operações
- clica em `Começar`
- o jogo gera a primeira pergunta
- cada acerto vale `1 ponto`
- ao acertar, a próxima pergunta aparece depois de um tempo
- ao terminar `10 rodadas`, a partida é encerrada

### Por que isso foi feito

Isso deixa o jogo mais organizado.

A criança entende que existe:

- começo
- meio
- fim da partida

## 12. Feedback visual de acerto e erro

No jogo matemático e no jogo das vogais, foram usadas imagens de:

- `Acertou.png`
- `Errou.png`

### Lógica

O estado `feedbackImage` recebe:

- `success` quando acerta
- `error` quando erra
- vazio quando a imagem deve sumir

No CSS, a imagem só aparece quando recebe a classe `active`.

Isso separa bem as responsabilidades:

- o JavaScript decide quando mostrar
- o CSS decide como mostrar

## 13. Jogo das vogais

### `src/pages/VowelGamePage.jsx`

Funciona da mesma forma da página matemática:

- topo com título
- botão de voltar
- componente do jogo

### `src/components/VowelGame.jsx`

Esse componente controla a lógica do preenchimento das vogais.

## 14. Banco de palavras

Foi criado um array com palavras simples:

- `CASA`
- `BOLA`
- `ABELHA`
- `GATO`
- `ESCOLA`
- e outras

Cada item possui:

- a palavra
- um emoji
- uma dica

Exemplo:

```js
{ word: 'CASA', emoji: '🏠', hint: 'Lugar onde moramos' }
```

### Lógica

O jogo sorteia uma palavra desse banco para cada rodada.

## 15. Como os espaços das vogais são criados

### `createRoundData(entry)`

Essa função:

1. quebra a palavra em letras
2. encontra quais posições são vogais
3. cria os espaços vazios que a criança deve preencher

Exemplo com `CASA`:

- letras: `C`, `A`, `S`, `A`
- posições das vogais: `1` e `3`
- preenchimento inicial: `['', '']`

Isso permite mostrar:

`C _ S _`

## 16. Lógica da interação no jogo das vogais

O jogo permite:

- clicar em uma vogal
- usar o teclado

### Como funciona

1. a criança escolhe um espaço
2. clica na vogal
3. a letra entra naquele espaço
4. o foco vai automaticamente para o próximo espaço

Essa passagem automática foi feita para facilitar a experiência infantil.

### Por que isso ajuda

- reduz cliques desnecessários
- deixa a brincadeira mais fluida
- ajuda a criança a manter a atenção na palavra

## 17. Conferir antes de avançar

No jogo das vogais foi criada a regra:

- só pode ir para a próxima palavra depois de clicar em `Conferir palavra`

### Lógica

O estado `checkedWord` controla isso.

- começa como `false`
- vira `true` depois da conferência
- só então o botão `Próxima palavra` é liberado

Isso força a criança a concluir a atividade antes de seguir.

## 18. Jogo da memória

O jogo da memória foi feito em `HTML`, `CSS` e `JS` puro dentro de:

- [public/jogos/memoria-vogais/index.html](./public/jogos/memoria-vogais/index.html)
- [public/jogos/memoria-vogais/style.css](./public/jogos/memoria-vogais/style.css)
- [public/jogos/memoria-vogais/script.js](./public/jogos/memoria-vogais/script.js)

### Por que ele ficou em `public`

Porque você pediu esse jogo especificamente em estrutura clássica:

- `index.html`
- `style.css`
- `script.js`

Como o restante do site está em React, a solução foi:

- manter o portal em React
- deixar esse jogo como um arquivo estático acessado por link

Isso permite respeitar os dois objetivos ao mesmo tempo.

## 19. Lógica do jogo da memória

Os pares foram montados assim:

- `A` com `Abelha`
- `E` com `Elefante`
- `I` com `Igreja`
- `O` com `Ovo`
- `U` com `Urso`

### Funcionamento

1. as cartas começam viradas para baixo
2. a criança vira duas cartas
3. o sistema compara se elas pertencem ao mesmo par
4. se combinar, elas permanecem abertas
5. se não combinar, viram de volta após um tempo

Também foram adicionados:

- contador de tentativas
- pontuação
- estrelas
- botão de reiniciar
- dificuldade

## 20. CSS e adaptação para a tela toda

Um pedido importante do projeto foi evitar barra de rolagem, porque isso atrapalha crianças pequenas.

### O que foi feito

Nos estilos principais:

- foi usado `height: 100dvh`
- foi usado `overflow: hidden`
- os espaços e tamanhos passaram a usar `clamp(...)`
- os blocos passaram a se ajustar melhor entre desktop, tablet e celular

### Lógica do `clamp(...)`

O `clamp()` define um tamanho com:

- valor mínimo
- valor ideal
- valor máximo

Isso ajuda a interface a ficar proporcional em telas diferentes.

Exemplo:

- em celular pequeno, o botão pode ficar menor
- em desktop, ele cresce até um limite confortável

## 21. Separação entre lógica e visual

Durante a construção, seguimos uma regra importante:

- React e JavaScript controlam comportamento
- CSS controla aparência

Exemplo no feedback de acerto:

- o componente define se é `success` ou `error`
- o CSS faz a animação, zoom e visibilidade

Isso deixa o código mais limpo e mais fácil de manter.

## 22. Como crescer o projeto daqui para frente

A estrutura foi preparada para receber novos jogos.

O caminho ideal para adicionar outro jogo React é:

1. criar um componente em `src/components`
2. criar uma página em `src/pages`
3. registrar a rota em `src/App.jsx`
4. adicionar um card na `HomePage`

### Exemplo

Se você quiser criar um jogo novo chamado `SilabasGame`, o padrão seria:

```text
src/components/SilabasGame.jsx
src/pages/SilabasGamePage.jsx
```

Depois:

- adicionar rota
- criar o card na home

## 23. Resumo da lógica geral

A lógica geral do projeto ficou assim:

1. a criança entra no portal
2. escolhe o jogo
3. cada jogo possui seu próprio componente e sua própria lógica
4. o React atualiza a tela com base no estado
5. o CSS deixa a experiência visual clara, grande e amigável

## 24. O que aprender com esse projeto

Este projeto é muito bom para estudar:

- componentes React
- `props`
- `useState`
- `useEffect`
- rotas
- renderização com `map()`
- organização em pastas
- separação entre lógica e visual
- responsividade

## 25. Próximos passos sugeridos

Algumas melhorias possíveis:

- adicionar som real para acerto e erro
- colocar narração das letras e palavras
- criar perfil do aluno
- salvar pontuação
- criar fases
- criar área do professor
- adicionar mais jogos educativos

## 26. Conclusão

O projeto saiu de uma estrutura simples e passou para uma base organizada, escalável e mais adequada para crescer como plataforma educativa.

O principal ganho foi este:

- agora cada jogo pode ser criado como peça independente
- a página inicial funciona como portal
- o código está mais limpo e mais fácil de evoluir

Se você quiser, no próximo passo eu posso criar uma segunda documentação:

- uma versão mais técnica, explicando `linha por linha`
- ou uma versão mais didática, como se fosse uma aula de React com esse projeto
