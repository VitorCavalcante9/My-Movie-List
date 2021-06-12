# My Movie List

Vídeo rodando a aplicação: 

Link do site hospedado: 

## Tecnologias
  - NodeJS
  - Express
  - ReactJS
  - MySQL
  - TypeScript
  - Yup
  - TypeORM

## Instalação

Você precisará ter o [NodeJS](https://nodejs.org) instalado na sua máquina, e, após isso, clonar este repositório:
```bash
$ git clone https://github.com/VitorCavalcante9/My-Movie-List.git
```
Depois disso, instale as dependências do Front-end e do Back-end:
```bash
$ cd server && yarn install # ou npm install
$ cd ../web && yarn install # ou npm install
```

## Executando a aplicação

Primeiro acesso a pasta server e para rodar as migrations (Antes de rodar as migrations crie uma database)
```bash
$ yarn typeorm migration:run
```

## Inicializar o projeto no back-end
```bash
$ yarn dev

# O servidor irá rodar na porta:3333
```

## Inicializar o projeto no front-end (volte para a pasta web)
```bash
$ yarn start

# O servidor irá rodar na porta:3000 - vá para http://localhost:3000
```
