/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { WebsiteSale } from "@website_sale/interactions/website_sale";

// Track last variant id across combination-change events, so the qty input is only
// reset to the new variant's MOQ when the variant actually changes (not on every
// combination_info refresh, e.g. price updates for the same variant).
let _lastVariantId = null;

patch(WebsiteSale.prototype, {
    /**
     * @override
     */
    _onChangeCombination(ev, parent, combination) {
        super._onChangeCombination(...arguments);

        const moqContainerEl = parent.querySelector("#moq_notice_container");
        if (moqContainerEl) {
            if (combination.minimum_qty > 1) {
                moqContainerEl.innerHTML = `
                    <div class="alert alert-info">
                        Minimum order quantity: ${combination.minimum_qty}
                    </div>
                `;
            } else {
                moqContainerEl.innerHTML = "";
            }
        }

        const qtyInputEl = parent.querySelector('input[name="add_qty"]');
        if (!qtyInputEl || !combination.minimum_qty) {
            return;
        }

        if (combination.product_id && _lastVariantId !== combination.product_id) {
            _lastVariantId = combination.product_id;
            qtyInputEl.setAttribute("min", combination.minimum_qty);
            qtyInputEl.value = combination.minimum_qty;
        } else if (parseInt(qtyInputEl.value, 10) < combination.minimum_qty) {
            qtyInputEl.value = combination.minimum_qty;
        }
    },
});
