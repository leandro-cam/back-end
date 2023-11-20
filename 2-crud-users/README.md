# Users API

Uma API de usuário completa! Com listagem, cadastro, edição e deleção de usuário. 

O projeto foi inicialmente desenvolvido em uma vídeo aula no canal do youtube do [@felipemotarocha](https://github.com/felipemotarocha), para acessá-lo, [clique aqui](https://youtu.be/gU3kp7Aw0JI). 
Para acessar o repositório deste projeto, [clique aqui](https://github.com/felipemotarocha/users-typescript-api).

Obrigado Felipe por compartilhar seu conhecimento, pela ótima explicação e projeto! 

Nesta minha versão, fiz boas modificações na estrutura da aplicação. Substituí o original arquivo principal: index.ts pelo arquivo main.ts em formato de classe, deixando-o menor e mais organizado, por estar separado em métodos. Coloquei as rotas do express em uma pasta e arquivo próprios: `routes/routes.ts`. Também mudei a estrutura das iniciais funções de erros https, colocando-as em classes, que sabem se tratar: `src/helpers/http-error-responses.ts`.

Além disso, encriptografei a senha do usuário antes de salvá-la no banco, utilizando a lib `bcryptjs`, e também deixei de retornar a senha dos usuários nas requisições, para que elas não fossem exibidas.

Eu aprovetei a API e adicionei token JWT nos endpoints PATCH, PUT e DELETE, utilizando a lib `jsonwebtoken`, em caráter de aprendizado, rsrs. Assim, antes de utilizar esses endpoints é preciso ser um usuário cadastrado e gerar um token através da rota: `POST /tokens`.

Para acessar o repositório da minha versão no GitHub, [clique aqui](https://github.com/leandro-cam/back-end/tree/main/2-crud-users). 

## Tecnologias utilizadas

- TypeScript
- Node.js
- Express
- MongoDB

## Conceitos utilizados

- SOLID
- Injeção de Dependência (Dependency Injection)
- Repository Pattern
- Singleton

## Entidades

<pre>
User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}</pre>

## Rotas

- GET /users - retorna todos usuários;
- GET /users/:id - retorna um usuário;
- POST /users - cria um usuário;
- PATCH /users/:id - atualiza parte de um usuário;
- PUT /users/:id - atualiza um usuário por completo;
- DELETE /users/:id - deleta um usuário;

## Arquitetura

![Arquitetura](https://imgur.com/k5mXFoZ.png)
