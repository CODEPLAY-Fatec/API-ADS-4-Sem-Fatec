# API-ADS-3-Sem-Fatec

# Sistema Intituitivo para Gestão de Projetos de Pesquisa e Desenvolvimento Tecnológico de uma fundação
<!-- Colocar nome futuramente -->



<span id="topo">
<p align="center">
    <a href="#sobre">Sobre</a>  |  
    <a href="#backlogs">Backlog do Produto</a>  |  
    <a href="#requisitosfuncionais">Lista de Requisitos Funcionais</a>  | 
    <a href="#requisitosnfuncionais">Lista de Requisitos Não Funcionais</a>  | 
    <a href="#planejamento">Planejamento das Sprints</a>  |   
    <a href="#tecnologias">Tecnologias</a>  |  
    <a href="#equipe">Equipe</a>   
    
</p>
   
<span id="sobre">

## :bookmark_tabs: Sobre o projeto

A FAPG enfrenta desafios para gerenciar os seus projetos, portanto, necessita de uma solução que 
simplifique e otimize esse processo.Nosso principal objetivo deste projeto é o desenvolvimento de um sistema web intuitivo que 
permita a gestão de projetos e suas atividades a fim de garantir eficiência e transparência no seu 
acompanhamento pelos partícipes. 


> _Projeto baseado na metodologia ágil SCRUM, procurando desenvolver a Proatividade, Autonomia, Colaboração e Entrega de Resultados dos estudantes envolvidos_

:pushpin: Status do Projeto: **Em desenvolvimento** 🚧

### 🏁 Entregas das Sprints
<!-- ARRUMAR ISSO COM OS DADOS REAIS -->
As entregas de valor de cada sprint. Os stakeholders podem acompanhar de perto o desenvolvimento do projeto e entender como as metas e objetivos estão sendo alcançados ao longo do tempo.
| Sprint | Previsão de Entrega | Status              | Descrição                                                                                 | MVP                                                                                                  |
|:------:|:------------------:|:-------------------:|:-----------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------|
|   01   |    30/03/2025       | ❌ Não Concluído      | *"Estruturação, Protótipo e Banco de Dados"*                                              | Definição do backlog, criação do protótipo navegável, tela de cadastro de líderes e liderados, modelagem do banco de dados. |
|   02   |    27/04/2025       | ❌ Não Concluído   | *"Autenticação e API"*                                                                    | Autenticação funcional e API para cadastro de perguntas e categorias.                              |
|   03   |    25/05/2025       | ❌ Não Concluído    | *"Dashboards Interativos"*                                                                | Dashboard geral para Admin com filtros de data.                                                     |



