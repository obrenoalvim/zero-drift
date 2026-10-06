<div align="center">

<img src=".github/logo.svg" alt="Logo do Zero Drift" width="120" height="120">

# Zero Drift

**Uma skill para Claude Code que mantém sessões longas de IA ancoradas.**<br>
As respostas abrem com o seu nome. As tarefas guardam um `TASK.md` de onde a próxima sessão retoma.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/obrenoalvim/zero-drift?style=flat&logo=github&color=22d3ee)](https://github.com/obrenoalvim/zero-drift/stargazers)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-5B5BD6)](#início-rápido)

[English](README.md) · **Português** · [Español](README.es.md)

[O problema](#o-problema) · [Início rápido](#início-rápido) · [As duas regras](#as-duas-regras) · [Como funciona](#como-funciona) · [Instalação](#instalação) · [Perguntas frequentes](#perguntas-frequentes)

</div>

---

O Zero Drift é uma skill para Claude Code com duas regras, aplicadas da primeira resposta até a última. Instale como plugin e ele carrega no início de cada sessão.

## O Problema

Sessões longas degradam. A janela de contexto enche, você abre uma instância nova do Claude e gasta dez minutos re-explicando o que estava fazendo. A essa altura a IA já começou a derivar: inventa trabalho que nunca fez e esquece decisões que você já tomou.

O Zero Drift te dá como perceber a deriva cedo e fazer o handoff limpo.

## Início rápido

```
/plugin marketplace add obrenoalvim/zero-drift
/plugin install zero-drift@zero-drift
```

Abra uma janela nova do Claude Code. Se a primeira resposta começar com o seu nome, o Zero Drift está ativo. As outras opções de instalação estão em [Instalação](#instalação).

---

## As Duas Regras

### 1. Resposta com Nome
A IA abre toda resposta com o seu nome. Isso mantém as respostas pessoais e fáceis de localizar num log longo.

```
Breno: o bug de auth está em middleware.ts:42, o token expiry usa < em vez de <=.
```

A IA lê seu nome de `git config user.name` ou do seu `CLAUDE.md`. Se não achar nada, pergunta uma vez.

**O nome é seu detector de alucinação.** Quando o modelo começa a derivar, o nome quebra primeiro: some, muda, ou soa um pouco fora. Esse é o seu sinal de que a sessão está degradando. Abra uma janela nova, diga *"leia o TASK.md e continue"*, e retome de um estado limpo.

### 2. Documento de Tarefa Vivo
Cada tarefa ganha um `TASK.md` na raiz do projeto. Depois de cada prompt relevante a IA registra o que fez, o que quebrou, o que corrigiu e onde as coisas estão agora.

O Log é um registro, não um diário. A IA não pode afirmar "corrigi X". Ela mostra a prova: o comando rodado, a saída, o exit code. Sem prova, não entra no Log; trabalho não comprovado vai para `Não Verificado / Pendente`. O `Estado Atual` só pode dizer que algo funciona se essa prova estiver no Log. Quando o contexto degrada, o modelo puxa pra fluência antes da verdade, então a regra de evidência é o que mantém o handoff confiável em vez de uma história plausível.

Quando o contexto encher, abra uma sessão nova e diga:
> "Leia o TASK.md e continue."

A instância nova lê o arquivo e retoma de onde a anterior parou.

---

## Estrutura do TASK.md

```markdown
# TASK: [Nome da Tarefa]
> Criado: YYYY-MM-DD | Atualizado: YYYY-MM-DD HH:MM

## Objetivo
O que estamos construindo ou corrigindo.

## Plano
- [x] Passo concluído
- [ ] Passo pendente

## Log
### YYYY-MM-DD
- Adicionou retry em fetchUser(): `npm test auth` -> 12 passed, exit 0
- Corrigiu null deref em parse(): `cargo test parse` -> ok. 3 passed, exit 0

## Não Verificado / Pendente
- Refatorou camada de cache: NÃO testado ainda, sem prova

## Erros & Correções
| Erro | Causa | Correção | Evidência |
|------|-------|----------|-----------|

## Estado Atual
Parágrafo de handoff para uma instância nova. Reescreva a cada vez para
descrever sempre o agora. Só afirme que algo funciona se a prova estiver no
Log; caso contrário escreva "implementado, não verificado".
```

---

## Como funciona

1. Um hook `SessionStart` ([`hooks/inject.js`](hooks/inject.js)) lê o [`skills/zero-drift/SKILL.md`](skills/zero-drift/SKILL.md) e adiciona o conteúdo ao contexto de cada sessão nova.
2. O Claude procura seu nome nesta ordem: `git config user.name`; uma linha com seu nome no `CLAUDE.md`, `AGENTS.md` ou `GEMINI.md`; uma apresentação sua no começo da sessão. Se as três falharem, ele pergunta uma vez.
3. Quando você começa uma tarefa com nome e objetivo ("vamos construir X", "corrija esse bug"), o Claude cria o `TASK.md` na raiz do projeto e atualiza depois de cada prompt que avança a tarefa.

---

## Instalação

### Recomendado: instale como plugin (global, automático)

Esta é a **única** opção que liga o Zero Drift sozinho em **toda** sessão. O plugin embarca um hook `SessionStart` que injeta as regras em cada janela nova do Claude Code, então você nunca invoca nada nem configura nada por sessão.

```
/plugin marketplace add obrenoalvim/zero-drift
/plugin install zero-drift@zero-drift
```

Depois abra uma janela nova do Claude Code. A partir daí, toda sessão começa com o Zero Drift ativo: respostas abrem com seu nome e tarefas ganham um `TASK.md`. Para confirmar que carregou, veja se a primeira resposta numa janela nova começa com seu nome.

**Requisito:** Node.js no seu `PATH`. O hook roda `node hooks/inject.js`.

> **Nota sobre os termos:** *plugin* é o pacote; o hook `SessionStart` dentro dele é o que torna o comportamento *global e automático*. Instalar o plugin te dá os dois. As opções manuais abaixo deixam a skill disponível mas **não** a ativam sozinhas.

### Alternativas manuais (sem plugin)

Funcionam sem instalar o plugin, mas exigem configuração e não ativam globalmente sozinhas.

**Cole no CLAUDE.md**: adicione isto em `~/.claude/CLAUDE.md` (global) ou num `CLAUDE.md` do projeto:

```markdown
# Zero Drift
Siga as regras da skill Zero Drift:
1. Comece toda resposta com meu nome (detecte via git config ou pergunte)
2. Para toda tarefa específica, mantenha e atualize TASK.md na raiz do projeto
Regras completas: https://github.com/obrenoalvim/zero-drift/blob/main/skills/zero-drift/SKILL.md
```

**Aponte a IA para este repositório**: inicie uma sessão e diga:
> "Leia https://github.com/obrenoalvim/zero-drift e siga a skill Zero Drift."

A IA lê o SKILL.md e aplica as duas regras.

**Copie o arquivo da skill**: copie `skills/zero-drift/SKILL.md` para o seu diretório de skills e carregue pelo seu sistema de plugins, como o superpowers.

---

## Handoff de Contexto

O fluxo que carrega um projeto longo entre instâncias:

1. A sessão enche, então a IA atualiza `Estado Atual` no TASK.md
2. Você abre uma sessão nova do Claude Code
3. Você diz: **"Leia o TASK.md e continue"**
4. A IA lê o arquivo, confirma onde as coisas estão e retoma dali

Você pula o re-explicar e a IA pula o adivinhar.

---

## Compatibilidade

Funciona com qualquer IA que leia markdown:
- Claude Code (claude.ai/code)
- Cursor
- GitHub Copilot (via AGENTS.md)
- Codex
- A API Claude

O hook automático `SessionStart` é específico do Claude Code. Para as outras, use as [alternativas manuais](#alternativas-manuais-sem-plugin).

---

## Perguntas frequentes

**O Zero Drift envia meus dados para algum lugar?**
Não. O hook lê um arquivo do disco e imprime como contexto da sessão. Não faz nenhuma chamada de rede. Se o arquivo não existir, o hook não imprime nada, então uma instalação quebrada nunca impede a sessão de começar.

**O que fazer quando o Claude esquece ou troca o meu nome?**
Trate como o sinal de que a sessão está degradando. Abra uma janela nova e diga "Leia o TASK.md e continue".

**Posso usar com Cursor, Codex ou Copilot?**
Sim. Coloque o trecho de [Alternativas manuais](#alternativas-manuais-sem-plugin) no seu `AGENTS.md` ou arquivo de regras.

---

## Contribuindo

Achou uma lacuna nas regras, ou um caso que a skill não cobre? Abra um PR. O SKILL.md é a fonte da verdade. Veja o [CONTRIBUTING.md](CONTRIBUTING.md) e o [changelog](CHANGELOG.md).

## Licença

[MIT](LICENSE)

---

<div align="center">

Se o Zero Drift te poupou um re-explicar, uma ⭐ ajuda outras pessoas que usam Claude Code a encontrar o projeto.

<sub>**Tópicos:** claude-code · claude-skill · claude-code-plugin · context-management · session-handoff · hallucination · ai-agents · prompt-engineering · cursor · llm</sub>

</div>
