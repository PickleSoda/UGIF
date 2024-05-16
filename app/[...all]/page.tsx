import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export async function generateStaticParams() {
  return [
    { all: ['gifs'] },
    { all: ['my-gifs'] },
    { all: ['settings'] },
    { all: ['signin'] },
    { all: ['signup'] },
    { all: ['home'] },
  ];
}

export default function Page() {
  return <App />;
}