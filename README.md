# ECONO 2026 — Simulador de chaveamento e pontuação

Interface para simular resultados das modalidades do ECONO 2026: chaveamento em duas chaves (esquerda/direita → final), pontos por colocação e **ranking geral** (soma de todas as modalidades).

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

A pasta de saída é `dist/` (ex.: deploy em Render como **Static Site**).

## Dados

- **Faculdades e logos:** `src/data/teams.js` (imagens em `public/`).
- **Chaveamentos por modalidade:** `src/data/teams.js` (`MODALITIES`), conforme a planilha oficial.

## Pontuação por colocação (modalidade)

| Colocação | Pontos |
|-----------|--------|
| 1º | 13 |
| 2º | 10 |
| 3º | 8 |
| 4º | 6 |
| 5º | 4 |
| 6º | 3 |
| 7º | 2 |
| 8º | 1 |

O **ranking geral** soma os pontos de cada faculdade em **todas** as modalidades já completamente preenchidas (final definida). Não há disputa de 3º lugar: quem perdeu pro campeão na semi fica em 3º, quem perdeu pro vice fica em 4º.

## Classificação do 5º ao 8º lugar

Não se usa a ordem fixa dos jogos das quartas de final.

Os **quatro vencedores das quartas** são exatamente os quatro times que chegam às **meias-finais** e terminam o torneio entre o **1º e o 4º** lugar (campeão, vice, 3º e 4º).

Cada **perdedor das quartas** foi eliminado por **um** desses quatro. A colocação entre os eliminados nas quartas segue **a posição final de quem os eliminou**:

- Perdeu para o **campeão (1º)** → **5º lugar**
- Perdeu para o **vice (2º)** → **6º lugar**
- Perdeu para o **3º colocado** → **7º lugar**
- Perdeu para o **4º colocado** → **8º lugar**

Assim, quem caiu “mais cedo” para o time que foi mais longe no torneio fica melhor classificado entre os que caíram nas quartas — coerente com o “caminho até à vitória” de quem os bateu.

A lógica está em `computeModalityStandings` em `src/App.jsx`.

## Estado da aplicação

Tudo corre **no browser** (React + `useState`). Não há servidor nem base de dados: cada utilizador vê o seu próprio simulador; **Reiniciar** zera todas as modalidades.

## Créditos

Desenvolvido por [Jhonatan Ramos](https://github.com/jhonatanrlp).
