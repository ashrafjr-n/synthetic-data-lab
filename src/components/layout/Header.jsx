import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full px-8 py-6">
      <div className="container-app flex items-center justify-between glass-card rounded-2xl px-6 py-4">
        <h1 
          className="font-semibold tracking-wide text-lg"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Synthetic Data Lab
        </h1>

        <div className="badge-gold text-xs px-3 py-1 rounded-full">
          Premium Beta
        </div>
      </div>
    </header>
  );
}

export default Header;