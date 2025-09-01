odoo.define('product_moq.moq_cart', function (require) {
    "use strict";

    const { patch } = require('web.utils');
    const { WebsiteSale } = require('website_sale.website_sale');
    const publicWidget = require('web.public.widget');

    patch(WebsiteSale.prototype, 'product_moq_cart_quantity', {
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

                // Use alert instead of Dialog
                alert(`You cannot order less than ${minQty} units of this product.`);
            }
        },
    });
});
