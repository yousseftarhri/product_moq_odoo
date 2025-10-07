{
    'name': 'Product Minimum Order Quantity',
<<<<<<< HEAD
    'version': '19.0.1.0.0',
=======
    'version': '18.0.1.0.0',
>>>>>>> c730d785e933a1ed38e1ff67f854a320810eedad
    'summary': 'Set Minimum Order Quantity (MOQ) for products in Odoo Website',
    'author': 'Youssef tarhri',
    'website': 'https://yousseftarhri.me',
    'license': 'LGPL-3',
    'price': '9.99',
    'currency': 'USD',
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
