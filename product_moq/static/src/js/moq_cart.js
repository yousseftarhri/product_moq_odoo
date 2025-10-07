odoo.define('product_moq.moq_cart', function (require) {
    "use strict";

<<<<<<< HEAD
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
=======
import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";

publicWidget.registry.WebsiteSale.include({
    start() {
        this._super(...arguments);
        $(document).on('change keyup', 'input.js_quantity', (ev) => {
            this._onCartQuantityChange(ev);
        });
    },
>>>>>>> c730d785e933a1ed38e1ff67f854a320810eedad

        _onCartQuantityChange(ev) {
            const $input = $(ev.currentTarget);
            let qty = parseInt($input.val(), 10) || 0;
            const minQty = parseInt($input.data('minimum-qty'), 10) || 1;

<<<<<<< HEAD
            if (qty > 0 && qty < minQty) {
                qty = minQty;
                $input.val(minQty);

                // Use alert instead of Dialog
                alert(`You cannot order less than ${minQty} units of this product.`);
            }
        },
    });
});
=======
        // Allow quantity 0 (product removal) without MOQ validation
        if (qty > 0 && qty < minQty) {
            qty = minQty;
            $input.val(minQty);

            alert(_t(`You cannot order less than ${minQty} units of this product.`));
        }
    },
});
>>>>>>> c730d785e933a1ed38e1ff67f854a320810eedad
