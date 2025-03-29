import { Button } from '@repo/ui/components/base/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center space-y-4 rounded-xl p-6 shadow-2xl">
        <h1 className="text-2xl text-center">
          <span className="block">Turborepo</span>
          <span className="block">Shadcn/ui</span>
          <span className="block">Tailwind CSS v4</span>
        </h1>

        <p>Here is your shadcn button.</p>
        <Button>Button</Button>
      </div>
    </div>
  );
}
