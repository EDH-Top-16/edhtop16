import logo from "../images/EGLogo.png";

export default function Nav() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-1/12 bg-nav drop-shadow-nav">
      <img className="mt-24" src={logo} alt="" width="40%" />
      <div className="flex flex-col items-center mt-32 space-y-16 text-white">
        <a href="">View Decks</a>
        <a href="">View Tournaments</a>
      </div>
    </div>
  );
}
