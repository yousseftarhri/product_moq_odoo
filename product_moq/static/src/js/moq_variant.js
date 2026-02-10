/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { _t } from "@web/core/l10n/translation";
import VariantMixin from "@website_sale/js/variant_mixin";

/**
 * Product MOQ Validator - Standalone widget for quantity enforcement
 */
publicWidget.registry.ProductMOQValidator = publicWidget.Widget.extend({
    selector: '.oe_website_sale',
    events: {
        'click .css_quantity .fa-minus': '_onClickMinus',
        'click .css_quantity .fa-plus': '_onClickPlus',
        'change input[name="add_qty"]': '_onChangeQuantity',
        'input input[name="add_qty"]': '_onInputQuantity',
    },

    /**
     * Initialize widget
     */
    start() {
        this._super.apply(this, arguments);
        this._setupMOQValidation();
        this._showPersistentWarning();
        return Promise.resolve();
    },

    /**
     * Setup initial MOQ validation
     */
    _setupMOQValidation() {
        const $qtyInput = this.$('input[name="add_qty"]');

        if ($qtyInput.length) {
            const minQty = this._getMinimumQuantity($qtyInput);
            $qtyInput.attr('min', minQty);

            const currentQty = parseInt($qtyInput.val()) || 0;
            if (currentQty < minQty) {
                $qtyInput.val(minQty);
            }
        }
    },

    /**
     * Get minimum quantity from input element
     */
    _getMinimumQuantity($input) {
        return parseInt($input.data('minimum-qty')) ||
               parseInt($input.attr('data-minimum-qty')) ||
               parseInt($input.attr('min')) ||
               1;
    },

    /**
     * Handle minus button click - BLOCK if at minimum
     */
    _onClickMinus(ev) {
        const $button = $(ev.currentTarget);
        const $input = $button.closest('.css_quantity, .input-group').find('input[name="add_qty"]');

        if (!$input.length) return;

        const minQty = this._getMinimumQuantity($input);
        const currentQty = parseInt($input.val()) || minQty;

        if (currentQty <= minQty) {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            $input.val(minQty);
            this._flashWarning();

            return false;
        }
    },

    _onClickPlus(ev) {
        const $button = $(ev.currentTarget);
        const $input = $button.closest('.css_quantity, .input-group').find('input[name="add_qty"]');

        if (!$input.length) return;

        const minQty = this._getMinimumQuantity($input);
        const currentQty = parseInt($input.val()) || 0;

        if (currentQty < minQty) {
            $input.val(minQty);
        }
    },

    _onInputQuantity(ev) {
        const $input = $(ev.currentTarget);
        const minQty = this._getMinimumQuantity($input);
        let currentQty = parseInt($input.val()) || 0;

        if (currentQty > 0 && currentQty < minQty) {
            $input.addClass('is-invalid');
        } else {
            $input.removeClass('is-invalid');
        }
    },

    _onChangeQuantity(ev) {
        const $input = $(ev.currentTarget);
        const minQty = this._getMinimumQuantity($input);
        let currentQty = parseInt($input.val()) || 0;

        if (currentQty < minQty) {
            $input.val(minQty);
            $input.removeClass('is-invalid');
            this._flashWarning();
        }
    },

    _showPersistentWarning() {
        const $qtyInput = this.$('input[name="add_qty"]');
        const $container = this.$('#moq_notice_container');

        if (!$qtyInput.length || !$container.length) {
            return;
        }

        const minQty = this._getMinimumQuantity($qtyInput);

        if (minQty > 1) {
            $container.html(`
                <div class="alert alert-warning mb-3" role="alert" id="moq_warning_persistent">
                    <i class="fa fa-exclamation-triangle me-2"></i>
                    <strong>${_t("Minimum order quantity:")}</strong> ${minQty}
                    <br>
                    <small>${_t("You cannot order less than %s units of this product.", minQty)}</small>
                </div>
            `);
        } else {
            $container.empty();
        }
    },

    _flashWarning() {
        const $warning = this.$('#moq_warning_persistent');

        if ($warning.length) {
            $warning.addClass('border border-danger');
            $warning.css('transition', 'all 0.3s ease');

            const originalBg = $warning.css('background-color');
            $warning.css('background-color', '#fff3cd');

            setTimeout(() => {
                $warning.removeClass('border border-danger');
                $warning.css('background-color', originalBg);
            }, 500);
        }
    },
});

// Extend VariantMixin._onChangeCombination
const originalOnChangeCombination = VariantMixin._onChangeCombination;

VariantMixin._onChangeCombination = function(ev, parent, combination) {
    // Call original method first
    originalOnChangeCombination.call(this, ev, parent, combination);

    // Add MOQ handling
    const $moqContainer = $(parent).find('#moq_notice_container');

    // Update MOQ warning
    if (combination?.minimum_qty && combination.minimum_qty > 1) {
        $moqContainer.html(`
            <div class="alert alert-warning mb-3" role="alert" id="moq_warning_persistent">
                <i class="fa fa-exclamation-triangle me-2"></i>
                <strong>${_t("Minimum order quantity:")}</strong> ${combination.minimum_qty}
                <br>
                <small>${_t("You cannot order less than %s units of this product.", combination.minimum_qty)}</small>
            </div>
        `);
    } else {
        $moqContainer.empty();
    }

    // Update quantity input
    if (combination?.minimum_qty) {
        const $qtyInput = $(parent).find('input[name="add_qty"]');

        if ($qtyInput.length) {
            $qtyInput.attr('min', combination.minimum_qty);
            $qtyInput.attr('data-minimum-qty', combination.minimum_qty);

            const currentQty = parseInt($qtyInput.val()) || 0;
            if (currentQty < combination.minimum_qty) {
                $qtyInput.val(combination.minimum_qty);
            }
        }
    }
};

export default publicWidget.registry.ProductMOQValidator;