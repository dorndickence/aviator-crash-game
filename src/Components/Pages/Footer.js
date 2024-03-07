const Footer = () => {
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <a href="./contact" className="link link-hover">
            Contact Us
          </a>
          <a href="https://partner.crashfly.com/" className="link link-hover">
            Affiliate
          </a>
        </nav>

        <aside>
          <p>Copyright © 2024 - All right reserved by CrashFly.win</p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
