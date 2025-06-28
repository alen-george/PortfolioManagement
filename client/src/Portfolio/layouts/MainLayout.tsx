import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => (
  <div>
    <nav>
      <Link to="/portfolio/performance">Portfolio Performance</Link> | <Link to="/holdings">Portfolio Holdings</Link>
    </nav>
    <main>{children}</main>
  </div>
);

export default MainLayout;
