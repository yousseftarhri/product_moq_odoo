from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale

class WebsiteSaleMOQVariant(WebsiteSale):

    def _get_combination_info(self, product_template, combination, add_qty, pricelist, parent_combination=None, only_template=False, **kw):
        res = super()._get_combination_info(
            product_template, combination, add_qty, pricelist,
            parent_combination=parent_combination,
            only_template=only_template, **kw
        )
        # Add MOQ to the JSON response
        if res.get('product_id'):
            product = request.env['product.product'].browse(res['product_id'])
            res['minimum_qty'] = product.minimum_qty
        return res
