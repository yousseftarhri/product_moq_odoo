odoo.define('product_moq.moq_variant', function (require) {
    "use strict";

    var publicWidget = require('web.public.widget');

    // Wait for WebsiteSale widget to exist
    if (publicWidget.registry.WebsiteSale) {
        publicWidget.registry.WebsiteSale.include({

            _lastVariantId: null,

            _onChangeCombination: function (ev, $parent, combination) {
                this._super.apply(this, arguments);

                var $moqContainer = $parent.find('#moq_notice_container');

                if (combination && combination.minimum_qty && combination.minimum_qty > 1) {
                    $moqContainer.html(
                        '<div class="alert alert-info">' +
                        'Minimum order quantity: ' + combination.minimum_qty +
                        '</div>'
                    );
                } else {
                    $moqContainer.empty();
                }

                if (combination && combination.product_id) {
                    var currentVariantId = combination.product_id;
                    if (this._lastVariantId !== currentVariantId) {
                        this._lastVariantId = currentVariantId;
                        if (combination.minimum_qty) {
                            var $qtyInput = $parent.find('input[name="add_qty"]');
                            $qtyInput.attr('min', combination.minimum_qty);
                            $qtyInput.val(combination.minimum_qty);
                        }
                    }
                }

                if (combination && combination.minimum_qty) {
                    var $qtyInput = $parent.find('input[name="add_qty"]');
                    var currentQty = parseInt($qtyInput.val(), 10) || 1;
                    if (currentQty < combination.minimum_qty) {
                        $qtyInput.val(combination.minimum_qty);
                    }
                }
            },

        });
    }
});
