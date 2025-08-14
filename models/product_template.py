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

    def write(self, vals):
        res = super().write(vals)
        for record in self:
            if 'minimum_qty_tmpl' in vals and record.product_variant_count <= 1:
                record.product_variant_ids.minimum_qty = record.minimum_qty_tmpl
        return res


class ProductTemplateMOQ(models.Model):
    _inherit = 'product.template'

    def _get_combination_info(self, *args, **kwargs):
        res = super()._get_combination_info(*args, **kwargs)

        product_id = res.get('product_id')
        if product_id:
            product = self.env['product.product'].browse(product_id)
            res['minimum_qty'] = product.minimum_qty or 1

        return res