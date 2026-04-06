import type { ContentMap } from '@/lib/types';

export default function REFooter({ content }: { content: ContentMap }) {
  return (
    <footer className="re-footer">
      <div className="re-container re-footer__inner">
        <p className="re-footer__text">{content.re_footer_text}</p>
        <a href="/" className="re-footer__link">
          Back to House of H.
        </a>
      </div>
    </footer>
  );
}
