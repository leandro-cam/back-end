# Barbershop Scheduling System

Um projeto de agendamento para barbearia! 

O projeto foi inicialmente desenvolvido pelo [Diego Fernandes](https://github.com/diego3g){:target="_blank"} em uma [vídeo aula](https://www.youtube.com/watch?v=jBOLRzjEERk){:target="_blank"} no canal do Youtube da Rocketseat.

A ideia do projeto era ser o mais simples possível, focando nas entidades, 
nos casos de uso e na lógica. Ele não é uma API, é um protótipo inicial somente
com a lógica e testes. Mas está tão bem estruturado e organizado, que facilmente 
vira uma API.

Para o Diego, o sucesso de um projeto não está tanto na sua arquitetura quanto está na sua facilidade em ser testado
(isto é, testes unitários). Por isso, o projeto foi feito utilizando TDD (Test-Driven Development) aliado a princípios
do DDD (Domain-Driven Development). Um projeto feito à base de testes unitários e com foco no domínio, na sua essência.

Para os testes experimentamos o Vitest, que contém tudo que o Jest possui, mas é mais fácil de ser configurado,
e muito mais rápido e performático. O uso do Vitest foi um sucesso.

A aplicação feita pelo Diego possui apenas uma entidade: Appointment (ou agendamento). Eu fui além e integrei as entidades:
Cliente, Barbearia e Barbeiro (como pode ser visto na imagem do Diagrama de Entidade e Relacionamento). Isso deixou a minha aplicação muito mais próxima de uma aplicação da vida real, porém, deixou 
a criação dos testes muito mais complexa.

## Tecnologias utilizadas


- TypeScript;
- Vitest;
- Biblioteca date-fns;

## Conceitos utilizados

- SOLID;
- Design Patterns: Bridge, Adapter e Facade;
- TDD;
- DDD;
- In-memory repository;

## Entidades

<pre>
Person {
  id: string;
  name: string;
  lastName: string;
  birthYear: Date;
}
</pre>

<pre>
Barbershop {
  id: string;
  name: string;
  state: string;
  city: string;
  neighborhood: string;
  number: string;
  barbers: Person[];
}
</pre>

<pre>
Appointment {
  id: string;
  customer: Person;
  startsAt: Date;
  endsAt: Date;
  durationInMinutes: number;
  barbershop: Barbershop;
  barber: Person;
}
</pre>

## Diagrama de entidade e relacionamento

![Imagem do Diagrama de entidade e relacionamento da Barbearia](https://imgur.com/ERCgoAq.png)