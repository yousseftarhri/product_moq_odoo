/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";

/**
 * Shopping Cart MOQ Validator
 * Validates minimum order quantity in the shopping cart
 */
publicWidget.registry.CartMOQValidator = publicWidget.Widget.extend({
    selector: '.oe_website_sale',
    events: {
        'change input.js_quantity': '_onCartQuantityChange',
        'keyup input.js_quantity': '_onCartQuantityKeyup',
        'click .js_quantity .fa-minus': '_onClickCartMinus',
        'click .js_quantity .fa-plus': '_onClickCartPlus',
    },

    /**
     * Handle quantity change in cart
     */
    _onCartQuantityChange(ev) {
        const $input = $(ev.currentTarget);
        this._validateCartQuantity($input);
    },

    /**
     * Handle keyup in cart quantity input
     */
    _onCartQuantityKeyup(ev) {
        const $input = $(ev.currentTarget);
        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;
        let qty = parseInt($input.val(), 10) || 0;

        // Visual feedback while typing
        if (qty > 0 && qty < minQty) {
            $input.addClass('is-invalid');
        } else {
            $input.removeClass('is-invalid');
        }
    },

    /**
     * Handle minus button click in cart
     */
    _onClickCartMinus(ev) {
        const $button = $(ev.currentTarget);
        const $input = $button.closest('.js_quantity').find('input.js_quantity');

        if (!$input.length) return;

        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;
        const currentQty = parseInt($input.val(), 10) || 0;
        const newQty = currentQty - 1;

        // Allow going to 0 (remove product from cart)
        if (newQty === 0) {
            return; // Let default behavior handle removal
        }

        // Block if would go below minimum (but above 0)
        if (newQty > 0 && newQty < minQty) {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            $input.val(minQty);
            this._showCartMOQWarning($input, minQty);

            return false;
        }
    },

    /**
     * Handle plus button click in cart
     */
    _onClickCartPlus(ev) {
        const $button = $(ev.currentTarget);
        const $input = $button.closest('.js_quantity').find('input.js_quantity');

        if (!$input.length) return;

        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;
        const currentQty = parseInt($input.val(), 10) || 0;

        // If somehow below minimum, correct it
        if (currentQty > 0 && currentQty < minQty) {
            $input.val(minQty);
        }
    },

    /**
     * Validate cart quantity
     */
    _validateCartQuantity($input) {
        let qty = parseInt($input.val(), 10) || 0;
        const minQty = parseInt($input.data('minimum-qty'), 10) || 1;

        // Allow quantity 0 (product removal from cart)
        if (qty === 0) {
            $input.removeClass('is-invalid');
            return;
        }

        // Enforce minimum quantity for non-zero values
        if (qty > 0 && qty < minQty) {
            qty = minQty;
            $input.val(minQty);
            $input.removeClass('is-invalid');

            this._showCartMOQWarning($input, minQty);

            // Trigger change to update cart
            $input.trigger('change');
        } else {
            $input.removeClass('is-invalid');
        }
    },

    /**
     * Show warning message in cart
     */
    _showCartMOQWarning($input, minQty) {
        // Remove existing warnings for this product
        $input.closest('tr, .o_cart_product').find('.moq-cart-warning').remove();

        // Create warning message
        const $warning = $(`
            <div class="alert alert-warning alert-dismissible fade show moq-cart-warning mt-2 mb-0" role="alert">
                <i class="fa fa-exclamation-triangle me-2"></i>
                <small>
                    <strong>${_t("Minimum Quantity:")}</strong>
                    ${_t("You cannot order less than %s units of this product.", minQty)}
                </small>
                <button type="button" class="btn-close btn-close-sm" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        // Insert warning below the quantity input
        const $container = $input.closest('td, .o_cart_product');
        if ($container.length) {
            $container.append($warning);
        } else {
            $input.after($warning);
        }

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            $warning.fadeOut(300, function() {
                $(this).remove();
            });
        }, 4000);
    },
});

export default publicWidget.registry.CartMOQValidator;