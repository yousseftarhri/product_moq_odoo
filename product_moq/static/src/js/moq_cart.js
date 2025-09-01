/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";

publicWidget.registry.WebsiteSale.include({
    start() {
        this._super(...arguments);
        $(document).on('change keyup', 'input.js_quantity', (ev) => {
            this._onCartQuantityChange(ev);
        });
    },

    _onCartQuantityChange(ev) {
        const $input = $(ev.currentTarget);
        let qty = parseInt($input.val(), 10) || 0;
        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;

        if (qty < minQty) {
            qty = minQty;
            $input.val(minQty);

            // Use browser's native alert for simplicity in Odoo 18
            alert(_t(`You cannot order less than ${minQty} units of this product.`));
        }
    },
});