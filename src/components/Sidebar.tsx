import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Case Assessment', path: '/case-assessment' },
  { label: 'Financial Analysis', path: '/financial-analysis' },
  { label: 'Case History', path: '/case-history' },
  { label: 'Pricing Tool', path: '/pricing-tool' },
  { label: 'Settings', path: '/settings' },
  { label: 'UW Copilot Chat', path: '/chat' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">UW</div>
        <div>
          <p className="brand-title">UW Copilot</p>
          <p className="brand-subtitle">Underwriting Support</p>
        </div>
      </div>

      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}