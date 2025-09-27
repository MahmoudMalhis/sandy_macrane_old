import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/">
      <img
        src="/logo.jpg"
        alt="Sandy macrame logo"
        className="h-16 w-16 rounded-full"
      />
    </Link>
  );
}
