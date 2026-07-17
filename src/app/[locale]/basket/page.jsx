import Container from "@/utils/Container";
import Basket from "../../components/main/Basket/Basket";

// Службова сторінка — закрита від індексації.
export const metadata = { robots: { index: false, follow: false } };

export default function BasketPage() {
  return (
    <Container>
      <Basket />
    </Container>
  );
}
