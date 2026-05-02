import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { menuItems } from "../components/menu";

const emptyCartItem = {
  itemType: "",
  quantity: 1,
  customText: "",
};

const initialForm = {
  customerName: "",
  email: "",
  phone: "",
  pickupDate: "",
  cart: [],
  allergies: "",
  notes: "",
};

const initialStatus = { state: "idle", message: "" };

const isValidEmail = (email) => {
  return String(email)
    .toLocaleLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
const isValidPhoneNumber = (phone) => {
  return String(phone).match(/^\d{10}$/);
};

export default function Order() {
  const [form, setForm] = useState(initialForm);
  const [currentItem, setCurrentItem] = useState(emptyCartItem);
  const [status, setStatus] = useState(initialStatus);

  const selectedMenuItem = useMemo(() => {
    return menuItems.find((item) => item.id === currentItem.itemType) || null;
  }, [currentItem.itemType]);

  const totalPrice = useMemo(() => {
    return form.cart.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [form.cart]);

  const cartSummaryLine = useMemo(() => {
    if (!form.cart.length) return "Cart: Empty";

    const itemsText = form.cart
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    return `Cart: ${itemsText} | Total: $${totalPrice}`;
  }, [form.cart, totalPrice]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    const cleaned = name === "phone" ? value.replace(/\D/g, "") : value;
    setForm((prev) => ({
      ...prev,
      [name]: cleaned,
    }));
  }

  function handleCurrentItemChange(e) {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function addToCart() {
    if (!currentItem.itemType) {
      setStatus({ state: "error", message: "Please select an item first." });
      return;
    }

    const qty = Number(currentItem.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      setStatus({ state: "error", message: "Quantity must be 1 or more." });
      return;
    }

    const menuItem = menuItems.find((item) => item.id === currentItem.itemType);

    if (!menuItem) {
      setStatus({ state: "error", message: "Selected item not found." });
      return;
    }

    const lineTotal = menuItem.price * qty;

    const cartItem = {
      cartId: `${menuItem.id}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      itemType: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      unit: menuItem.unit || "",
      quantity: qty,
      customText: currentItem.customText.trim(),
      lineTotal,
    };

    setForm((prev) => ({
      ...prev,
      cart: [...prev.cart, cartItem],
    }));

    setCurrentItem(emptyCartItem);
    setStatus(initialStatus);
  }

  function removeFromCart(cartId) {
    setForm((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.cartId !== cartId),
    }));
  }

  function updateCartQuantity(cartId, newQuantity) {
    const qty = Number(newQuantity);

    setForm((prev) => ({
      ...prev,
      cart: prev.cart.map((item) => {
        if (item.cartId !== cartId) return item;

        const safeQty = !Number.isFinite(qty) || qty < 1 ? 1 : qty;

        return {
          ...item,
          quantity: safeQty,
          lineTotal: item.price * safeQty,
        };
      }),
    }));
  }

  function updateCartCustomText(cartId, newText) {
    setForm((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              customText: newText,
            }
          : item,
      ),
    }));
  }

  function validate(values) {
    const errors = {};

    if (!values.customerName.trim()) {
      errors.customerName = "Name is required.";
    }

    const hasEmail = values.email.trim().length > 0;
    const hasPhone = values.phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      errors.contact = "Email or phone is required.";
    }
    if (hasEmail && !isValidEmail(values.email)) {
      errors.email = "email format is invalid";
    }
    if (hasPhone && !isValidPhoneNumber(values.phone)) {
      errors.phone = " please provide a valid phone number";
    }

    if (!values.pickupDate) {
      errors.pickupDate = "Pickup date is required.";
    }

    if (!values.cart.length) {
      errors.cart = "Please add at least one item to the cart.";
    }

    return errors;
  }

  function buildOrderSummary(cart) {
    return cart
      .map((item) => {
        return [
          `${item.name}`,
          `Quantity: ${item.quantity}`,
          `Unit Price: $${item.price}${item.unit ? ` (${item.unit})` : ""}`,
          item.customText ? `Customizations: ${item.customText}` : null,
          `Line Total: $${item.lineTotal}`,
        ]
          .filter(Boolean)
          .join(" | ");
      })
      .join("\n");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setStatus({
        state: "error",
        message: Object.values(errors)[0],
      });
      return;
    }

    setStatus({ state: "sending", message: "Sending..." });

    const orderSummary = buildOrderSummary(form.cart);
    console.log("PUBLIC KEY:", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

    const templateParams = {
      customerName: form.customerName,
      email: form.email || "No email provided",
      phone: form.phone || "No phone number provided",
      pickupDate: form.pickupDate,
      allergies: form.allergies || "No allergies added",
      notes: form.notes || "No notes added",
      orderSummary,
      totalPrice: `$${totalPrice}`,
      cartSummaryLine,
    };

    try {
      emailjs.init({
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
      );
      if (form.email.trim()) {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID,
          templateParams,
        );
      }

      setStatus({ state: "success", message: "Order request sent!" });
      setForm(initialForm);
      setCurrentItem(emptyCartItem);
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setStatus({
        state: "error",
        message: err?.text || err?.message || "Failed to send. Try again.",
      });
    }
  }

  return (
    <div className="order-page-layout">
      <form id="order-form" onSubmit={handleSubmit}>
        <div className="order-form-panel">
          <label>
            Name
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleFormChange}
              autoComplete="name"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              autoComplete="email"
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              autoComplete="tel"
            />
          </label>

          <label>
            Pickup Date
            <input
              type="date"
              name="pickupDate"
              value={form.pickupDate}
              onChange={handleFormChange}
            />
          </label>

          <div className="order-builder">
            <label>
              Item Type
              <select
                name="itemType"
                value={currentItem.itemType}
                onChange={handleCurrentItemChange}
              >
                <option value="">Select an item</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — ${item.price}
                    {item.unit ? ` (${item.unit})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                name="quantity"
                min={1}
                value={currentItem.quantity}
                onChange={handleCurrentItemChange}
              />
            </label>

            <label>
              Customizations / Flavor Notes
              <input
                type="text"
                name="customText"
                value={currentItem.customText}
                onChange={handleCurrentItemChange}
                placeholder="Hot or mild, pistachio, custom inclusions, etc."
              />
            </label>

            {selectedMenuItem && (
              <p>
                Current Item: {selectedMenuItem.name} — $
                {selectedMenuItem.price}
                {selectedMenuItem.unit ? ` ${selectedMenuItem.unit}` : ""}
              </p>
            )}

            <button type="button" onClick={addToCart}>
              Add to Cart
            </button>
          </div>

          <label>
            Allergies
            <input
              type="text"
              name="allergies"
              value={form.allergies}
              onChange={handleFormChange}
              placeholder="Nuts, dairy, gluten..."
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              rows={4}
              placeholder="Anything else you'd like us to know?"
            />
          </label>

          <button type="submit" disabled={status.state === "sending"}>
            {status.state === "sending" ? "Sending..." : "Send Order Request"}
          </button>

          {status.state !== "idle" && <p>{status.message}</p>}
        </div>
      </form>

      <aside className="cart-panel">
        <div className="cart-section">
          <h2>Your Cart</h2>

          {form.cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {form.cart.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <div className="cart-item-header">
                    <h3>{item.name}</h3>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartId)}
                    >
                      Remove
                    </button>
                  </div>

                  <p>
                    ${item.price}
                    {item.unit ? ` (${item.unit})` : ""}
                  </p>

                  <label>
                    Quantity
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQuantity(item.cartId, e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Customizations / Flavor Notes
                    <input
                      type="text"
                      value={item.customText}
                      onChange={(e) =>
                        updateCartCustomText(item.cartId, e.target.value)
                      }
                      placeholder="Optional notes for this item"
                    />
                  </label>

                  <p>Line Total: ${item.lineTotal}</p>
                </div>
              ))}

              <p className="cart-summary-line">
                <strong>{cartSummaryLine}</strong>
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
