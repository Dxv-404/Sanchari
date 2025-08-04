import React from "react";
import "./ProductCardPreview.css";
import icons from "./SidebarIcons";

export default function ProductCardPreview({ form, image }) {
  return (
    <div className="product-card">
      <img
        className="product-img"
        src={image ? URL.createObjectURL(image) : "/placeholder.jpg"}
        alt={form.name || "Preview"}
      />
      <div className="product-body">
        <div className="product-title">{form.name || "Vehicle Name"}</div>

        <div className="product-info-row">
          <div className="product-info-left">
            <span className="product-info-item" title="Daily Price">
              {icons.price} ₹{form.price_daily || "0.00"}
            </span>
            <span
              className="product-info-item"
              title={form.available ? "Available" : "Not available"}
            >
              {form.available ? icons.available : icons.unavailable}
              {form.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <div className="product-info-right">
            {form.pickup_locations?.[0]?.city && (
              <span className="product-info-item" title="Pickup City">
                {icons.city} {form.pickup_locations[0].city}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
