export default function Disclosure({ text }: { text: string }) {
  return (
    <aside
      aria-label="Disclosure"
      className="mb-8 border-l-4 border-amber bg-amber/10 px-4 py-3 text-sm text-ink/80 rounded-sm"
    >
      <strong className="text-ink">Disclosure:</strong> {text}
    </aside>
  );
}
