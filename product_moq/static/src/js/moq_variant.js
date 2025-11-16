/** @odoo-module **/

import { publicWidget } from "@web/legacy/js/public/public_widget";
import { WebsiteSale } from "@website_sale/js/website_sale";

publicWidget.registry.WebsiteSale = WebsiteSale.extend({

    _lastVariantId: null,

    _onChangeCombination(ev, $parent, combination) {
        const res = this._super(...arguments);
        const $moqContainer = $parent.find('#moq_notice_container');

        if (combination?.minimum_qty && combination.minimum_qty > 1) {
            $moqContainer.html(`
                <div class="alert alert-info">
                    Minimum order quantity: ${combination.minimum_qty}
                </div>
            `);
        } else {
            $moqContainer.empty();
        }

        if (combination?.product_id) {
            const currentVariantId = combination.product_id;

            if (this._lastVariantId !== currentVariantId) {
                this._lastVariantId = currentVariantId;

                if (combination.minimum_qty) {
                    const $qtyInput = $parent.find('input[name="add_qty"]');
                    $qtyInput.attr('min', combination.minimum_qty);
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
