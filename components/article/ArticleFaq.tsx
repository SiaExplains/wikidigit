import type { ArticleFaq as Faq } from "@/types/article";

interface ArticleFaqProps {
  items: Faq[];
}

export default function ArticleFaq({ items }: ArticleFaqProps) {
  if (items.length === 0) return null;

  return (
    <section className="prose-article max-w-none mt-10" aria-labelledby="faq">
      <h2 id="faq">Frequently asked questions</h2>
      {items.map((item) => (
        <div key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </section>
  );
}