→ [Voltar ao topo](#topo)

<span id="backlogs">

## :dart: Backlog do Produto
<!-- ARRUMAR ISSO COM OS DADOS REAIS -->
| **Sprint** | **Prioridade** | **User Story** | **Estimativa** | **Requisito** | **Critério de Aceitação** |
|------------|----------------|----------------|----------------|---------------|---------------------------|
| **1** | Alta | Eu, como usuário, quero usar uma interface navegável e finalizada para ter uma experiência consistente e intuitiva ao navegar e interagir com o sistema. | 8h | - | Protótipo navegável validado |
|       | Alta | Eu, como usuário, quero ver uma tela funcional para o cadastro de líderes e liderados para inserir e gerenciar os dados de forma eficiente. | 10h | RF1 | Tela de cadastro funcional e validada |
|       | Alta | Eu, como desenvolvedor, quero modelar um banco de dados relacional para garantir a integridade referencial dos dados. | 8h | RNF2 | Esquema de banco de dados validado |
|       | Alta | Eu, como desenvolvedor, quero definir os requisitos detalhados do sistema para garantir que o desenvolvimento esteja alinhado às expectativas do parceiro. | 6h | - | Requisitos documentados e validados |
| **2** | Alta | Eu, como desenvolvedor, quero implementar autenticação e controle de acesso para garantir que os usuários possam acessar apenas as informações pertinentes ao seu nível de acesso. | 10h | RF1 | Autenticação funcional |
|       | Alta | Eu, como desenvolvedor, quero criar uma API para o cadastro de perguntas e categorias para permitir a inserção e gerenciamento das perguntas de forma eficiente. | 12h | RF2, RF3, RF4 | API funcional com testes |
| **3** | Alta | Eu, como usuário, quero acessar o dashboard geral para Admin para visualizar todas as informações e comparar avaliações de maneira abrangente. | 16h | RF5 | Dashboard funcional para Admin |
|       | Alta | Eu, como usuário, quero utilizar filtros de data nos dashboards para visualizar informações em diferentes períodos de tempo. | 6h | RF6 | Filtros de data funcionando |


<p align="center">
     

<span id="requisitosfuncionais">

## :dart: Lista de Requisitos Funcionais

1. **RF1** – Cadastrar projetos da FAPG (nome do projeto, descrição, etc);
2. **RF2** – Permitir a recuperação de dados de projetos, de forma intuitiva;
3. **RF3** – Permitir atualizar e excluir dados dos projetos;
4. **RF4** – Visualizar projetos por área de atuação;
5. **RF5** – Visualizar projetos por responsáveis;
6. **RF6** – Visualizar projetos pelo status;
7. **RF7** – Acompanhar andamento das atividades.

<p align="center">
    

<span id="requisitosnfuncionais">

## :dart: Lista de Requisitos Não Funcionais
<!-- Colocar os requisitos nao funcionais corretos -->
1. **RNF1** – Usabilidade;
2. **RNF2** – Privacidade de dados;
3. **RNF3** – Conversão de linguagem natural para chamada de funções (sem uso de API externa);
4. **RNF4** – Extração de parâmetros da mensagem do usuário (sem uso de API externa);
- Orquestrar chamadas de funções.

<p align="center">
    

<span id="planejamento">

## :dart: MVP das Sprints
<!-- COLOCAR O MVP CORRETO -->
| **MVP** |
|------------|
|**Sprint 1 –** *"Estruturação, Protótipo e Banco de Dados"*  
  **MVP:** Definição do backlog, criação do protótipo navegável, desenvolvimento de cadastro,login e criação de projeot, modelagem do banco de dados relacional, e organização dos requisitos principais.|
|**Sprint 2 –** *"Autenticação,API e cadastro de tasks"*  
  **MVP:** Autenticação funcional e API para cadastro de perguntas e categorias.|
|**Sprint 3 –** *"Dashboards "*  
  **MVP:** Dashboard geral para Admin e filtros de data implementados.|




→ [Voltar ao topo](#topo)

<span id="tecnologias">

## 🛠️ Tecnologias

As seguintes ferramentas, linguagens, bibliotecas e tecnologias foram usadas na construção do projeto:

<table>
  <thead>
    <th><img
    src="https://user-images.githubusercontent.com/89823203/190877360-8c7f93cf-5f62-4f49-8641-3b605deb513e.png"
    alt="Alt text"
    title="Figma"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
    <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg" /></th>
    <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
    alt="Alt text"
    title="React"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
    <th><img
    src="https://user-images.githubusercontent.com/89823203/190717820-53e9f06b-1aec-4e46-91e1-94ea2cf07100.svg"
    alt="Alt text"
    title="JavaScript"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
     <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
    alt="Alt text"
    title="TypeScript"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
     <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg"
    alt="Alt text"
    title="Node.Js"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
    <th><img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
    alt="Alt text"
    title="nextjs"
    style="display: inline-block; margin: 0 auto; width: 60px"></th>
  </thead>

  <tbody>
    <td>Figma</td>
    <td>MySQL</td>
    <td>React</td>
    <td>JavaScript</td>
    <td>Typescript</td>
    <td>Node.Js</td>
    <td>Nextjs</td>
  </tbody>

</table>
    
→ [Voltar ao topo](#topo)

<span id="equipe">

## :bust_in_silhouette: Equipe

|    Função     | Nome                             |                                                                                                                                                            LinkedIn & GitHub                                                                                                                                                            |
| :-----------: | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Product Owner | Daniel Sendreti       |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/danielbroder/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/d-broder)           |
|   Scrum Master    | Gabriel Vasconcelos      |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-vasconcelos-255979262/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gabrielvascf)|
|   Dev Team    | André Neves |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/andre-neves-44807a209/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/andreN4vs) |
|   Dev Team    | Gabriel Carvalho |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-carvalho-30598b292/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Gabriecarvalho) |
|   Dev Team    | Gabriel Silva  |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-silva--cs/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gabrielfelip)         |
|   Dev Team    | Matheus Marques        |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/matmarquesx/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/matmarquesx)         |
|   Dev Team    | Ana Clara Tolomelli     |[![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/anaclaratolomelli/ ) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ninabtolo)   |

→ [Voltar ao topo](#topo)
