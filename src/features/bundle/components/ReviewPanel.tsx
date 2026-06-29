import { useMemo, useState } from "react";
import { TruckIcon } from "@/components/ui/icons/StepIcons";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useSteps, useShipping, useBundleActions } from "../store/bundleStore";
import { getReviewItems, computeTotals, FINANCING_MONTHS } from "../selectors";
import type { ReviewLineItem } from "../types";

const CATEGORY_ORDER = ["CAMERAS", "SENSORS", "ACCESSORIES", "PLAN"];

export default function ReviewPanel() {
  const steps = useSteps();
  const shipping = useShipping();
  const { setVariantQuantity, setProductQuantity, saveSystem } =
    useBundleActions();
  const [saved, setSaved] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const items = useMemo(() => getReviewItems(steps), [steps]);
  const { compareTotal, total, savings } = useMemo(
    () => computeTotals(items, shipping),
    [items, shipping],
  );
  const monthlyFinancing = (total / FINANCING_MONTHS).toFixed(2);

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.reduce<Record<string, ReviewLineItem[]>>((acc, cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length > 0) acc[cat] = catItems;
        return acc;
      }, {}),
    [items],
  );

  const isEmpty = items.length === 0;

  function handleDecrement(item: ReviewLineItem) {
    if (item.variantId) {
      setVariantQuantity(
        item.stepId,
        item.productId,
        item.variantId,
        item.quantity - 1,
      );
    } else {
      setProductQuantity(item.stepId, item.productId, item.quantity - 1);
    }
  }

  function handleIncrement(item: ReviewLineItem) {
    if (item.variantId) {
      setVariantQuantity(
        item.stepId,
        item.productId,
        item.variantId,
        item.quantity + 1,
      );
    } else {
      setProductQuantity(item.stepId, item.productId, item.quantity + 1);
    }
  }

  function handleSave() {
    saveSystem();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCheckout() {
    setCheckedOut(true);
    setTimeout(() => setCheckedOut(false), 2500);
  }

  return (
    <div className="bg-highlight rounded-xl border-2 border-accent overflow-hidden sticky top-4 px-5 pt-4 pb-7">
      <div className=" pb-3">
        <p className="text-xs font-normal text-content-label uppercase tracking-widest mb-6">
          REVIEW
        </p>
        <h2 className="text-[22px] font-bold text-content leading-tight">
          Your security system
        </h2>
        <p className="text-content-muted text-xs mt-1 leading-snug">
          Review your personalised protection system designed to keep what
          matters most safe.
        </p>
      </div>

      <div className="h-px bg-line-subtle" />

      <div className=" py-3 space-y-4">
        {isEmpty && (
          <p className="py-6 text-center text-xs text-content-muted">
            No items selected yet. Add products from the steps on the left to
            build your system.
          </p>
        )}

        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category}>
            <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">
              {category}
            </p>

            <div className="space-y-3">
              {catItems.map((item) => (
                <ReviewLineItem
                  key={item.id}
                  item={item}
                  onDecrement={() => handleDecrement(item)}
                  onIncrement={() => handleIncrement(item)}
                />
              ))}
            </div>
            <div className="h-px mt-2 bg-line-subtle" />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <TruckIcon className="w-6 h-6 text-success" />
          </div>
          <span className="flex-1 text-xs font-medium text-content-secondary">
            {shipping.label}
          </span>
          <div className="text-right">
            <p className="text-[11px] text-content-muted line-through leading-none">
              ${shipping.comparePrice.toFixed(2)}
            </p>
            <p className="text-xs font-bold text-primary">FREE</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-line-subtle" />

      <div className=" py-4">

        <div className="flex items-center justify-between gap-3 mb-3">

          <div className=" min-w-0">
            <img
              src="/images/satisfaction-badge.png"
              alt="100% Wyze satisfaction guarantee"
              className="w-20 h-20 shrink-0 object-contain"
            />
          </div>

          <div>
            <div className="bg-primary text-white text-xs text-center font-normal px-2.5 py-1 rounded-xs whitespace-nowrap">
              as low as ${monthlyFinancing}/mo
            </div>
            <div className="flex items-center gap-1 shrink-0 leading-tight">
              <span className="text-lg text-content-subtle line-through">
                ${compareTotal.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {savings > 0 && (
          <div className="bg-highlight rounded-lg py-1.5 mb-3 text-center">
            <p className="text-success text-[11px] font-semibold">
              Congrats! You're saving ${savings.toFixed(2)} on your security
              bundle!
            </p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={isEmpty}
          className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-bold py-3.5 rounded-xl transition-colors text-[15px] tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {checkedOut ? "✓ Order placed!" : "Checkout"}
        </button>

        <div className="mt-3 text-center">
          <button
            onClick={handleSave}
            className="text-xs text-content-secondary hover:text-primary underline underline-offset-2 transition-colors italic"
          >
            {saved ? "✓ System saved!" : "Save my system for later"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewLineItem({
  item,
  onDecrement,
  onIncrement,
}: {
  item: ReviewLineItem;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const isPlan = item.category === "PLAN";

  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 shrink-0 rounded border border-line-subtle bg-surface-muted flex items-center justify-center overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-contain p-0.5"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-medium leading-snug truncate ${isPlan ? "text-primary font-bold" : "text-content"}`}
        >
          {item.name}
        </p>
      </div>

      {!isPlan && (
        <QuantityStepper
          quantity={item.quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          size="sm"
        />
      )}

      <div className="text-right shrink-0 min-w-14">
        {item.comparePrice != null && (
          <p className="text-[14px] text-content-muted line-through leading-none">
            {isPlan
              ? `$${item.comparePrice.toFixed(2)}${item.priceUnit ?? ""}`
              : `$${(item.comparePrice * item.quantity).toFixed(2)}`}
          </p>
        )}
        <p className={`text-[14px] font-bold leading-tight text-primary`}>
          {item.isFree
            ? "FREE"
            : isPlan
              ? `$${item.price.toFixed(2)}${item.priceUnit ?? ""}`
              : `$${(item.price * item.quantity).toFixed(2)}`}
        </p>
      </div>
      {/* <div className="h-px bg-line-subtle" /> */}
    </div>
  );
}
