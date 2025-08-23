/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import Dialog from "@web/legacy/js/core/dialog";

publicWidget.registry.WebsiteSale.include({
        /**
     * Bind events for quantity changes on cart page
     */
    start() {
        this._super(...arguments);

        // Watch quantity input changes
        this.$('input.js_quantity').on('change', (ev) => {
            this._onCartQuantityChange(ev);
        });
    },

    /**
     * Handle cart quantity change
     */
    _onCartQuantityChange(ev) {
        const $input = $(ev.currentTarget);
        const qty = parseInt($input.val(), 10) || 0;

        // minimum_qty is often stored in a data attribute
        // Make sure to add it in your cart template if missing
        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;

        if (qty < minQty) {
            // Show message
            new Dialog(this, {
                title: "Minimum Quantity",
                $content: $(`<p>You cannot order less than ${minQty} units of this product.</p>`),
                buttons: [{ text: "OK", close: true }],
            }).open();

            // Reset back to minimum
            $input.val(minQty).trigger('change');
        }
    },


});
