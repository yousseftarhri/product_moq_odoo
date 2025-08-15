/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.WebsiteSale.include({
    _lastVariantId: null, // Store last seen variant ID

    /**
     * @override
     */
    _onChangeCombination(ev, $parent, combination) {
        const res = this._super.apply(this, arguments);

        if (combination?.product_id) {
            const currentVariantId = combination.product_id;

            // Run MOQ update only if the variant actually changed
            if (this._lastVariantId !== currentVariantId) {
                this._lastVariantId = currentVariantId;

                if (combination.minimum_qty) {
                    const $qtyInput = $parent.find('input[name="add_qty"]');

                    // Update minimum allowed qty
                    $qtyInput.attr('min', combination.minimum_qty);

                    // Set quantity to MOQ only once when variant changes
                    $qtyInput.val(combination.minimum_qty);
                }
            }
        }

        return res;
    },
});
