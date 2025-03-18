# Documentação - Front-End
## Documentação
[Documentação Completa](https://docs.google.com/document/d/133GOQwhl75MV2KTdwHevr08D_d-MBY8vpOwTtpNCpvY/edit?tab=t.z6lbq0xdgzy1)
## Setup
1. Clone o repositório:
  ```bash
  git clone https://github.com/ArturMota19/hestia-frontend
  ```
2. Instale os pacotes:
  ```bash
  npm install
  ```
3. Execute o projeto:
  ```bash
  npm run dev
  ```

## Organização de Pastas
- `public`: Use para armazenar imagens em geral.
- `src`:
  - `assets`: Use para armazenar ícones e imagens que se repetem.
  - `basics`: Pastas de componentes que se repetem, Ex: Header, Footer.
  - `components`: Componentes em geral, Ex: RegisterScreen, LoginScreen.
  - `pages`: Páginas do projeto, englobam componentes.

## Estilização
### CSS Modules + SASS
O projeto utiliza CSS Modules e SASS para estilização. O Modules evita conflito entre classes e ids de mesmo nome, enquanto o SASS dá novas funcionalidades ao CSS padrão.

### Organização de Estilização
- `src`:
  - `styles`:
   - `_mixins.scss`: Mistura de vários estilos em uma classe reutilizável.
   - `globals.scss`: Estilização global.

### Nomear Classes e Pastas
- Use inglês para nomear as classes, arquivos e pastas.
- Utilize `camelCase` para nomear todas as classes.
- Utilize `PascalCase` para nomear todos os arquivos e pastas.

## Organização de Branches
- Para cada implementação, crie uma branch nova com o padrão dos tipos disponíveis e o nome do que será implementado.
  - Exemplo: `feat/implement-models`, `refact/login-screen`.
- Para criar uma branch, use:
  ```bash
  git checkout -b x-nome-da-branch
  ```
- Após criar a branch para a sua implementação, faça o que quiser nela, pois ainda não está na branch `main`, logo, não oferece risco à branch de produção.
- Depois de terminar a branch que você estava fazendo, dê `git push`, solicite o merge da sua branch para a `PROD`, e aguarde revisão.

**NÃO CODAR NA PASTA MAIN!**
