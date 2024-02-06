import Head from "next/head";

export default function MissingApp() {
  return (
    <>
      <Head>
        <title>Missing Application | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="pt-16">
        <h1 className="pt-12 pb-3 text-center text-2xl">
          Hello! It seems you came here without being redirected from a Kreative application.
        </h1>
        <div className="text-center">
          <a href="https://kreativeusa.com" target="_blank" className="text-md text-center text-indigo-500" rel="noreferrer">
            Go to kreativeusa.com
          </a>
        </div>
      </main>
    </>
  );
}
