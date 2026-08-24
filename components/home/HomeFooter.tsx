import Link from 'next/link';
import { footerProfile } from '@/lib/site-config';

const HomeFooter = () => {
  return (
    <footer className="home-footer">
      <div className="main-container !pt-10 !pb-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="home-footer-card home-footer-card--feature">
            <div className="home-footer-badge">
              <span className="home-footer-badge-dot" />
              Built by Swadhin
            </div>
            <h2 className="home-footer-title">
              Block-coin, shaped with a fast dark-market
            </h2>
            <p className="home-footer-body">
              Live market screens, portfolio tracking, and coin-level liquidity intent all live in one workspace so users can move from discovery to action without leaving the flow.
            </p>
          </div>

          <div className="grid gap-4">
            <Link
              href={footerProfile.github}
              target="_blank"
              rel="noreferrer"
              className="home-footer-link"
            >
              <p className="home-footer-kicker">GitHub</p>
              <p className="home-footer-value">SWADHIN300</p>
            </Link>

            <Link
              href={footerProfile.x}
              target="_blank"
              rel="noreferrer"
              className="home-footer-link"
            >
              <p className="home-footer-kicker">X</p>
              <p className="home-footer-value">@SWADHIN300</p>
            </Link>

            <Link
              href={`mailto:${footerProfile.email}`}
              className="home-footer-link"
            >
              <p className="home-footer-kicker">Email</p>
              <p className="home-footer-value break-all">{footerProfile.email}</p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
