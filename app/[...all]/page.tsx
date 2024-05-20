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
    { all: ['forgot-password'] },
    { all: ['code-verify'] },
    { all: ['change-password'] }
  ];
}

export default function Page() {
  return <App />;
}