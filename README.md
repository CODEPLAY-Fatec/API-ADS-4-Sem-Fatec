# Sistema Intituitivo para Gestão de Projetos de Pesquisa e Desenvolvimento Tecnológico de uma fundação

<!-- Colocar nome futuramente -->

<span id="topo">
<p align="center">
    <a href="#sobre">Sobre</a>  |  
    <a href="#backlogs">Backlog do Produto</a>  |  
    <a href="#requisitosfuncionais">Lista de Requisitos Funcionais</a>  | 
    <a href="#requisitosnfuncionais">Lista de Requisitos Não Funcionais</a>  |
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

As entregas de valor de cada sprint. Os stakeholders podem acompanhar de perto o desenvolvimento do projeto e entender como as metas e objetivos estão sendo alcançados ao longo do tempo.

| Sprint | Previsão de Entrega |      Status      | Descrição                                           | MVP                                                                     |
| :----: | :-----------------: | :--------------: | :-------------------------------------------------- | :---------------------------------------------------------------------- |
|   1    |     30/03/2025      | ❌ Não Concluído | _"Configuração Inicial e Operações Básicas"_        | Cadastro, listagem, edição e exclusão de projetos.                      |
|   2    |     27/04/2025      | ❌ Não Concluído | _"Gestão de Projetos e Visualizações"_              | Filtros de projetos, dashboard de acompanhamento, gestão de atividades. |
|   3    |     25/05/2025      | ❌ Não Concluído | _"Implementação Técnica e Inteligência Artificial"_ | Interface conversacional baseada em IA, recuperação de dados.           |

