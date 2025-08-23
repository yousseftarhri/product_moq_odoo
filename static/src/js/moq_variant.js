/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import Dialog from "@web/legacy/js/core/dialog";

publicWidget.registry.WebsiteSale.include({

    _lastVariantId: null, // Store last seen variant ID

    /**
     * @override
     */
    _onChangeCombination(ev, $parent, combination) {
        const res = this._super.apply(this, arguments);
        const $moqContainer = $parent.find('#moq_notice_container');

        if (combination?.minimum_qty && combination.minimum_qty > 1) {
            $moqContainer.html(`
                <div class="alert alert-info">
                    Minimum order quantity: ${combination.minimum_qty}
                </div>
            `);
        } else {
            $moqContainer.empty(); // hide if MOQ <= 1
        }


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

        if (combination?.minimum_qty) {
            const $qtyInput = this.$('input[name="add_qty"]');
            if (parseInt($qtyInput.val(), 10) < combination.minimum_qty) {
                $qtyInput.val(combination.minimum_qty);
            }
        }


        return res;
    },

});
