/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";
import VariantMixin from "@website_sale/js/variant_mixin";

// Store the original method
const originalOnChangeCombination = VariantMixin._onChangeCombination;

// Track last variant ID (needs to be outside the method since VariantMixin is not a class instance)
let _lastVariantId = null;

// Override the method
VariantMixin._onChangeCombination = function(ev, parent, combination) {
    // Call the original method (equivalent to this._super() in Odoo 18)
    originalOnChangeCombination.call(this, ev, parent, combination);

    // Convert parent to jQuery (in Odoo 18 it was $parent, in Odoo 19 it's parent)
    const $parent = $(parent);

    // YOUR ODOO 18 CODE - exactly the same, just with $parent converted
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
        if (_lastVariantId !== currentVariantId) {
            _lastVariantId = currentVariantId;

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
        // Note: In Odoo 19, 'this' context might be different, so use $parent instead
        const $qtyInput = $parent.find('input[name="add_qty"]');
        if (parseInt($qtyInput.val(), 10) < combination.minimum_qty) {
            $qtyInput.val(combination.minimum_qty);
        }
    }
};

export default VariantMixin;