# 🎨 ArtMatch

### Foi meu Primeiro Projeto de estudo, completo e independente, feito antes de ter conhecimentos de arquitetura e SOLID
### Fauna foi descontinuado, o Código está sendo refatorado

**ArtMatch** é uma aplicação JAMStack desenvolvida com foco na comunidade artística, permitindo que artistas criem perfis personalizados e compartilhem seus trabalhos de maneira fluida, visualmente atrativa e integrada a recursos modernos da web.

---

## ✨ Funcionalidades

- 🖼 **Upload de artes** com corte de imagem antes da publicação (preview e crop).
- 👤 **Perfil de artista** com nome, telefone e endereço (CEP com integração automática à API dos Correios).
- 🔐 **Autenticação OAuth** (login seguro via provedores externos).
- 🗑 **Drag & Drop com exclusão** intuitiva via área de descarte.
- 💬 **Animações fluidas** com Framer Motion para uma UX agradável.
- ☁️ **Armazenamento de imagens** via **Imgur API**.
- 🔄 **Back-end serverless** com **FaunaDB** como banco de dados.

---

## 🛠 Tecnologias Utilizadas

| Tecnologia        | Descrição                              |
|-------------------|------------------------------------------|
| [Next.js](https://nextjs.org/)     | Framework React para renderização SSR/SSG. |
| [Tailwind CSS](https://tailwindcss.com/) | Utilitário CSS para design moderno e responsivo. |
| [Framer Motion](https://www.framer.com/motion/) | Biblioteca de animações fluidas. |
| [FaunaDB](https://fauna.com/)      | Banco de dados serverless NoSQL. |
| [Imgur API](https://apidocs.imgur.com/) | Armazenamento de imagens na nuvem. |
| [Correios API](https://www.correios.com.br/) | Busca automática de endereço via CEP. |
| [OAuth](https://oauth.net/)        | Autenticação segura de usuários. |

---

## 📸 Demonstração

[Link do Projeto](https://inktrail.vercel.app/)

---

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/Mazakina/ArtMatch.git
cd ArtMatch

# Instale as dependências
npm install

# Crie um arquivo .env.local com suas variáveis:
# NEXT_PUBLIC_IMGUR_CLIENT_ID=
# NEXT_PUBLIC_FAUNADB_SECRET=
# NEXT_PUBLIC_OAUTH_PROVIDER=
# etc.

# Rode o projeto
npm run dev
```

---

## 📁 Estrutura do Projeto

```
📦ArtMatch
 ┣ 📂components      # Componentes reutilizáveis
 ┣ 📂pages           # Rotas do Next.js
 ┣ 📂lib             # Integrações com APIs externas
 ┣ 📂styles          # Estilos globais
 ┣ 📂public          # Assets estáticos
 ┣ 📄tailwind.config.js
 ┣ 📄next.config.js
 ┗ 📄README.md
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

## 📫 Contato

Criado por **Paulo Mazakina Bueno**  
📧 8.mazakina@gmail.com  
🔗 [github.com/Mazakina](https://github.com/Mazakina)

---
