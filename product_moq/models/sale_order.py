from odoo import models, _


class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def _verify_updated_quantity(self, order_line, product_id, new_qty, uom_id, **kwargs):
        new_qty, warning = super()._verify_updated_quantity(order_line, product_id, new_qty, uom_id, **kwargs)

        product = self.env['product.product'].browse(product_id)
        minimum_qty = product.minimum_qty or 1
        if new_qty and new_qty < minimum_qty:
            new_qty = minimum_qty
            moq_warning = _(
                "The minimum order quantity for %(product)s is %(min_qty)s.",
                product=product.display_name,
                min_qty=minimum_qty,
            )
            warning = f"{warning}\n{moq_warning}" if warning else moq_warning

        return new_qty, warning
