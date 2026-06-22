# Zero Drift

[🇺🇸 Read in English](README.md)

**Sem drift de contexto. Sem repetição. Sem recomeçar do zero.**

Zero Drift é uma skill para Claude Code que mantém seu assistente de IA ancorado em toda sessão — com três regras simples aplicadas desde a primeira até a última resposta.

---

## O Problema

Sessões longas quebram. O contexto enche. Você abre uma nova instância do Claude e passa 10 minutos re-explicando o que estava fazendo. A IA deriva, alucina o que foi feito, esquece o que foi decidido.

Zero Drift resolve isso.

---

## As Três Regras

### 1. Resposta com Nome
Toda resposta começa com o seu nome. Mantém as respostas pessoais e identificáveis em logs longos.

```
Breno: o bug de auth está em middleware.ts:42 — o token expiry usa < em vez de <=.
```

A IA detecta seu nome automaticamente via `git config user.name` ou seu `CLAUDE.md`. Se não encontrar, pergunta uma vez.

**Por que isso importa — é um detector de alucinação.** Quando a IA começa a derivar ou alucinar, o nome é a primeira coisa que quebra: some, muda, ou fica estranho. No momento que você notar isso, a sessão está degradando. Pare, abra uma nova janela, diga *"leia o TASK.md e continue"*, e retome limpo de onde parou.

### 2. Idioma da Pergunta
A IA sempre responde no idioma em que você perguntou. Pergunta em português, recebe em português. Pergunta em inglês, recebe em inglês. Sem configuração. Sem drift.

### 3. Documento de Tarefa Vivo
Toda tarefa específica ganha um `TASK.md` na raiz do projeto. A IA escreve nele após cada prompt relevante — o que foi feito, o que quebrou, o que foi corrigido e um resumo claro do estado atual.

Quando o contexto encher, abra uma nova sessão e diga:
> "Leia o TASK.md e continue."

Só isso. Contexto completo restaurado.

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
- Fez X usando Y
- Corrigiu Z — antes fazia W, agora faz V

## Erros & Correções
| Erro | Causa | Correção |
|------|-------|----------|

## Estado Atual
Parágrafo de handoff para nova instância. Sempre atualizado. Reescrito, não acumulado.
```

---

## Como Usar

### Opção A — Cole no CLAUDE.md (global, qualquer IA)

Adicione em `~/.claude/CLAUDE.md` (ou `CLAUDE.md` no seu projeto):

```markdown
# Zero Drift
Siga as regras da skill Zero Drift:
1. Comece toda resposta com meu nome (detecte via git config ou pergunte)
2. Responda no idioma da pergunta
3. Para toda tarefa específica, mantenha e atualize TASK.md na raiz do projeto
Regras completas: https://github.com/obrenoalvim/zero-drift/blob/main/skills/zero-drift/SKILL.md
```

### Opção B — Aponte a IA direto para este repositório

Inicie uma sessão e diga:
> "Leia https://github.com/obrenoalvim/zero-drift e siga a skill Zero Drift."

A IA lê o SKILL.md e aplica as três regras imediatamente.

### Opção C — Copie o arquivo da skill

Copie `skills/zero-drift/SKILL.md` para o seu diretório de skills e carregue pelo seu sistema de plugins (superpowers, etc.).

---

## Handoff de Contexto

O fluxo principal para projetos longos:

1. Sessão enche → IA atualiza `Estado Atual` no TASK.md
2. Abre nova sessão do Claude Code
3. Diz: **"Leia o TASK.md e continue"**
4. IA lê, confirma o estado, continua exatamente de onde parou

Sem re-explicar. Sem contexto repetido. Sem drift.

---

## Compatibilidade

Funciona com qualquer IA que consiga ler markdown:
- Claude Code (claude.ai/code)
- Cursor
- GitHub Copilot (via AGENTS.md)
- Codex
- Qualquer uso da API Claude

---

## Contribuindo

Encontrou uma lacuna nas regras? Caso não coberto? Abra um PR — o SKILL.md é a fonte da verdade.
