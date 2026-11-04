import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  switchText?: string;
  switchLabel?: string;
  switchHref?: string;
};

function ProjectIllustration() {
  return (
    <div className="story-art" aria-hidden="true">
      <svg viewBox="0 0 540 330" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="273" cy="292" rx="211" ry="20" fill="#e3e3e1" fillOpacity=".42" />
        <path
          d="M88 257C113 209 162 185 214 188C260 190 288 228 329 225C365 222 381 184 419 182C450 180 471 202 480 233V277H88V257Z"
          fill="#ededeb"
        />
        <path
          d="M120 239C148 212 184 204 217 215C244 224 264 245 294 244C326 243 348 221 374 211C403 200 431 207 448 230V268H120V239Z"
          fill="#e5e5e3"
          fillOpacity=".25"
        />
        <g className="illustration-card">
          <rect x="177" y="46" width="207" height="153" rx="18" fill="#ffffff" />
          <rect x="177.75" y="46.75" width="205.5" height="151.5" rx="17.25" stroke="#e2e2e0" strokeWidth="1.5" />
          <path d="M195 74H365" stroke="#e4e4e2" strokeWidth="1.5" />
          <circle cx="199" cy="61" r="3" fill="#e5e5e3" />
          <circle cx="210" cy="61" r="3" fill="#e3e3e1" />
          <rect x="199" y="91" width="91" height="10" rx="5" fill="#1b1b1b" fillOpacity=".82" />
          <rect x="199" y="110" width="140" height="6" rx="3" fill="#8c8c8a" fillOpacity=".6" />
          <rect x="199" y="123" width="111" height="6" rx="3" fill="#8c8c8a" fillOpacity=".38" />
          <rect x="199" y="150" width="73" height="26" rx="8" fill="#f7f7f5" />
          <path d="M212 163L218 169L230 156" stroke="#454545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="240" y="160" width="22" height="5" rx="2.5" fill="#8c8c8a" fillOpacity=".6" />
          <rect x="281" y="150" width="79" height="26" rx="8" fill="#f7f7f5" />
          <path d="M296 157L304 169M304 157L296 169" stroke="#666666" strokeWidth="2" strokeLinecap="round" />
          <rect x="314" y="160" width="34" height="5" rx="2.5" fill="#8c8c8a" fillOpacity=".6" />
        </g>
        <g className="illustration-badge">
          <rect x="101" y="118" width="91" height="69" rx="15" fill="#e5e5e3" />
          <rect x="101.75" y="118.75" width="89.5" height="67.5" rx="14.25" stroke="#555555" strokeWidth="1.5" />
          <path d="M125 148L135 157L153 137" stroke="#454545" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="124" y="166" width="47" height="5" rx="2.5" fill="#454545" fillOpacity=".72" />
        </g>
        <g className="illustration-orbit">
          <circle cx="414" cy="99" r="32" fill="#f7f7f6" stroke="#e4e4e2" strokeWidth="1.5" />
          <path d="M414 81L418.8 93.2L432 94.2L421.9 102.8L425.1 115.7L414 108.8L402.9 115.7L406.1 102.8L396 94.2L409.2 93.2L414 81Z" fill="#e5e5e3" />
        </g>
        <path d="M78 120C82 120 85 123 85 127C85 131 82 134 78 134C74 134 71 131 71 127C71 123 74 120 78 120Z" fill="#e5e5e3" fillOpacity=".7" />
        <path d="M451 148L454 155L462 156L456 161L458 169L451 165L444 169L446 161L440 156L448 155L451 148Z" fill="#555555" fillOpacity=".7" />
        <path d="M124 90L127 97L135 98L129 103L131 111L124 107L117 111L119 103L113 98L121 97L124 90Z" fill="#555555" fillOpacity=".45" />
      </svg>
    </div>
  );
}

export function AuthShell({
  title,
  description,
  children,
  switchText,
  switchLabel,
  switchHref,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <aside className="auth-story">
        <div className="story-top">
          <Link className="brand-mark" href="/" aria-label="ZENTRO home">
            <span>ZENTRO</span>
          </Link>
        </div>

        <div className="story-copy">
          <h1 className="story-heading">
            Find Your Direction.
            <br />
            <span>Build Your Future.</span>
          </h1>
          <p className="story-description">
            Discover projects, explore technologies and get the guidance you
            need to build with confidence.
          </p>
        </div>

        <ProjectIllustration />

        <div className="story-bottom">
          <BookOpen size={16} />
          <span>Make your curiosity count.</span>
        </div>
      </aside>

      <section className="auth-panel" aria-label="Authentication">
        <div className="auth-panel-inner">
          <Link className="brand-mark auth-mobile-brand" href="/">
            <span>ZENTRO</span>
          </Link>
          <p className="story-eyebrow">
            <ArrowUpRight size={14} />
            A space to grow
          </p>
          <h2 className="auth-heading">{title}</h2>
          <p className="auth-description">{description}</p>
          {children}
          {switchText && switchLabel && switchHref ? (
            <p className="auth-switch">
              {switchText}{" "}
              <Link className="auth-link" href={switchHref}>
                {switchLabel}
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
