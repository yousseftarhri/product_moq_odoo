{
    'name': 'Product Minimum Order Quantity',
    'version': '17.0.1.0.0',
    'summary': 'Set Minimum Order Quantity (MOQ) for products in Odoo Website',
    'author': 'Youssef tarhri',
    'license': 'LGPL-3',
    'depends': ['website_sale'],
    'images': [
        'static/description/main_screenshot.png',
        'static/description/product_moq.png',
        'static/description/moq_website.png',
        'static/description/product_moq_variant.png',
    ],

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
