{
    'name': 'Product Minimum Order Quantity',
    'version': '17.0.1.0.0',
    'summary': 'Set Minimum Order Quantity (MOQ) for products in Odoo Website',
    'author': 'Your Name',
    'depends': ['website_sale'],
    'data': [
        'views/product_views.xml',
        'views/product_template_website.xml',
    ],
    'installable': True,
    'application': False,
}
