import useAppStore from "../store/useAppStore";
import Button from "./common/Button";

// src/components/ApplyNow.jsx
export default function ApplyNow({
  album = null,
  variant = "primary",
  className = "",
  children = "اطلب الآن",
}) {
  const { openOrderForm } = useAppStore();

  const handleClick = () => {
    openOrderForm(album);
  };

  return (
    <Button onClick={handleClick} variant={variant} className={className}>
      {children}
    </Button>
  );
}
