odoo.define('product_moq.moq_variant', function (require) {
    "use strict";

    const { patch } = require('web.utils');
    const { WebsiteSale } = require('website_sale.website_sale');
    const publicWidget = require('web.public.widget');

    // Patch the WebsiteSale OWL component
    patch(WebsiteSale.prototype, 'product_moq', {
        _onChangeCombination(ev, $parent, combination) {
            // Call original method if exists
            const res = this._super?.apply(this, arguments);

            const $moqContainer = $parent.find('#moq_notice_container');

            // Show MOQ alert
            if (combination?.minimum_qty && combination.minimum_qty > 1) {
                $moqContainer.html(
                    `<div class="alert alert-info">
                        Minimum order quantity: ${combination.minimum_qty}
                    </div>`
                );
            } else {
                $moqContainer.empty(); // hide if MOQ <= 1
            }

            // Update quantity if variant changed
            if (combination?.product_id) {
                const currentVariantId = combination.product_id;

                if (this._lastVariantId !== currentVariantId) {
                    this._lastVariantId = currentVariantId;

                    if (combination.minimum_qty) {
                        const $qtyInput = $parent.find('input[name="add_qty"]');
                        $qtyInput.attr('min', combination.minimum_qty);  // set min
                        $qtyInput.val(combination.minimum_qty);         // set qty
                    }
                }
            }

            // Ensure current qty >= MOQ
            if (combination?.minimum_qty) {
                const $qtyInput = $parent.find('input[name="add_qty"]');
                const currentQty = parseInt($qtyInput.val(), 10) || 1;
                if (currentQty < combination.minimum_qty) {
                    $qtyInput.val(combination.minimum_qty);
                }
            }

            return res;
        },
    });
});
