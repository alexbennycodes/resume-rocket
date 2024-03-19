# Resume Rocket

![image](https://github.com/alexbennycodes/resume-rocket/assets/98402835/62e40ec2-d150-4c22-b851-9f7a15ac44f0)


<p align="center">
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
</p>
<br/>

## Installation

Clone & create this repo locally with the following command:

```bash
git clone https://github.com/alexbennycodes/resume-rocket
```

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

4. Input ```HUGGINGFACE_API_KEY``` you need for the env.


5. Start the development server from either yarn or turbo:

```sh
pnpm run dev
```

## Tech Stack + Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [HuggingFace](https://huggingface.co/) - Free AI Models

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) – Generate dynamic Open Graph images at the edge

