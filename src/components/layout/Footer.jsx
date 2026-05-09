function Footer() {
  return (
    <footer className="w-full px-8 py-6">
      <div className="container-app glass-card rounded-2xl px-6 py-4 flex items-center justify-between">

        <span style={{ fontSize: "12px", color: "#b0b5bf", letterSpacing: "0.02em" }}>
          © 2026 Synthetic Data Lab. All rights reserved.
        </span>

        <a
          href="https://github.com/ashrafjr-n"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "7px 14px", borderRadius: "100px",
            border: "1px solid #e9eaec", background: "transparent",
            textDecoration: "none", fontSize: "12px", fontWeight: "600",
            color: "#374151", transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#c7a74a";
            e.currentTarget.style.color = "#9a7a28";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#e9eaec";
            e.currentTarget.style.color = "#374151";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755
              -1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305
              3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38
              1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399
              3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12
              3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81
              2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24
              12c0-6.63-5.37-12-12-12z"/>
          </svg>
          ashrafjr-n
        </a>

      </div>
    </footer>
  );
}

export default Footer;