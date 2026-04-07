import { useState } from "react";
// import { useRef } from "react";
import emailjs from "@emailjs/browser";
const initialForm = {
  customerName: "",
  email: "",
  phone: "",
  pickupDate: "",
  itemType: "",
  quantity: 1,
  flavors: "",
  allergies: "",
  notes: "",
};

const initialStatus = { state: "idle", message: "" };

export default function Order() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(initialStatus);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate(values) {
    const errors = {};

    if (!values.customerName.trim()) errors.customerName = "Name is required.";
    const hasEmail = values.email.trim().length > 0;
    const hasPhone = values.phone.trim().length > 0;
    if (!hasEmail && !hasPhone) errors.contact = "Email or phone is required.";

    if (!values.pickupDate) errors.pickupDate = "Pickup date is required.";
    if (!values.itemType) errors.itemType = "Please select an item type.";

    const qty = Number(values.quantity);
    if (!Number.isFinite(qty) || qty < 1)
      errors.quantity = "Quantity must be 1 or more.";

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setStatus({ state: "error", message: Object.values(errors)[0] }); // show first error
      return;
    }

    setStatus({ state: "sending", message: "Sending..." });

    try {
      emailjs.init({
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      });
      // Later: EmailJS send call here using `form` as template params
      // await sendOrderEmail(form);

      setStatus({ state: "success", message: "Order request sent!" });
      setForm(initialForm);
    } catch (err) {
      setStatus({ state: "error", message: "Failed to send. Try again." });
    }
  }

  return (
    
    <form id="order-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          autoComplete="name"
        />
      </label>

      <label>
        Email
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </label>

      <label>
        Phone
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
      </label>

      <label>
        Pickup date
        <input
          type="date"
          name="pickupDate"
          value={form.pickupDate}
          onChange={handleChange}
        />
      </label>

      <label>
        Item type
        <select name="itemType" value={form.itemType} onChange={handleChange}>
          <option value="TRADITIONAL SOURDOUGH LOAF">
            Traditional Sourdough Loaf
          </option>
          <option value="GARLIC HERB AND CHEESE LOAF">
            Garlic Herb and Cheese Loaf
          </option>
          <option value="JALAPENO GARLIC CHEDDAR LOAF">
            Jalapeño Garlic Cheddar Loaf
          </option>
          <option value="SOURDOUGH CHEESE-ITS">Sourdough Cheese-Its</option>
          <option value="BLUEBERRY CRUMBLE MUFFINS">
            BlueberryCrumble Muffins
          </option>
          <option value="Custom Loaf">Custom Loaf</option>
        </select>
      </label>

      <label>
        Quantity
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min={1}
        />
      </label>

      <label>
        Flavors
        <input
          name="flavors"
          value={form.flavors}
          onChange={handleChange}
          placeholder="Vanilla, red velvet, etc."
        />
      </label>

      <label>
        Allergies
        <input
          name="allergies"
          value={form.allergies}
          onChange={handleChange}
          placeholder="Nuts, dairy, gluten..."
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
        />
      </label>

      <button type="submit" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Sending..." : "Send Order Request"}
      </button>

      {status.state !== "idle" && <p>{status.message}</p>}
    </form>
  );
}
