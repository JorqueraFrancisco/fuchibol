import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

import { db } from "~/fireabase";
import { collection, addDoc, doc, setDoc, query, getDocs } from "firebase/firestore";

export default component$(() => {

  const matchIdList = useStore([])



  useTask$(async () => {
    const matchesDocs = await getDocs(
      query(
        collection(db, 'matches')
      )
    );
    matchesDocs.forEach((doc) => {
      matchIdList.push(doc.id)
    });
  });

  return (
    <>
      <div>
        {matchIdList.map((id) => (
          <Link href={`/match/${id}`} key={id}>
            <h1>{id}</h1>
          </Link>
        ))}
      </div>
    </>
  );
});




export const Input = component$(() => {
  return <div>Hello Qwik!</div>
});

export const head: DocumentHead = {
  title: "Fuchibol",
  meta: [
    {
      name: "Lista para partidos",
      content: "Qwik site description",
    },
  ],
};
