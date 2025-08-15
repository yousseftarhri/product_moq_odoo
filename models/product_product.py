from odoo import models, fields

class ProductProduct(models.Model):
    _inherit = "product.product"

    minimum_qty = fields.Integer(string="Minimum Order Quantity", default=1)
