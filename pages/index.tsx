import React from "react";
import type { GetStaticProps } from "next";

type Pokemon = { id: number; name: string };

export default function Home({ pokedex }: { pokedex: Pokemon[] }) {
  return (
    <main>
      <h1>Pokedex (静态)</h1>
      <p>这是示例静态页面，下面列出少量宝可梦：</p>
      <ul>
        {pokedex.map((p) => (
          <li key={p.id}>
            {p.id} - {p.name}
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const pokedex: Pokemon[] = [
    { id: 1, name: "Bulbasaur" },
    { id: 4, name: "Charmander" },
    { id: 7, name: "Squirtle" },
  ];

  return {
    props: {
      pokedex,
    },
  };
};