→ [Voltar ao topo](#topo)

<span id="backlogs">

## :dart: Backlog do Produto

| Rank | Prioridade | User Story                                                                                                                                                                                                          | Estimativa | Sprint | Requisito do Parceiro | Critério de Aceitação                                                                                                                                                                                                                                     |
| :--: | :--------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: | :----: | :-------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1   |    Alta    | **Como usuário, quero cadastrar novos projetos para organizar e acompanhar seu desenvolvimento de forma estruturada.**                                                                                              |     5      |   1    |          RF1          | - Formulário com campos obrigatórios (nome, descrição, data, etc.)<br>- Mensagem de sucesso ao salvar<br>- Persistência dos dados no banco e disponibilidade nas consultas futuras                                                                        |
|  2   |    Alta    | **Como usuário, quero visualizar a lista de projetos para obter uma visão consolidada do portfólio, possibilitando decisões rápidas e embasadas.**                                                                  |     3      |   1    |         RNF1          | - Exibição de listagem intuitiva e responsiva<br>- Visualização dos dados essenciais de cada projeto                                                                                                                                                      |
|  3   |   Média    | **Como usuário, quero atualizar informações dos projetos para garantir que os dados reflitam a realidade, contribuindo para decisões mais assertivas.**                                                             |     5      |   1    |          RF3          | - Permite edição de campos específicos<br>- Confirmação visual da atualização<br>- Persistência das alterações no banco de dados                                                                                                                          |
|  4   |   Média    | **Como usuário, quero excluir projetos obsoletos para manter a base de dados organizada, facilitando a gestão dos projetos ativos.**                                                                                |     3      |   1    |          RF3          | - Solicitação de confirmação antes da exclusão<br>- Remoção imediata da listagem                                                                                                                                                                          |
|  5   |    Alta    | **Como usuário, quero me cadastrar no sistema para acessar as funcionalidades de gestão de projetos de forma segura e personalizada.**                                                                              |     4      |   1    |         RNF1          | - Formulário de cadastro com validação de e-mail e senha<br>- Armazenamento seguro dos dados de login<br>- Confirmação de cadastro bem-sucedido                                                                                                           |
|  6   |   Média    | **Como usuário, quero filtrar projetos por área de atuação, responsáveis e status para identificar rapidamente os projetos relevantes, otimizando o acompanhamento e a delegação de tarefas.**                      |     5      |   2    |     RF4, RF5, RF6     | - Filtros funcionando corretamente para todas as categorias<br>- Resultados precisos e atualizados em tempo real<br>- Interface intuitiva e responsiva para seleção                                                                                       |
|  7   |   Média    | **Como usuário, quero acompanhar o andamento das atividades e acessar uma dashboard intuitiva para visualizar relatórios dos projetos, possibilitando um monitoramento completo e suportando a tomada de decisão.** |     5      |   2    |          RF7          | - Exibição de dashboard que consolida o progresso das atividades com gráficos<br>- Interface amigável e responsiva                                                                                                                                        |
|  8   |    Alta    | **Como usuário, quero adicionar atividades aos projetos para organizar e acompanhar as tarefas de forma eficiente.**                                                                                                |     4      |   2    |          RF3          | - Formulário para cadastro de atividades vinculado a um projeto<br>- Campos obrigatórios validados antes do cadastro<br>- Mensagem de sucesso após salvar atividade                                                                                       |
|  9   |    Alta    | **Como usuário, quero editar e excluir atividades para manter o planejamento atualizado e remover tarefas desnecessárias.**                                                                                         |     4      |   2    |          RF3          | - Permite edição dos detalhes de uma atividade cadastrada<br>- Exclusão de atividades com confirmação prévia                                                                                                                                              |
|  10  |   Baixa    | **Como usuário, quero que o sistema tenha uma interface conversacional baseada em IA para executar funções de forma intuitiva e eficiente.**                                                                        |     6      |   3    |   RNF3, RNF4, RNF5    | - Interface conversacional implementada e funcional<br>- Capacidade de interpretar comandos e executar funções corretamente<br>- Extração de parâmetros de entrada com alta precisão<br>- Registro de interações para monitoramento e melhorias contínuas |
|  11  |   Média    | **Como usuário, quero recuperar os dados de projetos de forma intuitiva para facilitar consultas rápidas e embasar análises estratégicas, aumentando a eficiência na tomada de decisões.**                          |     3      |   3    |          RF2          | - Dados dos projetos são recuperados e exibidos de forma clara<br>- Interface permite busca e filtragem intuitivas                                                                                                                                        |

<p align="center">

<span id="requisitosfuncionais">

## :dart: Requisitos Funcionais

| Número do Requisito | Requisito do Parceiro                                         |
| ------------------- | ------------------------------------------------------------- |
| RF1                 | Cadastrar projetos da FAPG (nome do projeto, descrição, etc). |
| RF2                 | Recuperar dados de projetos de forma intuitiva.               |
| RF3                 | Atualizar e excluir dados dos projetos.                       |
| RF4                 | Visualizar projetos por área de atuação.                      |
| RF5                 | Visualizar projetos por responsáveis.                         |
| RF6                 | Visualizar projetos pelo status.                              |
| RF7                 | Acompanhar o andamento das atividades.                        |

<p align="center">

<span id="requisitosnfuncionais">

## :dart: Requisitos Não Funcionais

| Número do Requisito | Requisito do Parceiro                                                            |
| :-----------------: | -------------------------------------------------------------------------------- |
|        RNF1         | Usabilidade.                                                                     |
|        RNF2         | Privacidade de dados.                                                            |
|        RNF3         | Conversão de linguagem natural para chamada de funções (sem uso de API externa). |
|        RNF4         | Extração de parâmetros da mensagem do usuário (sem uso de API externa).          |
|        RNF5         | Orquestrar chamadas de funções.                                                  |

<p align="center">

<span id="planejamento">

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

|    Função     | Nome                |                                                                                                                                                                                              LinkedIn & GitHub                                                                                                                                                                                              |
| :-----------: | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Product Owner | Daniel Sendreti     |                                                     [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/danielbroder/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/d-broder)                                                     |
| Scrum Master  | Gabriel Vasconcelos | [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-vasconcelos-255979262/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gabrielvascf) |
|   Dev Team    | André Neves         |      [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/andre-neves-44807a209/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/andreN4vs)       |
|   Dev Team    | Gabriel Carvalho    |                                           [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-carvalho-30598b292/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Gabriecarvalho)                                           |
|   Dev Team    | Gabriel Silva       |                                                [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-silva--cs/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gabrielfelip)                                                 |
|   Dev Team    | Matheus Marques     |                                                    [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/matmarquesx/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/matmarquesx)                                                    |
|   Dev Team    | Ana Clara Tolomelli |                                                  [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/anaclaratolomelli/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ninabtolo)                                                  |

→ [Voltar ao topo](#topo)
