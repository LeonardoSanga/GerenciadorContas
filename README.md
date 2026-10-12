# Gerenciador de Contas a Pagar

Sistema web para controle financeiro de **contas a pagar** e dos **fornecedores** a elas vinculados. A aplicação é dividida em um **back-end** (API REST com autenticação JWT) e um **front-end** (páginas renderizadas no servidor, que consomem a API pelo navegador).

---

## Objetivo

Centralizar o cadastro de fornecedores e o acompanhamento das contas a pagar de uma empresa, permitindo saber **o que deve ser pago, quando vence, a quem se deve e se já foi pago**. O projeto também serve como exemplo prático de uma aplicação **Node.js em camadas** (rotas → controller → model) com front-end separado e autenticação por token.

## Funcionalidades

**Autenticação**
- Login com usuário e senha (senhas armazenadas com hash *bcrypt*).
- Token JWT com expiração de 10 minutos.
- Páginas protegidas: sem sessão ativa, o usuário é redirecionado ao login.
- Encerramento automático da sessão quando o token expira ou é inválido.

**Fornecedores**
- Listagem com busca, ordenação e paginação (DataTables).
- Cadastro, visualização, edição e remoção.
- CNPJ gravado apenas com dígitos e exibido com máscara (`00.000.000/0000-00`).
- Validação do CNPJ (14 dígitos) e do e-mail.

**Contas a pagar**
- Listagem com valor em R$, datas no formato brasileiro, indicador visual de pago/não pago e nome do fornecedor.
- Cadastro, visualização, edição e remoção.
- Seleção do fornecedor por lista pesquisável (Select2).
- Data de pagamento opcional (conta ainda não paga).

**Geral**
- Painel inicial com navegação por menu.
- Remoção **lógica**: os registros são marcados como `deleted = true` e não são apagados do banco.
- Um único formulário atende às quatro operações (criar, visualizar, atualizar e remover), controladas pelo parâmetro `oper` da URL.

## Tecnologias utilizadas

### Back-end
| Tecnologia | Uso |
|---|---|
| Node.js | Ambiente de execução |
| Express | Servidor HTTP e roteamento |
| PostgreSQL | Banco de dados relacional e driver |
| JWT | Geração e verificação do JWT |
| bcrypt | Hash e comparação de senhas |
| dotenv | Variáveis de ambiente |

### Front-end
| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor das páginas |
| Nunjucks | Motor de templates (`.njk`) |
| Bootstrap 5 | Layout e ícones |
| jQuery 3.7 | Dependência do DataTables e do Select2 |
| JavaScript (ES6+, fetch, async/await) | Comunicação com a API e lógica das telas |

> **Atenção:** O jQuery 4 é incompatível com as versões do DataTables e do Select2 usadas aqui.
