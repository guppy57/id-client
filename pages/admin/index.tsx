import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminHome(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/apps");  
  }, []);

  return (
    <div>
      <Head>
        <title>Admin | Kreative ID</title>
        <meta name="description" content="First-class authentication for Kreative." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
