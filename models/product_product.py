from odoo import models, fields

class ProductProduct(models.Model):
    _inherit = "product.product"

    minimum_qty = fields.Float(string="Minimum Order Quantity", default=1.0)
