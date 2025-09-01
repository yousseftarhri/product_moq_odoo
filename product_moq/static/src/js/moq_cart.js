/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import Dialog from "@web/legacy/js/core/dialog";

publicWidget.registry.WebsiteSale.include({
    start() {
        this._super(...arguments);

        // Event delegation: watch for any input.js_quantity inside the body
        $(document).on('change keyup', 'input.js_quantity', (ev) => {
            this._onCartQuantityChange(ev);
        });
    },

    _onCartQuantityChange(ev) {
        const $input = $(ev.currentTarget);
        let qty = parseInt($input.val(), 10) || 0;
        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;

        if (qty > 0 && qty < minQty) {
            qty = minQty;
            $input.val(minQty);

            new Dialog(this, {
                title: "Minimum Quantity",
                $content: $(`<p>You cannot order less than ${minQty} units of this product.</p>`),
                buttons: [{ text: "OK", close: true }],
            }).open();
        }
    },
});
