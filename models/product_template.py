from odoo import models, fields, api

class ProductTemplate(models.Model):
    _inherit = "product.template"

    minimum_qty_tmpl = fields.Float(string="Minimum Order Quantity (Template)", default=1.0)

    @api.model
    def create(self, vals):
        record = super().create(vals)
        if record.product_variant_count <= 1:
            record.product_variant_ids.minimum_qty = record.minimum_qty_tmpl
        return record
