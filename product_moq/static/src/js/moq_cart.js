/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { CartLine } from "@website_sale/interactions/cart_line";
import wSaleUtils from "@website_sale/js/website_sale_utils";

const MOQ_WARNING_ICON_CLASS = "moq_warning_icon";

/**
 * Block the "minus" button of a cart line from bringing its quantity below
 * the product's Minimum Order Quantity, and warn the customer when it happens
 * (top-of-page alert + an inline warning triangle, like Odoo's own stock warnings).
 * Reaching 0 (removing the line) is still allowed.
 */
patch(CartLine.prototype, {
    async incOrDecQuantity(ev, currentTargetEl) {
        const container = currentTargetEl.closest(".css_quantity");
        const input = container.querySelector("input.js_quantity");
        const isDecrease = currentTargetEl.querySelector("i").classList.contains("oi-minus");
        const minQuantity = parseFloat(input.dataset.minimumQty || 1);
        const newQuantity = parseFloat(input.value || 0) - 1;

        if (isDecrease && newQuantity > 0 && newQuantity < minQuantity) {
            const message = _t("You cannot order less than %s units of this product.", minQuantity);
            wSaleUtils.showWarning(message);
            this._showMoqWarningIcon(container, message);
            return;
        }

        return super.incOrDecQuantity(...arguments);
    },

    _showMoqWarningIcon(container, message) {
        container.querySelector(`.${MOQ_WARNING_ICON_CLASS}`)?.remove();

        const iconEl = document.createElement("i");
        iconEl.className = `fa fa-warning text-warning ms-1 ${MOQ_WARNING_ICON_CLASS}`;
        iconEl.setAttribute("title", message);
        iconEl.setAttribute("role", "img");
        iconEl.setAttribute("aria-label", "Warning");

        container.appendChild(iconEl);
        setTimeout(() => iconEl.remove(), 4000);
    },
});
