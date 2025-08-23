{
    'name': 'Product Minimum Order Quantity',
    'version': '17.0.1.0.0',
    'summary': 'Set Minimum Order Quantity (MOQ) for products in Odoo Website',
    'author': 'Your Name',
    'depends': ['website_sale'],
    'data': [
        'views/product_views.xml',
        'views/product_template_website.xml',
        'views/cart_inherit.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'product_moq/static/src/js/moq_variant.js',
            'product_moq/static/src/js/moq_cart.js',

        ],
    },

    'installable': True,
    'application': False,
}
