import type { ContentMap, Venture } from '@/lib/types';
import Link from 'next/link';

interface Props {
  content: ContentMap;
  ventures: Venture[];
}

export default function Footer({ content, ventures }: Props) {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__brand-name" dangerouslySetInnerHTML={{ __html: content.footer_brand || '' }} />
          <p>{content.footer_tagline}</p>
        </div>
        <div className="footer__col">
          <h4>Ventures</h4>
          <ul className="footer__links">
            {ventures.map((v) => (
              <li key={v.id}><a href="#verticals">{v.title}</a></li>
            ))}
            <li><a href="/houseofh">Real Estate Portfolio</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Company</h4>
          <ul className="footer__links">
            <li><a href="#about">About</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Connect</h4>
          <ul className="footer__links">
            <li><a href="tel:+919945720417">+91 99457 20417</a></li>
            <li><a href="https://wa.me/919945720417" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="tel:+919900139430">+91 99001 39430</a></li>
            <li><a href="tel:+919986664874">+91 99866 64874</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>{content.footer_copyright}</span>
        <span><Link href="/admin">Admin Panel</Link></span>
      </div>
    </footer>
  );
}
