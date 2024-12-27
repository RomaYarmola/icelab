import { useRouter } from "next/navigation";
import Order from "../../main/Delivery/Order";

export default function BasketModal({
  handleBackdropMouseLeave,
  modalRef,
  totalValue,
  products,
}) {
  const router = useRouter();
  return (
    <>
      <div
        onMouseEnter={handleBackdropMouseLeave}
        className="fixed z-10 inset-0 cursor-pointer opacity-50"
      />
      <div
        ref={modalRef}
        className="hidden sm:block sm:h-[486px] overflow-y-auto scrollbar-hidden z-50 fixed top-20 right-5 l:right-20 min-w-[386px] rounded-lg"
      >
        <Order
          variant="modal"
          handleSubmit={() => {
            router.push("/delivery");
          }}
          totalValue={totalValue}
          products={products}
        />
      </div>
    </>
  );
}
